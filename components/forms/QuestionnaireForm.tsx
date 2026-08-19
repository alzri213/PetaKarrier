"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  Globe2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { KategoriUsaha, ProfilUser, Rekomendasi } from "@/types";
import { SKILL_KATEGORI } from "@/lib/logic/rekomendasiUsaha";
import ScoreBar from "@/components/ui/ScoreBar";
import LoadingDots from "@/components/ui/LoadingDots";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import { submitAnalisisAction } from "@/lib/actions/analisis";

const KATEGORI_META: { key: KategoriUsaha; label: string; emoji: string }[] = [
  { key: "Kuliner", label: "Kuliner", emoji: "🍜" },
  { key: "Fashion", label: "Fashion", emoji: "👕" },
  { key: "Kreatif", label: "Kreatif", emoji: "🎨" },
  { key: "Jasa", label: "Jasa", emoji: "🔧" },
  { key: "Agribisnis", label: "Agribisnis", emoji: "🌱" },
];

const SKILL_META: Record<string, string> = {
  memasak: "🍳",
  "peracik-kopi": "☕",
  logistik: "📦",
  kemasan: "📦",
  "manajemen-waktu": "⏰",
  fashion: "🧥",
  "foto-produk": "📷",
  sablon: "🖨️",
  desain: "🎨",
  "sosial-media": "📱",
  fotografi: "📷",
  "editing-video": "🎬",
  "public-speaking": "🎤",
  ketelitian: "🔍",
  pelayanan: "🤝",
  teknik: "🛠️",
  negosiasi: "🤝",
  berkebun: "🌱",
  teknologi: "💻",
  riset: "📊",
};

const SKILLS = Array.from(new Set(Object.values(SKILL_KATEGORI).flat()));

const BUDGET_OPTIONS = [
  { value: 2_500_000, label: "Di bawah Rp3 jt", desc: "Rintisan modal mikro & terjangkau" },
  { value: 6_000_000, label: "Rp3 – 8 jt", desc: "Usaha rumahan atau online shop" },
  { value: 12_000_000, label: "Rp8 – 15 jt", desc: "Usaha menengah dengan booth/alat lengkap" },
  { value: 22_000_000, label: "Di atas Rp15 jt", desc: "Skala komersial & fasilitas sewa awal" },
];

const WAKTU_OPTIONS = [
  { value: "full", label: "Full-time", desc: "Fokus penuh mengembangkan usaha" },
  { value: "parttime", label: "Sambil kuliah/kerja", desc: "Usaha sampingan produktif" },
  { value: "sampling", label: "Coba-coba dulu", desc: "Validasi pasar skala mikro" },
] as const;

const PENGALAMAN_OPTIONS = [
  { value: "pemula", label: "Belum pernah berjualan", desc: "Butuh panduan step-by-step" },
  { value: "pernah", label: "Pernah mencoba jualan", desc: "Paham dasar transaksi" },
  { value: "sudah", label: "Sudah menjalankan usaha", desc: "Fokus optimasi laba & scale-up" },
] as const;

const STEPS = ["Minat", "Skill", "Budget", "Komitmen", "Hasil Rekomendasi"];

const ANALISIS_TEKS = [
  "Membaca profil preferensi dan kapabilitasmu…",
  "Menghubungkan kecocokan skill dengan 14 jenis usaha…",
  "Menghitung skor kelayakan modal awal & potensi pasar…",
  "Menyusun analisis keselarasan dampak SDG 8 & RAN TPB…",
];

export default function QuestionnaireForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [minat, setMinat] = useState<KategoriUsaha[]>([]);
  const [skill, setSkill] = useState<string[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [waktu, setWaktu] = useState<string>("parttime");
  const [pengalaman, setPengalaman] = useState<string>("pemula");
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasil, setHasil] = useState<Rekomendasi[] | null>(null);
  const [analisisId, setAnalisisId] = useState<string | null>(null);
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMinat = (k: KategoriUsaha) =>
    setMinat((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );

  const toggleSkill = (s: string) =>
    setSkill((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const canNext =
    (step === 0 && minat.length > 0) ||
    (step === 1 && skill.length > 0) ||
    (step === 2 && budget !== null) ||
    step === 3;

  const submit = async () => {
    if (!budget) return;
    setIsSubmitting(true);
    setStep(4);

    const profil: ProfilUser = {
      minat,
      skill,
      budget,
      waktu: waktu as ProfilUser["waktu"],
      pengalaman: pengalaman as ProfilUser["pengalaman"],
    };

    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, ANALISIS_TEKS.length - 1));
    }, 650);

    try {
      const res = await submitAnalisisAction(profil);
      await new Promise((r) => setTimeout(r, 2200));
      clearInterval(interval);

      if (!res.success || !res.rekomendasi) {
        throw new Error(res.error ?? "Gagal memproses rekomendasi");
      }

      setHasil(res.rekomendasi);
      setAnalisisId(res.id ?? null);
      setPilihan(res.rekomendasi[0]?.usaha.id ?? null);

      localStorage.setItem(
        "konekumkm-profil",
        JSON.stringify({ profil, analisisId: res.id, tanggal: new Date().toISOString() })
      );
      toast.success("Analisis berhasil diproses!", {
        description: "Rekomendasi usaha terbaik siap untuk dieksplorasi.",
      });
    } catch (err) {
      clearInterval(interval);
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lanjutKalkulator = () => {
    if (!pilihan) return;
    localStorage.setItem(
      "konekumkm-usaha",
      JSON.stringify({ usahaId: pilihan, analisisId })
    );
    router.push(`/kalkulator?usahaId=${pilihan}${analisisId ? `&analisisId=${analisisId}` : ""}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4">
      <AnimatePresence mode="wait">
        {step < 4 && (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 font-mono text-[10px]">
                    {step + 1}
                  </span>
                  Langkah {step + 1} dari 4 — {STEPS[step]}
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200 text-emerald-600">
                  {Math.round((step / 4) * 100)}% Selesai
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-200">
                <motion.div
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400"
                />
              </div>
            </div>

            {step === 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Bidang usaha apa yang paling kamu <span className="text-gradient">minati</span>?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Pilih satu atau beberapa kategori yang menarik bagimu (bisa lebih dari satu).
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                  {KATEGORI_META.map((k, i) => {
                    const active = minat.includes(k.key);
                    return (
                      <motion.button
                        key={k.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleMinat(k.key)}
                        className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                          active
                            ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/15"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="minat-check"
                            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-400 text-xs font-bold text-white shadow-md"
                          >
                            ✓
                          </motion.span>
                        )}
                        <span className="text-4xl">{k.emoji}</span>
                        <p className="mt-3 font-extrabold text-slate-900">{k.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Keahlian apa yang kamu <span className="text-gradient">miliki</span>?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Pilih keterampilan yang sudah kamu kuasai atau ingin kamu terapkan.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {SKILLS.map((s, i) => {
                    const active = skill.includes(s);
                    return (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSkill(s)}
                        className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {SKILL_META[s] ?? "✨"} {s.replace(/-/g, " ")}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Berapa alokasi <span className="text-gradient">budget modalmu</span>?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Estimasi dana awal yang dapat kamu siapkan secara mandiri atau kemitraan.
                </p>
                <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                  {BUDGET_OPTIONS.map((b, i) => {
                    const active = budget === b.value;
                    return (
                      <motion.button
                        key={b.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBudget(b.value)}
                        className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                          active
                            ? "border-emerald-400/60 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-lg shadow-emerald-500/15"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <p className="text-lg font-extrabold text-slate-900">{b.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{b.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Komitmen & <span className="text-gradient">Pengalaman Berwirausaha</span>
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Membantu algoritma kami menyesuaikan rekomendasi dengan ritme dan kesiapan mentalmu.
                </p>

                <p className="mt-7 text-sm font-extrabold text-slate-700">
                  Alokasi waktu yang dapat kamu luangkan:
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {WAKTU_OPTIONS.map((w, i) => {
                    const active = waktu === w.value;
                    return (
                      <motion.button
                        key={w.value}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setWaktu(w.value)}
                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                          active
                            ? "border-emerald-400/60 bg-emerald-500/15 ring-1 ring-emerald-400/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <p className="font-extrabold text-slate-900 text-sm">{w.label}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{w.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="mt-7 text-sm font-extrabold text-slate-700">
                  Bagaimana rekam jejak pengalaman berjualanmu?
                </p>
                <div className="mt-3 grid gap-2.5">
                  {PENGALAMAN_OPTIONS.map((p, i) => {
                    const active = pengalaman === p.value;
                    return (
                      <motion.button
                        key={p.value}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setPengalaman(p.value)}
                        className={`rounded-xl border p-3.5 text-left text-sm font-semibold transition-all duration-300 flex items-center justify-between ${
                          active
                            ? "border-emerald-400/60 bg-emerald-500/15 text-slate-900 ring-1 ring-emerald-400/30"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-900">{p.label}</p>
                          <p className="text-xs text-slate-500 font-normal mt-0.5">{p.desc}</p>
                        </div>
                        {active && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali
              </button>
              {step < 3 ? (
                <button
                  onClick={() => canNext && setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Lanjut <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={isSubmitting}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 px-7 py-3 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-emerald-500/25 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" /> Proses Analisis AI Sekarang
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4 Loading Simulation */}
        {step === 4 && !hasil && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[400px] flex-col items-center justify-center text-center p-8 rounded-3xl border border-slate-200 bg-white"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-200 border-t-emerald-500 border-r-green-400"
              >
                <Loader2 className="h-10 w-10 text-emerald-600" />
              </motion.div>
              <motion.span
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-500/30"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-base font-bold text-slate-900"
              >
                {ANALISIS_TEKS[loadingStep]}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-slate-500 mt-2">Menyinkronkan kalkulasi dengan data PostgreSQL & target SDG 8...</p>
            <div className="mt-6 flex gap-1.5">
              <LoadingDots />
            </div>
          </motion.div>
        )}

        {/* Step 4 Results */}
        {step === 4 && hasil && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-400 shadow-xl shadow-emerald-500/30 text-white"
            >
              <TrendingUp className="h-8 w-8" />
            </motion.div>
            <h2 className="mt-5 text-center text-3xl font-extrabold text-slate-900">
              Rekomendasi <span className="text-gradient">Usaha Terbaik untukmu!</span>
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Berdasarkan pemetaan minat, keterampilan, dan budget — pilih jenis usaha di bawah untuk melanjutkan ke simulasi kalkulator modal & break-even.
            </p>

            <div className="mt-8 space-y-4">
              {hasil.map((r, i) => {
                const rank = i === 0 ? "Paling Kompatibel (Top Match)" : i === 1 ? "Alternatif Kuat" : "Potensi Berkembang";
                const active = pilihan === r.usaha.id;
                return (
                  <motion.button
                    key={r.usaha.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                    onClick={() => setPilihan(r.usaha.id)}
                    className={`relative w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
                      active
                        ? "border-emerald-400/70 bg-gradient-to-br from-emerald-500/20 to-green-500/10 shadow-xl shadow-emerald-500/15 ring-1 ring-emerald-400/30"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {i === 0 && (
                      <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-1 text-[10px] font-extrabold text-slate-950 shadow-md">
                        ⭐ {rank}
                      </span>
                    )}
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-3xl sm:text-4xl ring-1 ring-slate-200">
                        {r.usaha.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            {r.usaha.nama}
                          </h3>
                          <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                            {r.usaha.kategori}
                          </span>
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/30">
                            SDG Score: {r.sdgScore ?? 85}%
                          </span>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                          {r.alasan}
                        </p>
                        <div className="mt-4 space-y-2">
                          <ScoreBar label="Kecocokan minat" value={r.skorMinat} color="from-emerald-500 to-emerald-600" />
                          <ScoreBar label="Kecocokan keahlian" value={r.skorSkill} color="from-green-400 to-emerald-500" />
                          <ScoreBar label="Kecocokan budget modal" value={r.skorBudget} color="from-emerald-400 to-green-500" />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-xl bg-emerald-500/20 px-3 py-1 font-bold text-emerald-600 ring-1 ring-emerald-400/30">
                            Skor Keseluruhan: {r.skor}/100
                          </span>
                          <span className="rounded-xl bg-slate-50 px-3 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
                            Estimasi Modal: ± {formatRupiah(r.estimasiModal)}
                          </span>
                          <span className="rounded-xl bg-slate-50 px-3 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
                            Proyeksi Kerja: ~{r.lapanganKerjaEstimasi ?? 2} orang
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={lanjutKalkulator}
                className="btn-shine inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-400 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/30 transition hover:scale-105 active:scale-95"
              >
                Hitung Modal Usaha Terpilih <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/kalkulator"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Eksplor jenis usaha lain
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
