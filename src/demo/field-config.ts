import type { FieldConfig } from "../types/field-options";
import type { FormValues } from "./schema";

export const fieldConfig: FieldConfig<FormValues> = {
  name: {
    label: "Nama",
    placeholder: "Masukkan nama",
  },
  email: {
    label: "Email",
    placeholder: "nama@example.com",
  },
  website: {
    label: "Website",
    placeholder: "https://example.com",
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
  },
  meetingAt: {
    label: "Waktu meeting",
  },
  resume: {
    label: "File resume",
    description: "Opsional. Pilih file dari perangkat Anda.",
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
  },
  companyName: {
    label: "Nama perusahaan",
    placeholder: "Hanya tampil saat role Admin",
    description: "Tampil saat Role Admin dipilih; dikosongkan saat disembunyikan.",
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
    section: "Metadata",
  },
  tuple: {
    section: "Tuple",
    0: { label: "Nilai teks" },
    1: { label: "Nilai angka" },
  },
  contact: {
    section: "Jenis kontak",
    name: { label: "Nama kontak", placeholder: "Nama kontak personal" },
    company: { label: "Nama perusahaan kontak", placeholder: "Nama perusahaan" },
    kind: {
      label: "Jenis kontak",
      options: [
        { label: "Personal", value: "person" },
        { label: "Perusahaan", value: "company" },
      ],
    },
  },
  preferences: {
    inputType: "checkbox-group",
    options: [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
      { label: "Push notification", value: "push" },
    ],
    section: "Notifikasi",
  },
};
