import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { ErlForm } from "./components";
import type { FieldConfig } from "./types/field-options";

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  bio: z.string(),
  age: z.number().min(1, "Umur harus diisi"),
  role: z.string().min(1, "Role harus dipilih"),
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
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  name: "",
  password: "",
  bio: "",
  age: 18,
  role: "",
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
};

const fieldConfig: FieldConfig<FormValues> = {
  name: {
    label: "Nama",
    placeholder: "Masukkan nama",
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
  role: {
    label: "Role",
    options: [
      { label: "User", value: "user" },
      { label: "Editor", value: "editor" },
      { label: "Admin", value: "admin" },
    ],
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
    array: {
      itemLabel: (_, index) => `Kontak #${index + 1}`,
      addLabel: "+ Tambah kontak",
      removeLabel: "Hapus kontak",
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
};

export default function App() {
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => setSubmittedData(value),
  });

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-semibold text-slate-950">ErlForm Demo</h1>
            <p className="mt-2 text-sm text-slate-500">
              Contoh semua tipe field utama: text, password, textarea, number, select, boolean,
              object, dan array.
            </p>
          </div>

          <ErlForm<FormValues> form={form} schema={schema} fieldConfig={fieldConfig} />

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
