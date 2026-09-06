<div align="center">

  <img src="public/og-image.png" alt="PetaKarier Logo" width="120" />
  
  # PetaKarier
  ### Akselerasi Karier Wirausahamu dengan Validasi Data Riil Bersama

  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://petakarier.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://[URL_REPO])
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  **Submission for ITECHNO CUP 2026 - Web Development**
  
  **By Excellent Team**
  
</div>

> **Tema:** Pencapaian **SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi**  
> **Rujukan Formal:** Rencana Aksi Nasional (RAN) TPB/SDGs Indonesia — **Matriks 4 untuk Pelaku Usaha** ([Lampiran III Bappenas RI](https://sdgs.bappenas.go.id/website/wp-content/uploads/2023/11/Lampiran-III-RAN-Matriks-3-dan-4.pdf))

---

## 📋 Daftar Isi

- [Tim Developer](#-tim-developer)
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Keamanan](#-keamanan)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **Dzikrie Wildani Az-Zahrika** | Assistant Fullstack | [@lorddzik](https://github.com/lorddzik) |
| **Fikri Alifa Alfan Ramadhan** | Fullstack | [@alzri213](https://github.com/alzri213) |
| **Hanifah** | Designer | [@hanifaah](https://github.com/hanifaah) |

---

## 🎯 Tentang Proyek

### Latar Belakang

Banyak orang — terutama anak muda dan calon wirausaha pemula — punya keinginan untuk membuka usaha sendiri, tapi terhambat di tahap paling awal: bingung usaha apa yang cocok dengan minat dan modal yang dimiliki, tidak tahu cara menghitung kebutuhan modal dan kapan usahanya akan balik modal (BEP), serta kesulitan menyusun rencana bisnis yang rapi untuk diajukan ke pemodal atau sekadar jadi panduan sendiri. Selain itu, calon wirausaha sering tidak punya gambaran apakah potensi keuntungan usahanya sepadan dibanding bekerja dengan gaji UMR di kotanya.

### Solusi yang Ditawarkan

**PetaKarier** adalah platform web yang memandu calon wirausaha dari nol sampai punya rencana bisnis siap pakai — memvalidasi setiap langkah dengan data riil (UMR resmi, estimasi modal, dan rekomendasi berbasis data), bukan sekadar tebakan atau template generik:
1. Menemukan jenis usaha yang cocok berdasarkan minat, skill, dan modal
2. Menghitung kebutuhan modal dan estimasi waktu balik modal (BEP)
3. Membandingkan potensi keuntungan usaha dengan data UMR riil di kota domisili
4. Merangkum semuanya secara otomatis menjadi dokumen rencana bisnis yang siap diedit dan diekspor
5. Menghubungkan pengguna ke sumber daya resmi untuk lanjut merealisasikan usahanya (perizinan, pendanaan, pelatihan, dan lainnya)

### Tujuan Proyek

- 🎯 **Tujuan Utama**: Membantu calon wirausaha pemula menentukan, merencanakan, dan memvalidasi kelayakan usahanya sebelum benar-benar memulai
- 📊 **Target Pengguna**: Anak muda/masyarakat umum yang ingin memulai usaha kecil-menengah namun belum punya pengalaman perencanaan bisnis
- 💡 **Value Proposition**: Satu platform yang menggabungkan analisis minat, kalkulasi modal, pembanding UMR, dan generator dokumen rencana bisnis — bukan kalkulator atau template terpisah-pisah

### Keselarasan dengan SDG 8 & RAN TPB Matriks 4

| Target SDG 8 | Deskripsi Mandat | Implementasi di PetaKarier |
|---|---|---|
| **Target 8.3** | *Dukungan UMKM, Kreativitas & Formalisasi Usaha* | Memfasilitasi edukasi alokasi legalitas NIB (OSS RBA) dalam struktur modal awal dan penyusunan rencana bisnis siap modal. |
| **Target 8.5** | *Pekerjaan Layak & Pendapatan Produktif* | Menghitung potensi penciptaan 1–5 lapangan kerja per unit bisnis dan memvalidasi laba di atas standar UMR daerah. |
| **Target 8.6** | *Pengurangan Pengangguran Pemuda (NEET)* | Menyediakan rute wirausaha terstruktur dalam 4 langkah terpadu dengan panduan aksi 90 hari. |
| **Target 8.2** | *Peningkatan Produktivitas & Inovasi Teknologi* | Platform fullstack modern dengan performa tinggi, kalkulasi *real-time*, dan database cloud serverless. |

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|----------|--------------|---------------|
| **Analisis Potensi Usaha** | Kuesioner minat, skill, dan modal awal untuk merekomendasikan 2-3 jenis usaha yang paling cocok | Rekomendasi personal berbasis data pengguna, bukan saran generik |
| **Kalkulator Modal & Break-Even** | Menghitung estimasi modal awal, biaya operasional, dan waktu balik modal (BEP) berdasarkan jenis usaha dan lokasi | Memberi gambaran realistis kapan usaha mulai untung |
| **Pembanding Usaha vs UMR** | Membandingkan potensi profit bulanan usaha dengan data UMR kota terkait, ditampilkan lewat peta interaktif Indonesia | Membantu pengguna menilai apakah usaha lebih menjanjikan dibanding bekerja dengan UMR |
| **Generator Rencana Bisnis** | Merangkai otomatis hasil dari ketiga fitur di atas menjadi dokumen rencana bisnis siap pakai | Menghemat waktu penyusunan proposal bisnis dari nol |

### Fitur Tambahan

- **Peta UMR Vektor Interaktif** - Visualisasi data UMR seluruh 38 provinsi di Indonesia dalam bentuk peta SVG vektor interaktif (13 kota strategis, kompas, skala dinamis)
- **AI Chat Assistant** - Asisten AI berbasis Google Gemini untuk konsultasi wirausaha real-time
- **Autentikasi Multi-Layer** - Registrasi email + password, verifikasi OTP via email, Google OAuth, GitHub OAuth
- **Dark Mode & Light Mode** - Tema adaptif penuh di seluruh halaman
- **Dashboard Dampak SDG 8** - Pemantauan indikator serapan tenaga kerja dan formalisasi UMKM
- **Export ke PDF** - Rencana bisnis yang sudah jadi bisa diunduh dalam format PDF/print-friendly
- **Menu Aksesibilitas** - Fitur bantu akses supaya platform lebih inklusif digunakan berbagai kalangan pengguna
- **Direktori Resource Wirausaha** - Kumpulan link resmi yang menunjang langkah nyata calon wirausaha, di antaranya:
  - Pendaftaran NIB Online (OSS RBA)
  - Sertifikasi Halal BPJPH
  - Dana Bergulir LPDB-KUMKM
  - Integrasi QRIS Digital
  - E-Katalog LKPP Pemerintah
  - Pelatihan Wirausaha Digital
  - Rumah BUMN & Inkubator Bisnis

---

## 📸 Demo & Screenshot

### Live Demo

🔗 **[Kunjungi Website](https://petakarier.vercel.app/)**

### Screenshot Aplikasi

<div align="center">
  <img src="https://github.com/user-attachments/assets/13755580-1a5a-4916-a3ac-f67ff1002335" alt="Analisis Potensi Usaha" width="800"/>
  <p><em>Analisis Potensi Usaha - Kuesioner dan hasil rekomendasi jenis usaha</em></p>
  
  <img src="https://github.com/user-attachments/assets/a7223f7a-1f34-4f31-935e-4e58f9976ec0" alt="Kalkulator Modal BEP" width="800"/>
  <p><em>Kalkulator Modal & BEP - Estimasi modal dan waktu balik modal</em></p>
  
  <img src="https://github.com/user-attachments/assets/97d10f90-ff88-465d-a674-5a68086a9ce2" alt="Peta UMR Indonesia" width="800"/>
  <p><em>Peta UMR Indonesia - Visualisasi data UMR per wilayah</em></p>
</div>

### Video Demo

📹 **[Link Video Demo](https://drive.google.com/drive/folders/1jPTVLXgYmvJtBYm7kkJduMeJCyXXFILw)
---

## 🛠️ Teknologi

<!-- Isi sesuai stack yang kamu pakai. Contoh umum untuk web app seperti ini dikasih di bawah, hapus/ganti yang tidak sesuai -->

### Tech Stack

#### Frontend
```
Framework    : Next.js 16 (App Router, React 19)
UI Library   : Tailwind CSS v4, Radix UI
State Mgmt   : React State & Server Actions
Peta         : SVG Vektor Interaktif (38 Provinsi kustom, tanpa library eksternal)
Visualisasi  : Recharts, Framer Motion
```

#### Backend
```
Runtime      : Node.js (v18+)
Framework    : Next.js Server Actions & API Route Handlers
Database     : Neon Serverless PostgreSQL
ORM          : Prisma 6
Auth & AI    : Auth.js v5 (NextAuth), Google Gemini API, Nodemailer
```

#### DevOps & Tools
```
Deployment   : Vercel
CI/CD        : GitHub Actions
Security     : Google reCAPTCHA v3, Bcrypt, Zod
Testing      : Vitest / Jest (opsional)
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **Next.js 16 (App Router)** | Server Components, Server Actions, dan rendering hibrid SSR/SSG dengan performa optimal |
| **Neon PostgreSQL** | Cloud-native serverless PostgreSQL, auto-scaling, dan connection pooling tanpa cold start |
| **Prisma 6** | Type-safe ORM, auto-migration, dan query parameterized yang kebal terhadap SQL injection |
| **Tailwind CSS v4 & Radix UI** | Styling modern berkecepatan tinggi dengan komponen aksesibel (standar ARIA) |
| **SVG Vektor Kustom (Peta)** | Render peta 38 provinsi fleksibel, interaktif, ringan, tanpa lisensi library peta pihak ketiga |
| **Auth.js v5 (NextAuth)** | Autentikasi multi-provider (Google, GitHub, OTP email), session JWT, dan route protection |
| **Google Gemini API** | AI konsultasi bisnis terintegrasi dengan rate limiting dan multi-model fallback |

### Dependencies Utama

```json
{
  "dependencies": {
    "next": "16.3.0",
    "react": "19.2.8",
    "@prisma/client": "^6.19.3",
    "next-auth": "^5.0.0-beta.32",
    "framer-motion": "^13.0.0",
    "recharts": "^3.10.1",
    "zod": "^4.4.3",
    "bcryptjs": "^3.0.3",
    "nodemailer": "^8.0.11"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           ALUR PENGGUNA (USER FLOW)                          │
│  [1. Kuesioner] ──► [2. Rekomendasi] ──► [3. Kalkulator BEP] ──► [4. Rencana]│
└──────────────────────┬──────────────────────┬──────────────────────┬─────────┘
                       │                      │                      │
┌──────────────────────▼──────────────────────▼──────────────────────▼─────────┐
│                    NEXT.JS 16 CORE (App Router & Actions)                    │
│  • Antarmuka    : Tailwind v4 · Radix UI · Framer Motion · Peta SVG Vektor   │
│  • Keamanan     : NextAuth Middleware · reCAPTCHA v3 · Rate Limiter · Zod    │
│  • Engine Bisnis: rekomendasiUsaha · hitungModal · generateRencana · SDG     │
└──────────────────────┬──────────────────────────────┬────────────────────────┘
                       │                              │ (Prisma Client ORM)
┌──────────────────────▼───────────────┐    ┌─────────▼────────────────────────┐
│       LAYANAN EKSTERNAL (CLOUD)      │    │    DATABASE (Neon PostgreSQL)    │
│  • AI    : Google Gemini API         │    │  • Master : 32 Usaha · 56 Kota   │
│  • Email : Nodemailer (OTP via SMTP) │    │  • Wilayah: 38 Provinsi (Vektor) │
│  • Auth  : Google & GitHub OAuth     │    │  • User   : Analisis & Proposal  │
└──────────────────────────────────────┘    └──────────────────────────────────┘
```

### Database Schema

```
┌──────────────┐          ┌────────────────────┐          ┌─────────────────┐
│     User     │───1:N────│      Analisis      │───1:1────│  RencanaBisnis  │
│ (Auth & OTP) │          │ (Hasil Kuesioner)  │          │ (Proposal PDF)  │
└──────────────┘          └─────────┬──────────┘          └─────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │ 1:1                 │ N:1
                         ▼                     ▼
               ┌──────────────────┐   ┌─────────────────┐
               │    SdgImpact     │   │      Kota       │───N:1───┐
               │ (Metrik Dampak)  │   │ (56 Kota & UMR) │         │
               └──────────────────┘   └─────────────────┘         ▼
                                               │           ┌─────────────┐
                                               │ N:1       │  Provinsi   │
                                               ▼           │ (38 Vektor) │
                                      ┌─────────────────┐  └─────────────┘
                                      │   JenisUsaha    │
                                      │ (32 Model UMKM) │
                                      └─────────────────┘
```

### Folder Structure

```
PetaKarier/
├── app/
│   ├── layout.tsx              # Root layout, providers, dan metadata SEO
│   ├── page.tsx                # Landing page interaktif
│   ├── globals.css             # Tailwind v4 & design system
│   ├── login/page.tsx          # Halaman login (OTP + OAuth)
│   ├── signup/page.tsx         # Halaman registrasi akun
│   ├── analisis/
│   │   ├── page.tsx            # Kuesioner Analisis Potensi Usaha
│   │   └── [id]/page.tsx       # Hasil analisis tersimpan (dynamic route)
│   ├── kalkulator/page.tsx     # Kalkulator Modal & BEP
│   ├── perbandingan/page.tsx   # Komparasi Usaha vs UMR
│   ├── rencana-bisnis/page.tsx # Generator Rencana Bisnis
│   ├── sdg-impact/page.tsx     # Dashboard Dampak SDG 8
│   ├── komunitas/page.tsx      # Resource Hub & Komunitas
│   └── api/
│       ├── auth/               # NextAuth, signup, send-otp, verify-otp
│       ├── chat/               # AI Chat (Gemini) dengan rate limiting
│       ├── analisis/           # Submit & retrieve analisis
│       ├── modal/              # Hitung modal & BEP
│       ├── wilayah/peta/       # Data vektor 38 provinsi
│       ├── kota/               # Data 56 kota & UMR
│       ├── usaha/              # Data 32 jenis usaha
│       └── umr/                # Data UMR per provinsi
├── components/
│   ├── ui/                     # Radix UI components (Button, Card, Dialog, dll)
│   ├── auth/                   # LoginForm, SignupForm, OtpModal
│   ├── forms/                  # QuestionnaireForm, ModalCalculator
│   ├── landing/                # Hero, Features, UMR Map, SDG, Stats, Testimoni
│   ├── layout/                 # Navbar, Footer
│   ├── results/                # UMRComparison, BusinessPlan
│   ├── sdg/                    # SdgDashboard
│   ├── komunitas/              # ResourceHub
│   └── providers/              # ThemeProvider, SessionProvider, Recaptcha
├── lib/
│   ├── prisma.ts               # Singleton Prisma Client
│   ├── auth/                   # Hash (bcrypt), userStore
│   ├── actions/                # Server Actions (analisis, kalkulator, rencana, sdg)
│   ├── logic/                  # Recommendation, financial & SDG calculation engines
│   ├── utils/                  # Currency formatter, class merger (cn)
│   └── validations/            # Zod validation schemas
├── prisma/
│   ├── schema.prisma           # 10 model PostgreSQL
│   ├── seed.ts                 # Database seeder
│   ├── seed-data.ts            # Data 56 kota & 32 jenis usaha
│   └── seed-provinsi.ts        # Data vektor 38 provinsi
├── public/                     # Static assets (logo, OG image, SVG map data)
├── tests/
│   └── logic.test.ts           # Unit tests (Node native test runner)
├── proxy.ts                     # Route protection & NextAuth proxy
├── auth.ts                     # Auth.js v5 configuration
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## ⚙️ Instalasi & Setup

### Prerequisites

Pastikan Anda telah menginstall:
- **Node.js** (v18.x atau lebih tinggi)
- **npm** / **yarn** / **pnpm**
- **PostgreSQL** database (lokal atau cloud seperti [Neon](https://neon.tech))
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/alzri213/PetaKarrier.git
cd PetaKarrier
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env` di root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"

# Autentikasi (NextAuth / Auth.js v5)
AUTH_SECRET="your-auth-secret-min-32-chars"
AUTH_URL="http://localhost:3000"

# AI Engine (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key"

# Anti-Bot (Google reCAPTCHA v3)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"

# Email OTP (Nodemailer via Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Other configs
NODE_ENV="development"
PORT=3000
```

#### 4️⃣ Setup Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### 5️⃣ Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 🚀 Penggunaan

### Menjalankan Aplikasi

```bash
npm run dev        # Development mode
npm run build      # Production build
npm run start      # Start production server
npm run test       # Run tests
npm run lint       # Linting code
```

### User Guide

#### Untuk Pengguna Umum

1. **Isi Kuesioner Analisis Potensi Usaha**: Jawab pertanyaan minat, skill, dan budget
2. **Lihat Rekomendasi Usaha**: Pilih salah satu dari 2-3 rekomendasi yang muncul
3. **Hitung Modal & BEP**: Lanjut ke kalkulator untuk melihat estimasi modal dan waktu balik modal
4. **Bandingkan dengan UMR**: Cek apakah potensi usaha sepadan dengan UMR kota kamu lewat peta interaktif
5. **Generate Rencana Bisnis**: Unduh dokumen rencana bisnis yang sudah otomatis terisi

#### Untuk Admin

1. **Kelola Dataset Usaha**: Tambah atau ubah model bisnis di `prisma/seed-data.ts`, lalu jalankan `npx prisma db seed`.
2. **Update Data UMR**: Perbarui data UMR tahunan di `prisma/seed-data.ts` (kota) dan `prisma/seed-provinsi.ts` (provinsi), lalu sinkronkan ulang ke database dengan `npx prisma db seed`.

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production:  https://petakarier.vercel.app/api
```

### Endpoints

#### Analisis Potensi Usaha

```http
POST /api/analisis             # Kirim jawaban kuesioner, simpan & dapatkan rekomendasi
GET  /api/analisis?id=[id]     # Ambil hasil analisis berdasarkan ID
GET  /api/usaha                # Ambil daftar 32 jenis usaha terkurasi
```

#### Kalkulator Modal & BEP

```http
POST /api/modal                # Hitung modal awal, biaya sewa, BEP, dan arus kas 12 bulan
```

#### Data Wilayah & UMR

```http
GET  /api/kota                 # Ambil daftar 56 kota beserta data UMR & biaya sewa regional
GET  /api/umr                  # Ambil data UMR seluruh provinsi
GET  /api/wilayah/peta         # Ambil data vektor SVG 38 provinsi
```

#### AI Assistant & Autentikasi

```http
POST /api/chat                 # Chat konsultasi wirausaha via Google Gemini AI (rate limited)
POST /api/auth/signup          # Registrasi akun baru
POST /api/auth/send-otp        # Kirim kode OTP verifikasi ke email
POST /api/auth/verify-otp      # Verifikasi kode OTP
```

### Example Request

```javascript
// Analisis Potensi Usaha
const response = await fetch('/api/analisis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    minat: ["Kuliner"],
    skill: ["memasak", "manajemen"],
    budget: 15000000,
    waktu: "full",
    pengalaman: "pemula"
  })
});
const data = await response.json();
```

📖 **[Dokumentasi API Lengkap](./docs/API.md)**

---

## 🧪 Testing

### Running Tests

```bash
npm run test
npm run test:coverage
```

### Test Coverage

```
Statements   : 98.24%
Branches     : 75.16%
Functions    : 89.87%
Lines        : 98.24%
```

---

## 🔒 Keamanan

Proyek ini telah melalui **13 kategori audit keamanan mendalam**:

- ✅ **Secret Protection** — File `.env*` diblokir di `.gitignore`, 0 hardcoded credentials
- ✅ **Authentication** — Bcrypt 12 rounds, JWT session, OAuth multi-provider (Google, GitHub)
- ✅ **Route Protection** — NextAuth middleware pada seluruh rute privat
- ✅ **OTP Security** — CSPRNG + bcrypt hash + Google reCAPTCHA v3 + rate limit 3 percobaan
- ✅ **API Hardening** — Rate limit per IP, batasan payload, validasi skema Zod pada client & server
- ✅ **Error Masking** — Respons error generik tanpa membocorkan stack trace internal
- ✅ **SQL Injection** — 100% parameterized Prisma queries, 0 query mentah tidak aman
- ✅ **XSS Prevention** — 0 `dangerouslySetInnerHTML`, sanitasi protokol URL
- ✅ **Security Headers** — `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`
- ✅ **Open Redirect** — Redirect callback hanya dibatasi ke origin internal

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

  **Made with ❤️ by Excellent Team for ITECHNO CUP 2026**

</div>
