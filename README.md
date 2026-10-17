# ErlForm

ErlForm adalah library pembuat formulir berbasis schema untuk React yang dibangun dengan
Zod dan TanStack Form. Definisikan struktur data sekali melalui schema, lalu ErlForm
membantu merender field, validasi, array dinamis, object bertingkat, dan kondisi antar-field.

Cocok untuk form profil, onboarding, data perusahaan, hingga form kompleks dengan
section dan nested array.

## Kenapa dibuat?

ErlForm awalnya dibuat sebagai library pribadi untuk mengurangi pekerjaan berulang saat
membangun formulir React. Setelah pola schema, validasi, konfigurasi field, dan data
bertingkat mulai sering dipakai di beberapa proyek, library ini dirapikan agar bisa
digunakan ulang dengan API yang tetap sederhana dan fleksibel.

## Instalasi

```bash
npm install erlangform
```

Kemudian gunakan komponen utama dengan named import:

```tsx
import { ErlForm } from "erlangform";
```

Stylesheet bawaan dimuat otomatis saat `ErlForm` digunakan, sehingga tidak perlu
menambahkan import CSS terpisah.

## Fitur utama

- Membuat field React dari schema Zod
- Integrasi dengan TanStack Form
- Validasi dan pesan kesalahan per field
- Field bersyarat, section, serta layout grid responsif
- Object dan array bertingkat dengan konfigurasi terisolasi

## Dokumentasi

### Array bertingkat dan tuple

Gunakan `item` untuk mengatur setiap item array, termasuk array di dalam array.
Untuk tuple, gunakan indeks posisi (`0`, `1`, dan seterusnya).

```tsx
const schema = z.object({
  matrix: z.array(z.array(z.string())),
  points: z.array(z.tuple([z.string(), z.number()])),
});

const fieldConfig = {
  matrix: {
    array: { addLabel: "Tambah baris" },
    item: {
      array: { addLabel: "Tambah sel" },
      item: { placeholder: "Isi sel" },
    },
  },
  points: {
    item: { 0: { label: "Nama titik" }, 1: { label: "Nilai" } },
  },
} satisfies FieldConfig<z.infer<typeof schema>>;
```

Konfigurasi langsung pada child object array tetap didukung. Jika `item` diisi,
konfigurasi item tersebut digunakan sebagai penggantinya. Callback pada child
object menerima object induknya; callback pada posisi tuple atau item array
menerima tuple atau array induknya.

### Konfigurasi discriminated union

Semua field dari setiap cabang union dapat dikonfigurasi. Tipe nilai tetap
diperiksa, dan callback bisa melakukan narrowing melalui discriminator.
Pilihan discriminator diinferensikan dari seluruh cabang schema.

```tsx
const schema = z.object({
  contact: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("person"), name: z.string() }),
    z.object({ kind: z.literal("company"), company: z.string() }),
  ]),
});

const fieldConfig = {
  contact: {
    kind: { label: "Jenis kontak" },
    name: { label: "Nama personal" },
    company: { label: "Nama perusahaan" },
  },
} satisfies FieldConfig<z.infer<typeof schema>>;
```

`z.date()` menggunakan `Date` pada tengah malam zona waktu lokal. Tanggal yang
ditampilkan di kalender tetap sama setelah dipilih. Field ISO datetime menyimpan
nilai ISO UTC dan menampilkan waktu lokal pada input.

Panduan lengkap, contoh penggunaan, konfigurasi field, API, dan changelog tersedia di:

[erlangform.erlanggaht.com/docs](https://erlangform.erlanggaht.com/docs)
