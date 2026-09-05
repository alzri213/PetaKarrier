"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  TrendingUp,
  Users,
  Building2,
  Cpu,
  FileCheck2,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Reveal from "@/components/ui/Reveal";
import type { PlatformStatsData } from "@/types";

interface SdgDashboardProps {
  stats: PlatformStatsData;
}

const CATEGORY_DISTRIBUTION = [
  { name: "Kuliner", value: 38, color: "#0d9488" },
  { name: "Jasa", value: 24, color: "#06b6d4" },
  { name: "Kreatif", value: 18, color: "#8b5cf6" },
  { name: "Fashion", value: 12, color: "#ec4899" },
  { name: "Agribisnis", value: 8, color: "#10b981" },
];

const SDG_TARGET_DETAILS = [
  {
    target: "Target 8.3",
    pilar: "Formalisasi & Inovasi UMKM",
    deskripsi:
      "Mendorong kebijakan berorientasi pembangunan yang mendukung kegiatan produktif, penciptaan lapangan kerja layak, kewirausahaan, kreativitas dan inovasi, serta mendorong formalisasi usaha.",
    indikator: "Proporsi UMKM terdaftar NIB (OSS RBA) & akuntabilitas finansial",
    kontribusiPetaKarier:
      "Menyediakan generator dokumen rencana bisnis standar perbankan/KUR dan edukasi alokasi legalitas NIB dalam rincian modal awal.",
    status: "Aktif Terintegrasi",
  },
  {
    target: "Target 8.5",
    pilar: "Pekerjaan Layak & Pendapatan Produktif",
    deskripsi:
      "Mencapai kesempatan kerja penuh dan produktif serta pekerjaan yang layak bagi semua perempuan dan laki-laki, termasuk pemuda dan penyandang disabilitas, serta upah yang sama untuk pekerjaan bernilai sama.",
    indikator: "Tingkat penyerapan tenaga kerja per unit UMKM & upah di atas UMR",
    kontribusiPetaKarier:
      "Simulasi komparasi laba vs UMR 18 kota memastikan pemuda memilih model usaha dengan return ekonomi yang layak dan berkelanjutan.",
    status: "Aktif Terintegrasi",
  },
  {
    target: "Target 8.6",
    pilar: "Pengurangan Pengangguran Pemuda (NEET)",
    deskripsi:
      "Secara substansial mengurangi proporsi generasi muda yang tidak bekerja, tidak berpendidikan atau tidak terlatih (Youth Not in Employment, Education or Training).",
    indikator: "Tingkat partisipasi wirausaha muda produktif usia 18–30 tahun",
    kontribusiPetaKarier:
      "Akselerasi ide wirausaha mandiri melalui tes minat/skill interaktif dan roadmap eksekusi 90 hari tanpa hambatan teknis rumit.",
    status: "Aktif Terintegrasi",
  },
  {
    target: "Target 8.2",
    pilar: "Peningkatan Mutu Teknologi & Diversifikasi",
    deskripsi:
      "Mencapai tingkat produktivitas ekonomi yang lebih tinggi melalui diversifikasi, peningkatan mutu teknologi dan inovasi, termasuk fokus pada sektor bernilai tambah tinggi.",
    indikator: "Adopsi teknologi digital dalam perencanaan dan pemasaran UMKM",
    kontribusiPetaKarier:
      "Platform pemetaan wirausaha terpadu berbasis data terverifikasi dan kalkulator sensitivitas modal instan.",
    status: "Aktif Terintegrasi",
  },
];

export default function SdgDashboard({ stats }: SdgDashboardProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 space-y-12">
      {/* Overview Stat Counters */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Usaha Dianalisis",
            value: stats.totalAnalisis,
            icon: Building2,
            textColor: "text-emerald-600 dark:text-emerald-400",
            badge: "Target 8.3",
          },
          {
            label: "Proyeksi Serapan Kerja",
            value: stats.totalEstimasiKerja,
            icon: Users,
            textColor: "text-emerald-600 dark:text-emerald-400",
            badge: "Target 8.5",
          },
          {
            label: "Rencana Bisnis Diterbitkan",
            value: stats.totalRencanaBisnis,
            icon: FileCheck2,
            textColor: "text-sky-600 dark:text-sky-400",
            badge: "Target 8.6",
          },
          {
            label: "Kota Terjangkau",
            value: stats.totalKotaAktif,
            suffix: " Kota",
            icon: Globe2,
            textColor: "text-amber-600 dark:text-amber-400",
            badge: "Pilar Daerah",
          },
        ].map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-6 shadow-md transition-all hover:shadow-xl hover:border-emerald-400 hover:-translate-y-0.5 flex flex-col justify-between h-full dark:border-slate-700 dark:bg-slate-800 dark:shadow-lg dark:hover:border-emerald-500 dark:hover:shadow-emerald-500/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <c.icon className={`h-8 w-8 ${c.textColor}`} />
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40">
                    {c.badge}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  <AnimatedCounter
                    value={c.value}
                    format={(n) => `${n.toLocaleString("id-ID")}${c.suffix ?? "+"}`}
                  />
                </p>
                <h3 className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  {c.label}
                </h3>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Interactive Charts: Category Distribution & Impact Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl border-2 border-emerald-100 bg-white p-4 shadow-md h-full flex flex-col justify-between dark:border-slate-700 dark:bg-slate-800 dark:shadow-lg sm:p-7">
            <div>
              <div className="flex min-w-0 items-center gap-2 sm:justify-between sm:gap-3">
                <h3 className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-extrabold uppercase leading-none tracking-wide text-slate-900 dark:text-white sm:text-sm sm:tracking-wider">
                  Distribusi Sektor Usaha yang Diminati
                </h3>
                <span className="shrink-0 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-extrabold leading-none text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300 sm:px-2.5 sm:py-0.5 sm:text-[10px]">
                  14 Model Terkurasi
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
                Persentase wirausaha muda berdasarkan bidang sektor ekonomi
              </p>

              <div className="mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DISTRIBUTION}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, "Porsi Minat"]}
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: 16,
                        fontSize: 12,
                        color: "#0f172a",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                      wrapperClassName="dark:[&_.recharts-tooltip-wrapper]:!bg-slate-800 dark:[&_.recharts-default-tooltip]:!bg-slate-800 dark:[&_.recharts-default-tooltip]:!border-slate-600 dark:[&_.recharts-tooltip-label]:!text-white dark:[&_.recharts-tooltip-item]:!text-slate-200"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
              {CATEGORY_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="font-extrabold">{item.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border-2 border-emerald-100 bg-white p-4 shadow-md h-full flex flex-col justify-between dark:border-slate-700 dark:bg-slate-800 dark:shadow-lg sm:p-7">
            <div>
              <div className="flex min-w-0 items-center gap-2 sm:justify-between sm:gap-3">
                <h3 className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-extrabold uppercase leading-none tracking-wide text-slate-900 dark:text-white sm:text-sm sm:tracking-wider">
                  Indikator Kesiapan Usaha Inklusif
                </h3>
                <span className="shrink-0 whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[9px] font-extrabold leading-none text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-300 sm:px-2.5 sm:py-0.5 sm:text-[10px]">
                  Indeks PetaKarier
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
                Rata-rata skor parameter keberlanjutan unit bisnis
              </p>

              <div className="mt-6 space-y-4">
                {[
                  { label: "Tingkat Inklusivitas Pemuda & Perempuan", score: 92, color: "from-emerald-500 to-teal-600" },
                  { label: "Kesiapan Adopsi Digital & QRIS", score: 86, color: "from-teal-500 to-cyan-600" },
                  { label: "Tingkat Kelayakan Finansial (Laba > UMR)", score: 78, color: "from-cyan-600 to-emerald-600" },
                  { label: "Kepatuhan Rencana Legalitas NIB", score: 89, color: "from-amber-500 to-orange-600" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-extrabold dark:text-slate-200">{item.label}</span>
                      <span className="text-emerald-700 font-extrabold dark:text-emerald-400">{item.score}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-sm`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 font-semibold flex items-center gap-2 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Semua indikator selaras dengan Rencana Aksi Nasional TPB Bappenas RI.</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Deep Dive SDG 8 Target Alignment Table */}
      <div className="space-y-6">
        <Reveal>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Keselarasan dengan Target SDG 8 & RAN TPB Matriks 4
            </h3>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
              Rincian implementasi teknis dan indikator capaian pada setiap sub-target Tujuan Pembangunan Berkelanjutan.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {SDG_TARGET_DETAILS.map((t, idx) => (
            <Reveal key={t.target} delay={idx * 0.1}>
              <div className="rounded-3xl border-2 border-emerald-100 bg-white p-7 shadow-md space-y-4 hover:border-emerald-400 transition-all hover:shadow-xl hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500 dark:shadow-lg dark:hover:shadow-emerald-500/10">
                <div className="flex flex-col items-start gap-2 border-b border-slate-100 pb-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                      {t.target}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{t.pilar}</h4>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> {t.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-600 font-extrabold uppercase tracking-wider text-[10px] dark:text-slate-400">
                      Mandat SDG 8 PBB & Bappenas:
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-0.5 font-medium dark:text-slate-300">{t.deskripsi}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-emerald-700 font-extrabold uppercase tracking-wider text-[10px] dark:text-emerald-400">
                      Kontribusi Nyata Platform PetaKarier:
                    </p>
                    <p className="text-slate-900 leading-relaxed mt-0.5 font-bold dark:text-white">{t.kontribusiPetaKarier}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Official Bappenas Reference Box */}
      <Reveal delay={0.2}>
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 dark:border-emerald-500/40 dark:from-emerald-900/30 dark:via-slate-800 dark:to-teal-900/30 dark:shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Pelajari Dokumen Rencana Aksi Nasional TPB/SDGs
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed dark:text-slate-300">
              PetaKarier mengadopsi indikator Lampiran III Matriks 4 (Pelaku Usaha) yang diterbitkan oleh Kementerian PPN/Bappenas RI sebagai rujukan formal pengembangan ekosistem kewirausahaan digital.
            </p>
          </div>
          <a
            href="/Buku-Capaian-SDGs-Indonesia-2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 shrink-0 dark:from-emerald-600 dark:via-emerald-500 dark:to-green-600 dark:hover:shadow-emerald-400/20"
          >
            <span>Unduh Buku Capaian SDGs Indonesia 2025</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
