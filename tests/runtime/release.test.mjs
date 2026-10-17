import { FormApi } from "@tanstack/react-form";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { z } from "zod";
import { FieldRenderer, infer } from "../../dist/index.js";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../../", import.meta.url));
// Exercise actual component handlers with hooks isolated from the browser.
// Form values and nested updates use the real TanStack Form API.
const modules = new Map();
function loadSource(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} };
  modules.set(file, module);
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    Date,
    require: (name) => {
      if (name === "react")
        return { ...React, useEffect() {}, useState: (value) => [value, () => {}] };
      if (name === "@tanstack/react-form")
        return { useStore: (store, selector) => selector(store.state) };
      if (name.startsWith(".") || name.startsWith("@/")) {
        const base = name.startsWith("@/")
          ? path.join(root, "src", name.slice(2))
          : path.resolve(path.dirname(file), name);
        const source = [
          base + ".ts",
          base + ".tsx",
          path.join(base, "index.ts"),
          path.join(base, "index.tsx"),
        ].find(existsSync);
        assert.ok(source, `Missing source module ${name}`);
        return loadSource(source);
      }
      return require(name);
    },
  });
  return module.exports;
}
const runtime = {
  ...loadSource(path.join(root, "src/components/field/FieldControl.tsx")),
  ...loadSource(path.join(root, "src/components/FieldRenderer.tsx")),
};
const state = { visible: true, disabled: false, readOnly: false, required: false };

function nodes(node, result = []) {
  if (node == null || typeof node === "boolean") return result;
  if (Array.isArray(node)) {
    node.forEach((child) => nodes(child, result));
    return result;
  }
  if (typeof node !== "object") return result;
  if (typeof node.type === "function") return nodes(node.type(node.props), result);
  result.push(node);
  nodes(node.props?.children, result);
  return result;
}

function fixture(schema, values, config = {}) {
  const form = new FormApi({ defaultValues: structuredClone(values) });
  form.Field = ({ name, children }) =>
    children({
      name,
      state: { value: form.getFieldValue(name), meta: { errors: [] } },
      handleChange: (value) => form.setFieldValue(name, value),
    });
  const meta = infer(schema)[0];
  const render = () =>
    nodes(
      React.createElement(runtime.FieldRenderer, {
        form,
        field: meta,
        values: form.state.values,
        fieldConfig: config,
      }),
    );
  return {
    form,
    render,
    input: (id) => {
      const element = render().find((node) => node.props?.id === id);
      assert.ok(element, `Missing input ${id}`);
      return element;
    },
    click: (text) => {
      const button = render().find(
        (node) => node.type === "button" && node.props.children === text,
      );
      assert.ok(button, `Missing button ${text}`);
      button.props.onClick();
    },
  };
}

test("calendar Date round trips without changing day across time zones", () => {
  const previousTZ = process.env.TZ;
  try {
    for (const zone of ["Asia/Jakarta", "Pacific/Kiritimati", "America/Los_Angeles", "UTC"]) {
      process.env.TZ = zone;
      for (const selected of ["2026-10-17", "2026-01-01", "2024-02-29"]) {
        const field = {
          name: "date",
          state: { value: undefined, meta: { errors: [] } },
          handleChange(value) {
            this.state.value = value;
          },
        };
        const render = () => runtime.FieldControl({ field, type: "date-object", state });
        render().props.onChange({ target: { value: selected } });
        assert.equal(z.date().safeParse(field.state.value).success, true);
        assert.equal(render().props.value, selected, `${zone}: ${selected}`);
        render().props.onChange({ target: { value: "" } });
        assert.equal(field.state.value, undefined);
        assert.equal(render().props.value, "");
        field.state.value = new Date(NaN);
        assert.equal(render().props.value, "");
      }
    }
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});

test("nested arrays render editable paths and support add/remove/reorder independently", () => {
  const f = fixture(
    z.object({ matrix: z.array(z.array(z.string())) }),
    { matrix: [["a", "b"], ["c"]] },
    {
      matrix: {
        array: { addLabel: "Add row" },
        item: {
          array: { addLabel: "Add cell", removeLabel: "Remove cell", moveDownLabel: "Down cell" },
        },
      },
    },
  );
  f.input("matrix[0][1]").props.onChange({ target: { value: "updated" } });
  assert.equal(f.form.getFieldValue("matrix[0][1]"), "updated");
  f.click("Add cell");
  assert.deepEqual(JSON.parse(JSON.stringify(f.form.state.values.matrix)), [
    ["a", "updated", ""],
    ["c"],
  ]);
  f.click("Down cell");
  assert.deepEqual(Array.from(f.form.state.values.matrix[0]), ["updated", "a", ""]);
  f.click("Remove cell");
  assert.deepEqual(JSON.parse(JSON.stringify(f.form.state.values.matrix)), [["a", ""], ["c"]]);
  f.click("Add row");
  assert.equal(f.form.state.values.matrix[2].length, 0);
});

test("arrays of tuples render each position and create structured defaults", () => {
  const f = fixture(
    z.object({ rows: z.array(z.tuple([z.string(), z.number()])) }),
    { rows: [["first", 1]] },
    {
      rows: {
        array: { addLabel: "Add tuple" },
        item: { 0: { label: "Text" }, 1: { label: "Amount" } },
      },
    },
  );
  assert.equal(f.input("rows[0][0]").props.value, "first");
  f.input("rows[0][1]").props.onChange({ target: { value: "7" } });
  assert.equal(f.form.getFieldValue("rows[0][1]"), 7);
  f.click("Add tuple");
  assert.deepEqual(Array.from(f.form.state.values.rows[1]), ["", undefined]);
  assert.equal(f.input("rows[1][0]").props.value, "");
});

test("tuple positions recurse into arrays, objects, and unions", () => {
  const contact = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]);
  const f = fixture(
    z.object({ data: z.tuple([z.array(z.string()), z.object({ title: z.string() }), contact]) }),
    {
      data: [["nested"], { title: "title" }, { kind: "person", name: "Ada" }],
    },
  );
  assert.equal(f.input("data[0][0]").props.value, "nested");
  assert.equal(f.input("data[1].title").props.value, "title");
  f.input("data[2].kind").props.onChange({ target: { value: "company" } });
  f.input("data[2].company").props.onChange({ target: { value: "Studio" } });
  assert.equal(f.form.getFieldValue("data[2].company"), "Studio");
});

test("arrays of unions infer every discriminator option and render branch configs", () => {
  const contact = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]);
  const f = fixture(
    z.object({ contacts: z.array(contact) }),
    { contacts: [{ kind: "person", name: "Ada" }] },
    {
      contacts: {
        array: { addLabel: "Add contact" },
        item: { name: { placeholder: "Personal name" }, company: { placeholder: "Company name" } },
      },
    },
  );
  assert.equal(f.input("contacts[0].name").props.placeholder, "Personal name");
  const selector = f.input("contacts[0].kind");
  assert.deepEqual(
    Array.from(
      nodes(selector)
        .filter((node) => node.type === "option")
        .map((node) => node.props.value),
    ),
    ["", "person", "company"],
  );
  selector.props.onChange({ target: { value: "company" } });
  assert.equal(f.input("contacts[0].company").props.placeholder, "Company name");
  f.click("Add contact");
  assert.equal(f.form.getFieldValue("contacts[1].kind"), "person");
  assert.equal(f.form.getFieldValue("contacts[1].name"), "");
});

test("arrays of records render existing entries and add empty record objects", () => {
  const f = fixture(
    z.object({ rows: z.array(z.record(z.string(), z.string())) }),
    { rows: [{ source: "demo" }] },
    {
      rows: { array: { addLabel: "Add record" } },
    },
  );
  assert.equal(f.input("rows[0].source").props.value, "demo");
  f.click("Add record");
  assert.equal(typeof f.form.state.values.rows[1], "object");
  assert.equal(Object.keys(f.form.state.values.rows[1]).length, 0);
});

test("built public package renders nested array fields with real React", () => {
  const schema = z.object({ matrix: z.array(z.array(z.string())) });
  const f = fixture(schema, { matrix: [["one"]] });
  const markup = renderToStaticMarkup(
    React.createElement(FieldRenderer, {
      form: f.form,
      field: infer(schema)[0],
      values: f.form.state.values,
    }),
  );
  assert.match(markup, /id="matrix\[0\]\[0\]"/);
  assert.match(markup, /value="one"/);
});

test("three array levels and object children keep independent configs and paths", () => {
  const f = fixture(
    z.object({ groups: z.array(z.object({ cells: z.array(z.array(z.string())) })) }),
    {
      groups: [{ cells: [["left"], ["right"]] }],
    },
    {
      groups: { cells: { item: { item: { placeholder: "Deep cell" } } } },
    },
  );
  assert.equal(f.input("groups[0].cells[0][0]").props.placeholder, "Deep cell");
  f.input("groups[0].cells[1][0]").props.onChange({ target: { value: "changed" } });
  assert.equal(f.form.getFieldValue("groups[0].cells[0][0]"), "left");
  assert.equal(f.form.getFieldValue("groups[0].cells[1][0]"), "changed");
});

test("union callbacks receive the active object and direct array configs still work", () => {
  const contact = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]);
  const f = fixture(
    z.object({ contacts: z.array(contact) }),
    { contacts: [{ kind: "person", name: "Ada" }] },
    {
      contacts: {
        name: {
          placeholder: (values) => `${values.kind}: ${values.name}`,
          showIf: (values) => values.kind === "person",
        },
        company: { placeholder: (values) => `Company: ${values.company ?? "new"}` },
      },
    },
  );
  assert.equal(f.input("contacts[0].name").props.placeholder, "person: Ada");
  f.input("contacts[0].kind").props.onChange({ target: { value: "company" } });
  assert.equal(f.input("contacts[0].company").props.placeholder, "Company: new");
  assert.equal(
    f.render().some((node) => node.props?.id === "contacts[0].name"),
    false,
  );
});
