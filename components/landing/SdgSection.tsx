"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  Building2,
  BookCheck,
  ArrowRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const SDG_TARGETS = [
  {
    code: "Target 8.3",
    title: "Formalisasi & Pertumbuhan UMKM",
    desc: "Mendorong formalisasi usaha mikro dan kecil melalui fasilitasi legalitas OSS NIB, pencatatan keuangan transparan, dan akses permodalan.",
    icon: "solar:shop-2-bold",
    color: "text-emerald-600",
    impact: "14 Jenis Usaha Terstandar",
  },
  {
    code: "Target 8.5",
    title: "Pekerjaan Layak & Inklusif",
    desc: "Membuka peluang kerja produktif yang memberikan pendapatan layak di atas standar UMR bagi pemuda dan perempuan di seluruh daerah.",
    icon: "solar:users-group-two-rounded-bold",
    color: "text-green-600",
    impact: "Benchmark UMR 18 Kota",
  },
  {
    code: "Target 8.6",
    title: "Pengurangan Angka Pengangguran Muda",
    desc: "Menurunkan persentase generasi muda tanpa kerja atau pelatihan (NEET) dengan menyediakan roadmap kewirausahaan siap pakai.",
    icon: "solar:chart-2-bold-duotone",
    color: "text-orange-500",
    impact: "Roadmap 90 Hari Aksi",
  },
  {
    code: "Target 8.2",
    title: "Inovasi & Peningkatan Produktivitas",
    desc: "Mendorong transformasi digital UMKM melalui pemanfaatan teknologi, otomatisasi rencana bisnis, dan strategi pemasaran modern.",
    icon: "solar:cpu-bolt-bold",
    color: "text-amber-500",
    impact: "Validasi Finansial Terpadu",
  },
];

const MATRIKS_PILLARS = [
  {
    title: "Pemberdayaan Pelaku Usaha (Matriks 4)",
    desc: "Fasilitasi inkubasi mandiri dan literasi finansial digital agar pelaku usaha rintisan mampu bertahan dan bertumbuh melampaui fase break-even.",
    badge: "Pilar Ekonomi",
    imageSrc:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Pengrajin tangan UMKM Indonesia",
  },
  {
    title: "Kemitraan Inklusif & Rantai Pasok Lokal",
    desc: "Mengintegrasikan UMKM lokal dengan ekosistem pemasok bahan baku dan pasar kota untuk memperkuat sirkulasi ekonomi daerah.",
    badge: "Pilar Pembangunan",
    imageSrc:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Pasar tradisional Indonesia",
  },
  {
    title: "Transparansi & Akuntabilitas Finansial",
    desc: "Memberikan model kalkulasi biaya investasi dan proyeksi arus kas riil sehingga UMKM bankable untuk akses KUR & modal ventura.",
    badge: "Pilar Tata Kelola",
    imageSrc:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Wirausaha startup kecil bekerja di laptop",
  },
];

export default function SdgSection() {
  return (
    <section className="relative bg-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:bg-gradient-to-b px-4 py-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute right-1/4 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px] hidden dark:block" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[120px] hidden dark:block" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
            Menjawab Amanat <span className="text-emerald-700 dark:text-emerald-400">SDG 8 & Matriks 4</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            PetaKarier bukan sekadar solusi teknologi, tetapi wujud nyata kontribusi sektor digital bagi pencapaian <b className="text-slate-900 dark:text-white">SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi</b>, khususnya mendukung peran strategis <b className="text-emerald-700 dark:text-emerald-400">Pelaku Usaha (Matriks 4)</b> dalam RAN TPB Bappenas.
          </p>
        </Reveal>

        {/* 4 SDG Sub-Targets Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SDG_TARGETS.map((t, i) => (
            <Reveal key={t.code} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {t.code}
                    </span>
                    <Icon icon={t.icon} className={`h-8 w-8 ${t.color}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t.desc}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Solusi: <span className="text-emerald-700 dark:text-emerald-400">{t.impact}</span>
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* RAN TPB Matriks 4 Deep-dive Box */}
        <Reveal delay={0.3} className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-emerald-300 dark:border-slate-800 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-10 sm:p-12 shadow-xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/40 bg-emerald-100/90 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Dokumen Bappenas RI</span>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    <span className="text-[#16a34a] dark:text-emerald-400">Matriks 4:</span> Pelaku Usaha & Startup Berkelanjutan
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    Sesuai Lampiran III RAN TPB Indonesia, pelaku usaha didorong menciptakan model bisnis sirkular, inklusif, dan membuka kesempatan kerja berbasis digitalisasi.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="/Buku-Capaian-SDGs-Indonesia-2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn-shine group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-3.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-white transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-white font-extrabold">Unduh PDF Resmi Lampiran III Bappenas</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 grid gap-5 sm:grid-cols-3">
                {MATRIKS_PILLARS.map((p, idx) => (
                  <div
                    key={idx}
                    className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    {/* Card Image */}
                    <div className="relative h-28 w-full overflow-hidden">
                      <Image
                        src={p.imageSrc}
                        alt={p.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 pt-4">
                      <span className="inline-block rounded-full border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[#16a34a] dark:text-emerald-400">
                        {p.badge}
                      </span>
                      <h4 className="mt-2.5 text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {p.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-slate-200 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <BookCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
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
