"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Users, PieChart, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const FAKTA_UMKM = [
  {
    angka: "65,5 Juta",
    label: "Total Unit UMKM Indonesia",
    sub: "Mencakup 99% dari seluruh unit dunia usaha nasional (BPS & Kemenkop UKM).",
    icon: Users,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    angka: "61,9%",
    label: "Kontribusi terhadap PDB",
    sub: "UMKM merupakan tulang punggung dan penyumbang terbesar PDB Indonesia.",
    icon: PieChart,
    color: "text-green-700 bg-green-50 border-green-200",
  },
  {
    angka: "97%",
    label: "Penyerapan Tenaga Kerja",
    sub: "Menyerap mayoritas angkatan kerja produktif dan generasi muda di seluruh daerah.",
    icon: TrendingUp,
    color: "text-emerald-800 bg-emerald-100 border-emerald-300",
  },
  {
    angka: "30,2 Juta",
    label: "Terverifikasi SIDT Non-Pertanian",
    sub: "Dominasi 99,7% pada sektor Mikro yang memerlukan penguatan akuntabilitas modal.",
    icon: ShieldCheck,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
];

export default function EvidenceSection() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-800 shadow-sm">
            <ShieldCheck className="h-4 w-4" /> Bukti Data Resmi UMKM Indonesia
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Mengapa <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">PetaKarier</span> Dibangun?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Berdasarkan riset data resmi Kementerian Koperasi & UKM serta BPS RI, UMKM adalah fondasi ekonomi Indonesia namun memerlukan validasi kelayakan bisnis yang terukur.
          </p>
        </Reveal>

        {/* Showcase Banner & Real Photo Evidence */}
        <Reveal delay={0.2} className="mt-12">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-200 bg-white shadow-xl">
            <div className="grid lg:grid-cols-12 items-center">
              {/* Image side */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[450px] w-full overflow-hidden">
                <Image
                  src="/umkm-indonesia-hero.jpg"
                  alt="Wirausaha Muda UMKM Indonesia"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/90" />
                <div className="absolute bottom-6 left-6 right-6 lg:hidden text-white">
                  <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white mb-2">
                    Foto Riil Pelaku UMKM
                  </span>
                  <h3 className="text-xl font-extrabold">Wirausaha Muda Produktif Indonesia</h3>
                </div>
              </div>

              {/* Text / Data Evidence Side */}
              <div className="lg:col-span-5 p-8 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                    Fakta Lapangan
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    Tulang Punggung Ekonomi Indonesia
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 font-normal">
                    UMKM menyumbang mayoritas PDB dan lapangan kerja nasional. Namun, banyak calon wirausaha muda gagal di tahun pertama akibat ketidakpastian perhitungan modal awal, sewa tempat, dan standar UMR daerah.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    "Menghilangkan estimasi modal fiktif dengan database 18 kota UMR riil.",
                    "Perhitungan otomatis titik balik modal (Break Even Point) 12 bulan.",
                    "Dokumen rencana bisnis siap KUR selaras SDG 8 Matriks 4 Bappenas.",
                  ].map((poin, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{poin}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Sumber: Data Kemenkop UKM & BPS RI</span>
                  <Link
                    href="/sdg-impact"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition"
                  >
                    <span>Lihat Rincian Dampak</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 4 Stat Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FAKTA_UMKM.map((item, idx) => (
            <Reveal key={item.label} delay={idx * 0.1}>
              <div className="h-full rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-900">{item.angka}</span>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h4 className="mt-4 text-sm font-extrabold text-slate-900">{item.label}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.sub}</p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-bold text-emerald-700">Terverifikasi Publikasi Resmi</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
