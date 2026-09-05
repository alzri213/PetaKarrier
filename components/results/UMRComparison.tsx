"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  Check,
  Search,
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

import { kotaSeedList, jenisUsahaSeedList } from "@/prisma/seed-data";

export default function UMRComparison({
  daftarUsaha = [],
  daftarKota = [],
}: UMRComparisonProps) {
  const [rawKota, setRawKota] = useState<KotaItem[]>(
    daftarKota.length > 0 ? daftarKota : (kotaSeedList as unknown as KotaItem[])
  );
  const [rawUsaha, setRawUsaha] = useState<UsahaItem[]>(
    daftarUsaha.length > 0
      ? daftarUsaha
      : (jenisUsahaSeedList as unknown as UsahaItem[])
  );

  // Fetch directly from database APIs if not preloaded
  useEffect(() => {
    if (daftarKota.length === 0) {
      fetch("/api/kota")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data && json.data.length > 0) {
            setRawKota(json.data);
          }
        })
        .catch(() => {});
    }

    if (daftarUsaha.length === 0) {
      fetch("/api/usaha")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data && json.data.length > 0) {
            setRawUsaha(json.data);
          }
        })
        .catch(() => {});
    }
  }, [daftarKota.length, daftarUsaha.length]);

  // Available cities — data lengkap 38 provinsi UMR dari database
  const kotaList: KotaItem[] = useMemo(() => {
    return rawKota.map((k) => ({ ...k, nama: k.nama.replace(/^Kota\s+/i, "") }));
  }, [rawKota]);

  // Available businesses — dari database
  const usahaList: UsahaItem[] = useMemo(() => {
    return rawUsaha.map((u) => ({
      ...u,
      nama: u.nama.replace(/\s*\(.*\)/, ""),
      labaEstimasi: u.labaEstimasi ?? 7200000,
    }));
  }, [rawUsaha]);

  // Selected state — restored from localStorage
  const [selectedKotaId, setSelectedKotaId] = useState<string>("dki-jakarta");
  const [selectedUsahaId, setSelectedUsahaId] = useState<string>(
    daftarUsaha.find((u) => u.id === "kopi" || u.nama.toLowerCase().includes("kopi"))?.id || "kopi"
  );
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState<boolean>(false);
  const [isUsahaModalOpen, setIsUsahaModalOpen] = useState<boolean>(false);
  const [citySearch, setCitySearch] = useState("");
  const [usahaSearch, setUsahaSearch] = useState("");

  const filteredCities = kotaList.filter((kota) =>
    kota.nama.toLowerCase().includes(citySearch.trim().toLowerCase())
  );
  const filteredBusinesses = usahaList.filter((usaha) =>
    usaha.nama.toLowerCase().includes(usahaSearch.trim().toLowerCase())
  );

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
            onClick={() => {
              setIsCitySelectorOpen(!isCitySelectorOpen);
              setCitySearch("");
            }}
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
                className="absolute left-0 right-auto mt-2 z-50 w-64 max-w-[calc(100vw-2rem)] max-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-[#0a0f1d] sm:left-auto sm:right-0"
              >
                <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  Pilih Kota Domisili
                </div>
                <div className="relative mb-1.5">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={citySearch}
                    onChange={(event) => setCitySearch(event.target.value)}
                    placeholder="Cari kota..."
                    autoFocus
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {filteredCities.length > 0 ? filteredCities.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => {
                        setSelectedKotaId(k.id);
                        setIsCitySelectorOpen(false);
                        setCitySearch("");
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                        selectedKotaId === k.id
                          ? "bg-[#00df82] text-slate-950 font-bold"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{k.nama}</span>
                      {selectedKotaId === k.id && <Check className="h-4 w-4" />}
                    </button>
                  )) : (
                    <p className="px-3 py-3 text-xs text-slate-400">Kota tidak ditemukan.</p>
                  )}
                </div>
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
                  onClick={() => {
                    setIsUsahaModalOpen(!isUsahaModalOpen);
                    setUsahaSearch("");
                  }}
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
                        className="absolute right-0 left-auto top-full z-50 mt-2 w-[320px] max-w-[calc(100vw-2rem)] max-h-96 overflow-hidden rounded-2xl border border-emerald-500/40 bg-white p-3 shadow-2xl backdrop-blur-md dark:bg-[#0a0f1d]"
                      >
                        <p className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-2">
                          Pilih Jenis Rencana Usaha
                        </p>
                        <div className="relative mb-2">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          <input
                            value={usahaSearch}
                            onChange={(event) => setUsahaSearch(event.target.value)}
                            placeholder="Cari jenis usaha..."
                            autoFocus
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid max-h-64 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
                          {filteredBusinesses.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setSelectedUsahaId(u.id);
                                setIsUsahaModalOpen(false);
                                setUsahaSearch("");
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
