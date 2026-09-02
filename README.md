# 🌐 PetaKarier — Ekosistem Pemberdayaan & Perencanaan Usaha Inklusif
>>>>>>> 5791fa0c2a954590dd52fcf8763cafa3c2b5efb6

> **Proyek Inovasi Digital untuk ITechnoCup 2026**  
> **Tema:** Pencapaian **SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi**  
> **Rujukan Formal:** Rencana Aksi Nasional (RAN) TPB/SDGs Indonesia — **Matriks 4 untuk Pelaku Usaha** ([Lampiran III Bappenas RI](https://sdgs.bappenas.go.id/website/wp-content/uploads/2023/11/Lampiran-III-RAN-Matriks-3-dan-4.pdf))

---

## 📌 Ringkasan Eksekutif

**PetaKarrier** adalah platform *fullstack* berbasis **Next.js 15 (App Router) + Server Actions + Prisma ORM + Neon PostgreSQL + Tailwind CSS + Shadcn/ui**. Dirancang untuk menjembatani kesenjangan antara generasi muda/calon wirausaha dengan kepastian kelayakan usaha mandiri melalui:

1. **Analisis Potensi Usaha (AI Matching):** Pencocokan minat, keterampilan, dan ketersediaan modal dengan 14 model bisnis terkurasi.
2. **Kalkulator Modal & Break-Even Point (BEP):** Simulasi kebutuhan investasi awal, biaya sewa riil 18 kota, serta kurva arus kas 12 bulan.
3. **Komparasi Usaha vs UMR:** Benchmark laba bersih terhadap standar upah minimum regional (UMR) 2026 secara transparan.
4. **Generator Rencana Bisnis Otomatis:** Penyusunan dokumen proposal komprehensif berstandar perbankan/KUR dengan analisis SWOT dan *90-Day Execution Roadmap*.
5. **Dashboard Dampak SDG 8:** Pemantauan indikator serapan tenaga kerja, formalisasi UMKM, dan perputaran ekonomi lokal sesuai amanat Bappenas.
6. **Resource Hub & Komunitas:** Panduan legalitas OSS NIB, sertifikasi halal gratis (SEHATI), akses pembiayaan KUR bunga 6%, dan integrasi QRIS.

---

## 🎯 Keselarasan dengan SDG 8 & RAN TPB Matriks 4

| Target SDG 8 | Deskripsi Mandat | Implementasi Solusi di PetaKarrier |
|---|---|---|
| **Target 8.3** | *Dukungan UMKM, Kreativitas & Formalisasi Usaha* | Memfasilitasi edukasi alokasi legalitas NIB (OSS RBA) dalam struktur modal awal dan penyusunan rencana bisnis siap modal. |
| **Target 8.5** | *Pekerjaan Layak & Pendapatan Produktif* | Menghitung potensi penciptaan 1–5 lapangan kerja per unit bisnis dan memvalidasi laba di atas standar UMR daerah. |
| **Target 8.6** | *Pengurangan Pengangguran Pemuda (NEET)* | Menyediakan rute wirausaha terstruktur dalam 4 langkah terpadu dengan panduan aksi 90 hari. |
| **Target 8.2** | *Peningkatan Produktivitas & Inovasi Teknologi* | Platform fullstack modern dengan performa tinggi, kalkulasi *real-time*, dan database cloud serverless. |

---

## 🛠️ Tech Stack & Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
│   Tailwind CSS · Shadcn/ui · Framer Motion · Recharts       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Server Actions)
┌──────────────────────────────▼──────────────────────────────┐
│                    Backend Logic Layer                      │
│   rekomendasiUsaha · hitungModal · generateRencana · SDG    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Prisma Client ORM)
┌──────────────────────────────▼──────────────────────────────┐
│                Database (Neon PostgreSQL)                   │
│   JenisUsaha · Kota · Analisis · RencanaBisnis · SdgImpact  │
└─────────────────────────────────────────────────────────────┘
```

- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Database:** Neon Serverless PostgreSQL
- **ORM:** Prisma ORM 6
- **UI & Styling:** Tailwind CSS v4, Shadcn/ui components
- **Animasi:** Framer Motion
- **Visualisasi Data:** Recharts (Area, Bar, Pie, Radar)
- **Validasi:** Zod & React Hook Form
- **Notifikasi:** Sonner Toasts

---

## 🚀 Panduan Menjalankan Proyek

### 1. Kloning dan Instalasi Dependensi
```bash
git clone <repository-url>
cd PetaKarier
npm install
```

### 2. Konfigurasi Database Neon PostgreSQL
Buat file `.env` di direktori utama:
```env
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"
```

### 3. Generate Prisma Client & Database Migration
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi ke Neon PostgreSQL (opsional jika direct push)
npx prisma db push

# Seed data 18 kota dan 14 jenis usaha
npm run db:seed
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Build Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori

```
PetaKarrier/
├── app/
│   ├── layout.tsx              # Root layout & Toaster provider
│   ├── page.tsx                # Landing page interaktif
│   ├── globals.css             # Tailwind v4 & Shadcn CSS variables
│   ├── analisis/
│   │   ├── page.tsx            # Halaman Kuesioner Analisis
│   │   └── [id]/page.tsx       # Dynamic route hasil analisis tersimpan
│   ├── kalkulator/
│   │   └── page.tsx            # Halaman Kalkulator Modal & BEP
│   ├── perbandingan/
│   │   └── page.tsx            # Halaman Komparasi Usaha vs UMR
│   ├── rencana-bisnis/
│   │   └── page.tsx            # Generator Rencana Bisnis Otomatis
│   ├── sdg-impact/
│   │   └── page.tsx            # Dashboard Dampak SDG 8 & RAN TPB
│   └── komunitas/
│       └── page.tsx            # Resource Hub, Legalitas NIB & KUR
├── components/
│   ├── ui/                     # Shadcn/ui (Button, Card, Badge, Progress, Dialog, Tabs, etc.)
│   ├── forms/                  # QuestionnaireForm, ModalCalculator
│   ├── landing/                # Hero, Features, SdgSection, Why, Flow, Stats, Testimoni, Tech
│   ├── layout/                 # Navbar, Footer
│   ├── results/                # UMRComparison, BusinessPlan
│   └── sdg/                    # SdgDashboard
├── lib/
│   ├── prisma.ts               # Singleton Prisma Client
│   ├── utils.ts                # cn() helper
│   ├── actions/                # Server Actions (analisis, kalkulator, rencana, sdg, data)
│   ├── logic/                  # Financial & Recommendation calculation engines
│   ├── validations/            # Zod validation schemas
│   └── data/                   # Initial JSON datasets (UMR & Jenis Usaha)
├── prisma/
│   ├── schema.prisma           # 6 PostgreSQL models
│   └── seed.ts                 # Database seeder script
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## 🏆 Kesiapan Lomba

- ✅ **Full-stack Complete:** Database terintegrasi dengan Server Actions dan fallback resilient.
- ✅ **Kesesuaian Tema SDG 8:** Mengadopsi Lampiran III Matriks 4 Bappenas RI.
- ✅ **Desain & UX Berkelas:** Glassmorphism, micro-interactions, dark mode, dan print-ready styling.
- ✅ **Validasi Finansial Riil:** Berdasarkan standar UMR 18 kota di seluruh wilayah Indonesia.
