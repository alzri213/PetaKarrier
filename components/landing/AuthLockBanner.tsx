"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export default function AuthLockBanner() {
  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/15" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] border-2 border-emerald-500/40 bg-gradient-to-b from-white via-emerald-50/30 to-white p-8 sm:p-12 lg:p-14 shadow-2xl dark:border-emerald-500/30 dark:from-[#0a0f1d] dark:via-[#06121e] dark:to-[#0a0f1d] text-center"
        >
          {/* Top Lock Badge */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00df82]/20 border border-[#00df82]/40 text-[#00df82] shadow-lg shadow-emerald-500/20">
            <Lock className="h-8 w-8 text-[#00df82] animate-pulse" />
          </div>

          <div className="mt-6 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-[#00df82]">
              <Sparkles className="h-3.5 w-3.5" />
              Eksplorasi Lebih Lengkap
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto">
              Buka Akses Penuh ke Seluruh Ekosistem PetaKarier
            </h2>
            <p className="mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
              Masuk atau buat akun gratis sekarang untuk membuka roadmap 90 hari aksi wirausaha, simulasi modal real-time 18 kota, perbandingan UMR, dan pembuatan rencana bisnis otomatis siap KUR.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {[
              {
                icon: Zap,
                title: "Analisis Potensi Usaha",
                desc: "Rekomendasi cerdas sesuai minat & modal",
              },
              {
                icon: FileSpreadsheet,
                title: "Kalkulator BEP 18 Kota",
                desc: "Simulasi biaya hidup & sewa tempat",
              },
              {
                icon: ShieldCheck,
                title: "Rencana Bisnis Otomatis",
                desc: "Format standar pengajuan KUR Bappenas",
              },
              {
                icon: CheckCircle2,
                title: "100% Gratis Selamanya",
                desc: "Tanpa biaya berlangganan tersembunyi",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-[#00df82]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-shine group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#00df82] px-8 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:bg-[#00c975] hover:scale-105 active:scale-95"
            >
              <span>Daftar Akun Gratis</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
