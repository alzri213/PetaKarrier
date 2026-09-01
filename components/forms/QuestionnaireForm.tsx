"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Loader2,
  Sparkles,
  Calculator,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { KategoriUsaha, ProfilUser, Rekomendasi } from "@/types";
import { submitAnalisisAction } from "@/lib/actions/analisis";
import { formatRupiah } from "@/lib/utils/formatCurrency";

interface KategoriItem {
  key: KategoriUsaha;
  label: string;
}

const KATEGORI_LIST: KategoriItem[] = [
  { key: "Kuliner", label: "Culinary (Kuliner)" },
  { key: "Fashion", label: "Fashion (Pakaian)" },
  { key: "Jasa", label: "Services (Jasa)" },
  { key: "Agribisnis", label: "Agriculture (Pertanian)" },
  { key: "Digital", label: "Technology (Teknologi)" },
  { key: "Kreatif", label: "Crafts (Kerajinan & Kreatif)" },
  { key: "Kecantikan", label: "Beauty (Kecantikan)" },
  { key: "Pendidikan", label: "Education (Pendidikan)" },
];

const KEAHLIAN_OPTIONS = [
  { value: "pemula", label: "Pemula (Siap Belajar dari Nol)" },
  { value: "menengah", label: "Menengah (Pernah Praktik / Bekerja)" },
  { value: "mahir", label: "Mahir (Pengalaman Industri & Manajemen)" },
];

const PRESET_TIERS = [
  { label: "< Rp 5 Juta", value: 3_500_000 },
  { label: "Rp 5–20 Juta", value: 12_000_000 },
  { label: "Rp 20–50 Juta", value: 35_000_000 },
  { label: "> Rp 50 Juta", value: 65_000_000 },
];

const DAFTAR_KOTA = [
  { id: "jakarta", nama: "DKI Jakarta" },
  { id: "bandung", nama: "Bandung" },
  { id: "surabaya", nama: "Surabaya" },
  { id: "yogyakarta", nama: "Yogyakarta" },
  { id: "medan", nama: "Medan" },
  { id: "makassar", nama: "Makassar" },
  { id: "bali", nama: "Denpasar / Bali" },
  { id: "semarang", nama: "Semarang" },
  { id: "malang", nama: "Malang" },
  { id: "bekasi", nama: "Bekasi" },
  { id: "tangerang", nama: "Tangerang" },
  { id: "depok", nama: "Depok" },
  { id: "bogor", nama: "Bogor" },
  { id: "palembang", nama: "Palembang" },
  { id: "batam", nama: "Batam" },
  { id: "padang", nama: "Padang" },
  { id: "pekanbaru", nama: "Pekanbaru" },
  { id: "balikpapan", nama: "Balikpapan" },
];

// UI skill labels mapped to actual data tags used in jenisUsaha.json
const SKILL_TAGS: { label: string; dataTags: string[] }[] = [
  { label: "Memasak & Racik Minuman", dataTags: ["memasak", "peracik-kopi", "kemasan"] },
  { label: "Desain Grafis & Branding", dataTags: ["desain", "sablon"] },
  { label: "Social Media Marketing", dataTags: ["sosial-media"] },
  { label: "Manajemen Logistik & Stok", dataTags: ["logistik", "manajemen-waktu"] },
  { label: "Pelayanan & Negosiasi", dataTags: ["pelayanan", "negosiasi"] },
  { label: "Teknologi & Web", dataTags: ["teknologi"] },
  { label: "Foto & Video Produk", dataTags: ["fotografi", "editing-video", "foto-produk"] },
  { label: "Ketelitian Finansial", dataTags: ["ketelitian"] },
];

const ANALISIS_STEPS_TEXT = [
  "Membaca profil preferensi dan kompetensi...",
  "Mencocokkan karakteristik dengan 14 sektor usaha terkurasi...",
  "Mengalkulasi kelayakan modal awal dan proyeksi risiko...",
  "Menyusun rekomendasi siap eksekusi...",
];

export default function QuestionnaireForm() {
  const router = useRouter();

  // Active step: 0 = Minat & Skill, 1 = Modal Awal & Detail, 2 = Rekomendasi
  const [step, setStep] = useState<number>(0);

  // Form Fields
  const [minat, setMinat] = useState<KategoriUsaha[]>([]);
  const [keahlian, setKeahlian] = useState<string>("");

  // Smooth continuous modal slider state: 2jt to 80jt
  const [modalValue, setModalValue] = useState<number>(12_000_000);

  const [selectedKota, setSelectedKota] = useState<string>("");
  const [waktu, setWaktu] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Loading & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [hasil, setHasil] = useState<Rekomendasi[] | null>(null);
  const [analisisId, setAnalisisId] = useState<string | null>(null);

  const toggleMinat = (k: KategoriUsaha) => {
    setMinat((prev) =>
      prev.includes(k) ? prev.filter((item) => item !== k) : [...prev, k]
    );
  };

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  // Slider progress percentage for custom fill track (2M to 80M)
  const sliderPercentage = useMemo(() => {
    const min = 2_000_000;
    const max = 80_000_000;
    return Math.max(0, Math.min(100, ((modalValue - min) / (max - min)) * 100));
  }, [modalValue]);

  // Determine active tier label
  const activeTierLabel = useMemo(() => {
    if (modalValue < 5_000_000) return "< Rp 5 Juta";
    if (modalValue <= 20_000_000) return "Rp 5–20 Juta";
    if (modalValue <= 50_000_000) return "Rp 20–50 Juta";
    return "> Rp 50 Juta";
  }, [modalValue]);

  const handleNextToStep2 = () => {
    if (minat.length === 0) {
      toast.error("Pilih minimal 1 bidang usaha yang diminati.");
      return;
    }
    if (!keahlian) {
      toast.error("Pilih tingkat keahlian teknis Anda.");
      return;
    }
    setStep(1);
  };

  const handleProcessAnalysis = async () => {
    if (!selectedKota) {
      toast.error("Pilih kota domisili / target operasional.");
      return;
    }
    if (!waktu) {
      toast.error("Pilih komitmen waktu operasional usaha.");
      return;
    }

    setIsSubmitting(true);
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount < ANALISIS_STEPS_TEXT.length) {
        setLoadingTextIndex(stepCount);
      } else {
        clearInterval(interval);
      }
    }, 600);

    // Map selected UI skill labels to actual data tags used in jenisUsaha.json
    const resolvedSkillTags = selectedSkills.flatMap((label) => {
      const found = SKILL_TAGS.find((st) => st.label === label);
      return found ? found.dataTags : [];
    });
    // Deduplicate
    const uniqueSkillTags = [...new Set(resolvedSkillTags)];

    const profil: ProfilUser = {
      minat,
      skill: uniqueSkillTags,
      budget: modalValue,
      waktu: waktu as "full" | "parttime" | "sampling" | "fleksibel",
      pengalaman: keahlian as "pemula" | "menengah" | "mahir",
    };

    try {
      const res = await submitAnalisisAction(profil);
      if (!res.success || !res.rekomendasi) {
        throw new Error(res.error ?? "Gagal memproses rekomendasi");
      }
      // Store profile and calculated recommendations in localStorage for instant reference
      localStorage.setItem(
        "konekumkm-profil",
        JSON.stringify({
          profil,
          analisisId: res.id,
          kota: selectedKota,
          rekomendasi: res.rekomendasi,
        })
      );
      // Redirect to the dedicated results page
      router.push(`/analisis/${res.id}`);
    } catch (err) {
      clearInterval(interval);
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan analisis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT COLUMN: TITLE, BADGE, AND BULLET CHECKMARKS (Adaptive Light/Dark)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6 pt-2 lg:col-span-5 lg:sticky lg:top-28">
          {/* SDG Badge */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/80 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-md dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-[#00df82]">
              SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-[1.15]">
            Temukan Usaha yang Cocok untuk Anda
          </h1>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base font-normal">
            Melalui algoritma analisis potensi kami, petakan minat, keahlian, dan modal awal Anda untuk mendapatkan rekomendasi bisnis mikro yang paling berkelanjutan dan menguntungkan di wilayah Anda.
          </p>

          {/* Checklist Bullets */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-[#00df82]" />
              <span>Rekomendasi Berdasarkan Tren Lokal</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-[#00df82]" />
              <span>Kalkulasi Risiko yang Realistis</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-[#00df82]" />
              <span>Terhubung Langsung ke Rencana Aksi</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT COLUMN: 3-STEP CARD QUESTIONNAIRE FORM (Adaptive Light/Dark)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-[#0a0f1d]/95 dark:shadow-2xl sm:p-8">
            {/* ══════════════════════════════════════════════════════════════════
                TOP STEPPER NAVIGATION & ANIMATED PROGRESS BAR
            ══════════════════════════════════════════════════════════════════ */}
            <div className="mb-6">
              {/* Stepper Labels */}
              <div className="flex items-center justify-between pb-2">
                <button
                  type="button"
                  onClick={() => !isSubmitting && setStep(0)}
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    step >= 0
                      ? "text-emerald-600 dark:text-[#00df82]"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  1. Minat & Skill
                </button>

                <button
                  type="button"
                  onClick={() => !isSubmitting && minat.length > 0 && setStep(1)}
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    step >= 1 || isSubmitting
                      ? "text-emerald-600 dark:text-[#00df82]"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  2. Modal Awal
                </button>

                <span
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    isSubmitting
                      ? "text-emerald-600 dark:text-[#00df82]"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  3. Rekomendasi
                </span>
              </div>

              {/* Continuous Animated Progress Track */}
              <div className="relative h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/90">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#00df82] shadow-md shadow-emerald-500/40"
                  initial={false}
                  animate={{
                    width: isSubmitting
                      ? "100%"
                      : step === 0
                      ? "33.33%"
                      : "66.66%",
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                />
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                LOADING OVERLAY (DURING SUBMISSION)
            ══════════════════════════════════════════════════════════════════ */}
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-[#00df82]" />
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  {ANALISIS_STEPS_TEXT[loadingTextIndex]}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Mohon tunggu beberapa saat selagi sistem memproses data.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* ── STEP 1: PROFIL MINAT & KOMPETENSI ── */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-7"
                  >
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        Langkah 1: Profil Minat & Kompetensi
                      </h2>
                    </div>

                    {/* Field 1: Pilih Bidang Usaha yang Diminati */}
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Pilih Bidang Usaha yang Anda Minati
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {KATEGORI_LIST.map((k) => {
                          const isSelected = minat.includes(k.key);
                          return (
                            <button
                              key={k.key}
                              type="button"
                              onClick={() => toggleMinat(k.key)}
                              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#00df82] text-slate-950 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50 font-bold"
                                  : "border border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-400 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                              }`}
                            >
                              {k.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Field 2: Tingkat Keahlian Teknis */}
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Bagaimana Tingkat Keahlian Teknis Anda?
                      </label>
                      <div className="relative">
                        <select
                          value={keahlian}
                          onChange={(e) => setKeahlian(e.target.value)}
                          className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium outline-none transition focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900/90 ${keahlian ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                          <option value="" disabled className="bg-white text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                            — Pilih Tingkat Keahlian —
                          </option>
                          {KEAHLIAN_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                      </div>
                    </div>

                    {/* Field 3: Estimasi Modal Maksimal (Smooth Manual Draggable Slider) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Estimasi Modal Maksimal
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-extrabold text-emerald-700 dark:text-[#00df82]">
                            {formatRupiah(modalValue)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            ({activeTierLabel})
                          </span>
                        </div>
                      </div>

                      {/* Smooth Manual Range Slider */}
                      <div className="relative py-2">
                        <input
                          type="range"
                          min={2_000_000}
                          max={80_000_000}
                          step={1_000_000}
                          value={modalValue}
                          onChange={(e) => setModalValue(Number(e.target.value))}
                          aria-label="Estimasi Modal Maksimal Slider"
                          className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-[#00df82]"
                          style={{
                            background: `linear-gradient(to right, #00df82 0%, #00df82 ${sliderPercentage}%, rgba(148, 163, 184, 0.25) ${sliderPercentage}%, rgba(148, 163, 184, 0.25) 100%)`,
                          }}
                        />
                      </div>

                      {/* Quick Tier Markers */}
                      <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {PRESET_TIERS.map((tier) => (
                          <button
                            key={tier.label}
                            type="button"
                            onClick={() => setModalValue(tier.value)}
                            className={`transition hover:text-slate-900 dark:hover:text-white ${
                              activeTierLabel === tier.label
                                ? "font-extrabold text-emerald-600 dark:text-[#00df82]"
                                : ""
                            }`}
                          >
                            {tier.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button to Step 2 */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleNextToStep2}
                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99]"
                      >
                        <span>Lanjut ke Langkah 2</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: MODAL AWAL & DETAIL PREFERENSI ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-7"
                  >
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        Langkah 2: Parameter Modal & Wilayah
                      </h2>
                    </div>

                    {/* Field 1: Kota Domisili Target */}
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Pilih Kota Domisili / Target Operasional
                      </label>
                      <div className="relative">
                        <select
                          value={selectedKota}
                          onChange={(e) => setSelectedKota(e.target.value)}
                          className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium outline-none transition focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900/90 ${selectedKota ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                        >
                          <option value="" disabled className="bg-white text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                            — Pilih Kota Domisili —
                          </option>
                          {DAFTAR_KOTA.map((k) => (
                            <option key={k.id} value={k.id} className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
                              {k.nama}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                      </div>
                    </div>

                    {/* Field 2: Komitmen Waktu */}
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Komitmen Waktu Operasional Usaha
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { id: "full", label: "Full-Time", sub: "Fokus Penuh" },
                          { id: "parttime", label: "Part-Time", sub: "Sampingan" },
                          { id: "sampling", label: "Fleksibel", sub: "Uji Pasar" },
                        ].map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => setWaktu(w.id)}
                            className={`rounded-2xl border p-3 text-center transition ${
                              waktu === w.id
                                ? "border-[#00df82] bg-emerald-50 text-emerald-950 ring-1 ring-[#00df82] dark:bg-emerald-950/40 dark:text-white"
                                : "border-slate-200 bg-slate-100/70 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <p className="text-xs font-bold">{w.label}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{w.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 3: Keahlian Spesifik */}
                    <div className="space-y-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Keahlian Spesifik yang Dimiliki
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_TAGS.map((s) => {
                          const isSkillActive = selectedSkills.includes(s.label);
                          return (
                            <button
                              key={s.label}
                              type="button"
                              onClick={() => toggleSkill(s.label)}
                              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                isSkillActive
                                  ? "bg-[#00df82] text-slate-950 font-bold"
                                  : "border border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600"
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleProcessAnalysis}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99]"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Analisis & Cocokkan Usaha</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: HASIL REKOMENDASI USAHA (REDESIGNED) ── */}
                {step === 2 && hasil && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-8"
                  >
                    {/* Header */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-[#00df82] dark:border-emerald-500/30">
                        SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi
                      </span>

                      <h2 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Rekomendasi Usaha untuk Anda
                      </h2>

                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        Berdasarkan analisis algoritma potensi mandiri yang disesuaikan dengan minat bidang {minat.join(", ").toLowerCase()}, keahlian {keahlian}, dan estimasi modal yang Anda miliki.
                      </p>
                    </div>

                    {/* 3 Recommendation Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {hasil.slice(0, 3).map((item, idx) => {
                        const badgeLabels = [
                          { text: "Potensi Tinggi", color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-[#00df82] dark:border-emerald-500/40" },
                          { text: "Modal Ringan", color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-[#00df82] dark:border-emerald-500/40" },
                          { text: "Risiko Rendah", color: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-[#00df82] dark:border-emerald-500/40" },
                        ];
                        const badge = badgeLabels[idx] || badgeLabels[0];

                        const iconPaths = [
                          // Store/shop icon
                          <path key="p" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
                          // Clipboard icon
                          <><path key="p1" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect key="p2" x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
                          // Briefcase icon
                          <><rect key="p1" x="2" y="7" width="20" height="14" rx="2" ry="2" /><path key="p2" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
                        ];

                        return (
                          <motion.div
                            key={item.usaha.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition-all hover:border-emerald-400/60 hover:shadow-lg dark:border-slate-800 dark:bg-[#0c111f] dark:hover:border-emerald-500/50"
                          >
                            {/* Top Row: Icon + Badge */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-emerald-600 dark:text-[#00df82]"
                                >
                                  {iconPaths[idx] || iconPaths[0]}
                                </svg>
                              </div>

                              <span className={`rounded-full border px-3 py-0.5 text-[10px] font-extrabold ${badge.color}`}>
                                {badge.text}
                              </span>
                            </div>

                            {/* Business Name */}
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                              {item.usaha.nama}
                            </h3>

                            {/* Description */}
                            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex-1">
                              {item.usaha.deskripsi}
                            </p>

                            {/* Modal Estimate */}
                            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                ESTIMASI MODAL AWAL
                              </span>
                              <p className="mt-0.5 text-base font-extrabold text-emerald-600 dark:text-[#00df82]">
                                {formatRupiah(item.usaha.modalMin)}–{formatRupiah(item.usaha.modalMax)}
                              </p>
                            </div>

                            {/* CTA Button */}
                            <button
                              type="button"
                              onClick={() => router.push(`/kalkulator?usahaId=${item.usaha.id}&kota=${selectedKota}`)}
                              className="mt-4 group flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-[#00c975] hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                            >
                              <span>Lanjut ke Kalkulator Modal</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Bottom Info Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c111f]"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Rekomendasi di atas dihitung secara presisi berdasarkan rata-rata pertumbuhan riil wilayah lokal Anda. Klik tombol kelayakan di salah satu opsi untuk menghitung estimasi Break Even Point (BEP) instan.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
