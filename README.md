# ErlForm

Schema-driven form builder untuk React menggunakan [TanStack Form](https://tanstack.com/form) dan [Zod](https://zod.dev/).

ErlForm membaca struktur dari Zod schema lalu membuat field secara otomatis, sambil tetap memberikan kontrol penuh melalui `fieldConfig`.

## Fitur

- Generate field otomatis dari Zod schema
- Integrasi dengan TanStack Form
- Konfigurasi field per nama field
- Conditional logic:
  - `showIf`
  - `disableIf`
  - `readOnlyIf`
  - `requiredIf`
- `clearOnHide` untuk mereset value ketika field disembunyikan
- Select native dengan `options`
- Dynamic options berdasarkan nilai form
- Custom field component
- Section dan section configuration
- Responsive 12-column grid layout
- Array field
- Nested array
- Object field
- Label item array yang bisa statis atau dinamis berdasarkan index/item
- Add/remove label yang dapat dikustomisasi
- Nested field path yang kompatibel dengan error validation TanStack Form
- Error message dari Zod/TanStack Form ditampilkan di level field
- TypeScript support

## Instalasi

```bash
npm install erlangform
```

Dependency yang dibutuhkan:

```bash
npm install @tanstack/react-form zod
```

## Penggunaan Dasar

```tsx
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ErlForm } from "erlangform";

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
      <ErlForm form={form} schema={schema} />

      <button type="button" onClick={() => form.handleSubmit()}>
        Submit
      </button>
    </>
  );
}
```

ErlForm menggunakan Zod schema sebagai sumber struktur form. Validasi tetap dapat dijalankan oleh TanStack Form menggunakan schema yang sama.

---

## Konfigurasi Field

Gunakan `fieldConfig` untuk mengubah tampilan atau perilaku field.

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    username: {
      label: "Username",
      placeholder: "Masukkan username",
    },

    email: {
      label: "Email",
      placeholder: "Masukkan email",
    },

    age: {
      label: "Umur",
    },
  }}
/>
```

### Properti `FieldOptions`

| Properti               | Keterangan                                                |
| ---------------------- | --------------------------------------------------------- |
| `label`                | Label field, bisa string atau resolver berdasarkan values |
| `type`                 | `text`, `password`, `textarea`, `number`, atau `checkbox` |
| `placeholder`          | Placeholder field                                         |
| `description`          | Deskripsi field                                           |
| `options`              | Option select, bisa statis atau resolver                  |
| `component`            | Custom component                                          |
| `showIf`               | Menentukan apakah field ditampilkan                       |
| `disableIf`            | Menentukan apakah field disabled                          |
| `readOnlyIf`           | Menentukan apakah field readonly                          |
| `requiredIf`           | Menentukan apakah field required                          |
| `clearOnHide`          | Reset value ketika field menjadi hidden                   |
| `section`              | Nama section                                              |
| `layout`               | Konfigurasi grid                                          |
| `className`            | Class untuk control                                       |
| `wrapperClassName`     | Class wrapper field                                       |
| `labelClassName`       | Class label                                               |
| `descriptionClassName` | Class description                                         |
| `errorClassName`       | Class error                                               |
| `array`                | Konfigurasi array field                                   |

---

## Conditional Logic

Conditional logic menggunakan nilai form saat ini.

### `showIf`

Menampilkan field hanya ketika kondisi terpenuhi.

```tsx
fieldConfig={{
  companyName: {
    label: "Nama Perusahaan",
    showIf: (values) => values.isCompany,
  },
}}
```

### `disableIf`

```tsx
fieldConfig={{
  username: {
    label: "Username",
    disableIf: (values) => values.locked,
  },
}}
```

### `readOnlyIf`

```tsx
fieldConfig={{
  username: {
    label: "Username",
    readOnlyIf: (values) => values.locked,
  },
}}
```

### `requiredIf`

```tsx
fieldConfig={{
  companyName: {
    label: "Nama Perusahaan",
    requiredIf: (values) => values.isCompany,
  },
}}
```

### `clearOnHide`

Jika field disembunyikan dan `clearOnHide` bernilai `true`, value field akan direset.

```tsx
fieldConfig={{
  companyName: {
    label: "Nama Perusahaan",
    showIf: (values) => values.isCompany,
    clearOnHide: true,
  },
}}
```

Dengan demikian value lama tidak tetap tersimpan ketika field sudah tidak relevan.

---

## Resolver untuk Label, Placeholder, Description, dan Options

Beberapa konfigurasi dapat berupa nilai langsung atau function yang menerima `values`.

```tsx
fieldConfig={{
  label: (values) =>
    values.isCompany ? "Nama Perusahaan" : "Nama Lengkap",

  placeholder: (values) =>
    values.isCompany
      ? "Masukkan nama perusahaan"
      : "Masukkan nama lengkap",
}}
```

Dynamic options:

```tsx
fieldConfig={{
  city: {
    label: "Kota",

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

---

## Select

String field dapat menjadi native `<select>` dengan memberikan `options`.

```tsx
const schema = z.object({
  country: z.string(),
});

<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      label: "Negara",
      options: [
        { label: "Indonesia", value: "id" },
        { label: "Jepang", value: "jp" },
      ],
    },
  }}
/>;
```

Jika `options` tidak diberikan, string field tetap menjadi input text biasa.

---

## Custom Component

Field tertentu dapat diganti dengan component sendiri.

```tsx
function MySelect({ field }: any) {
  return (
    <select
      value={field.state.value ?? ""}
      onChange={(event) => field.handleChange(event.target.value)}
    >
      <option value="id">Indonesia</option>
      <option value="jp">Jepang</option>
    </select>
  );
}
```

Kemudian:

```tsx
<ErlForm
  form={form}
  schema={schema}
  fieldConfig={{
    country: {
      label: "Negara",
      component: MySelect,
    },
  }}
/>
```

Custom component menerima `field` dan `config`.

---

## Section

Field dapat dikelompokkan berdasarkan nama section.

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

Field dengan nama section yang sama akan dirender dalam section yang sama.

Section juga dapat dikonfigurasi:

```tsx
<ErlForm
  form={form}
  schema={schema}
  sectionConfig={{
    Account: {
      title: "Informasi Akun",
      description: "Kelola pengaturan akun.",
      collapsible: true,
      defaultOpen: true,
    },
  }}
/>
```

---

## Layout

ErlForm menggunakan grid 12 kolom.

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

Responsive breakpoint juga dapat digunakan:

```tsx
layout: {
  colSpan: 12,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
}
```

Contoh:

```text
┌──────────────────┬──────────────────┐
│     Username     │     Password     │
│      6 cols      │      6 cols      │
├─────────────────────────────────────┤
│                 Bio                  │
│               12 cols                │
└─────────────────────────────────────┘
```

---

## Array

ErlForm mendukung array dari Zod.

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

Default value:

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

  onSubmit: ({ value }) => {
    console.log(value);
  },
});
```

Konfigurasi array:

```tsx
fieldConfig={{
  contacts: {
    label: "Contacts",
    array: {
      itemLabel: "Contact",
      addLabel: "Tambah Contact",
      removeLabel: "Hapus Contact",
    },
  },
}}
```

Hasilnya setiap item memiliki header dan tombol remove, serta tombol add di bagian bawah.

---

## Label Item Array Dinamis

`itemLabel` dapat berupa function:

```tsx
fieldConfig={{
  companies: {
    label: "Companies",
    array: {
      itemLabel: (item, index) =>
        item.name
          ? `Company: ${item.name}`
          : `Company ${index + 1}`,

      addLabel: "Tambah Company",
      removeLabel: "Hapus Company",
    },
  },
}}
```

Function menerima:

```ts
(item, index);
```

sehingga label dapat mengikuti value item saat ini.

Contoh:

```text
Company: Erlangga
Company: Acme
Company 3
```

Jika `itemLabel` hanya string:

```tsx
array: {
  itemLabel: "Contact",
}
```

maka hasilnya:

```text
Contact 1
Contact 2
Contact 3
```

---

## Nested Array

Array dapat berisi object yang memiliki array lain.

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

Contoh konfigurasi:

```tsx
fieldConfig={{
  companies: {
    label: "Companies",

    array: {
      itemLabel: (item, index) =>
        item.name
          ? `Company: ${item.name}`
          : `Company ${index + 1}`,

      addLabel: "Tambah Company",
      removeLabel: "Hapus Company",
    },
  },

  contacts: {
    label: "Contacts",

    array: {
      itemLabel: "Contact",
      addLabel: "Tambah Contact",
      removeLabel: "Hapus Contact",
    },
  },
}}
```

ErlForm akan membentuk nested path seperti:

```text
companies[0].name
companies[0].contacts[0].type
companies[0].contacts[0].phone
companies[0].contacts[1].type
```

Format ini juga digunakan agar error validation nested dari TanStack Form dapat terhubung kembali ke field yang sesuai.

---

## Object Field

Object di dalam Zod schema juga didukung.

```tsx
const schema = z.object({
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
});
```

Field di dalam object akan dirender berdasarkan struktur object tersebut.

---

## Validation dan Error

ErlForm menggunakan TanStack Form untuk state dan validation, sementara Zod dapat digunakan sebagai validator.

```tsx
const schema = z.object({
  email: z.string().email("Format email tidak valid"),

  contacts: z.array(
    z.object({
      type: z.string().min(1, "Type wajib dipilih"),
      phone: z.string().min(10, "Phone minimal 10 karakter"),
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

Error akan ditampilkan pada field yang sesuai.

Untuk nested array, misalnya:

```text
companies[0].contacts[0].type
```

error dari Zod juga akan dipetakan ke field tersebut.

Contoh error:

```text
Type wajib dipilih
```

---

## Submit Invalid

Jika ingin melihat error ketika submit gagal:

```tsx
const form = useForm({
  // ...

  validators: {
    onChange: schema,
  },

  onSubmitInvalid: (props) => {
    console.log(props.formApi.getAllErrors());
  },

  onSubmit: ({ value }) => {
    console.log(value);
  },
});
```

`getAllErrors()` dapat menghasilkan error dengan path seperti:

```text
email
contacts[0].type
companies[0].contacts[0].type
companies[0].contacts[0].phone
```

---

## Field Error Styling

Error dapat diberi class sendiri:

```tsx
fieldConfig={{
  email: {
    label: "Email",
    errorClassName: "text-red-500 text-sm",
  },
}}
```

Class lain yang tersedia:

```text
className
wrapperClassName
labelClassName
descriptionClassName
errorClassName
```

---

## TypeScript

ErlForm dibuat dengan TypeScript dan menggunakan Zod sebagai sumber struktur form.

```tsx
const schema = z.object({
  username: z.string(),
  email: z.string().email(),
});
```

Schema tetap menjadi sumber utama untuk:

1. Struktur field.
2. Tipe field dasar.
3. Validasi.

Sedangkan `fieldConfig` digunakan untuk menambahkan konfigurasi UI dan behavior.

---

## Struktur Konsep

Secara umum alur ErlForm:

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
         ↓
Field State + Validation
```

Conditional state:

```text
form values
    ↓
resolveFieldState()
    ↓
visible / disabled / readOnly / required
```

Resolver configuration:

```text
fieldConfig
    ↓
resolveFieldConfig()
    ↓
label / placeholder / description / options
```

---

## Requirements

- React 18 atau React 19
- TanStack Form
- Zod

## Versi

Versi saat ini:

```text
0.2.0
```

ErlForm masih dalam tahap pengembangan aktif.

## Lisensi

MIT
