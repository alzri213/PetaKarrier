"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Compass,
  Calculator,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { KategoriUsaha, ProfilUser, Rekomendasi } from "@/types";
import { submitAnalisisAction, getUserActiveAnalisis } from "@/lib/actions/analisis";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import { getLocalSessionState, setLocalSessionState } from "@/lib/utils/sessionSync";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { kotaSeedList } from "@/prisma/seed-data";

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

// Fallback 38 Provinsi Indonesia (dari database Kemenaker UMR)
const DAFTAR_PROVINSI_FALLBACK = kotaSeedList.map((k) => ({
  id: k.id,
  nama: k.nama,
  wilayah: k.wilayah,
}));

// UI skill labels mapped to actual data tags used in JenisUsaha database
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
  "Mencocokkan karakteristik dengan data usaha & standar upah 38 provinsi...",
  "Mengalkulasi kelayakan modal awal dan proyeksi risiko...",
  "Menyusun rekomendasi siap eksekusi...",
];

const LS_FORM_KEY = "petakarier_analisis_form";

export default function QuestionnaireForm() {
  const router = useRouter();

  // Active step: 0 = Minat & Skill, 1 = Modal Awal & Detail
  const [step, setStep] = useState<number>(0);

  // Form Fields — restored from localStorage on mount
  const [minat, setMinat] = useState<KategoriUsaha[]>([]);
  const [keahlian, setKeahlian] = useState<string>("");
  const [modalValue, setModalValue] = useState<number>(12_000_000);
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("");
  const [waktu, setWaktu] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [daftarProvinsi, setDaftarProvinsi] = useState<{ id: string; nama: string; wilayah?: string }[]>(DAFTAR_PROVINSI_FALLBACK);

  // Fetch 38 provinsi dari API database
  useEffect(() => {
    fetch("/api/kota")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDaftarProvinsi(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Restore form state from localStorage & database on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_FORM_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.minat)          setMinat(data.minat);
        if (data.keahlian)       setKeahlian(data.keahlian);
        if (data.modalValue)     setModalValue(data.modalValue);
        if (data.selectedProvinsi) setSelectedProvinsi(data.selectedProvinsi);
        if (data.waktu)          setWaktu(data.waktu);
        if (data.selectedSkills) setSelectedSkills(data.selectedSkills);
        if (data.step !== undefined) setStep(data.step);
      } else {
        const unified = getLocalSessionState();
        if (unified?.profil) {
          if (unified.profil.minat) setMinat(unified.profil.minat as KategoriUsaha[]);
          if (unified.profil.budget) setModalValue(unified.profil.budget);
          if (unified.profil.waktu) setWaktu(unified.profil.waktu);
          if (unified.profil.pengalaman) setKeahlian(unified.profil.pengalaman);
          if (unified.selectedKotaId) setSelectedProvinsi(unified.selectedKotaId);
        }
      }
    } catch {}

    // Check database for logged in user's latest analysis
    getUserActiveAnalisis().then((dbAnalisis) => {
      if (dbAnalisis) {
        if (dbAnalisis.minat && dbAnalisis.minat.length > 0) {
          setMinat(dbAnalisis.minat as KategoriUsaha[]);
        }
        if (dbAnalisis.budget) setModalValue(dbAnalisis.budget);
        if (dbAnalisis.waktu) setWaktu(dbAnalisis.waktu);
        if (dbAnalisis.pengalaman) setKeahlian(dbAnalisis.pengalaman);
        if (dbAnalisis.kotaId) setSelectedProvinsi(dbAnalisis.kotaId);

        setLocalSessionState({
          analisisId: dbAnalisis.id,
          selectedUsahaId: dbAnalisis.usahaId || "kedai-kopi",
          selectedKotaId: dbAnalisis.kotaId || "dki-jakarta",
          skala: dbAnalisis.skala || "sedang",
          profil: {
            minat: dbAnalisis.minat,
            skill: dbAnalisis.skill,
            budget: dbAnalisis.budget,
            waktu: dbAnalisis.waktu,
            pengalaman: dbAnalisis.pengalaman,
          },
          rekomendasi: (dbAnalisis.rekomendasi as any) || undefined,
        });
      }
    }).catch(() => {});
  }, []);

  // Persist form state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(LS_FORM_KEY, JSON.stringify({
        step, minat, keahlian, modalValue, selectedProvinsi, waktu, selectedSkills,
      }));
    } catch {}
  }, [step, minat, keahlian, modalValue, selectedProvinsi, waktu, selectedSkills]);

  // Loading & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

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
    if (!selectedProvinsi) {
      toast.error("Pilih provinsi domisili / target operasional.");
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

    const resolvedSkillTags = selectedSkills.flatMap((label) => {
      const found = SKILL_TAGS.find((st) => st.label === label);
      return found ? found.dataTags : [];
    });
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

      const defaultUsahaId = res.rekomendasi[0]?.usaha.id || "kedai-kopi";

      setLocalSessionState({
        analisisId: res.id,
        profil,
        rekomendasi: res.rekomendasi,
        selectedUsahaId: defaultUsahaId,
        selectedKotaId: selectedProvinsi || "dki-jakarta",
        modalAwal: modalValue,
      });

      localStorage.setItem(
        "PetaKarrier-profil",
        JSON.stringify({
          profil,
          analisisId: res.id,
          provinsi: selectedProvinsi,
          rekomendasi: res.rekomendasi,
        })
      );
      // Clear temporary draft form state after successful submit
      localStorage.removeItem(LS_FORM_KEY);
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
                      <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                        Pilih Bidang Usaha yang Anda Minati
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                        Pilih satu atau lebih bidang yang sesuai dengan minat Anda
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {KATEGORI_LIST.map((k) => {
                          const isSelected = minat.includes(k.key);
                          return (
                            <button
                              key={k.key}
                              type="button"
                              onClick={() => toggleMinat(k.key)}
                              className={`rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 text-center ${
                                isSelected
                                  ? "bg-[#00df82] text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/60 font-bold scale-[0.98]"
                                  : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-slate-950 active:scale-95 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800 dark:hover:text-white"
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
                      <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                        Bagaimana Tingkat Keahlian Teknis Anda?
                      </label>
                      <SearchableSelect
                        value={keahlian}
                        onChange={setKeahlian}
                        placeholder="Pilih tingkat keahlian"
                        options={KEAHLIAN_OPTIONS}
                      />
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

                    {/* Field 1: Provinsi Domisili Target */}
                    <div className="space-y-3">
                      <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                        Pilih Provinsi Domisili / Target Operasional
                      </label>
                      <SearchableSelect
                        value={selectedProvinsi}
                        onChange={setSelectedProvinsi}
                        placeholder="Pilih provinsi"
                        options={daftarProvinsi.map((provinsi) => ({
                          value: provinsi.id,
                          label: provinsi.wilayah ? `${provinsi.nama} (${provinsi.wilayah})` : provinsi.nama,
                        }))}
                      />
                    </div>

                    {/* Field 2: Komitmen Waktu */}
                    <div className="space-y-3">
                      <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
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
                      <label className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                        Keahlian Spesifik yang Dimiliki
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {SKILL_TAGS.map((s) => {
                          const isSkillActive = selectedSkills.includes(s.label);
                          return (
                            <button
                              key={s.label}
                              type="button"
                              onClick={() => toggleSkill(s.label)}
                              className={`min-h-10 rounded-lg px-2.5 py-2 text-center text-[11px] font-semibold leading-tight transition sm:text-xs ${
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
                    <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] items-stretch gap-2 pt-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-2 text-[10px] font-bold leading-none text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:min-h-12 sm:gap-2 sm:px-5 sm:text-sm"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleProcessAnalysis}
                        className="group flex min-h-12 min-w-0 items-center justify-center gap-1 rounded-xl bg-[#00df82] px-2 py-2 text-center text-[10px] font-bold leading-none text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-[#00c975] active:scale-[0.99] sm:min-h-12 sm:gap-2 sm:px-4 sm:text-sm"
                      >
                        <Compass className="h-4 w-4" />
                        <span className="whitespace-nowrap">Analisis & Cocokkan Usaha</span>
                      </button>
                    </div>
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
