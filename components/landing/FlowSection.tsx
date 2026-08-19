"use client";

import { motion } from "framer-motion";
import { UserPlus, ClipboardList, Search, Calculator, Scale, FileDown } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const LANGKAH = [
  {
    icon: UserPlus,
    title: "Daftar & isi profil",
    desc: "Mulai dengan mengisi minat, keahlian, dan budget awalmu.",
    grad: "from-emerald-500 to-emerald-600",
  },
  {
    icon: ClipboardList,
    title: "Isi kuesioner minat",
    desc: "Jawab beberapa pertanyaan singkat — tidak perlu data rumit.",
    grad: "from-emerald-600 to-emerald-700",
  },
  {
    icon: Search,
    title: "Analisis potensi usaha",
    desc: "Sistem mencocokkan profilmu dengan 14 jenis usaha terkurasi.",
    grad: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Calculator,
    title: "Hitung modal & lokasi",
    desc: "Masukkan kota domisili untuk estimasi biaya per kota.",
    grad: "from-emerald-400 to-emerald-500",
  },
  {
    icon: Scale,
    title: "Bandingkan dengan UMR",
    desc: "Lihat apakah usaha atau kerja lebih menguntungkan di kotamu.",
    grad: "from-emerald-300 to-emerald-400",
  },
  {
    icon: FileDown,
    title: "Rencana bisnis otomatis",
    desc: "Dapatkan dokumen rencana bisnis lengkap, siap diunduh.",
    grad: "from-emerald-600 to-emerald-500",
  },
];

export default function FlowSection() {
  return (
    <section id="cara-kerja" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
            Alur Pengguna
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Dari nol menuju <span className="text-gradient">rencana bisnis</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Hanya butuh kurang dari 5 menit untuk sampai ke dokumen rencana
            bisnis pertamamu.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <motion.span
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute left-[27px] top-2 h-[calc(100%-16px)] w-px origin-top bg-gradient-to-b from-emerald-500 via-green-500 to-emerald-400 sm:left-1/2"
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
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${l.grad} shadow-xl sm:absolute sm:left-1/2 sm:-translate-x-1/2`}
                    >
                      <l.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div
                      className={`flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] ${
                        left ? "sm:text-right" : ""
                      }`}
                    >
                      <p className="text-xs font-extrabold text-white/30">
                        LANGKAH {i + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold text-white">
                        {l.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">{l.desc}</p>
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
