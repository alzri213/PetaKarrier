"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  TrendingUp,
  Users,
  ShieldCheck,
  Building2,
  Cpu,
  BookCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const SDG_TARGETS = [
  {
    code: "Target 8.3",
    title: "Formalisasi & Pertumbuhan UMKM",
    desc: "Mendorong formalisasi usaha mikro dan kecil melalui fasilitasi legalitas OSS NIB, pencatatan keuangan transparan, dan akses permodalan.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M4 8 L4 4 L8 4 L8 8" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M16 8 L16 4 L20 4 L20 8" stroke="white" strokeWidth="2" fill="none"/>
      <rect x="8" y="12" width="3" height="3" fill="white"/>
      <rect x="13" y="12" width="3" height="3" fill="white"/>
    </svg>`,
    color: "from-emerald-500 to-emerald-600",
    impact: "14 Jenis Usaha Terstandar",
  },
  {
    code: "Target 8.5",
    title: "Pekerjaan Layak & Inklusif",
    desc: "Membuka peluang kerja produktif yang memberikan pendapatan layak di atas standar UMR bagi pemuda dan perempuan di seluruh daerah.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M6 20 C6 16 9 14 12 14 C15 14 18 16 18 20" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.8)"/>
      <circle cx="6" cy="10" r="1.5" fill="rgba(255,255,255,0.6)"/>
    </svg>`,
    color: "from-green-500 to-emerald-500",
    impact: "Benchmark UMR 18 Kota",
  },
  {
    code: "Target 8.6",
    title: "Pengurangan Angka Pengangguran Muda",
    desc: "Menurunkan persentase generasi muda tanpa kerja atau pelatihan (NEET) dengan menyediakan roadmap kewirausahaan siap pakai.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 L4 8 L12 12 L20 4 L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M4 8 L4 4 L12 8 L20 0" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="20" cy="4" r="2" fill="white"/>
    </svg>`,
    color: "from-orange-500 to-amber-500",
    impact: "Roadmap 90 Hari Aksi",
  },
  {
    code: "Target 8.2",
    title: "Inovasi & Peningkatan Produktivitas",
    desc: "Mendorong transformasi digital UMKM melalui pemanfaatan teknologi, otomatisasi rencana bisnis, dan strategi pemasaran modern.",
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M8 12 L10 12 L10 10 L14 10 L14 12 L16 12 L16 14 L14 14 L14 16 L10 16 L10 14 L8 14 Z" fill="white"/>
      <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.8)"/>
    </svg>`,
    color: "from-yellow-500 to-orange-500",
    impact: "Automasi AI + Database",
  },
];

const MATRIKS_PILLARS = [
  {
    title: "Pemberdayaan Pelaku Usaha (Matriks 4)",
    desc: "Fasilitasi inkubasi mandiri dan literasi finansial digital agar pelaku usaha rintisan mampu bertahan dan bertumbuh melampaui fase break-even.",
    badge: "Pilar Ekonomi",
  },
  {
    title: "Kemitraan Inklusif & Rantai Pasok Lokal",
    desc: "Mengintegrasikan UMKM lokal dengan ekosistem pemasok bahan baku dan pasar kota untuk memperkuat sirkulasi ekonomi daerah.",
    badge: "Pilar Pembangunan",
  },
  {
    title: "Transparansi & Akuntabilitas Finansial",
    desc: "Memberikan model kalkulasi biaya investasi dan proyeksi arus kas riil sehingga UMKM bankable untuk akses KUR & modal ventura.",
    badge: "Pilar Tata Kelola",
  },
];

export default function SdgSection() {
  return (
    <section className="relative px-4 py-28 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50">
      <div className="pointer-events-none absolute right-1/4 top-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-[130px]" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-80 w-80 rounded-full bg-orange-200/30 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-300 bg-emerald-50 px-5 py-2 text-xs font-bold text-emerald-700">
            <Globe2 className="h-4 w-4" />
            <span>Rencana Aksi Nasional (RAN) TPB/SDGs Indonesia</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Menjawab Amanat <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">SDG 8 & Matriks 4</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600">
            KonekUMKM bukan sekadar solusi teknologi, tetapi wujud nyata kontribusi sektor digital bagi pencapaian <b className="text-slate-900">SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi</b>, khususnya mendukung peran strategis <b className="text-emerald-700">Pelaku Usaha (Matriks 4)</b> dalam RAN TPB Bappenas.
          </p>
        </Reveal>

        {/* 4 SDG Sub-Targets Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SDG_TARGETS.map((t, i) => (
            <Reveal key={t.code} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                      {t.code}
                    </span>
                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-white shadow-xl border-2 border-white/30`}
                      dangerouslySetInnerHTML={{ __html: t.svg }}
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {t.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <span className="text-sm font-bold text-slate-700">
                    Solusi: <span className="text-emerald-700">{t.impact}</span>
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* RAN TPB Matriks 4 Deep-dive Box */}
        <Reveal delay={0.3} className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-10 sm:p-12 shadow-xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-4">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-700 border-2 border-emerald-300">
                  Dokumen Bappenas RI
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Matriks 4: Pelaku Usaha & Startup Berkelanjutan
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Sesuai Lampiran III RAN TPB Indonesia, pelaku usaha didorong menciptakan model bisnis sirkular, inklusif, dan membuka kesempatan kerja berbasis digitalisasi.
                </p>
                <div className="pt-2">
                  <a
                    href="https://sdgs.bappenas.go.id/website/wp-content/uploads/2023/11/Lampiran-III-RAN-Matriks-3-dan-4.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-700 transition"
                  >
                    <span>Unduh PDF Resmi Lampiran III Bappenas</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 grid gap-6 sm:grid-cols-3">
                {MATRIKS_PILLARS.map((p, idx) => (
                  <div key={idx} className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-md">
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {p.badge}
                    </span>
                    <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                      {p.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-slate-200 pt-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BookCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                <span>Simulasi rencana bisnis otomatis kami telah mengintegrasikan metrik kepatuhan SDG 8.</span>
              </div>
              <Link
                href="/sdg-impact"
                className="btn-shine inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 shrink-0 border-2 border-white/30"
              >
                Eksplor Dashboard Dampak <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
