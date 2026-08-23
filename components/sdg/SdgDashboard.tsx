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
            color: "from-teal-500 to-teal-600",
            badge: "Target 8.3",
          },
          {
            label: "Proyeksi Serapan Kerja",
            value: stats.totalEstimasiKerja,
            icon: Users,
            color: "from-emerald-500 to-teal-500",
            badge: "Target 8.5",
          },
          {
            label: "Rencana Bisnis Diterbitkan",
            value: stats.totalRencanaBisnis,
            icon: FileCheck2,
            color: "from-cyan-500 to-blue-600",
            badge: "Target 8.6",
          },
          {
            label: "Kota Terjangkau",
            value: stats.totalKotaAktif,
            suffix: " Kota",
            icon: Globe2,
            color: "from-amber-500 to-orange-500",
            badge: "Pilar Daerah",
          },
        ].map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-emerald-300">
              <div
                className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.color} opacity-15 blur-xl`}
              />
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-md`}>
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-700 border border-slate-200">
                  {c.badge}
                </span>
              </div>
              <p className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">
                <AnimatedCounter
                  value={c.value}
                  format={(n) => `${n.toLocaleString("id-ID")}${c.suffix ?? "+"}`}
                />
              </p>
              <h3 className="mt-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-600">
                {c.label}
              </h3>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Interactive Charts: Category Distribution & Impact Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-md h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Distribusi Sektor Usaha yang Diminati
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  14 Model Terkurasi
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
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
                        border: "1px solid #cbd5e1",
                        borderRadius: 16,
                        fontSize: 12,
                        color: "#0f172a",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
              {CATEGORY_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-slate-800">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="font-extrabold">{item.name}</span>
                  <span className="text-slate-500">({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-md h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Indikator Kesiapan Usaha Inklusif
                </h3>
                <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  Indeks PetaKarier
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
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
                      <span className="text-slate-800 font-extrabold">{item.label}</span>
                      <span className="text-emerald-700 font-extrabold">{item.score}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Semua indikator selaras dengan Rencana Aksi Nasional TPB Bappenas RI.</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Deep Dive SDG 8 Target Alignment Table */}
      <div className="space-y-6">
        <Reveal>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Keselarasan dengan Target SDG 8 & RAN TPB Matriks 4
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Rincian implementasi teknis dan indikator capaian pada setiap sub-target Tujuan Pembangunan Berkelanjutan.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {SDG_TARGET_DETAILS.map((t, idx) => (
            <Reveal key={t.target} delay={idx * 0.1}>
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-md space-y-4 hover:border-emerald-300 transition">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-700">
                      {t.target}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{t.pilar}</h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {t.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                      Mandat SDG 8 PBB & Bappenas:
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-0.5 font-medium">{t.deskripsi}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-emerald-700 font-extrabold uppercase tracking-wider text-[10px]">
                      Kontribusi Nyata Platform PetaKarier:
                    </p>
                    <p className="text-slate-900 leading-relaxed mt-0.5 font-bold">{t.kontribusiPetaKarier}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Official Bappenas Reference Box */}
      <Reveal delay={0.2}>
        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Pelajari Dokumen Rencana Aksi Nasional TPB/SDGs
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              PetaKarier mengadopsi indikator Lampiran III Matriks 4 (Pelaku Usaha) yang diterbitkan oleh Kementerian PPN/Bappenas RI sebagai rujukan formal pengembangan ekosistem kewirausahaan digital.
            </p>
          </div>
          <a
            href="https://sdgs.bappenas.go.id/website/wp-content/uploads/2023/11/Lampiran-III-RAN-Matriks-3-dan-4.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:scale-105 shrink-0"
          >
            <span>Unduh Dokumen Bappenas</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
