"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  ChevronDown,
  AlertTriangle,
  Coins,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { JenisUsaha, KotaData } from "@/types";
import { formatRupiah } from "@/lib/utils/formatCurrency";

interface ModalCalculatorProps {
  daftarUsaha?: JenisUsaha[];
  daftarKota?: KotaData[];
}

export default function ModalCalculator({
  daftarUsaha = [],
  daftarKota = [],
}: ModalCalculatorProps) {
  const searchParams = useSearchParams();
  const queryUsahaId = searchParams.get("usahaId") || searchParams.get("id");
  const queryKotaId = searchParams.get("kota") || searchParams.get("kotaId");

  // Fallback defaults if props are empty
  const usahaList = useMemo(() => {
    if (daftarUsaha.length > 0) return daftarUsaha;
    return [
      { id: "jasa-web-digital", nama: "Agensi Web & Software House", emoji: "💻", modalMin: 10000000, modalMax: 35000000, peralatan: 15000000, bahanBakuBulanan: 1000000, gajiKaryawan: 1500000, promosiBulanan: 800000, revenueBulanan: 18000000, marginBulanan: 9500000 },
      { id: "kedai-kopi", nama: "Kedai Kopi & Minuman Kekinian", emoji: "☕", modalMin: 15000000, modalMax: 40000000, peralatan: 12000000, bahanBakuBulanan: 3000000, gajiKaryawan: 1500000, promosiBulanan: 800000, revenueBulanan: 15000000, marginBulanan: 6000000 },
      { id: "distro-thrift", nama: "Distro & Thrift Terkurasi", emoji: "👕", modalMin: 10000000, modalMax: 30000000, peralatan: 6000000, bahanBakuBulanan: 5000000, gajiKaryawan: 500000, promosiBulanan: 700000, revenueBulanan: 14000000, marginBulanan: 4500000 },
      { id: "laundry-kiloan", nama: "Laundry Kiloan & Dry Clean", emoji: "🧺", modalMin: 15000000, modalMax: 35000000, peralatan: 15000000, bahanBakuBulanan: 1500000, gajiKaryawan: 1000000, promosiBulanan: 500000, revenueBulanan: 12000000, marginBulanan: 5500000 },
    ];
  }, [daftarUsaha]);

  const kotaList = useMemo(() => {
    if (daftarKota.length > 0) return daftarKota;
    return [
      { id: "jakarta", nama: "DKI Jakarta", provinsi: "DKI Jakarta", umr: 5067381, sewaTempat: 1500000, utilitas: 600000, retribusi: 150000 },
      { id: "surabaya", nama: "Surabaya", provinsi: "Jawa Timur", umr: 4725479, sewaTempat: 1100000, utilitas: 450000, retribusi: 100000 },
      { id: "bandung", nama: "Bandung", provinsi: "Jawa Barat", umr: 4209389, sewaTempat: 950000, utilitas: 400000, retribusi: 90000 },
      { id: "yogyakarta", nama: "Yogyakarta", provinsi: "DI Yogyakarta", umr: 2417495, sewaTempat: 750000, utilitas: 300000, retribusi: 60000 },
      { id: "medan", nama: "Medan", provinsi: "Sumatera Utara", umr: 3228949, sewaTempat: 900000, utilitas: 400000, retribusi: 80000 },
      { id: "makassar", nama: "Makassar", provinsi: "Sulawesi Selatan", umr: 3921088, sewaTempat: 900000, utilitas: 400000, retribusi: 80000 },
      { id: "bali", nama: "Denpasar (Bali)", provinsi: "Bali", umr: 3207459, sewaTempat: 1200000, utilitas: 500000, retribusi: 100000 },
    ];
  }, [daftarKota]);

  // Determine initial matched usaha & kota
  const initialUsaha = useMemo(() => {
    if (queryUsahaId) {
      const found = usahaList.find((u) => u.id === queryUsahaId || u.id.toLowerCase() === queryUsahaId.toLowerCase());
      if (found) return found;
    }
    return usahaList[0];
  }, [queryUsahaId, usahaList]);

  const initialKota = useMemo(() => {
    if (queryKotaId) {
      const found = kotaList.find((k) => k.id === queryKotaId || k.id.toLowerCase() === queryKotaId.toLowerCase());
      if (found) return found;
    }
    return kotaList[0];
  }, [queryKotaId, kotaList]);

  const [selectedUsahaId, setSelectedUsahaId] = useState<string>(initialUsaha?.id || usahaList[0]?.id || "jasa-web-digital");
  const [selectedKotaId, setSelectedKotaId] = useState<string>(initialKota?.id || kotaList[0]?.id || "jakarta");

  // Calculate default numbers based on selected business & city
  const initialModalVal = initialUsaha?.modalMin ? Math.round((initialUsaha.modalMin + initialUsaha.modalMax) / 2) : 20000000;
  const initialOpsVal = initialUsaha?.bahanBakuBulanan ? (initialUsaha.bahanBakuBulanan + initialUsaha.gajiKaryawan + initialUsaha.promosiBulanan + (initialKota?.utilitas || 600000)) : 6500000;

  const [modalAwal, setModalAwal] = useState<number>(initialModalVal);
  const [modalAwalStr, setModalAwalStr] = useState<string>(initialModalVal.toLocaleString("id-ID"));
  const [operasional, setOperasional] = useState<number>(initialOpsVal);
  const [operasionalStr, setOperasionalStr] = useState<string>(initialOpsVal.toLocaleString("id-ID"));
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Synchronize when query params change or component mounts
  useEffect(() => {
    if (queryUsahaId) {
      const matchedUsaha = usahaList.find((u) => u.id === queryUsahaId || u.id.toLowerCase() === queryUsahaId.toLowerCase());
      if (matchedUsaha) {
        setSelectedUsahaId(matchedUsaha.id);
        const avgModal = Math.round((matchedUsaha.modalMin + matchedUsaha.modalMax) / 2);
        const ops = (matchedUsaha.bahanBakuBulanan || 1000000) + (matchedUsaha.gajiKaryawan || 0) + (matchedUsaha.promosiBulanan || 500000) + 600000;
        setModalAwal(avgModal);
        setModalAwalStr(avgModal.toLocaleString("id-ID"));
        setOperasional(ops);
        setOperasionalStr(ops.toLocaleString("id-ID"));
      }
    }
    if (queryKotaId) {
      const matchedKota = kotaList.find((k) => k.id === queryKotaId || k.id.toLowerCase() === queryKotaId.toLowerCase());
      if (matchedKota) {
        setSelectedKotaId(matchedKota.id);
      }
    }
  }, [queryUsahaId, queryKotaId, usahaList, kotaList]);

  // Handler when user selects a different usaha from the select dropdown
  const handleSelectUsaha = (usahaId: string) => {
    setSelectedUsahaId(usahaId);
    const chosenUsaha = usahaList.find((u) => u.id === usahaId);
    if (chosenUsaha) {
      const avgModal = Math.round((chosenUsaha.modalMin + chosenUsaha.modalMax) / 2);
      const ops = (chosenUsaha.bahanBakuBulanan || 1000000) + (chosenUsaha.gajiKaryawan || 0) + (chosenUsaha.promosiBulanan || 500000) + 600000;
      setModalAwal(avgModal);
      setModalAwalStr(avgModal.toLocaleString("id-ID"));
      setOperasional(ops);
      setOperasionalStr(ops.toLocaleString("id-ID"));
    }
  };

  // Selected entities
  const selectedKota = useMemo(
    () => kotaList.find((k) => k.id === selectedKotaId) || kotaList[0],
    [kotaList, selectedKotaId]
  );

  // Dynamic calculations for Break-Even Point
  const calculations = useMemo(() => {
    // Net profit estimation per month
    const marginRatio = 0.42; // ~42% gross margin
    const estimatedMonthlyRevenue = Math.max(operasional * 1.65, 14000000);
    const netProfitPerMonth = Math.max(estimatedMonthlyRevenue * marginRatio - operasional * 0.25, 5500000);

    const bepMonth = Math.max(4, Math.min(18, Math.ceil(modalAwal / netProfitPerMonth)));

    // Generate 6 sample months around the BEP milestone
    const m1 = 1;
    const m2 = Math.max(2, Math.round(bepMonth * 0.35));
    const m3 = Math.max(3, Math.round(bepMonth * 0.65));
    const m4 = Math.max(4, bepMonth - 1);
    const m5 = bepMonth; // The exact BEP Month
    const m6 = bepMonth + 1; // Post BEP

    const getAccumulatedCashflow = (m: number) => {
      // In early months, cashflow is negative (unrecovered investment)
      return Math.round(netProfitPerMonth * m - modalAwal);
    };

    const formatJt = (val: number) => {
      const inJt = val / 1000000;
      if (val < 0) {
        return `-Rp ${Math.abs(inJt).toFixed(inJt % 1 === 0 ? 0 : 1)}jt`;
      }
      return `Rp ${inJt.toFixed(inJt % 1 === 0 ? 0 : 1)}jt`;
    };

    const bars = [
      {
        monthLabel: `Bln ${m1}`,
        rawVal: getAccumulatedCashflow(m1),
        valLabel: formatJt(getAccumulatedCashflow(m1)),
        isBep: false,
        heightPct: 22,
      },
      {
        monthLabel: `Bln ${m2}`,
        rawVal: getAccumulatedCashflow(m2),
        valLabel: formatJt(getAccumulatedCashflow(m2)),
        isBep: false,
        heightPct: 42,
      },
      {
        monthLabel: `Bln ${m3}`,
        rawVal: getAccumulatedCashflow(m3),
        valLabel: formatJt(getAccumulatedCashflow(m3)),
        isBep: false,
        heightPct: 62,
      },
      {
        monthLabel: `Bln ${m4}`,
        rawVal: getAccumulatedCashflow(m4),
        valLabel: formatJt(getAccumulatedCashflow(m4)),
        isBep: false,
        heightPct: 78,
      },
      {
        monthLabel: `Bln ${m5} (BEP)`,
        rawVal: Math.max(1500000, getAccumulatedCashflow(m5)),
        valLabel: formatJt(Math.max(1500000, getAccumulatedCashflow(m5))),
        isBep: true,
        heightPct: 90,
      },
      {
        monthLabel: `Bln ${m6}`,
        rawVal: getAccumulatedCashflow(m6) + 3000000,
        valLabel: formatJt(getAccumulatedCashflow(m6) + 3000000),
        isBep: false,
        isPostBep: true,
        heightPct: 96,
      },
    ];

    return {
      bepMonth,
      bars,
    };
  }, [modalAwal, operasional]);

  // Form submit handler with smooth feedback
  const handleHitung = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 400);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = Number(raw) || 0;
    setModalAwal(num);
    setModalAwalStr(num.toLocaleString("id-ID"));
  };

  const handleOperasionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = Number(raw) || 0;
    setOperasional(num);
    setOperasionalStr(num.toLocaleString("id-ID"));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT COLUMN: KALKULATOR MODAL & BEP FORM CARD
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl sm:p-8"
        >
          {/* Header text with proper wrap protection */}
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Kalkulator Modal & BEP
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 break-words max-w-full">
              Estimasi waktu kembali modal usaha Anda dengan parameter biaya operasional riil.
            </p>
          </div>

          <form onSubmit={handleHitung} className="space-y-5">
            {/* Field 1: Jenis Rencana Usaha */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Jenis Rencana Usaha
              </label>
              <div className="relative">
                <select
                  value={selectedUsahaId}
                  onChange={(e) => handleSelectUsaha(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-800 dark:bg-[#0f172a] dark:text-white"
                >
                  {usahaList.map((u) => (
                    <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900">
                      {u.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Field 2: Kota Domisili */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kota Domisili
              </label>
              <div className="relative">
                <select
                  value={selectedKotaId}
                  onChange={(e) => setSelectedKotaId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-800 dark:bg-[#0f172a] dark:text-white"
                >
                  {kotaList.map((k) => (
                    <option key={k.id} value={k.id} className="bg-white dark:bg-slate-900">
                      {k.nama}
                    </option>
                  ))}
                </select>
                <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Field 3: Target Modal Awal (Green Border Highlight) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Modal Awal
              </label>
              <div className="flex items-center rounded-xl border-2 border-[#00df82] bg-slate-50 px-4 py-3 shadow-sm transition dark:bg-[#0f172a]">
                <span className="font-bold text-[#00df82] mr-2 text-sm select-none">Rp</span>
                <input
                  type="text"
                  value={modalAwalStr}
                  onChange={handleModalChange}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none dark:text-white"
                  placeholder="45.000.000"
                />
              </div>
            </div>

            {/* Field 4: Biaya Operasional Bulanan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Biaya Operasional Bulanan
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-[#00df82] dark:border-slate-800 dark:bg-[#0f172a]">
                <span className="font-bold text-slate-400 mr-2 text-sm select-none">Rp</span>
                <input
                  type="text"
                  value={operasionalStr}
                  onChange={handleOperasionalChange}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none dark:text-white"
                  placeholder="8.500.000"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#00df82] py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-[#00c975] hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Menghitung...</span>
                </>
              ) : (
                <span>Hitung Sekarang</span>
              )}
            </button>
          </form>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT COLUMN: 3 SUMMARY METRICS + PROYEKSI ACCUMULATED CASHFLOW BAR CHART
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Top 3 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Total Modal Awal */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-[#0a0f1d] transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-600 dark:bg-[#051d14] dark:border-[#00df82]/50 dark:text-[#00df82] shadow-sm">
                <DollarSign className="h-6 w-6 font-bold" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Total Modal Awal
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                  {formatRupiah(modalAwal)}
                </p>
              </div>
            </div>

            {/* Card 2: Operasional/Bulan */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-[#0a0f1d] transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 border border-amber-300/80 text-amber-600 dark:bg-[#1e1706] dark:border-amber-500/50 dark:text-amber-400 shadow-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Operasional/Bulan
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                  {formatRupiah(operasional)}
                </p>
              </div>
            </div>

            {/* Card 3: Waktu Balik Modal (Green Highlight) */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-[#0a0f1d] transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-600 dark:bg-[#051d14] dark:border-[#00df82]/50 dark:text-[#00df82] shadow-sm">
                <Clock className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Waktu Balik Modal
                </span>
                <p className="text-base font-extrabold text-emerald-600 dark:text-[#00df82] truncate mt-0.5">
                  {calculations.bepMonth} Bulan
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card: Proyeksi Akumulasi Arus Kas Menuju BEP Bar Chart */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              Proyeksi Akumulasi Arus Kas Menuju BEP
            </h3>

            {/* Custom Bar Visualization Grid (Responsive with Horizontal Scroll on extra-small screens) */}
            <div className="relative pt-6 pb-2 overflow-x-auto scrollbar-none">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end min-h-[220px] min-w-[320px]">
                {calculations.bars.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end h-full group">
                    {/* Top Value Label */}
                    <span
                      className={`text-[10px] sm:text-xs font-bold mb-2 transition-all whitespace-nowrap ${
                        bar.isBep
                          ? "text-[#00df82] font-extrabold scale-105"
                          : bar.isPostBep
                          ? "text-emerald-600 dark:text-slate-300"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {bar.valLabel}
                    </span>

                    {/* Vertical Bar */}
                    <div className="w-full max-w-[58px] h-40 flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.heightPct}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          bar.isBep
                            ? "bg-[#00df82] shadow-lg shadow-emerald-500/30 ring-2 ring-[#00df82]/50"
                            : bar.isPostBep
                            ? "bg-[#16a34a] hover:bg-[#22c55e]"
                            : "bg-[#f87171] hover:bg-[#ef4444] dark:bg-[#f87171] dark:hover:bg-[#ef4444]"
                        }`}
                      />
                    </div>

                    {/* Bottom Month Label */}
                    <span
                      className={`mt-3 text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                        bar.isBep
                          ? "text-[#00df82] font-bold"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {bar.monthLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Info Note with Warning Icon */}
            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="leading-relaxed">
                Analisis berdasarkan UMR regional dan rerata kunjungan 45 konsumen harian.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
