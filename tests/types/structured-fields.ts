import type { FieldConfig, NestedFieldConfig } from "../../src/index";

type Contact = { kind: "person"; name: string } | { kind: "company"; company: string };
type Values = {
  contact: Contact;
  contacts: Contact[];
  matrix: string[][];
  tuples: [string, number][];
  tuple: [string[], { title: string }, Contact];
};

export const config = {
  contact: {
    kind: { label: "Kind" },
    name: {
      label: "Personal name",
      showIf: (values) => values.kind === "person" && values.name.length >= 0,
      component: ({ field }) => {
        const value: string = field.state.value;
        return value;
      },
    },
    company: {
      label: "Company name",
      showIf: (values) => values.kind === "company" && values.company.length >= 0,
    },
  },
  contacts: { item: { name: { label: "Name" }, company: { label: "Company" } } },
  matrix: {
    array: { addLabel: "Add row" },
    item: { array: { addLabel: "Add cell" }, item: { placeholder: "Cell" } },
  },
  tuples: { item: { 0: { label: "Text" }, 1: { min: 0 } } },
  tuple: {
    0: { array: { addLabel: "Add text" } },
    1: { title: { label: "Title" } },
    2: { company: { label: "Company" } },
  },
} satisfies FieldConfig<Values>;

const invalidKey: NestedFieldConfig<Contact> = {
  // @ts-expect-error Union config must still reject unknown fields.
  missing: { label: "Unknown" },
};
const invalidValue: NestedFieldConfig<Contact> = {
  name: {
    // @ts-expect-error Personal name is string, not number.
    component: (props: { field: { state: { value: number } } }) => String(props.field.state.value),
  },
};
const invalidIndex: FieldConfig<Values> = {
  tuple: {
    // @ts-expect-error There are only three tuple positions.
    3: { label: "Unknown position" },
  },
};
void invalidKey;
void invalidValue;
void invalidIndex;
