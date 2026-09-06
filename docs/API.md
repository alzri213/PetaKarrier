# Dokumentasi API PetaKarier

Dokumentasi endpoint HTTP untuk aplikasi PetaKarier. Semua endpoint menggunakan base URL aplikasi yang sedang berjalan.

- **Local:** `http://localhost:3000`
- **Production:** [Peta Karrier](https://petakarier.vercel.app/)
- Format request dan response: `application/json`

> Endpoint yang menggunakan database memerlukan konfigurasi Prisma/database yang valid. Endpoint AI memerlukan salah satu environment variable `GEMINI_API_KEY`, `GOOGLE_API_KEY`, atau `GOOGLE_GENERATIVE_AI_API_KEY`.

## Daftar Isi

- [Ringkasan Endpoint](#ringkasan-endpoint)
- [Format Error](#format-error)
- [Analisis Potensi Usaha](#analisis-potensi-usaha)
- [Data Usaha dan Wilayah](#data-usaha-dan-wilayah)
- [Kalkulator Modal](#kalkulator-modal)
- [Peta Provinsi](#peta-provinsi)
- [AI Assistant](#ai-assistant)
- [Autentikasi](#autentikasi)
- [Contoh Integrasi JavaScript](#contoh-integrasi-javascript)
- [Konfigurasi Environment](#konfigurasi-environment)

## Ringkasan Endpoint

| Method | Endpoint | Keterangan | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/analisis` | Membuat rekomendasi usaha dari profil pengguna | Opsional |
| `GET` | `/api/analisis?id={id}` | Mengambil hasil analisis tersimpan | Tidak |
| `GET` | `/api/usaha` | Mengambil daftar jenis usaha | Tidak |
| `GET` | `/api/kota` | Mengambil daftar kota dan data regional | Tidak |
| `GET` | `/api/umr` | Mengambil ringkasan kota dan UMR | Tidak |
| `GET` | `/api/umr?id={id}` | Mengambil detail satu kota | Tidak |
| `POST` | `/api/modal` | Menghitung modal dan proyeksi usaha | Tidak |
| `GET` | `/api/wilayah/peta` | Mengambil data SVG 38 provinsi | Tidak |
| `POST` | `/api/chat` | Mengirim percakapan ke Google Gemini AI | Tidak |
| `POST` | `/api/auth/signup` | Membuat akun baru | Tidak |
| `POST` | `/api/auth/send-otp` | Mengirim OTP login ke email | Tidak |
| `POST` | `/api/auth/verify-otp` | Memverifikasi OTP login | Tidak |

## Format Error

Error umumnya dikembalikan sebagai JSON berikut:

```json
{
  "error": "Pesan error dalam Bahasa Indonesia"
}
```

Beberapa endpoint juga mengembalikan `success: false`. Status yang digunakan antara lain `400` untuk input tidak valid, `401` untuk kredensial salah, `404` untuk data yang tidak ditemukan, `409` untuk konflik data, `429` untuk rate limit, dan `500` untuk kesalahan server.

## Analisis Potensi Usaha

### Membuat analisis

```http
POST /api/analisis
Content-Type: application/json
```

Request body:

```json
{
  "minat": ["Kuliner", "Digital"],
  "skill": ["memasak", "manajemen"],
  "budget": 15000000,
  "waktu": "full",
  "pengalaman": "pemula"
}
```

Field yang tersedia:

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| `minat` | `string[]` | Ya | `Kuliner`, `Fashion`, `Kreatif`, `Jasa`, `Agribisnis`, `Digital`, `Kecantikan`, `Pendidikan` |
| `skill` | `string[]` | Tidak | Daftar kemampuan pengguna, default `[]` |
| `budget` | `number` | Ya | Angka positif dalam rupiah |
| `waktu` | `string` | Ya | `full`, `parttime`, `sampling`, `fleksibel` |
| `pengalaman` | `string` | Ya | `pemula`, `menengah`, `mahir`, `pernah`, `sudah` |

Response `200`:

```json
{
  "id": "cm123...",
  "rekomendasi": [
    {
      "usaha": {
        "id": "kedai-kopi",
        "nama": "Kedai Kopi"
      }
    }
  ]
}
```

`id` dapat berupa ID database atau ID lokal dengan awalan `local-` jika penyimpanan database tidak tersedia.

### Mengambil analisis berdasarkan ID

```http
GET /api/analisis?id=cm123...
```

Response `200` berisi `id`, `rekomendasi`, `minat`, `pengalaman`, dan `budget`. Jika parameter `id` tidak diberikan, response `400`. Jika data tidak ditemukan, response `404`.

## Data Usaha dan Wilayah

### Daftar jenis usaha

```http
GET /api/usaha
GET /api/usaha?kategori=Kuliner
```

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "kedai-kopi",
      "nama": "Kedai Kopi",
      "kategori": "Kuliner"
    }
  ],
  "count": 1
}
```

Bentuk item lain mengikuti kolom yang tersedia pada model `JenisUsaha` di database.

### Daftar kota

```http
GET /api/kota
GET /api/kota?wilayah=Jawa
```

Parameter `wilayah` bersifat opsional dan memfilter data berdasarkan wilayah.

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "bandung",
      "nama": "Kota Bandung",
      "provinsi": "Jawa Barat",
      "wilayah": "Jawa",
      "umr": 4965451
    }
  ],
  "count": 1
}
```

Bentuk item mengikuti kolom yang tersedia pada model `Kota` di database.

### Data UMR

Daftar ringkas semua kota:

```http
GET /api/umr
```

Response `200`:

```json
{
  "kota": [
    {
      "id": "bandung",
      "nama": "Kota Bandung",
      "provinsi": "Jawa Barat",
      "umr": 4965451
    }
  ]
}
```

Detail satu kota:

```http
GET /api/umr?id=bandung
```

Response `200`:

```json
{
  "kota": {
    "id": "bandung",
    "nama": "Kota Bandung",
    "provinsi": "Jawa Barat",
    "umr": 4965451
  }
}
```

Jika ID kota tidak ditemukan, response `404`.

## Kalkulator Modal

```http
POST /api/modal
Content-Type: application/json
```

Request body:

```json
{
  "usahaId": "kedai-kopi",
  "kotaId": "bandung",
  "skala": "kecil"
}
```

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| `usahaId` | `string` | Ya | ID jenis usaha dari `/api/usaha` |
| `kotaId` | `string` | Ya | ID kota dari `/api/umr` atau `/api/kota` |
| `skala` | `string` | Tidak | `kecil`, `sedang`, `besar`; default `kecil` |

Response `200`:

```json
{
  "hasil": {
    "...": "Nilai hasil kalkulasi modal, biaya operasional, BEP, dan proyeksi arus kas"
  }
}
```

Struktur detail `hasil` mengikuti kalkulator usaha, sehingga dapat berkembang sesuai jenis usaha dan skala yang dipilih. Jika `usahaId` atau `kotaId` tidak ditemukan, response `400`.

## Peta Provinsi

```http
GET /api/wilayah/peta
```

Response `200`:

```json
{
  "viewBox": "0 0 1000 380",
  "width": 1000,
  "height": 380,
  "totalProvinces": 38,
  "provinces": [
    {
      "id": "11",
      "name": "Aceh",
      "wilayah": "Sumatera",
      "avgUmr": 3500000,
      "minUmr": 3200000,
      "maxUmr": 3800000,
      "cityCount": 5,
      "topSector": "Perdagangan",
      "path": "M...",
      "centroid": [120, 80]
    }
  ]
}
```

Response menyertakan header cache publik selama 1 jam dan stale-while-revalidate selama 24 jam. Jika database gagal diakses, response `500`.

## AI Assistant

```http
POST /api/chat
Content-Type: application/json
```

Request body:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Bagaimana cara menghitung BEP usaha kedai kopi?"
    }
  ]
}
```

`role` yang diterima adalah `user` dan `assistant`. Maksimal 10 pesan terakhir diproses dan pesan pengguna terbaru maksimal 1.500 karakter.

Response `200`:

```json
{
  "text": "Jawaban asisten dalam format Markdown"
}
```

Rate limit endpoint ini adalah maksimal 15 request per menit untuk setiap alamat IP. Jika terlampaui, response `429`. Tanpa API key Gemini, endpoint tetap mengembalikan pesan konfigurasi dengan response `200`.

## Autentikasi

### Registrasi

```http
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

`name` berisi 2-100 karakter, `email` harus valid, dan `password` berisi 6-100 karakter.

Response berhasil `201`:

```json
{
  "success": true
}
```

Email yang sudah terdaftar menghasilkan `409`.

### Mengirim OTP login

```http
POST /api/auth/send-otp
Content-Type: application/json
```

```json
{
  "email": "budi@example.com",
  "password": "rahasia123",
  "recaptchaToken": "TOKEN_RECAPTCHA_DARI_CLIENT"
}
```

Response berhasil `200`:

```json
{
  "success": true,
  "message": "Kode OTP telah dikirim ke email Anda. Periksa inbox atau folder spam."
}
```

OTP berlaku 10 menit. Endpoint ini memerlukan `RECAPTCHA_SECRET_KEY`, konfigurasi SMTP, dan membatasi pengiriman OTP aktif maksimal 3 percobaan.

### Verifikasi OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json
```

```json
{
  "email": "budi@example.com",
  "otp": "123456"
}
```

Response berhasil `200`:

```json
{
  "success": true,
  "message": "Kode OTP berhasil diverifikasi!",
  "verified": true
}
```

OTP harus berupa 6 digit angka, hanya dapat digunakan sekali, dan memiliki batas percobaan.

## Contoh Integrasi JavaScript

```javascript
const response = await fetch("/api/analisis", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    minat: ["Kuliner"],
    skill: ["memasak", "manajemen"],
    budget: 15000000,
    waktu: "full",
    pengalaman: "pemula"
  })
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Request gagal");
}

console.log(data.rekomendasi);
```

## Konfigurasi Environment

Variable berikut digunakan oleh endpoint tertentu:

| Variable | Digunakan untuk |
| --- | --- |
| `DATABASE_URL` | Koneksi database Prisma |
| `GEMINI_API_KEY` atau alternatifnya | `/api/chat` |
| `RECAPTCHA_SECRET_KEY` | `/api/auth/send-otp` |
| `EMAIL_HOST` | Host SMTP, default `smtp.gmail.com` |
| `EMAIL_PORT` | Port SMTP, default `587` |
| `EMAIL_SECURE` | Mode secure SMTP (`true`/`false`) |
| `EMAIL_USER` | Akun pengirim OTP |
| `EMAIL_PASS` | Password atau App Password SMTP |

Jangan pernah mengekspos secret environment variable ke browser atau memasukkannya ke dalam dokumentasi publik.
