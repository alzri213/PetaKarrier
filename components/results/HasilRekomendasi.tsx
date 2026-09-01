"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Info,
  Coffee,
  UtensilsCrossed,
  Shirt,
  Sparkle,
  Store,
  Scissors,
  Laptop,
  Briefcase,
  Loader2,
} from "lucide-react";
import type { Rekomendasi } from "@/types";

function formatModalJuta(min: number, max: number): string {
  const minJuta = Math.round(min / 1_000_000);
  const maxJuta = Math.round(max / 1_000_000);
  if (minJuta > 0 && maxJuta > 0) {
    return `Rp ${minJuta}–${maxJuta} Juta`;
  }
  return `Rp ${min.toLocaleString("id-ID")} – Rp ${max.toLocaleString("id-ID")}`;
}

export default function HasilRekomendasi() {
  const params = useParams();
  const router = useRouter();
  const analisisId = params.id as string;

  const [rekomendasi, setRekomendasi] = useState<Rekomendasi[] | null>(null);
  const [profil, setProfil] = useState<{
    profil: { minat: string[]; pengalaman: string };
    kota: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let hasLocalData = false;
    // Read profil and rekomendasi from localStorage
    try {
      const stored = localStorage.getItem("konekumkm-profil");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfil(parsed);
        if (parsed.rekomendasi && Array.isArray(parsed.rekomendasi) && parsed.rekomendasi.length > 0) {
          setRekomendasi(parsed.rekomendasi);
          hasLocalData = true;
          setLoading(false);
        }
      }
    } catch {}

    // Fetch analisis data from API
    async function fetchData() {
      try {
        const res = await fetch(`/api/analisis?id=${analisisId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.rekomendasi && Array.isArray(data.rekomendasi) && data.rekomendasi.length > 0) {
            setRekomendasi(data.rekomendasi);
          }
        }
      } catch {
        // Fallback handled in component state
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [analisisId]);

  const kota = profil?.kota || "jakarta";
  const minatList = profil?.profil?.minat || [];
  const keahlian = profil?.profil?.pengalaman || "pemula";

  const BADGE_CONFIGS = [
    { text: "Potensi Tinggi", icon: Coffee },
    { text: "Modal Ringan", icon: UtensilsCrossed },
    { text: "Risiko Rendah", icon: Store },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-[#00df82]" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Memuat rekomendasi usaha...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#060a14] pt-28 pb-20 transition-colors duration-300">
      {/* Smooth Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/[0.07] blur-[140px] dark:bg-[#00df82]/[0.05]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-teal-500/[0.05] blur-[120px] dark:bg-teal-500/[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ══════════════════════════════════════════════════════════════════
            TOP HEADER SECTION: SDG BADGE + TITLE + DESCRIPTION
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-[#00df82] dark:border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi
          </span>

          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rekomendasi Usaha untuk Anda
          </h1>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-3xl">
            Berdasarkan analisis algoritma potensi mandiri yang disesuaikan dengan minat bidang{" "}
            {minatList.length > 0
              ? minatList.join("/").toLowerCase()
              : "kuliner/jasa"}
            , keahlian {keahlian}, dan estimasi modal yang Anda miliki.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            3 RECOMMENDATION CARDS GRID (EXACT BORDER RADIUS & STYLING)
        ══════════════════════════════════════════════════════════════════ */}
        {rekomendasi && rekomendasi.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {rekomendasi.slice(0, 3).map((item, idx) => {
              const badge = BADGE_CONFIGS[idx] || BADGE_CONFIGS[0];
              const BadgeIcon = badge.icon;

              return (
                <motion.div
                  key={item.usaha.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all hover:border-emerald-400/60 dark:border-slate-800/80 dark:bg-[#070d1a] dark:hover:border-emerald-500/50"
                >
                  <div>
                    {/* Top Row: Icon Box (Left) + Pill Badge (Right) */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-50 dark:border-[#14423a] dark:bg-[#0d2222]">
                        <BadgeIcon className="h-5 w-5 text-emerald-600 dark:text-[#00df82]" />
                      </div>

                      <span className="rounded-full border border-emerald-300/60 bg-emerald-50 px-3.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-[#0e483b] dark:bg-[#07241e] dark:text-[#00df82]">
                        {badge.text}
                      </span>
                    </div>

                    {/* Business Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {item.usaha.nama}
                    </h3>

                    {/* Business Description */}
                    <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 min-h-[72px]">
                      {item.usaha.deskripsi}
                    </p>
                  </div>

                  <div>
                    {/* Modal Estimate Section */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        ESTIMASI MODAL AWAL
                      </span>
                      <p className="mt-1 text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-[#00df82]">
                        {formatModalJuta(item.usaha.modalMin, item.usaha.modalMax)}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/kalkulator?usahaId=${item.usaha.id}&kota=${kota}`
                        )
                      }
                      className="mt-5 group flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-[#00c975] hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                    >
                      <span>Lanjut ke Kalkulator Modal</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md dark:border-slate-800 dark:bg-[#070d1a]">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Hasil Analisis Tidak Ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Data analisis ini mungkin sudah kedaluwarsa atau belum tersimpan. Silakan lakukan analisis ulang.
            </p>
            <Link
              href="/analisis"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#00df82] px-6 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-[#00c975] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Mulai Analisis Baru
            </Link>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM INFO BANNER (MATCHES REFERENCE)
        ══════════════════════════════════════════════════════════════════ */}
        {rekomendasi && rekomendasi.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-md dark:border-slate-800/80 dark:bg-[#070d1a]"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 text-slate-400">
              <Info className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
              Rekomendasi di atas dihitung secara presisi berdasarkan rata-rata pertumbuhan riil wilayah lokal Anda. Klik tombol kelayakan di salah satu opsi untuk menghitung estimasi Break Even Point (BEP) instan.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
