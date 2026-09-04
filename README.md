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

Panduan lengkap, contoh penggunaan, konfigurasi field, API, dan changelog tersedia di:

[erlangform.erlanggaht.com/docs](https://erlangform.erlanggaht.com/docs)
