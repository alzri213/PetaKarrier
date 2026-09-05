"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Loader2,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import type { JenisUsaha, KotaData } from "@/types";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import { getLocalSessionState, setLocalSessionState } from "@/lib/utils/sessionSync";
import { getUserActiveAnalisis, updateKalkulatorAction } from "@/lib/actions/analisis";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

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

  // State untuk data kota dari database
  const [kotaList, setKotaList] = useState<KotaData[]>(daftarKota);
  const [isLoadingKota, setIsLoadingKota] = useState<boolean>(false);
  const [selectedWilayah, setSelectedWilayah] = useState<string>("");

  // Fetch kota data from API on mount
  useEffect(() => {
    if (daftarKota.length > 0) {
      setKotaList(daftarKota);
      return;
    }

    const fetchKotaData = async () => {
      setIsLoadingKota(true);
      try {
        const res = await fetch("/api/kota");
        const json = await res.json();
        if (json.success && json.data) {
          setKotaList(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch kota data:", error);
        // Fallback to empty if API fails
        setKotaList([]);
      } finally {
        setIsLoadingKota(false);
      }
    };

    fetchKotaData();
  }, [daftarKota]);

  // Filter kota berdasarkan wilayah yang dipilih
  const filteredKotaList = useMemo(() => {
    if (!selectedWilayah) return kotaList;
    return kotaList.filter((k) => k.wilayah === selectedWilayah);
  }, [kotaList, selectedWilayah]);

  // Daftar wilayah unik untuk filter
  const wilayahOptions = useMemo(() => {
    const uniqueWilayah = Array.from(
      new Set(kotaList.map((k) => k.wilayah).filter((wilayah): wilayah is string => Boolean(wilayah)))
    ).sort();
    return [
      { value: "", label: "Semua Wilayah" },
      ...uniqueWilayah.map((w) => ({ value: w, label: w })),
    ];
  }, [kotaList]);

  const getDefaultModal = useCallback((usaha?: { modalMin?: number; modalMax?: number }) => {
    if (!usaha) return 20000000;
    return Math.round(((usaha.modalMin ?? 20000000) + (usaha.modalMax ?? 30000000)) / 2);
  }, []);

  const getDefaultOperasional = useCallback((usaha?: { bahanBakuBulanan?: number; gajiKaryawan?: number; promosiBulanan?: number }, kota?: { utilitas?: number }) => {
    if (!usaha) return 6500000;
    return (usaha.bahanBakuBulanan || 1000000) + (usaha.gajiKaryawan || 0) + (usaha.promosiBulanan || 500000) + (kota?.utilitas || 600000);
  }, []);

  const getUsahaById = useCallback((id?: string | null) => {
    if (!id) return undefined;
    return usahaList.find((u) => u.id === id || u.id.toLowerCase() === id.toLowerCase());
  }, [usahaList]);

  const getKotaById = useCallback((id?: string | null) => {
    if (!id) return undefined;
    return kotaList.find((k) => k.id === id || k.id.toLowerCase() === id.toLowerCase());
  }, [kotaList]);

  const initialUsaha = useMemo(() => {
    return getUsahaById(queryUsahaId) ?? usahaList[0];
  }, [queryUsahaId, usahaList, getUsahaById]);

  const initialKota = useMemo(() => {
    return getKotaById(queryKotaId) ?? kotaList[0];
  }, [queryKotaId, kotaList, getKotaById]);

  const initialModalVal = useMemo(() => {
    if (queryUsahaId) {
      return getDefaultModal(getUsahaById(queryUsahaId));
    }
    return getDefaultModal(initialUsaha);
  }, [queryUsahaId, initialUsaha, getUsahaById, getDefaultModal]);

  const initialOpsVal = useMemo(() => {
    if (queryUsahaId || queryKotaId) {
      return getDefaultOperasional(getUsahaById(queryUsahaId), getKotaById(queryKotaId) ?? initialKota);
    }
    return getDefaultOperasional(initialUsaha, initialKota);
  }, [queryUsahaId, queryKotaId, initialUsaha, initialKota, getUsahaById, getKotaById, getDefaultOperasional]);

  const [selectedUsahaId, setSelectedUsahaId] = useState<string>(initialUsaha?.id || usahaList[0]?.id || "jasa-web-digital");
  const [selectedKotaId, setSelectedKotaId] = useState<string>(initialKota?.id || kotaList[0]?.id || "dki-jakarta");

  const [modalAwal, setModalAwal] = useState<number>(initialModalVal);
  const [modalAwalStr, setModalAwalStr] = useState<string>(initialModalVal.toLocaleString("id-ID"));
  const [operasional, setOperasional] = useState<number>(initialOpsVal);
  const [operasionalStr, setOperasionalStr] = useState<string>(initialOpsVal.toLocaleString("id-ID"));
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  const [activeModalAwal, setActiveModalAwal] = useState<number>(initialModalVal);
  const [activeOperasional, setActiveOperasional] = useState<number>(initialOpsVal);
  const [activeUsahaId, setActiveUsahaId] = useState<string>(initialUsaha?.id || "jasa-web-digital");
  const [activeKotaId, setActiveKotaId] = useState<string>(initialKota?.id || "dki-jakarta");
  const hasSkippedInitialPersist = useRef(false);

  // Restore from unified local storage & PostgreSQL database on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // 1. Try restoring from unified session state first
    const unified = getLocalSessionState();
    if (unified) {
      if (!queryUsahaId && unified.selectedUsahaId) {
        setSelectedUsahaId(unified.selectedUsahaId);
        setActiveUsahaId(unified.selectedUsahaId);
      }
      if (!queryKotaId && unified.selectedKotaId) {
        setSelectedKotaId(unified.selectedKotaId);
        setActiveKotaId(unified.selectedKotaId);
      }
      if (unified.modalAwal) {
        setModalAwal(unified.modalAwal);
        setModalAwalStr(unified.modalAwal.toLocaleString("id-ID"));
        setActiveModalAwal(unified.modalAwal);
      }
      if (unified.operasional) {
        setOperasional(unified.operasional);
        setOperasionalStr(unified.operasional.toLocaleString("id-ID"));
        setActiveOperasional(unified.operasional);
      }
      if (unified.hasCalculated !== undefined) {
        setHasCalculated(unified.hasCalculated);
      }
    }

    // 2. Fetch logged-in user's active session from database
    getUserActiveAnalisis().then((dbData) => {
      if (dbData) {
        if (!queryUsahaId && dbData.usahaId) {
          setSelectedUsahaId(dbData.usahaId);
          setActiveUsahaId(dbData.usahaId);
        }
        if (!queryKotaId && dbData.kotaId) {
          setSelectedKotaId(dbData.kotaId);
          setActiveKotaId(dbData.kotaId);
        }
        if (dbData.hasilModal && typeof dbData.hasilModal === "object") {
          const hm = dbData.hasilModal as Record<string, unknown>;
          const savedModalAwal = typeof hm.modalAwal === "number" ? hm.modalAwal : null;
          const savedOperasional = typeof hm.operasional === "number" ? hm.operasional : null;
          if (savedModalAwal !== null) {
            setModalAwal(savedModalAwal);
            setModalAwalStr(savedModalAwal.toLocaleString("id-ID"));
            setActiveModalAwal(savedModalAwal);
          }
          if (savedOperasional !== null) {
            setOperasional(savedOperasional);
            setOperasionalStr(savedOperasional.toLocaleString("id-ID"));
            setActiveOperasional(savedOperasional);
          }
          setHasCalculated(true);
        }

        setLocalSessionState({
          analisisId: dbData.id,
          selectedUsahaId: dbData.usahaId || "kedai-kopi",
          selectedKotaId: dbData.kotaId || "dki-jakarta",
          skala: dbData.skala || "sedang",
        });
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist to unified local session on every change
  useEffect(() => {
    if (!hasSkippedInitialPersist.current) {
      hasSkippedInitialPersist.current = true;
      return;
    }

    setLocalSessionState({
      selectedUsahaId,
      selectedKotaId,
      modalAwal,
      operasional,
      hasCalculated,
    });
  }, [selectedUsahaId, selectedKotaId, modalAwal, operasional, hasCalculated]);

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

      setLocalSessionState({
        selectedUsahaId: usahaId,
        modalAwal: avgModal,
        operasional: ops,
      });
    }
  };

  // Selected entities
  const selectedKota = useMemo(
    () => kotaList.find((k) => k.id === (hasCalculated ? activeKotaId : selectedKotaId)),
    [kotaList, hasCalculated, activeKotaId, selectedKotaId]
  );

  // Dynamic calculations for Break-Even Point based STRICTLY on active calculated state
  const calculations = useMemo(() => {
    if (!hasCalculated) {
      return {
        bepMonth: 0,
        bars: [
          { monthLabel: "Bln 1", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
          { monthLabel: "Bln 2", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
          { monthLabel: "Bln 3", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
          { monthLabel: "Bln 4", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
          { monthLabel: "Bln 5", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
          { monthLabel: "Bln 6", rawVal: 0, valLabel: "—", isBep: false, heightPct: 4 },
        ],
      };
    }

    // Net profit estimation per month
    const marginRatio = 0.42; // ~42% gross margin
    const estimatedMonthlyRevenue = Math.max(activeOperasional * 1.65, 14000000);
    const netProfitPerMonth = Math.max(estimatedMonthlyRevenue * marginRatio - activeOperasional * 0.25, 5500000);

    const bepMonth = Math.max(4, Math.min(18, Math.ceil(activeModalAwal / netProfitPerMonth)));

    // Generate 6 sample months around the BEP milestone
    const m1 = 1;
    const m2 = Math.max(2, Math.round(bepMonth * 0.35));
    const m3 = Math.max(3, Math.round(bepMonth * 0.65));
    const m4 = Math.max(4, bepMonth - 1);
    const m5 = bepMonth; // The exact BEP Month
    const m6 = bepMonth + 1; // Post BEP

    const getAccumulatedCashflow = (m: number) => {
      // In early months, cashflow is negative (unrecovered investment)
      return Math.round(netProfitPerMonth * m - activeModalAwal);
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
  }, [hasCalculated, activeModalAwal, activeOperasional]);

  // Form submit handler: recalculates when the button is clicked!
  const handleHitung = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setHasCalculated(true);
      setActiveModalAwal(modalAwal);
      setActiveOperasional(operasional);
      setActiveUsahaId(selectedUsahaId);
      setActiveKotaId(selectedKotaId);
      setIsCalculating(false);

      setLocalSessionState({
        selectedUsahaId,
        selectedKotaId,
        modalAwal,
        operasional,
        hasCalculated: true,
      });

      // Background sync to PostgreSQL database
      updateKalkulatorAction({
        usahaId: selectedUsahaId,
        kotaId: selectedKotaId,
        modalAwal,
        operasional,
        hasilModal: {
          modalAwal,
          operasional,
          bepMonth: calculations.bepMonth,
        },
      }).catch(() => {});
    }, 400);
  };

  const handleReset = () => {
    setSelectedUsahaId("");
    setSelectedKotaId("");
    setModalAwal(0);
    setModalAwalStr("");
    setOperasional(0);
    setOperasionalStr("");
    setActiveUsahaId("");
    setActiveKotaId("");
    setActiveModalAwal(0);
    setActiveOperasional(0);
    setHasCalculated(false);
    setLocalSessionState({
      selectedUsahaId: "",
      selectedKotaId: "",
      modalAwal: 0,
      operasional: 0,
      hasCalculated: false,
    });
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

  const hasChanges = useMemo(() => {
    return (
      modalAwal !== activeModalAwal ||
      operasional !== activeOperasional ||
      selectedUsahaId !== activeUsahaId ||
      selectedKotaId !== activeKotaId
    );
  }, [modalAwal, activeModalAwal, operasional, activeOperasional, selectedUsahaId, activeUsahaId, selectedKotaId, activeKotaId]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT COLUMN: KALKULATOR MODAL & BEP FORM CARD
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 lg:h-full rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl sm:p-8"
        >
          {/* Header text with proper wrap protection */}
          <div className="mb-5 space-y-2 sm:mb-6">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Kalkulator Modal & BEP
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 break-words max-w-full">
              Estimasi waktu kembali modal usaha Anda dengan parameter biaya operasional riil.
            </p>
          </div>

          <form onSubmit={handleHitung} className="space-y-4 sm:space-y-5">
            {/* Field 1: Jenis Rencana Usaha */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 sm:text-sm">
                Jenis Rencana Usaha
              </label>
              <SearchableSelect
                value={selectedUsahaId}
                onChange={handleSelectUsaha}
                placeholder="Pilih jenis usaha"
                options={usahaList.map((usaha) => ({ value: usaha.id, label: usaha.nama }))}
              />
            </div>

            {/* Field 2: Filter Wilayah (Baru) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 sm:text-sm">
                Filter Wilayah
              </label>
              <SearchableSelect
                value={selectedWilayah}
                onChange={setSelectedWilayah}
                placeholder="Semua Wilayah Indonesia"
                options={wilayahOptions}
                disabled={isLoadingKota}
              />
              {filteredKotaList.length > 0 && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {filteredKotaList.length} provinsi tersedia {selectedWilayah && `di wilayah ${selectedWilayah}`}
                </p>
              )}
            </div>

            {/* Field 3: Kota Domisili */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 sm:text-sm">
                Kota Domisili
              </label>
              <SearchableSelect
                value={selectedKotaId}
                onChange={setSelectedKotaId}
                placeholder={isLoadingKota ? "Memuat data kota..." : "Pilih kota domisili"}
                options={filteredKotaList.map((kota) => ({ 
                  value: kota.id, 
                  label: `${kota.nama} - ${kota.wilayah}` 
                }))}
                disabled={isLoadingKota || filteredKotaList.length === 0}
              />
            </div>

            {/* Field 4: Target Modal Awal (Green Border Highlight) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 sm:text-sm">
                Target Modal Awal
              </label>
              <div className="flex items-center rounded-xl border-2 border-[#00df82] bg-slate-50 px-3 py-2.5 shadow-sm transition dark:bg-[#0f172a] sm:px-4 sm:py-3">
                <span className="mr-2 text-xs font-bold text-[#00df82] select-none sm:text-sm">Rp</span>
                <input
                  type="text"
                  value={modalAwalStr}
                  onChange={handleModalChange}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none dark:text-white sm:text-sm"
                  placeholder="45.000.000"
                />
              </div>
            </div>

            {/* Field 5: Biaya Operasional Bulanan */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 sm:text-xs">
                Biaya Operasional Bulanan
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm transition focus-within:border-[#00df82] dark:border-slate-800 dark:bg-[#0f172a] sm:px-4 sm:py-3">
                <span className="mr-2 text-xs font-bold text-slate-400 select-none sm:text-sm">Rp</span>
                <input
                  type="text"
                  value={operasionalStr}
                  onChange={handleOperasionalChange}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none dark:text-white sm:text-sm"
                  placeholder="8.500.000"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isCalculating || !selectedUsahaId || !selectedKotaId}
                  className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-extrabold leading-none text-slate-950 shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] sm:gap-2 sm:py-4 sm:text-sm ${
                    hasChanges
                      ? "bg-[#00df82] shadow-emerald-500/30 ring-2 ring-[#00df82]/50 hover:bg-[#00c975]"
                      : "bg-[#00df82] shadow-emerald-500/20 hover:bg-[#00c975]"
                  }`}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Menghitung Ulang...</span>
                    </>
                  ) : (
                    <span>Hitung Sekarang</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isCalculating}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-md transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 sm:h-12 sm:w-12"
                  aria-label="Reset kalkulator"
                  title="Reset kalkulator"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {hasChanges && (
                <p className="text-center text-[11px] font-semibold text-emerald-600 dark:text-[#00df82] animate-pulse">
                  * Parameter input diubah. Klik tombol di atas untuk memperbarui kalkulasi.
                </p>
              )}
            </div>
          </form>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT COLUMN: 3 SUMMARY METRICS + PROYEKSI ACCUMULATED CASHFLOW BAR CHART
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 lg:flex lg:h-full lg:flex-col space-y-6"
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
                <p className={`text-base font-extrabold truncate mt-0.5 ${hasCalculated ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}>
                  {hasCalculated ? formatRupiah(activeModalAwal) : "—"}
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
                <p className={`text-base font-extrabold truncate mt-0.5 ${hasCalculated ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}>
                  {hasCalculated ? formatRupiah(activeOperasional) : "—"}
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
                <p className={`text-base font-extrabold truncate mt-0.5 ${hasCalculated ? "text-emerald-600 dark:text-[#00df82]" : "text-slate-300 dark:text-slate-600"}`}>
                  {hasCalculated ? `${calculations.bepMonth} Bulan` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card: Proyeksi Akumulasi Arus Kas Menuju BEP Bar Chart */}
          <div className="lg:flex-1 flex flex-col rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                Proyeksi Akumulasi Arus Kas Menuju BEP
              </h3>
              <div className="mt-2 flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 sm:text-xs">
                <span>Perkiraan arus kas 6 tahap</span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-emerald-600 dark:text-[#00df82]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00df82]" />
                  Titik BEP
                </span>
              </div>
            </div>

            {/* Empty state prompt when not yet calculated */}
            {!hasCalculated && (
              <div className="flex flex-1 flex-col items-center justify-center min-h-[220px] text-center px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 mb-4">
                  <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                  Belum ada data kalkulasi
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-xs">
                  Isi parameter di sebelah kiri, lalu klik Hitung Sekarang untuk melihat proyeksi BEP di {selectedKota?.nama || "kota Anda"}.
                </p>
              </div>
            )}

            {/* Actual bar chart (only when calculated) */}
            {hasCalculated && (
              <div className="relative overflow-hidden px-1 pb-2 pt-4 sm:overflow-x-auto sm:px-0 sm:pt-6 scrollbar-none">
                <div className="grid min-h-[155px] w-full min-w-0 grid-cols-6 items-end gap-1.5 sm:min-h-[220px] sm:gap-4">
                  {calculations.bars.map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-end h-full group">
                      {/* Top Value Label */}
                      <span
                        className={`mb-1 text-[9px] font-bold leading-none tracking-tight transition-all whitespace-nowrap sm:mb-2 sm:text-xs sm:tracking-normal ${
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
                      <div className="flex h-28 w-full max-w-[58px] items-end justify-center sm:h-40">
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
                        className={`mt-2 text-[9px] font-semibold leading-none tracking-tight whitespace-nowrap sm:mt-3 sm:text-xs sm:tracking-normal ${
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
            )}

            {/* Bottom Info Note with Warning Icon */}
            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="leading-relaxed">
                {hasCalculated
                  ? "Analisis berdasarkan UMR regional dan rerata kunjungan 45 konsumen harian."
                  : "Klik \"Hitung Sekarang\" untuk menampilkan proyeksi arus kas dan estimasi BEP."}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
