import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Field } from "../../dist/index.js";

test("renders accessible label, description, and error relationships", () => {
  const fakeField = {
    name: "email",
    state: {
      value: "",
      meta: { errors: ["Email is required"] },
    },
    handleChange() {},
  };
  const fakeForm = {
    state: { values: { email: "" } },
    Field: ({ children }) => children(fakeField),
  };

  const markup = renderToStaticMarkup(
    React.createElement(Field, {
      form: fakeForm,
      name: "email",
      type: "string",
      config: {
        label: "Email",
        description: "Use your primary email.",
      },
      state: {
        visible: true,
        disabled: false,
        readOnly: false,
        required: true,
      },
    }),
  );

  assert.match(markup, /for="email"/);
  assert.match(markup, /id="email-description"/);
  assert.match(markup, /aria-describedby="email-description email-error"/);
  assert.match(markup, /aria-invalid="true"/);
  assert.match(markup, /aria-required="true"/);
  assert.match(markup, /role="alert"/);
});
