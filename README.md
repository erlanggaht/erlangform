# ErlForm

Schema-driven form builder for React using [TanStack Form](https://tanstack.com/form) and [Zod](https://zod.dev/).

ErlForm generates form fields automatically from your Zod schema while still allowing you to customize individual fields.

## Features

- Generate fields from Zod schema
- TanStack Form integration
- Field configuration
- Conditional fields
- Conditional disabled / readonly / required state
- Select options
- Dynamic options
- Custom field components
- Sections
- Grid layout
- Array and object fields
- TypeScript support

## Installation

```bash
npm install erlangform
```

You will also need:

```bash
npm install @tanstack/react-form zod
```

## Basic Usage

```tsx
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AutoForm } from "erlangform";

const schema = z.object({
  username: z.string(),
  email: z.string().email(),
  age: z.number(),
  isAdmin: z.boolean(),
});

export default function App() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      age: 0,
      isAdmin: false,
    },

    validators: {
      onChange: schema,
    },

    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <AutoForm form={form} schema={schema} />

      <button onClick={() => form.handleSubmit()}>Submit</button>
    </>
  );
}
```

ErlForm reads the Zod schema and automatically generates the appropriate fields.

## Field Configuration

Use `fieldConfig` when you want to customize a field.

```tsx
<AutoForm
  form={form}
  schema={schema}
  fieldConfig={{
    username: {
      label: "Username",
      placeholder: "Enter your username",
    },

    email: {
      label: "Email",
      placeholder: "Enter your email",
    },

    age: {
      label: "Age",
    },
  }}
/>
```

## Password and Textarea

You can change the input type using `type`.

```tsx
fieldConfig={{
  password: {
    label: "Password",
    type: "password",
  },

  bio: {
    label: "Bio",
    type: "textarea",
  },
}}
```

Supported types include:

```text
text
password
textarea
number
checkbox
```

## Conditional Fields

Fields can react to other form values.

### Show / Hide

```tsx
fieldConfig={{
  companyName: {
    label: "Company Name",
    showIf: (values) => values.isCompany,
  },
}}
```

### Required

```tsx
fieldConfig={{
  companyName: {
    requiredIf: (values) => values.isCompany,
  },
}}
```

### Disabled

```tsx
fieldConfig={{
  email: {
    disableIf: (values) => !values.isAdmin,
  },
}}
```

### Read Only

```tsx
fieldConfig={{
  username: {
    readOnlyIf: (values) => values.locked,
  },
}}
```

## Select Options

A string field can be rendered as a native `<select>` by providing `options`.

```tsx
const schema = z.object({
  country: z.string(),
});

<AutoForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      label: "Country",
      options: [
        {
          label: "Indonesia",
          value: "id",
        },
        {
          label: "Japan",
          value: "jp",
        },
      ],
    },
  }}
/>;
```

## Dynamic Options

Options can depend on the current form values.

```tsx
fieldConfig={{
  city: {
    label: "City",

    options: (values) =>
      values.country === "id"
        ? [
            { label: "Jakarta", value: "jakarta" },
            { label: "Bandung", value: "bandung" },
          ]
        : [
            { label: "Tokyo", value: "tokyo" },
            { label: "Osaka", value: "osaka" },
          ],
  },
}}
```

## Custom Components

You can replace the default field component.

```tsx
function MySelect({ field }: any) {
  return (
    <select
      value={field.state.value ?? ""}
      onChange={(event) => field.handleChange(event.target.value)}
    >
      <option value="id">Indonesia</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

Then register it:

```tsx
<AutoForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      component: MySelect,
    },
  }}
/>
```

## Sections

Fields can be grouped into sections.

```tsx
fieldConfig={{
  username: {
    label: "Username",
    section: "Account",
  },

  password: {
    label: "Password",
    section: "Account",
    type: "password",
  },

  email: {
    label: "Email",
    section: "Profile",
  },
}}
```

Fields using the same section name are rendered together.

## Layout

Fields can use a 12-column grid layout.

```tsx
fieldConfig={{
  username: {
    layout: {
      colSpan: 6,
    },
  },

  password: {
    layout: {
      colSpan: 6,
    },
  },

  bio: {
    layout: {
      colSpan: 12,
    },
  },
}}
```

Example:

```text
┌──────────────────┬──────────────────┐
│     Username     │     Password     │
│      6 cols      │      6 cols      │
├─────────────────────────────────────┤
│                 Bio                  │
│               12 cols                │
└─────────────────────────────────────┘
```

## Arrays

ErlForm supports arrays defined in Zod.

```tsx
const schema = z.object({
  contacts: z.array(
    z.object({
      phone: z.string(),
      active: z.boolean(),
    }),
  ),
});
```

Example default value:

```tsx
const form = useForm({
  defaultValues: {
    contacts: [
      {
        phone: "",
        active: true,
      },
    ],
  },

  validators: {
    onChange: schema,
  },

  onSubmit: ({ value }) => {
    console.log(value);
  },
});
```

## Field Configuration Reference

| Property           | Description                       |
| ------------------ | --------------------------------- |
| `label`            | Field label                       |
| `type`             | Input type                        |
| `placeholder`      | Input placeholder                 |
| `description`      | Field description                 |
| `options`          | Select options or dynamic options |
| `component`        | Custom field component            |
| `showIf`           | Conditionally show field          |
| `disableIf`        | Conditionally disable field       |
| `readOnlyIf`       | Conditionally make field readonly |
| `requiredIf`       | Conditionally require field       |
| `section`          | Section name                      |
| `layout`           | Grid layout configuration         |
| `wrapperClassName` | Wrapper styling                   |
| `className`        | Field styling                     |

## TypeScript

ErlForm is built with TypeScript and works with Zod schemas.

Your schema remains the source of truth for the form structure and validation.

```tsx
const schema = z.object({
  username: z.string(),
  email: z.string().email(),
});
```

## Requirements

- React 18 or React 19
- TanStack Form
- Zod

## Version

Current version:

```text
0.1.0
```

ErlForm is currently under active development.

## License

MIT
