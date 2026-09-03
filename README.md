# ErlForm

Schema-driven form builder for React powered by **TanStack Form** and **Zod**.

ErlForm reads a Zod object schema and automatically renders form fields while still giving you control over UI and behavior through `fieldConfig`.

> Current package version: **0.4.0**

## Baru di v0.4.0

Versi ini menyelesaikan fondasi type-safety yang dimulai pada seri v0.3.x tanpa mengubah cara dasar menggunakan `ErlForm`.

- `FieldConfig<FormValues>` sekarang mengenali seluruh key dari schema, termasuk object dan array bertingkat.
- Callback field tingkat atas menerima root form values yang bertipe.
- Callback field di dalam object atau array menerima contextual values yang sesuai.
- `itemLabel(item, index)` menerima tipe item array sebenarnya, bukan `any`.
- Konfigurasi field di dalam object atau array ditulis langsung di bawah parent-nya.
- Dynamic resolver untuk label, placeholder, description, dan options bertipe end-to-end.
- Custom field component memiliki `FieldComponentProps<TValue, TValues>` yang bertipe.
- Component registry mendukung field string, number, dan boolean dengan value yang tepat.
- Metadata hasil inferensi Zod tidak lagi memakai `any`.
- Helper nested path menggunakan `unknown` dan pemeriksaan object yang aman.
- Public type exports ditambah untuk kebutuhan integrasi lanjutan.

Contoh konfigurasi nested yang sekarang type-safe:

```tsx
type FormValues = z.infer<typeof schema>;

const fieldConfig = {
  username: {
    disableIf: (values) => values.locked,
  },
  contacts: {
    array: {
      itemLabel: (item, index) => `${index + 1}. ${item.phone}`,
    },
    companyName: {
      showIf: (item) => item.type === "company",
    },
  },
} satisfies FieldConfig<FormValues>;
```

## Features

- Generate fields from a Zod object schema
- TanStack Form integration
- Zod validation
- TypeScript support
- Field configuration with `fieldConfig`
- Conditional fields with:
  - `showIf`
  - `disableIf`
  - `readOnlyIf`
  - `requiredIf`
- Reset hidden fields with `clearOnHide`
- Dynamic labels, placeholders, descriptions, and select options
- Native select fields
- Custom field components
- Configurable sections
- Collapsible sections
- Responsive 12-column layout
- Object fields
- Array fields
- Nested arrays and objects
- Custom array add/remove labels
- Static or dynamic array item labels
- Field-level validation errors

## Installation

```bash
npm install erlangform
```

ErlForm is built around:

- React
- TanStack Form
- Zod

## Quick Start

```tsx
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ErlForm } from "erlangform";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email"),
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
      <ErlForm form={form} schema={schema} />

      <button type="button" onClick={() => form.handleSubmit()}>
        Submit
      </button>
    </>
  );
}
```

The Zod schema defines the form structure, while TanStack Form manages form state and validation.

## Supported Schema Types

Automatic field inference currently supports:

| Zod schema     | Rendered field       |
| -------------- | -------------------- |
| String / Email | Text input           |
| Number         | Number input         |
| Boolean        | Checkbox             |
| Object         | Nested object fields |
| Array          | Dynamic array fields |

Other Zod schema types are not automatically rendered yet.

## ErlForm Props

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldConfig={fieldConfig}
  sectionConfig={sectionConfig}
  fieldComponent={fieldComponent}
/>
```

| Prop             | Description                                       |
| ---------------- | ------------------------------------------------- |
| `form`           | TanStack Form instance                            |
| `schema`         | Zod object schema used to generate the form       |
| `fieldConfig`    | Configuration for individual fields               |
| `sectionConfig`  | Configuration for field sections                  |
| `fieldComponent` | Custom component registry by primitive field type |

## Field Configuration

Use `fieldConfig` to customize individual fields.

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    username: {
      label: "Username",
      placeholder: "Enter your username",
    },

    email: {
      label: "Email Address",
      description: "We will never share your email.",
    },

    age: {
      label: "Age",
    },
  }}
/>
```

### FieldOptions

Available configuration:

| Option                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `label`                | Input label, static/dynamic `ReactNode`              |
| `type`                 | UI variant such as `text`, `password`, or `textarea` |
| `placeholder`          | Input placeholder, static or dynamic                 |
| `description`          | Field description, static or dynamic                 |
| `options`              | Select options, static or dynamic                    |
| `component`            | Custom React component for the field                 |
| `showIf`               | Controls field visibility                            |
| `disableIf`            | Controls disabled state                              |
| `readOnlyIf`           | Controls readonly state                              |
| `requiredIf`           | Controls required state                              |
| `clearOnHide`          | Resets the field value when hidden                   |
| `section`              | Assigns the field to a section                       |
| `layout`               | Responsive grid configuration                        |
| `className`            | Class for the form control                           |
| `wrapperClassName`     | Class for the field wrapper                          |
| `labelClassName`       | Class for the label                                  |
| `descriptionClassName` | Class for the description                            |
| `errorClassName`       | Class for validation errors                          |
| `array`                | Array-specific configuration                         |

`label`, `placeholder`, `description`, input `type`, custom component, and input class
props are only available to leaf input fields. Mereka sengaja tidak tersedia pada object
atau array karena renderer tidak menggunakannya.

## Input Types

### Text

A Zod string renders as a regular text input by default.

```tsx
fieldConfig={{
  username: {
    label: "Username",
    placeholder: "Enter username",
  },
}}
```

### Password

```tsx
fieldConfig={{
  password: {
    label: "Password",
    type: "password",
  },
}}
```

### Textarea

```tsx
fieldConfig={{
  bio: {
    label: "Biography",
    type: "textarea",
  },
}}
```

### Number

A Zod number automatically renders a number input.

```tsx
const schema = z.object({
  age: z.number(),
});
```

### Checkbox

A Zod boolean automatically renders a checkbox.

```tsx
const schema = z.object({
  acceptTerms: z.boolean(),
});
```

## Select Fields

A string field becomes a native `<select>` when `options` are provided.

```tsx
const schema = z.object({
  country: z.string(),
});

<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      label: "Country",
      options: [
        { label: "Indonesia", value: "id" },
        { label: "Japan", value: "jp" },
      ],
    },
  }}
/>;
```

## Dynamic Configuration

`label`, `placeholder`, `description`, and `options` can be resolver functions.

```tsx
fieldConfig={{
  companyName: {
    label: (values) =>
      values.isCompany ? "Company Name" : "Full Name",

    placeholder: (values) =>
      values.isCompany
        ? "Enter company name"
        : "Enter your full name",
  },

  city: {
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

If the currently selected value no longer exists after dynamic options change, ErlForm resets the value to an empty string.

## Conditional Fields

### showIf

Only render a field when a condition is true.

```tsx
fieldConfig={{
  companyName: {
    label: "Company Name",
    showIf: (values) => values.isCompany,
  },
}}
```

### disableIf

```tsx
fieldConfig={{
  username: {
    disableIf: (values) => values.locked,
  },
}}
```

### readOnlyIf

```tsx
fieldConfig={{
  username: {
    readOnlyIf: (values) => values.locked,
  },
}}
```

### requiredIf

```tsx
fieldConfig={{
  companyName: {
    requiredIf: (values) => values.isCompany,
  },
}}
```

### clearOnHide

Use `clearOnHide` when hidden values should not remain in the form state.

```tsx
fieldConfig={{
  companyName: {
    showIf: (values) => values.isCompany,
    clearOnHide: true,
  },
}}
```

For top-level fields, conditional callbacks receive the root form values.

For nested fields, conditional callbacks receive the values of their current parent object.

## Custom Components

A field can use its own React component.

```tsx
function CountrySelect({ field, config }: any) {
  return (
    <select
      value={field.state.value ?? ""}
      className={config?.className}
      onChange={(event) => field.handleChange(event.target.value)}
    >
      <option value="">Select country</option>
      <option value="id">Indonesia</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

Then assign it through `fieldConfig`:

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      label: "Country",
      component: CountrySelect,
    },
  }}
/>
```

Custom components receive:

```ts
{
  (field, config);
}
```

### Component Registry

You can also provide default custom controls by inferred field type.

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldComponent={{
    string: CustomTextInput,
    number: CustomNumberInput,
    boolean: CustomCheckbox,
  }}
/>
```

Field-level `component` configuration takes precedence over the component registry.

## Sections

Assign fields to sections using `section`.

```tsx
fieldConfig={{
  username: {
    label: "Username",
    section: "Account",
  },

  password: {
    label: "Password",
    type: "password",
    section: "Account",
  },

  email: {
    label: "Email",
    section: "Profile",
  },
}}
```

Configure sections through `sectionConfig`:

```tsx
<ErlForm
  form={form}
  schema={schema}
  sectionConfig={{
    Account: {
      title: "Account Information",
      description: "Manage your account credentials.",
      collapsible: true,
      defaultOpen: true,
    },

    Profile: {
      title: "Profile",
    },
  }}
/>
```

Available section configuration:

| Option             | Description                          |
| ------------------ | ------------------------------------ |
| `title`            | Section title                        |
| `description`      | Section description                  |
| `className`        | Section class                        |
| `headerClassName`  | Section header class                 |
| `contentClassName` | Section content class                |
| `collapsible`      | Render section using `<details>`     |
| `defaultOpen`      | Open a collapsible section initially |

## Responsive Layout

ErlForm uses a 12-column grid model.

```tsx
fieldConfig={{
  firstName: {
    layout: {
      colSpan: 6,
    },
  },

  lastName: {
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

Responsive values are also supported:

```tsx
layout: {
  colSpan: 12,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
}
```

The supported breakpoints correspond to:

```text
sm  >= 640px
md  >= 768px
lg  >= 1024px
xl  >= 1280px
```

> The responsive layout depends on ErlForm's CSS class definitions. The current package build does not automatically expose the demo stylesheet, so applications consuming the npm package should provide the required styling themselves.

## Object Fields

Nested Zod objects are rendered recursively.

```tsx
const schema = z.object({
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});
```

The generated field paths follow the nested structure:

```text
profile.firstName
profile.lastName
```

## Arrays

ErlForm supports Zod arrays.

```tsx
const schema = z.object({
  contacts: z.array(
    z.object({
      type: z.string(),
      phone: z.string(),
      active: z.boolean(),
    }),
  ),
});
```

Provide array values through TanStack Form:

```tsx
const form = useForm({
  defaultValues: {
    contacts: [
      {
        type: "personal",
        phone: "",
        active: true,
      },
    ],
  },

  validators: {
    onChange: schema,
  },
});
```

Configure array controls and its item fields in one place:

```tsx
fieldConfig={{
  contacts: {
    array: {
      itemLabel: "Contact",
      addLabel: "Add Contact",
      removeLabel: "Remove Contact",
    },
    type: {
      label: "Contact type",
      options: [
        { label: "Personal", value: "personal" },
        { label: "Company", value: "company" },
      ],
    },
    phone: {
      label: "Phone number",
    },
  },
}}
```

When a new item is added, ErlForm creates a default value based on the inferred item schema.

## Dynamic Array Labels

`itemLabel` can be a string, `ReactNode`, or function that receives the current item and index.

```tsx
fieldConfig={{
  companies: {
    array: {
      itemLabel: (item, index) =>
        item.name
          ? `Company: ${item.name}`
          : `Company ${index + 1}`,

      addLabel: "Add Company",
      removeLabel: "Remove Company",
    },
  },
}}
```

Or use a static prefix:

```tsx
array: {
  itemLabel: "Contact",
}
```

which produces labels such as:

```text
Contact 1
Contact 2
Contact 3
```

> Current implementation note: array containers also render their own `Item N` header above the configured item content.

## Nested Arrays

Arrays can contain nested objects and other arrays.

```tsx
const schema = z.object({
  companies: z.array(
    z.object({
      name: z.string(),

      contacts: z.array(
        z.object({
          type: z.string(),
          phone: z.string(),
          active: z.boolean(),
        }),
      ),
    }),
  ),
});
```

Generated paths follow TanStack Form's nested field format:

```text
companies[0].name
companies[0].contacts[0].type
companies[0].contacts[0].phone
```

Nested fields are recursively passed back through the same `FieldRenderer`.

### Scoped Nested Field Configuration

Put child settings directly on an object or array configuration to scope them to its direct children.
The condition callbacks receive the immediate parent value, so the following `showIf`
receives one contact rather than the whole form:

```tsx
fieldConfig={{
  contacts: {
    array: {
      addLabel: "Add contact",
    },
    type: {
      label: "Contact type",
    },
    companyName: {
      label: "Company name",
      showIf: (contact) => contact.type === "company",
    },
  },
}}
```

This shape is recursive, including arrays nested inside array items:

```tsx
fieldConfig={{
  companies: {
    contacts: {
      array: { addLabel: "Add company contact" },
      phone: { label: "Company phone" },
    },
  },
}}
```

Objects use the same direct shape:

```tsx
fieldConfig={{
  company: {
    city: { label: "City" },
    address: { label: "Address" },
  },
}}
```

Input labels can render static or dynamic React content:

```tsx
label: (contact) => <span>Type for {contact.phone}</span>
```

The label renderer already supplies the wrapper for plain text. If returning custom
markup, prefer a semantic child such as `span` or `strong`, not a nested `label` element.

The previous flat form (`phone: { ... }`) remains supported as a compatibility
fallback. Prefer the scoped direct form for new forms because same-named fields can
have different settings in different branches of the schema.

## Validation

Validation is handled by TanStack Form. A Zod schema can be used as the validator.

```tsx
const schema = z.object({
  email: z.email("Invalid email"),

  contacts: z.array(
    z.object({
      type: z.string().min(1, "Type is required"),
      phone: z.string().min(10, "Phone must contain at least 10 characters"),
    }),
  ),
});

const form = useForm({
  defaultValues: {
    email: "",
    contacts: [
      {
        type: "",
        phone: "",
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

ErlForm displays the first validation error associated with a field.

## Styling

ErlForm exposes class hooks through `fieldConfig`:

```tsx
fieldConfig={{
  email: {
    className: "input",
    wrapperClassName: "field",
    labelClassName: "field-label",
    descriptionClassName: "field-description",
    errorClassName: "field-error",
  },
}}
```

Available field classes:

```text
className
wrapperClassName
labelClassName
descriptionClassName
errorClassName
```

The rendered components also use internal class names such as:

```text
erlform-form
erlform-grid
erlform-field
erlform-section
erlform-array
erlform-array-item
erlform-error
```

The repository contains a demo stylesheet under:

```text
src/styles/index.css
```

That stylesheet is currently used by the development/demo application and is not automatically exported by the package build.

## Public Exports

The package currently exports:

```ts
ErlForm;
Field;
FieldRenderer;

FieldConfig;
FieldOptions;
ResolvedFieldOptions;

SectionConfig;
SectionConfigs;
```

Example type import:

```tsx
import type { FieldConfig, FieldOptions, SectionConfig } from "erlangform";
```

## Development

Clone the repository:

```bash
git clone https://github.com/erlanggaht/erlangform.git
cd erlangform
```

Install dependencies:

```bash
npm install
```

Run the demo application:

```bash
npm run dev
```

Build the npm library:

```bash
npm run build
```

Build the demo application:

```bash
npm run build:app
```

Run ESLint:

```bash
npm run lint
```

Preview the demo build:

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── AutoForm.tsx
│   ├── FieldRenderer.tsx
│   ├── field/
│   ├── field-array/
│   ├── field-object/
│   └── field-section/
├── styles/
├── types/
├── utils/
├── infer.ts
└── index.ts
```

High-level flow:

```text
Zod Schema
    ↓
infer()
    ↓
Field Metadata
    ↓
FieldRenderer
    ├── Field
    ├── ObjectField
    └── FieldArray
         ↓
TanStack Form
```

## Current Limitations

ErlForm is still under active development.

Current implementation limitations include:

- Automatic inference is limited to string/email, number, boolean, object, and array schemas.
- Schema keys that collide with container options such as `array`, `layout`, or `section` should use the legacy flat configuration.
- The built-in stylesheet is not currently exported from the npm package build.

## Version

Current repository package version:

```text
0.4.1
```
