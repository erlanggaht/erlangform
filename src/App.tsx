import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { ErlForm } from "./components";
import type { FieldConfig } from "./types/field-options";

const schema = z.object({
  // Seksi Account
  locked: z.boolean(),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),

  // Seksi Profile
  bio: z.string(),
  isAdmin: z.boolean(),
  email: z.string().email("Format email tidak valid"),

  // Seksi Pekerjaan (Company)
  isCompany: z.boolean(),
  company: z.string(),

  // Seksi Lokasi
  country: z.string(),
  city: z.string(),

  socials: z.object({
    facebook: z.string(),
    instagram: z.string(),
  }),

  // Seksi Contacts (Array Sederhana)
  contacts: z.array(
    z.object({
      type: z.string(),
      phone: z.string().min(4, "Phone minimal 10 karakter"),
      companyName: z.string(),
      active: z.boolean(),
    }),
  ),

  // Seksi Companies (Array Terintegrasi / Nested Array)
  companies: z.array(
    z.object({
      name: z.string(),

      contacts: z.array(
        z.object({
          type: z.string().min(1, "Type wajib dipilih"),
          phone: z.string().min(10, "Phone minimal 10 karakter"),
          companyName: z.string(),
          active: z.boolean(),
        }),
      ),
    }),
  ),
});

export default function App() {
  const [submittedData, setSubmittedData] = useState<z.infer<typeof schema> | null>(null);

  const form = useForm({
    defaultValues: {
      locked: false,
      username: "Erlangga",
      password: "password123",
      bio: "Software Engineer & UI Enthusiast",
      isAdmin: false,
      email: "",
      isCompany: false,
      company: "",
      country: "id",
      city: "jakarta",
      socials: {
        facebook: "fb",
        instagram: "ig",
      },
      contacts: [
        {
          type: "x",
          phone: "08123456789",
          companyName: "",
          active: true,
        },
      ],
      companies: [
        {
          name: "Erlangga",
          contacts: [
            {
              type: "personal",
              phone: "123",
              companyName: "",
              active: false,
            },
          ],
        },
      ],
    },
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      console.log("Form Submitted:", value);
      setSubmittedData(value);
    },
  });

  const tryScenario = (scenario: "admin" | "company" | "locked") => {
    if (scenario === "admin") {
      form.setFieldValue("isAdmin", true);
      form.setFieldValue("email", "admin@erlangform.dev");
    }

    if (scenario === "company") {
      form.setFieldValue("isCompany", true);
      form.setFieldValue("company", "Erlangga Studio");
    }

    if (scenario === "locked") {
      form.setFieldValue("locked", true);
    }
  };

  return (
    <main className="min-h-dvh bg-slate-50 py-6 text-slate-900 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="border-b border-slate-300 pb-7 sm:pb-9">
          <p className="mb-3 font-mono text-xs font-medium text-blue-700">ErlForm / Playground</p>
          <h1 className="m-0 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Coba perilaku form secara langsung
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Pilih skenario atau ubah isian sendiri. Panel di sebelah kanan akan menunjukkan cara
            ErlForm membaca perubahan data.
          </p>
        </header>

        <section
          className="border-b border-slate-200 py-5 sm:py-6"
          aria-labelledby="quick-start-title"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="quick-start-title" className="m-0 text-sm font-semibold text-slate-800">
              Skenario cepat
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => tryScenario("admin")}
                className="min-h-11 cursor-pointer rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-slate-100"
              >
                Tampilkan field bersyarat
              </button>
              <button
                type="button"
                onClick={() => tryScenario("company")}
                className="min-h-11 cursor-pointer rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-slate-100"
              >
                Isi sebagai perusahaan
              </button>
              <button
                type="button"
                onClick={() => tryScenario("locked")}
                className="min-h-11 cursor-pointer rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-slate-100"
              >
                Coba field terkunci
              </button>
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setSubmittedData(null);
                }}
                className="min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_304px] lg:gap-8">
          <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="mb-7 border-b border-slate-200 pb-5">
              <h2 className="m-0 text-xl font-semibold text-slate-950">Profil pengguna</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Perubahan dan validasi berjalan saat Anda mengisi form.
              </p>
            </div>
            <ErlForm
              form={form}
              schema={schema}
              sectionConfig={{
                Account: {
                  title: "1. Akun & Keamanan",
                  description: "Kelola kredensial akun dan status penguncian.",
                  collapsible: true,
                  defaultOpen: true,
                },
                Profile: {
                  title: "2. Profil Pengguna",
                  description: "Informasi bio dan hak akses sistem.",
                  collapsible: true,
                  defaultOpen: true,
                },
                Company: {
                  title: "3. Informasi Perusahaan",
                  description: "Isi jika Anda mendaftar atas nama badan usaha.",
                  collapsible: true,
                  defaultOpen: true,
                },
                Address: {
                  title: "4. Domisili & Lokasi",
                  description: "Pilihan kota dinamis tergantung negara yang dipilih.",
                  collapsible: true,
                  defaultOpen: true,
                },
                Contacts: {
                  title: "5. Daftar Kontak",
                  description: "Konfigurasi setiap field kini berada di dalam array contacts.",
                  collapsible: true,
                  defaultOpen: true,
                },
                Companies: {
                  title: "6. Perusahaan & Sub-Kontak (Nested)",
                  description: "Contoh pengisian data bertingkat (Array di dalam Array).",
                  collapsible: true,
                  defaultOpen: false,
                },
              }}
              fieldConfig={
                {
                  // --- SEKSI ACCOUNT ---
                  locked: {
                    label: "Kunci Akun (Lock)",
                    description: "Aktifkan untuk mengunci username dan password",
                    section: "Account",
                  },
                  username: {
                    label: "Username",
                    placeholder: "Masukkan username...",
                    section: "Account",
                    disableIf: (values) => values.locked, // Kunci jika 'locked' true
                    layout: { colSpan: 12, md: 6 },
                  },
                  password: {
                    label: "Password",
                    type: "password",
                    placeholder: "••••••••",
                    section: "Account",
                    disableIf: (values) => values.locked,
                    layout: { colSpan: 12, md: 6 },
                  },

                  // --- SEKSI PROFILE ---
                  bio: {
                    label: "Bio Singkat",
                    type: "textarea",
                    placeholder: "Tuliskan sedikit tentang diri Anda...",
                    section: "Profile",
                    layout: { colSpan: 12 },
                  },
                  isAdmin: {
                    label: "Status Admin",
                    description: "Centang untuk membongkar akses email administrator",
                    section: "Profile",
                  },
                  email: {
                    label: "Email Admin",
                    placeholder: "admin@domain.com",
                    section: "Profile",
                    showIf: (values) => values.isAdmin,
                    requiredIf: (values) => values.isAdmin,
                    clearOnHide: true,
                    layout: { colSpan: 12, md: 6 },
                  },

                  // --- SEKSI COMPANY ---
                  isCompany: {
                    label: "Daftar Sebagai Perusahaan?",
                    section: "Company",
                  },
                  company: {
                    label: "Nama Perusahaan",
                    placeholder: "PT Nama Perusahaan",
                    section: "Company",
                    showIf: (values) => values.isCompany,
                    requiredIf: (values) => values.isCompany,
                    clearOnHide: true,
                    layout: { colSpan: 12, md: 6 },
                  },

                  // --- SEKSI ADDRESS ---
                  country: {
                    label: "Negara",
                    section: "Address",
                    options: [
                      { label: "Indonesia", value: "id" },
                      { label: "Jepang", value: "jp" },
                    ],
                    layout: { colSpan: 12, md: 6 },
                  },
                  city: {
                    label: "Kota",
                    section: "Address",
                    // Options dinamis berdasarkan pilihan negara
                    options: (values) =>
                      values.country === "id"
                        ? [
                            { label: "Jakarta", value: "jakarta" },
                            { label: "Bandung", value: "bandung" },
                            { label: "Surabaya", value: "surabaya" },
                          ]
                        : [
                            { label: "Tokyo", value: "tokyo" },
                            { label: "Osaka", value: "osaka" },
                            { label: "Kyoto", value: "kyoto" },
                          ],
                    layout: { colSpan: 12, md: 6 },
                  },

                  socials: {
                    facebook: {
                      label: "Facebook",
                    },
                    instagram: {
                      label: "Instagram",
                    },
                  },

                  // --- SEKSI ARRAY: CONTACTS ---
                  contacts: {
                    section: "Contacts",
                    layout: { colSpan: 12 },
                    array: {
                      itemLabel: (_, index) => `Kontak #${index + 1}`,
                      addLabel: "+ Tambah Kontak Baru",
                      removeLabel: "Hapus Kontak",
                    },
                    type: {
                      label: () => "Tipe Kontak",
                      options: [
                        { label: "Personal", value: "personal" },
                        { label: "Perusahaan", value: "company" },
                      ],
                      layout: { colSpan: 12, md: 6 },
                    },
                    phone: {
                      label: "Nomor Telepon",
                      placeholder: "0812xxxxxxxx",
                      layout: { colSpan: 12, md: 6 },
                    },
                    companyName: {
                      label: "Nama PT/CV",
                      placeholder: "PT Nama Kontak",
                      showIf: (contact) => contact.type === "company",
                      requiredIf: (contact) => contact.type === "company",
                      clearOnHide: true,
                      layout: { colSpan: 12 },
                    },
                    active: {
                      label: "Status Aktif",
                    },
                  },

                  // --- SEKSI NESTED ARRAY: COMPANIES ---
                  companies: {
                    section: "Companies",
                    layout: { colSpan: 12 },
                    array: {
                      itemLabel: (item, index) =>
                        item.name ? item.name : `Perusahaan #${index + 1}`,
                      addLabel: "+ Tambah Perusahaan",
                      removeLabel: "Hapus Perusahaan",
                    },
                    name: {
                      label: "Nama Perusahaan",
                      placeholder: "PT Nama Perusahaan",
                    },
                    contacts: {
                      array: {
                        itemLabel: (_, index) => `Kontak perusahaan #${index + 1}`,
                        addLabel: "+ Tambah Kontak Perusahaan",
                        removeLabel: "Hapus Kontak",
                      },
                      type: {
                        label: "Tipe Kontak",
                        options: [
                          { label: "Personal", value: "personal" },
                          { label: "Perusahaan", value: "company" },
                        ],
                        layout: { colSpan: 12, md: 6 },
                      },
                      phone: {
                        label: "Nomor Telepon",
                        placeholder: "0812xxxxxxxx",
                        layout: { colSpan: 12, md: 6 },
                      },
                      companyName: {
                        label: "Nama PT/CV",
                        placeholder: "PT Nama Kontak",
                        showIf: (contact) => contact.type === "company",
                        requiredIf: (contact) => contact.type === "company",
                        clearOnHide: true,
                      },
                      active: {
                        label: "Status Aktif",
                      },
                    },
                  },
                } as FieldConfig<z.infer<typeof schema>>
              }
            />

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Data tidak dikirim ke server.</p>
              <button
                type="button"
                onClick={() => form.handleSubmit()}
                className="min-h-11 cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:bg-blue-900"
              >
                Validasi & lihat hasil
              </button>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <form.Subscribe selector={(state) => state.values}>
              {(values) => (
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <h2 className="m-0 text-base font-semibold text-slate-950">Data saat ini</h2>
                  <p className="mt-1 text-xs text-slate-500" role="status">
                    Diperbarui otomatis
                  </p>
                  <dl className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Pengguna</dt>
                      <dd className="truncate font-medium text-slate-800">
                        {values.username || "Belum diisi"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Mode</dt>
                      <dd className="font-medium text-slate-800">
                        {values.isCompany ? "Perusahaan" : "Personal"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Akses</dt>
                      <dd className="font-medium text-slate-800">
                        {values.isAdmin ? "Administrator" : "Pengguna"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Lokasi</dt>
                      <dd className="font-medium capitalize text-slate-800">
                        {values.city}, {values.country}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Kontak</dt>
                      <dd className="font-medium text-slate-800">{values.contacts.length} item</dd>
                    </div>
                  </dl>
                  <div className="mt-5  bg-blue-50 p-3.5 text-xs leading-5 text-blue-950">
                    {values.locked
                      ? "Akun sedang terkunci. Username dan password otomatis dinonaktifkan."
                      : values.isAdmin
                        ? "Mode admin aktif. ErlForm menampilkan email admin dan menjadikannya wajib."
                        : values.isCompany
                          ? "Mode perusahaan aktif. Field nama perusahaan kini tersedia."
                          : "Coba aktifkan status Admin atau Perusahaan untuk melihat field muncul secara kontekstual."}
                  </div>
                </div>
              )}
            </form.Subscribe>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="m-0 text-base font-semibold text-slate-950">Hasil validasi</h2>
              {submittedData ? (
                <>
                  <p className="mt-2 text-sm font-medium text-blue-700" role="status">
                    Data valid.
                  </p>
                  <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-200">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Lengkapi form lalu pilih “Validasi & lihat hasil”. Data yang lolos validasi akan
                  muncul di sini.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
