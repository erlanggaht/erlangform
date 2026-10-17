import type { SectionConfigs } from "../types/section-config";

export const sectionConfig: SectionConfigs = {
  Kontak: {
    title: "Daftar kontak",
    description: "Array object · tambah, duplikat, hapus, atau ubah urutan kontak.",
  },
  "Tag dan kondisi": { title: "Tag", description: "Array primitive · kelola hingga 5 tag." },
  Metadata: { title: "Metadata", description: "Record · data dengan pasangan key dan value." },
  Tuple: { title: "Tuple", description: "Dua nilai dengan urutan tetap: teks dan angka." },
  "Jenis kontak": {
    title: "Jenis kontak",
    description: "Union · pilih person atau company untuk mengganti field yang ditampilkan.",
  },
  Notifikasi: {
    title: "Preferensi notifikasi",
    description: "Checkbox group · pilih satu atau beberapa saluran.",
  },
};
