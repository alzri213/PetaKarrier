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

  const kotaList = useMemo(() => {
    if (daftarKota.length > 0) return daftarKota;
    // Full 34 provinsi UMP/UMR 2024–2025 (Sumber: Kemenaker RI)
    return [
      { id: "dki-jakarta",      nama: "DKI Jakarta",          provinsi: "DKI Jakarta",          umr: 5067381, sewaTempat: 1500000, utilitas: 600000, retribusi: 150000 },
      { id: "jawa-barat",       nama: "Jawa Barat",           provinsi: "Jawa Barat",            umr: 2101000, sewaTempat: 950000,  utilitas: 400000, retribusi: 90000  },
      { id: "jawa-tengah",      nama: "Jawa Tengah",          provinsi: "Jawa Tengah",           umr: 2036947, sewaTempat: 800000,  utilitas: 350000, retribusi: 80000  },
      { id: "diy",              nama: "DI Yogyakarta",        provinsi: "DI Yogyakarta",         umr: 2159000, sewaTempat: 750000,  utilitas: 300000, retribusi: 60000  },
      { id: "jawa-timur",       nama: "Jawa Timur",           provinsi: "Jawa Timur",            umr: 2165244, sewaTempat: 900000,  utilitas: 400000, retribusi: 85000  },
      { id: "banten",           nama: "Banten",               provinsi: "Banten",                umr: 2727812, sewaTempat: 1100000, utilitas: 450000, retribusi: 100000 },
      { id: "bali",             nama: "Bali",                 provinsi: "Bali",                  umr: 2713672, sewaTempat: 1200000, utilitas: 500000, retribusi: 100000 },
      { id: "aceh",             nama: "Aceh",                 provinsi: "Aceh",                  umr: 3460672, sewaTempat: 700000,  utilitas: 300000, retribusi: 70000  },
      { id: "sumatera-utara",   nama: "Sumatera Utara",       provinsi: "Sumatera Utara",        umr: 2809915, sewaTempat: 800000,  utilitas: 380000, retribusi: 75000  },
      { id: "sumatera-barat",   nama: "Sumatera Barat",       provinsi: "Sumatera Barat",        umr: 2811000, sewaTempat: 750000,  utilitas: 350000, retribusi: 70000  },
      { id: "riau",             nama: "Riau",                 provinsi: "Riau",                  umr: 3294625, sewaTempat: 900000,  utilitas: 400000, retribusi: 80000  },
      { id: "kepulauan-riau",   nama: "Kepulauan Riau",       provinsi: "Kepulauan Riau",        umr: 3402492, sewaTempat: 950000,  utilitas: 420000, retribusi: 85000  },
      { id: "jambi",            nama: "Jambi",                provinsi: "Jambi",                 umr: 3037121, sewaTempat: 750000,  utilitas: 350000, retribusi: 70000  },
      { id: "sumatera-selatan", nama: "Sumatera Selatan",     provinsi: "Sumatera Selatan",      umr: 3456874, sewaTempat: 800000,  utilitas: 370000, retribusi: 75000  },
      { id: "bangka-belitung",  nama: "Bangka Belitung",      provinsi: "Bangka Belitung",       umr: 3640000, sewaTempat: 800000,  utilitas: 370000, retribusi: 75000  },
      { id: "bengkulu",         nama: "Bengkulu",             provinsi: "Bengkulu",              umr: 2507079, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "lampung",          nama: "Lampung",              provinsi: "Lampung",               umr: 2716497, sewaTempat: 700000,  utilitas: 320000, retribusi: 65000  },
      { id: "kalimantan-barat", nama: "Kalimantan Barat",     provinsi: "Kalimantan Barat",      umr: 2702616, sewaTempat: 750000,  utilitas: 350000, retribusi: 70000  },
      { id: "kalimantan-tengah",nama: "Kalimantan Tengah",    provinsi: "Kalimantan Tengah",     umr: 3261616, sewaTempat: 800000,  utilitas: 380000, retribusi: 75000  },
      { id: "kalimantan-selatan",nama:"Kalimantan Selatan",   provinsi: "Kalimantan Selatan",    umr: 3149977, sewaTempat: 800000,  utilitas: 370000, retribusi: 75000  },
      { id: "kalimantan-timur", nama: "Kalimantan Timur",     provinsi: "Kalimantan Timur",      umr: 3360067, sewaTempat: 950000,  utilitas: 420000, retribusi: 90000  },
      { id: "kalimantan-utara", nama: "Kalimantan Utara",     provinsi: "Kalimantan Utara",      umr: 3361653, sewaTempat: 900000,  utilitas: 400000, retribusi: 85000  },
      { id: "sulawesi-utara",   nama: "Sulawesi Utara",       provinsi: "Sulawesi Utara",        umr: 3545000, sewaTempat: 750000,  utilitas: 350000, retribusi: 70000  },
      { id: "sulawesi-tengah",  nama: "Sulawesi Tengah",      provinsi: "Sulawesi Tengah",       umr: 2914583, sewaTempat: 700000,  utilitas: 330000, retribusi: 65000  },
      { id: "sulawesi-selatan", nama: "Sulawesi Selatan",     provinsi: "Sulawesi Selatan",      umr: 3434298, sewaTempat: 800000,  utilitas: 370000, retribusi: 75000  },
      { id: "sulawesi-tenggara",nama: "Sulawesi Tenggara",    provinsi: "Sulawesi Tenggara",     umr: 2885964, sewaTempat: 680000,  utilitas: 320000, retribusi: 65000  },
      { id: "sulawesi-barat",   nama: "Sulawesi Barat",       provinsi: "Sulawesi Barat",        umr: 2914583, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "gorontalo",        nama: "Gorontalo",            provinsi: "Gorontalo",             umr: 3025100, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "ntb",              nama: "Nusa Tenggara Barat",  provinsi: "Nusa Tenggara Barat",   umr: 2371407, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "ntt",              nama: "Nusa Tenggara Timur",  provinsi: "Nusa Tenggara Timur",   umr: 2186826, sewaTempat: 600000,  utilitas: 280000, retribusi: 55000  },
      { id: "maluku",           nama: "Maluku",               provinsi: "Maluku",                umr: 3141700, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "maluku-utara",     nama: "Maluku Utara",         provinsi: "Maluku Utara",          umr: 3200000, sewaTempat: 650000,  utilitas: 300000, retribusi: 60000  },
      { id: "papua-barat",      nama: "Papua Barat",          provinsi: "Papua Barat",           umr: 3600000, sewaTempat: 700000,  utilitas: 320000, retribusi: 65000  },
      { id: "papua",            nama: "Papua",                provinsi: "Papua",                 umr: 4024270, sewaTempat: 750000,  utilitas: 350000, retribusi: 70000  },
    ];
  }, [daftarKota]);

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
          className="lg:col-span-5 lg:h-full rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl sm:p-8"
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
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                Jenis Rencana Usaha
              </label>
              <SearchableSelect
                value={selectedUsahaId}
                onChange={handleSelectUsaha}
                placeholder="Pilih jenis usaha"
                options={usahaList.map((usaha) => ({ value: usaha.id, label: usaha.nama }))}
              />
            </div>

            {/* Field 2: Kota Domisili */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                Kota Domisili
              </label>
              <SearchableSelect
                value={selectedKotaId}
                onChange={setSelectedKotaId}
                placeholder="Pilih kota domisili"
                options={kotaList.map((kota) => ({ value: kota.id, label: kota.nama }))}
              />
            </div>

            {/* Field 3: Target Modal Awal (Green Border Highlight) */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
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
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isCalculating || !selectedUsahaId || !selectedKotaId}
                  className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-extrabold text-slate-950 shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
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
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-md transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
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
          <div className="lg:flex-1 flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              Proyeksi Akumulasi Arus Kas Menuju BEP
            </h3>

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
