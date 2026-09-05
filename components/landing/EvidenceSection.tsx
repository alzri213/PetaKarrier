"use client";

import Image from "next/image";
import { TrendingUp, Users, PieChart, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const FAKTA_UMKM = [
  {
    angka: "65,5 Juta",
    label: "Total Unit UMKM Indonesia",
    sub: "Mencakup 99% dari seluruh unit dunia usaha nasional (BPS & Kemenkop UKM).",
    icon: Users,
    color: "text-[#16a34a]",
  },
  {
    angka: "61,9%",
    label: "Kontribusi terhadap PDB",
    sub: "UMKM merupakan tulang punggung dan penyumbang terbesar PDB Indonesia.",
    icon: PieChart,
    color: "text-emerald-600",
  },
  {
    angka: "97%",
    label: "Penyerapan Tenaga Kerja",
    sub: "Menyerap mayoritas angkatan kerja produktif dan generasi muda di seluruh daerah.",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    angka: "30,2 Juta",
    label: "Terverifikasi SIDT Non-Pertanian",
    sub: "Dominasi 99,7% pada sektor Mikro yang memerlukan penguatan akuntabilitas modal.",
    icon: ShieldCheck,
    color: "text-amber-500",
  },
];

export default function EvidenceSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white px-4 py-20 transition-colors duration-500 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Mengapa <span className="text-emerald-700 dark:text-emerald-400">PetaKarier</span> Dibangun?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Berdasarkan riset data resmi Kementerian Koperasi & UKM serta BPS RI, UMKM adalah fondasi ekonomi Indonesia namun memerlukan validasi kelayakan bisnis yang terukur.
          </p>
        </Reveal>

        {/* Showcase Banner & Real Photo Evidence */}
        <Reveal delay={0.2} className="mt-12">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-200 bg-white shadow-xl transition-colors duration-500 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid lg:grid-cols-12 items-center">
              {/* Image side */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[450px] w-full overflow-hidden">
                <Image
                  src="/umkm-indonesia-hero.jpg"
                  alt="Wirausaha Muda UMKM Indonesia"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 700px"
                  className="object-cover scale-[1.16] sm:scale-[1.18] object-center transition-transform duration-700 hover:scale-[1.20]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/90 dark:lg:to-slate-900/90" />
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
                  <h3 className="text-2xl font-extrabold leading-snug text-slate-900 dark:text-white sm:text-3xl">
                    Tulang Punggung Ekonomi Indonesia
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-300">
                    UMKM menyumbang mayoritas PDB dan lapangan kerja nasional. Namun, banyak calon wirausaha muda gagal di tahun pertama akibat ketidakpastian perhitungan modal awal, sewa tempat, dan standar UMR daerah.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    "Menghilangkan estimasi modal fiktif dengan database 38 provinsi UMR riil.",
                    "Perhitungan otomatis titik balik modal (Break Even Point) 12 bulan.",
                    "Dokumen rencana bisnis siap KUR selaras SDG 8 Matriks 4 Bappenas.",
                  ].map((poin, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 sm:text-sm">{poin}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-start gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">Sumber: Data Kemenkop UKM & BPS RI</span>
                  <Link
                    href="/sdg-impact"
                    className="inline-flex w-full items-center justify-between gap-2 text-xs font-extrabold text-emerald-700 transition hover:text-emerald-800 sm:w-auto sm:justify-start"
                  >
                    <span className="whitespace-nowrap">Lihat Rincian Dampak</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
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
              <div className="flex h-full flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{item.angka}</span>
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h4 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">{item.label}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.sub}</p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
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
