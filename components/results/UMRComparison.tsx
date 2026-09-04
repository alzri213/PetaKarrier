"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Check,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import { getLocalSessionState, setLocalSessionState } from "@/lib/utils/sessionSync";
import { getUserActiveAnalisis, updateKalkulatorAction } from "@/lib/actions/analisis";

interface UsahaItem {
  id: string;
  nama: string;
  kategori?: string;
  emoji?: string;
  labaEstimasi?: number;
}

interface KotaItem {
  id: string;
  nama: string;
  provinsi?: string;
  umr: number;
}

interface UMRComparisonProps {
  daftarUsaha?: UsahaItem[];
  daftarKota?: KotaItem[];
}

export default function UMRComparison({
  daftarUsaha = [],
  daftarKota = [],
}: UMRComparisonProps) {
  // Available cities — full 34 provinsi UMP/UMR 2024–2025
  const kotaList: KotaItem[] = useMemo(() => {
    if (daftarKota.length > 0) {
      return daftarKota.map((k) => ({ ...k, nama: k.nama.replace(/^Kota\s+/i, "") }));
    }
    return [
      { id: "dki-jakarta",       nama: "DKI Jakarta",          provinsi: "DKI Jakarta",          umr: 5067381 },
      { id: "jawa-barat",        nama: "Jawa Barat",           provinsi: "Jawa Barat",            umr: 2101000 },
      { id: "jawa-tengah",       nama: "Jawa Tengah",          provinsi: "Jawa Tengah",           umr: 2036947 },
      { id: "diy",               nama: "DI Yogyakarta",        provinsi: "DI Yogyakarta",         umr: 2159000 },
      { id: "jawa-timur",        nama: "Jawa Timur",           provinsi: "Jawa Timur",            umr: 2165244 },
      { id: "banten",            nama: "Banten",               provinsi: "Banten",                umr: 2727812 },
      { id: "bali",              nama: "Bali",                 provinsi: "Bali",                  umr: 2713672 },
      { id: "aceh",              nama: "Aceh",                 provinsi: "Aceh",                  umr: 3460672 },
      { id: "sumatera-utara",    nama: "Sumatera Utara",       provinsi: "Sumatera Utara",        umr: 2809915 },
      { id: "sumatera-barat",    nama: "Sumatera Barat",       provinsi: "Sumatera Barat",        umr: 2811000 },
      { id: "riau",              nama: "Riau",                 provinsi: "Riau",                  umr: 3294625 },
      { id: "kepulauan-riau",    nama: "Kepulauan Riau",       provinsi: "Kepulauan Riau",        umr: 3402492 },
      { id: "jambi",             nama: "Jambi",                provinsi: "Jambi",                 umr: 3037121 },
      { id: "sumatera-selatan",  nama: "Sumatera Selatan",     provinsi: "Sumatera Selatan",      umr: 3456874 },
      { id: "bangka-belitung",   nama: "Bangka Belitung",      provinsi: "Bangka Belitung",       umr: 3640000 },
      { id: "bengkulu",          nama: "Bengkulu",             provinsi: "Bengkulu",              umr: 2507079 },
      { id: "lampung",           nama: "Lampung",              provinsi: "Lampung",               umr: 2716497 },
      { id: "kalimantan-barat",  nama: "Kalimantan Barat",     provinsi: "Kalimantan Barat",      umr: 2702616 },
      { id: "kalimantan-tengah", nama: "Kalimantan Tengah",    provinsi: "Kalimantan Tengah",     umr: 3261616 },
      { id: "kalimantan-selatan",nama: "Kalimantan Selatan",   provinsi: "Kalimantan Selatan",    umr: 3149977 },
      { id: "kalimantan-timur",  nama: "Kalimantan Timur",     provinsi: "Kalimantan Timur",      umr: 3360067 },
      { id: "kalimantan-utara",  nama: "Kalimantan Utara",     provinsi: "Kalimantan Utara",      umr: 3361653 },
      { id: "sulawesi-utara",    nama: "Sulawesi Utara",       provinsi: "Sulawesi Utara",        umr: 3545000 },
      { id: "sulawesi-tengah",   nama: "Sulawesi Tengah",      provinsi: "Sulawesi Tengah",       umr: 2914583 },
      { id: "sulawesi-selatan",  nama: "Sulawesi Selatan",     provinsi: "Sulawesi Selatan",      umr: 3434298 },
      { id: "sulawesi-tenggara", nama: "Sulawesi Tenggara",    provinsi: "Sulawesi Tenggara",     umr: 2885964 },
      { id: "sulawesi-barat",    nama: "Sulawesi Barat",       provinsi: "Sulawesi Barat",        umr: 2914583 },
      { id: "gorontalo",         nama: "Gorontalo",            provinsi: "Gorontalo",             umr: 3025100 },
      { id: "ntb",               nama: "Nusa Tenggara Barat",  provinsi: "Nusa Tenggara Barat",   umr: 2371407 },
      { id: "ntt",               nama: "Nusa Tenggara Timur",  provinsi: "Nusa Tenggara Timur",   umr: 2186826 },
      { id: "maluku",            nama: "Maluku",               provinsi: "Maluku",                umr: 3141700 },
      { id: "maluku-utara",      nama: "Maluku Utara",         provinsi: "Maluku Utara",          umr: 3200000 },
      { id: "papua-barat",       nama: "Papua Barat",          provinsi: "Papua Barat",           umr: 3600000 },
      { id: "papua",             nama: "Papua",                provinsi: "Papua",                 umr: 4024270 },
    ];
  }, [daftarKota]);

  // Available businesses
  const usahaList: UsahaItem[] = useMemo(() => {
    if (daftarUsaha.length > 0) {
      return daftarUsaha.map((u) => ({
        ...u,
        nama: u.nama.replace(/\s*\(.*\)/, ""),
      }));
    }
    return [
      { id: "kopi", nama: "Warung Kopi", emoji: "☕", labaEstimasi: 7200000 },
      { id: "kuliner", nama: "Kuliner / Food Truck", emoji: "🍔", labaEstimasi: 8500000 },
      { id: "laundry", nama: "Laundry Kiloan", emoji: "🧺", labaEstimasi: 5800000 },
      { id: "barbershop", nama: "Barbershop Modern", emoji: "💈", labaEstimasi: 6400000 },
      { id: "fotocopy", nama: "Jasa Fotokopi & ATK", emoji: "🖨️", labaEstimasi: 6100000 },
    ];
  }, [daftarUsaha]);

  // Selected state — restored from localStorage
  const [selectedKotaId, setSelectedKotaId] = useState<string>("dki-jakarta");
  const [selectedUsahaId, setSelectedUsahaId] = useState<string>(
    daftarUsaha.find((u) => u.id === "kopi" || u.nama.toLowerCase().includes("kopi"))?.id || "kopi"
  );
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState<boolean>(false);
  const [isUsahaModalOpen, setIsUsahaModalOpen] = useState<boolean>(false);

  // Restore from unified local storage & PostgreSQL database on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // 1. Unified local storage
    const unified = getLocalSessionState();
    if (unified) {
      if (unified.selectedKotaId) {
        const match = kotaList.find((k) => k.id === unified.selectedKotaId || k.id.toLowerCase() === unified.selectedKotaId.toLowerCase());
        if (match) setSelectedKotaId(match.id);
      }
      if (unified.selectedUsahaId) {
        const match = usahaList.find((u) => u.id === unified.selectedUsahaId || u.id.toLowerCase() === unified.selectedUsahaId.toLowerCase());
        if (match) setSelectedUsahaId(match.id);
      }
    }

    // 2. PostgreSQL database check
    getUserActiveAnalisis().then((dbData) => {
      if (dbData) {
        if (dbData.kotaId) {
          const targetKota = dbData.kotaId;
          const match = kotaList.find((k) => k.id === targetKota || k.id.toLowerCase() === targetKota.toLowerCase());
          if (match) setSelectedKotaId(match.id);
        }
        if (dbData.usahaId) {
          const targetUsaha = dbData.usahaId;
          const match = usahaList.find((u) => u.id === targetUsaha || u.id.toLowerCase() === targetUsaha.toLowerCase());
          if (match) setSelectedUsahaId(match.id);
        }
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change
  useEffect(() => {
    setLocalSessionState({ selectedKotaId, selectedUsahaId });

    // Background sync to database
    updateKalkulatorAction({
      usahaId: selectedUsahaId,
      kotaId: selectedKotaId,
    }).catch(() => {});
  }, [selectedKotaId, selectedUsahaId]);

  const selectedKota = useMemo(
    () => kotaList.find((k) => k.id === selectedKotaId) || kotaList[0],
    [kotaList, selectedKotaId]
  );

  const selectedUsaha = useMemo(
    () => usahaList.find((u) => u.id === selectedUsahaId) || usahaList[0],
    [usahaList, selectedUsahaId]
  );

  const stats = useMemo(() => {
    const umr = selectedKota.umr;
    const base = selectedUsaha.labaEstimasi || 6400000;
    const factor = umr / 3000000; // normalise around mid-range province
    const profit = Math.round(base * factor * 0.7); // realistic scale

    const ratio = Number((profit / umr).toFixed(2));
    const selisihPct = Math.round(((profit - umr) / umr) * 100);
    const umrBarPct = 38;
    const profitBarPct = Math.min(95, Math.round(umrBarPct * (profit / umr)));

    return { umr, profit, ratio, selisihPct, umrBarPct, profitBarPct };
  }, [selectedKota, selectedUsaha]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* ══════════════════════════════════════════════════════════════════
          TOP HEADER: TITLE, SUBTITLE & CLEAN SINGLE PILL BUTTON ON RIGHT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bandingkan Potensi Usaha dengan UMR
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Apakah memulai usaha mandiri lebih menguntungkan dibanding upah minimum regional saat ini?
          </p>
        </div>

        {/* Right Single Clean Pill: Surabaya (2024) / City Switcher */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 shadow-sm transition hover:border-[#00df82] hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:bg-slate-900/80 dark:text-[#00df82] dark:hover:border-[#00df82]"
          >
            <MapPin className="h-4 w-4 text-[#00df82]" />
            <span>{selectedKota.nama} (2024)</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#00df82] transition-transform duration-200" />
          </button>

          {/* City Selector Dropdown */}
          <AnimatePresence>
            {isCitySelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 z-50 w-64 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-[#0a0f1d]"
              >
                <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  Pilih Kota Domisili
                </div>
                {kotaList.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      setSelectedKotaId(k.id);
                      setIsCitySelectorOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      selectedKotaId === k.id
                        ? "bg-[#00df82]/15 text-[#00df82] font-bold"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{k.nama}</span>
                    {selectedKotaId === k.id && <Check className="h-4 w-4 text-[#00df82]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TOP TWO COMPARISON CARDS: SIDE BY SIDE
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Card: STANDAR UPAH MINIMUM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[2.2rem] border border-slate-200 bg-white p-7 sm:p-8 shadow-xl dark:border-slate-800/90 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors flex flex-col justify-between"
        >
          <div>
            {/* Top Tag & Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                STANDAR UPAH MINIMUM
              </span>
              <span className="rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-3 py-0.5 text-[11px] font-bold text-[#f59e0b]">
                Terverifikasi
              </span>
            </div>

            {/* Title & Big Amount */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              UMR {selectedKota.nama} 2024
            </h2>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              {formatRupiah(stats.umr)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pemasukan kotor bulanan rata-rata pekerja formal.
            </p>
          </div>

          {/* Progress / Benchmark Bar */}
          <div className="mt-8 space-y-2">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-900/90 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.umrBarPct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-[#f59e0b]"
              />
            </div>
            <span className="block text-xs text-slate-400 dark:text-slate-500">
              Tolak Ukur Upah Regional
            </span>
          </div>
        </motion.div>

        {/* Right Card: ESTIMASI HASIL USAHA (Active Green Border) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[2.2rem] border-2 border-[#00df82] bg-white p-7 sm:p-8 shadow-xl shadow-emerald-500/10 dark:border-[#00df82] dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors flex flex-col justify-between"
        >
          <div>
            {/* Top Tag & Switchable Business Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-[#00df82]">
                ESTIMASI HASIL USAHA
              </span>

              {/* Floating Dropdown Trigger Container */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUsahaModalOpen(!isUsahaModalOpen)}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-400/50 px-3 py-1 text-[11px] font-bold text-emerald-700 hover:border-emerald-500 transition shadow-sm cursor-pointer dark:bg-[#051d14] dark:border-[#00df82]/40 dark:text-[#00df82] dark:hover:border-[#00df82]"
                >
                  <span>{selectedUsaha.nama}</span>
                  <ChevronDown className={`h-3 w-3 text-[#00df82] transition-transform duration-200 ${isUsahaModalOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Usaha Overlay (Nimpa di atas card tanpa dorong layout) */}
                <AnimatePresence>
                  {isUsahaModalOpen && (
                    <>
                      {/* Click outside backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUsahaModalOpen(false)}
                      />

                      {/* Floating Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl border border-emerald-500/40 bg-white dark:bg-[#0a0f1d] p-3 shadow-2xl backdrop-blur-md"
                      >
                        <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-2">
                          Pilih Jenis Rencana Usaha
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {usahaList.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setSelectedUsahaId(u.id);
                                setIsUsahaModalOpen(false);
                              }}
                              className={`flex items-center justify-between text-left text-xs px-3 py-2 rounded-xl transition ${
                                selectedUsahaId === u.id
                                  ? "bg-[#00df82] text-slate-950 font-bold shadow-sm"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <span className="truncate">{u.nama}</span>
                              {selectedUsahaId === u.id && <Check className="h-3.5 w-3.5 shrink-0 ml-1" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Title & Big Amount */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Estimasi Profit Bulanan
            </h2>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-[#00df82] tracking-tight mb-2">
              {formatRupiah(stats.profit)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimasi laba bersih setelah dikurangi operasional reguler.
            </p>
          </div>

          {/* Progress / Benchmark Bar */}
          <div className="mt-8 space-y-2">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-900/90 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.profitBarPct}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-full rounded-full bg-[#00df82] shadow-sm shadow-emerald-500/50"
              />
            </div>
            <span className="block text-xs font-bold text-emerald-600 dark:text-[#00df82]">
              {stats.selisihPct >= 0
                ? `Lebih Tinggi ${stats.selisihPct}% dari UMR`
                : `Di Bawah UMR (${Math.abs(stats.selisihPct)}%)`}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM CARD: RASIO KEUNTUNGAN & SDG 8 NARRATIVE
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-[2.2rem] border border-slate-200 bg-white p-7 sm:p-9 shadow-xl dark:border-slate-800/90 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Big Ratio Highlight */}
          <div className="lg:col-span-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              RASIO KEUNTUNGAN
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-[#00df82] tracking-tight">
                {stats.ratio}×
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                UMR
              </span>
            </div>
          </div>

          {/* Right Column: Narrative & SDG 8 Badges */}
          <div className="lg:col-span-8 space-y-3.5">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
              Potensi keuntungan bersih usaha mandiri{" "}
              <b className="font-extrabold text-emerald-600 dark:text-[#00df82]">
                {selectedUsaha.nama}
              </b>{" "}
              di {selectedKota.nama} setara dengan{" "}
              <b className="font-extrabold text-emerald-600 dark:text-[#00df82]">
                {stats.ratio}× UMR {selectedKota.nama}
              </b>
              , dengan kalkulasi estimasi modal awal kembali penuh dalam tempo 8 bulan operasional konsisten.
            </p>

            {/* SDG 8 Row */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 pb-0.5">
              <span className="rounded-md bg-[#00df82] px-2 py-0.5 text-[11px] font-extrabold text-slate-950">
                SDG 8
              </span>
              <span className="rounded-md bg-[#f59e0b]/20 border border-[#f59e0b]/40 px-2 py-0.5 text-[11px] font-extrabold text-[#f59e0b]">
                Target 8.3
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Mendukung kewirausahaan, kreativitas, dan inovasi usaha mikro.
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Modal awal usahamu setara dengan sekitar 1,5 bulan UMR {selectedKota.nama} — potensi baliknya{" "}
              <b className="font-extrabold text-emerald-600 dark:text-[#00df82]">lebih cepat</b> dibanding rata-rata usaha sejenis.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
