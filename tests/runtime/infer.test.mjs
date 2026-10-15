import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { infer } from "../../dist/index.js";

test("infers common Zod field types", () => {
  const schema = z.object({
    email: z.email(),
    website: z.url(),
    date: z.iso.date(),
    dateObject: z.date(),
    tags: z.array(z.string()),
    metadata: z.record(z.string(), z.string()),
    tuple: z.tuple([z.string(), z.number()]),
    status: z.union([z.literal("draft"), z.literal("published")]),
  });

  assert.deepEqual(infer(schema), [
    { name: "email", type: "email" },
    { name: "website", type: "url" },
    { name: "date", type: "date" },
    { name: "dateObject", type: "date-object" },
    { name: "tags", type: "array", item: { name: "item", type: "string" } },
    { name: "metadata", type: "record", item: { name: "value", type: "string" } },
    {
      name: "tuple",
      type: "tuple",
      items: [
        { name: "tuple-0", type: "string" },
        { name: "tuple-1", type: "number" },
      ],
    },
    {
      name: "status",
      type: "string",
      options: ["draft", "published"],
    },
  ]);
});

test("unwraps optional, nullable, pipe, and lazy schemas", () => {
  const schema = z.object({
    optional: z.string().optional(),
    nullable: z.number().nullable(),
    piped: z.string().pipe(z.string()),
    lazy: z.lazy(() => z.boolean()),
  });

  assert.deepEqual(infer(schema), [
    { name: "optional", type: "string" },
    { name: "nullable", type: "number" },
    { name: "piped", type: "string" },
    { name: "lazy", type: "boolean" },
  ]);
});

test("infers discriminated union variants", () => {
  const schema = z.object({
    contact: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("person"), name: z.string() }),
      z.object({ kind: z.literal("company"), company: z.string() }),
    ]),
  });

  const [contact] = infer(schema);

  assert.equal(contact.type, "union");
  assert.equal(contact.discriminator, "kind");
  assert.deepEqual(contact.variantKeys, ["person", "company"]);
  assert.deepEqual(contact.variants?.map((variant) => variant.type), ["object", "object"]);
});

test("merges intersected object schemas", () => {
  const schema = z.object({
    profile: z.intersection(
      z.object({ firstName: z.string() }),
      z.object({ age: z.number() }),
    ),
  });

  assert.deepEqual(infer(schema), [
    {
      name: "profile",
      type: "object",
      fields: [
        { name: "firstName", type: "string" },
        { name: "age", type: "number" },
      ],
    },
  ]);
});
