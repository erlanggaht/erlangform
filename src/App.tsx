import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ErlForm } from "./components";

// 1. Skema Validasi Zod
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
      alert("Form berhasil disubmit! Cek console log.");
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        {/* Header Playground */}
        <header className="space-y-2 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            ErlForm Dynamic Playground 🚀
          </h1>
          <p className="text-sm text-slate-600">
            Demonstrasi pembuatan form otomatis berbasis <strong>Zod Schema</strong> dan{" "}
            <strong>TanStack Form</strong>.
          </p>
        </header>

        {/* Section Wrapper */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ErlForm
            form={form}
            schema={schema}
            // Configuration untuk Accordion/Seksi Form
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
                description: "Manajemen kontak bertipe personal atau perusahaan.",
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
            // Configuration untuk setiap Field
            fieldConfig={{
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

              // --- SEKSI ARRAY: CONTACTS ---
              contacts: {
                label: "Daftar Kontak",
                section: "Contacts",
                layout: { colSpan: 12 },
                array: {
                  itemLabel: (_, index) => `Kontak #${index + 1}`,
                  addLabel: "+ Tambah Kontak Baru",
                  removeLabel: "Hapus Kontak",
                },
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
                showIf: (values) => values.type === "company",
                requiredIf: (values) => values.type === "company",
                clearOnHide: true,
                layout: { colSpan: 12 },
              },
              active: {
                label: "Status Aktif",
              },

              // --- SEKSI NESTED ARRAY: COMPANIES ---
              companies: {
                label: "Daftar Perusahaan",
                section: "Companies",
                layout: { colSpan: 12 },
                array: {
                  itemLabel: (item, index) =>
                    item.name ? `🏢 ${item.name}` : `Perusahaan #${index + 1}`,
                  addLabel: "+ Tambah Perusahaan",
                  removeLabel: "Hapus Perusahaan",
                },
              },
            }}
          />

          {/* Action Button */}
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => form.handleSubmit()}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:scale-[0.98] transition-all"
            >
              Simpan Data
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
