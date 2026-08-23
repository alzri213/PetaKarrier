"use client";

import { motion } from "framer-motion";
import { UserPlus, ClipboardList, Search, Calculator, Scale, FileDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const LANGKAH = [
  {
    icon: UserPlus,
    title: "Isi Profil Usaha & Budget",
    desc: "Mulai dengan memasukkan minat, keahlian, dan ketersediaan modal awalmu.",
    grad: "from-emerald-500 to-emerald-600",
  },
  {
    icon: ClipboardList,
    title: "Kuesioner Interaktif 2 Menit",
    desc: "Jawab beberapa pertanyaan singkat mengenai kesiapan dan komitmen usahamu.",
    grad: "from-emerald-600 to-emerald-700",
  },
  {
    icon: Search,
    title: "Pencocokan Rekomendasi Usaha",
    desc: "Sistem mencocokkan profilmu dengan 14 jenis usaha terkurasi dan analisis risiko.",
    grad: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Calculator,
    title: "Simulasi Modal & Parameter Kota",
    desc: "Pilih kota domisili untuk menghitung biaya sewa, UMR, utilitas, dan margin laba.",
    grad: "from-emerald-600 to-green-600",
  },
  {
    icon: Scale,
    title: "Komparasi Finansial vs UMR",
    desc: "Bandingkan kelayakan return usaha vs gaji upah minimum di wilayah pilihanmu.",
    grad: "from-emerald-500 to-teal-600",
  },
  {
    icon: FileDown,
    title: "Dokumen Rencana Bisnis Otomatis",
    desc: "Dapatkan dokumen rencana bisnis profesional standar KUR/perbankan, siap diunduh.",
    grad: "from-emerald-600 to-emerald-500",
  },
];

export default function FlowSection() {
  return (
    <section id="cara-kerja" className="relative px-4 py-24 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 shadow-sm">
            Alur Pengguna
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Dari Nol Menuju <span className="text-gradient">Rencana Bisnis Matang</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Hanya butuh kurang dari 5 menit untuk mendapatkan simulasi modal dan dokumen rencana bisnis pertamamu.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <motion.span
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute left-[27px] top-2 h-[calc(100%-16px)] w-1 origin-top bg-gradient-to-b from-emerald-500 via-green-500 to-emerald-400 sm:left-1/2 sm:-translate-x-1/2 rounded-full"
          />
          <div className="space-y-10">
            {LANGKAH.map((l, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={l.title} delay={0.1}>
                  <div
                    className={`relative flex items-start gap-6 sm:gap-0 ${
                      left
                        ? "sm:flex-row sm:pr-[calc(50%+3rem)]"
                        : "sm:flex-row-reverse sm:pl-[calc(50%+3rem)] sm:text-right"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: -6 }}
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${l.grad} shadow-lg shadow-emerald-500/25 sm:absolute sm:left-1/2 sm:-translate-x-1/2`}
                    >
                      <l.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div
                      className={`flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:border-emerald-300 hover:shadow-xl ${
                        left ? "sm:text-right" : ""
                      }`}
                    >
                      <span className="inline-block rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-200 mb-2">
                        LANGKAH {i + 1}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {l.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">{l.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
