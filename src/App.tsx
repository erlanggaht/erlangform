import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { ErlForm } from "./components";
import type { FieldComponentProps } from "./types/component-registry";
import type { FieldConfig } from "./types/field-options";
import type { FormWizardOptions } from "./components/AutoForm";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.email("Email tidak valid"),
  website: z.url("URL tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  bio: z.string(),
  age: z.number().min(1, "Umur harus diisi"),
  birthDate: z.date().optional(),
  meetingAt: z.iso.datetime().optional(),
  resume: z.file().optional(),
  role: z.string().min(1, "Role harus dipilih"),
  status: z.union([z.literal("draft"), z.literal("published")]),
  companyName: z.string(),
  active: z.boolean(),
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  contacts: z.array(
    z.object({
      type: z.string(),
      phone: z.string(),
      active: z.boolean(),
    }),
  ),
  tags: z.array(z.string().min(1, "Tag tidak boleh kosong")),
  metadata: z.record(z.string(), z.string()),
  tuple: z.tuple([z.string(), z.number()]),
  contact: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]),
  preferences: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  email: "",
  website: "https://example.com",
  password: "",
  bio: "",
  age: 18,
  birthDate: undefined,
  meetingAt: "",
  resume: undefined,
  role: "",
  status: "draft",
  companyName: "",
  active: false,
  profile: {
    firstName: "",
    lastName: "",
  },
  contacts: [
    {
      type: "personal",
      phone: "",
      active: true,
    },
  ],
  tags: ["contoh"],
  metadata: {
    source: "demo",
    version: "1",
  },
  tuple: ["fixed", 1],
  contact: {
    kind: "person",
    name: "",
  },
  preferences: ["email"],
};

const fieldConfig: FieldConfig<FormValues> = {
  name: {
    label: "Nama",
    placeholder: "Masukkan nama",
  },
  email: {
    label: "Email",
    placeholder: "nama@example.com",
    section: "Field lanjutan",
  },
  website: {
    label: "Website",
    placeholder: "https://example.com",
    section: "Field lanjutan",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "Masukkan password",
  },
  bio: {
    label: "Bio",
    type: "textarea",
    placeholder: "Tulis bio singkat",
  },
  age: {
    label: "Umur",
    placeholder: "Masukkan umur",
  },
  birthDate: {
    label: "Tanggal lahir",
    section: "Field lanjutan",
  },
  meetingAt: {
    label: "Waktu meeting",
    section: "Field lanjutan",
  },
  resume: {
    label: "File resume",
    description: "Contoh z.file().optional().",
    section: "Field lanjutan",
  },
  role: {
    label: "Role",
    options: [
      { label: "User", value: "user" },
      { label: "Editor", value: "editor" },
      { label: "Admin", value: "admin" },
    ],
  },
  status: {
    label: "Status publikasi",
    section: "Field lanjutan",
  },
  companyName: {
    label: "Nama perusahaan",
    placeholder: "Hanya tampil saat role Admin",
    section: "Kondisional",
    showIf: (values) => values.role === "admin",
    clearOnHide: true,
  },
  active: {
    label: "Status aktif",
  },
  profile: {
    firstName: {
      label: "Nama depan",
      placeholder: "Nama depan",
    },
    lastName: {
      label: "Nama belakang",
      placeholder: "Nama belakang",
    },
  },
  contacts: {
    section: "Kontak",
    array: {
      itemLabel: (_, index) => `Kontak #${index + 1}`,
      addLabel: "+ Tambah kontak",
      removeLabel: "Hapus kontak",
      duplicateLabel: "Duplikat",
      moveUpLabel: "Naik",
      moveDownLabel: "Turun",
      minItems: 1,
      maxItems: 3,
      reorderable: true,
    },
    type: {
      label: "Tipe kontak",
      options: [
        { label: "Personal", value: "personal" },
        { label: "Perusahaan", value: "company" },
      ],
    },
    phone: {
      label: "Nomor telepon",
      placeholder: "0812xxxxxxxx",
    },
    active: {
      label: "Kontak aktif",
    },
  },
  tags: {
    section: "Tag dan kondisi",
    array: {
      itemLabel: (_, index) => `Tag #${index + 1}`,
      addLabel: "+ Tambah tag",
      removeLabel: "Hapus tag",
      duplicateLabel: "Duplikat",
      moveUpLabel: "Naik",
      moveDownLabel: "Turun",
      minItems: 0,
      maxItems: 5,
      reorderable: true,
    },
  },
  metadata: {
    section: "Tag dan kondisi",
  },
  tuple: {
    section: "Tag dan kondisi",
  },
  contact: {
    section: "Tag dan kondisi",
  },
  preferences: {
    inputType: "checkbox-group",
    options: [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
      { label: "Push notification", value: "push" },
    ],
    section: "Tag dan kondisi",
  },
};

function DemoTextField({ field, config, state }: FieldComponentProps<string, FormValues>) {
  const commonProps = {
    id: field.name,
    value: field.state.value ?? "",
    placeholder: config?.placeholder,
    disabled: state?.disabled,
    readOnly: state?.readOnly,
    required: state?.required,
    onBlur: () => field.handleBlur?.(),
    className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500",
  };

  if (config?.type === "textarea") {
    return <textarea {...commonProps} rows={4} onChange={(event) => field.handleChange(event.target.value)} />;
  }

  return (
    <input
      {...commonProps}
      type={config?.type === "password" ? "password" : "text"}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  );
}

const fieldComponent = {
  string: DemoTextField,
};

const sectionConfig = {
  "Field lanjutan": {
    title: "Field lanjutan",
    description: "Email, URL, date, datetime, dan file.",
  },
  Kondisional: {
    title: "Field kondisional",
    description: "Pilih Admin pada Role untuk menampilkan field perusahaan.",
  },
  Kontak: {
    title: "Array object",
    description: "Tambah dan hapus object kontak secara dinamis.",
    collapsible: true,
    defaultOpen: true,
  },
  "Tag dan kondisi": {
    title: "Array primitive",
    description: "Contoh array sederhana yang setiap item-nya adalah input text.",
  },
};

const wizard: FormWizardOptions<FormValues> = {
  steps: [
    {
      id: "identity",
      title: "Identitas",
      description: "Data dasar pengguna.",
      fields: ["name", "email", "website", "password", "bio"],
    },
    {
      id: "profile",
      title: "Profil",
      description: "Data profil dan status pengguna.",
      fields: ["age", "role", "status", "companyName", "active", "profile"],
    },
    {
      id: "details",
      title: "Detail tambahan",
      description: "Tanggal, file, kontak, dan tag.",
      fields: [
        "birthDate",
        "meetingAt",
        "resume",
        "contacts",
        "tags",
        "metadata",
        "tuple",
        "contact",
        "preferences",
      ],
    },
  ],
  previousLabel: "Sebelumnya",
  nextLabel: "Berikutnya",
};

export default function App() {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }: { value: FormValues }) => setSubmittedData(value),
  });

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-semibold text-slate-950">ErlForm Demo</h1>
            <p className="mt-2 text-sm text-slate-500">
              Contoh fitur utama: custom component, conditional field, select, number, boolean,
              object, array object, dan array primitive.
            </p>
          </div>

          <ErlForm<FormValues>
            form={form}
            schema={schema}
            fieldConfig={fieldConfig}
            fieldComponent={fieldComponent}
            sectionConfig={sectionConfig}
            wizard={wizard}
          />

          <div className="mt-7 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={() => form.handleSubmit()}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </section>

        <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 sm:p-7 lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold text-slate-950">Hasil submit</h2>
          <p className="mt-1 text-sm text-slate-500">Data akan muncul setelah validasi berhasil.</p>

          {submittedData ? (
            <pre className="mt-5 max-h-[70vh] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-200">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Belum ada hasil submit.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
