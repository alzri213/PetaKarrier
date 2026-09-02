"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Edit2,
  Download,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils/formatCurrency";
import { getLocalSessionState, setLocalSessionState } from "@/lib/utils/sessionSync";
import { getUserActiveAnalisis, saveBusinessPlanAction } from "@/lib/actions/analisis";

type EditingSection = null | "ringkasan" | "masalah" | "proyeksi";

interface BusinessPlanProps {
  initialUsahaId?: string;
  initialKotaId?: string;
}

export default function BusinessPlan({
  initialUsahaId,
  initialKotaId,
}: BusinessPlanProps) {
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  const [currentUsahaId, setCurrentUsahaId] = useState<string>(initialUsahaId || "kedai-kopi");
  const [currentKotaId, setCurrentKotaId] = useState<string>(initialKotaId || "dki-jakarta");
  const [modalAwalVal, setModalAwalVal] = useState<number>(45000000);
  const [analisisId, setAnalisisId] = useState<string | null>(null);

  // Editable state fields
  const [namaUsaha, setNamaUsaha] = useState("Kedai Kopi Nusantara");
  const [ringkasan, setRingkasan] = useState(
    'Rencana bisnis ini disusun untuk mendirikan "Kedai Kopi Nusantara", sebuah usaha kedai kopi dan minuman berkualitas dengan harga terjangkau. Target pasar utama adalah mahasiswa, pekerja lepas, dan masyarakat sekitar.'
  );
  const [masalah1, setMasalah1] = useState(
    "Tingginya harga minuman di cafe modern waralaba yang kurang terjangkau untuk konsumsi harian."
  );
  const [masalah2, setMasalah2] = useState(
    "Kebutuhan tempat singgah yang nyaman, higienis, dan dilengkapi fasilitas pendukung memadai."
  );

  // Financial Projection Data (3 Months) — editable
  const [proyeksi, setProyeksi] = useState([
    {
      bulan: "Bulan 1",
      modal: "Rp 45jt",
      operasional: "Rp 8.5jt",
      revenue: "Rp 12.2jt",
      profit: "Rp 3.7jt",
    },
    {
      bulan: "Bulan 2",
      modal: "Rp 0",
      operasional: "Rp 8.5jt",
      revenue: "Rp 13.8jt",
      profit: "Rp 5.3jt",
    },
    {
      bulan: "Bulan 3",
      modal: "Rp 0",
      operasional: "Rp 8.5jt",
      revenue: "Rp 15.0jt",
      profit: "Rp 6.5jt",
    },
  ]);

  // Restore from unified session and database on mount
  useEffect(() => {
    // 1. Local unified session
    const unified = getLocalSessionState();
    if (unified) {
      if (unified.selectedUsahaId) setCurrentUsahaId(unified.selectedUsahaId);
      if (unified.selectedKotaId) setCurrentKotaId(unified.selectedKotaId);
      if (unified.analisisId) setAnalisisId(unified.analisisId);
      if (unified.modalAwal) setModalAwalVal(unified.modalAwal);

      if (unified.businessPlan) {
        if (unified.businessPlan.namaUsaha) setNamaUsaha(unified.businessPlan.namaUsaha);
        if (unified.businessPlan.ringkasan) setRingkasan(unified.businessPlan.ringkasan);
        if (unified.businessPlan.masalah1) setMasalah1(unified.businessPlan.masalah1);
        if (unified.businessPlan.masalah2) setMasalah2(unified.businessPlan.masalah2);
        if (unified.businessPlan.proyeksi) setProyeksi(unified.businessPlan.proyeksi);
      }
    }

    // 2. Fetch logged-in user active session from PostgreSQL
    getUserActiveAnalisis().then((dbData) => {
      if (dbData) {
        if (dbData.id) setAnalisisId(dbData.id);
        if (dbData.usahaId) setCurrentUsahaId(dbData.usahaId);
        if (dbData.kotaId) setCurrentKotaId(dbData.kotaId);

        if (dbData.hasilModal && typeof dbData.hasilModal === "object") {
          const hm = dbData.hasilModal as any;
          if (hm.modalAwal) setModalAwalVal(hm.modalAwal);
        }

        if (dbData.rencanaBisnis?.kontenMd) {
          try {
            const parsed = JSON.parse(dbData.rencanaBisnis.kontenMd);
            if (parsed.namaUsaha) setNamaUsaha(parsed.namaUsaha);
            if (parsed.ringkasan) setRingkasan(parsed.ringkasan);
            if (parsed.masalah1) setMasalah1(parsed.masalah1);
            if (parsed.masalah2) setMasalah2(parsed.masalah2);
            if (parsed.proyeksi) setProyeksi(parsed.proyeksi);
          } catch {}
        }
      }
    }).catch(() => {});
  }, []);

  // Save changes to unified session and PostgreSQL
  const persistChanges = (override?: Partial<any>) => {
    const updatedPlan = {
      namaUsaha: override?.namaUsaha ?? namaUsaha,
      ringkasan: override?.ringkasan ?? ringkasan,
      masalah1: override?.masalah1 ?? masalah1,
      masalah2: override?.masalah2 ?? masalah2,
      proyeksi: override?.proyeksi ?? proyeksi,
    };

    setLocalSessionState({
      businessPlan: updatedPlan,
    });

    // Background sync to PostgreSQL
    saveBusinessPlanAction({
      analisisId,
      usahaId: currentUsahaId,
      kotaId: currentKotaId,
      namaUsaha: updatedPlan.namaUsaha,
      ringkasan: updatedPlan.ringkasan,
      masalah1: updatedPlan.masalah1,
      masalah2: updatedPlan.masalah2,
      proyeksi: updatedPlan.proyeksi,
    }).catch(() => {});
  };

  const handleExportPDF = () => {
    const el = document.getElementById("plan-dokumen");
    if (!el) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Pop-up diblokir browser. Izinkan pop-up untuk halaman ini.");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rencana Bisnis — ${namaUsaha}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 2rem;
      font-size: 13px;
      line-height: 1.6;
    }
    .print-header { margin-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; }
    .print-header h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .print-header p { color: #64748b; font-size: 0.8rem; margin-top: 0.25rem; }
    .print-badge {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.2rem 0.75rem;
      border-radius: 999px;
      border: 1px solid #16a34a;
      color: #16a34a;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .layout { display: flex; gap: 2rem; align-items: flex-start; }
    .main-col { flex: 2; }
    .side-col { flex: 1; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.25rem; background: #f8fafc; }
    .section { margin-bottom: 1.5rem; }
    .section h2 { font-size: 0.95rem; font-weight: 700; color: #16a34a; margin-bottom: 0.5rem; }
    .section p { color: #334155; font-size: 0.85rem; }
    .bullet-list { list-style: none; padding-left: 0; }
    .bullet-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #334155;
      margin-bottom: 0.4rem;
    }
    .bullet-list li::before { content: "•"; color: #16a34a; font-weight: bold; font-size: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.8rem; }
    th { background: #f1f5f9; font-weight: 700; text-align: left; padding: 0.5rem; border-bottom: 2px solid #cbd5e1; }
    td { padding: 0.5rem; border-bottom: 1px solid #e2e8f0; }
    .side-card { margin-bottom: 1.25rem; }
    .side-card h3 { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.75rem; color: #0f172a; }
    .stat-row { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.5rem; }
    .stat-label { color: #64748b; }
    .stat-val { font-weight: 700; color: #0f172a; }
    .stat-val.green { color: #16a34a; }
    .footer { margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; font-size: 0.75rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>${namaUsaha} — Rencana Bisnis</h1>
    <p>Disusun melalui Platform PetaKarier &bull; Data Terverifikasi Nasional</p>
    <span class="print-badge">Dokumen Terstruktur Siap Pengajuan KUR</span>
  </div>

  <div class="layout">
    <div class="main-col">
      <div class="section">
        <h2>1. Ringkasan Eksekutif</h2>
        <p>${ringkasan}</p>
      </div>

      <div class="section">
        <h2>2. Analisis Masalah</h2>
        <ul class="bullet-list">
          <li>${masalah1}</li>
          <li>${masalah2}</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. Target Pasar & Keunggulan Kompetitif</h2>
        <p>Menyediakan penawaran nilai unik dengan perputaran modal efisien, harga bersaing, dan saluran pemasaran digital terarah.</p>
      </div>

      <div class="section">
        <h2>4. Proyeksi Keuangan (3 Bulan Pertama)</h2>
        <table>
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Modal Awal</th>
              <th>Operasional</th>
              <th>Revenue</th>
              <th>Est. Profit</th>
            </tr>
          </thead>
          <tbody>
            ${proyeksi.map(r => `<tr><td>${r.bulan}</td><td>${r.modal}</td><td>${r.operasional}</td><td>${r.revenue}</td><td style="color:#16a34a;font-weight:700;">${r.profit}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="side-col">
      <div class="side-card">
        <h3>Data Finansial Terpilih</h3>
        <div class="stat-row">
          <span class="stat-label">Estimasi Modal</span>
          <span class="stat-val">${formatRupiah(modalAwalVal)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Rasio UMR Kota</span>
          <span class="stat-val green">1.52x Lebih Tinggi</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Target Margin Laba</span>
          <span class="stat-val">42.6%</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    Dokumen ini dicetak otomatis dari PetaKarier pada ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
  </div>

  <script>
    window.onload = function() {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`);

    printWindow.document.close();
    toast.success("Dokumen PDF siap dicetak!");
  };

  const toggleEdit = (section: EditingSection) => {
    if (editingSection === section) {
      setEditingSection(null);
      persistChanges();
      toast.success("Perubahan tersimpan ke database & perangkat!");
    } else {
      setEditingSection(section);
    }
  };

  const updateProyeksiField = (
    index: number,
    field: "modal" | "operasional" | "revenue" | "profit",
    value: string
  ) => {
    const updated = proyeksi.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    setProyeksi(updated);
    persistChanges({ proyeksi: updated });
  };

  return (
    <div id="plan-dokumen" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rencana Bisnis Anda
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Draf rencana bisnis terstruktur otomatis yang siap direalisasikan dan diajukan ke calon investor.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:bg-slate-900/80 dark:text-[#00df82] dark:border-emerald-500/40 shadow-sm">
            DOKUMEN TERVERIFIKASI
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2.2rem] border border-slate-200 bg-white p-7 sm:p-9 shadow-xl dark:border-slate-800/90 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors space-y-8 print:border-none print:shadow-none"
          >
            {/* Section 1: Ringkasan Eksekutif */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-[#00df82] tracking-tight">
                  1. Ringkasan Eksekutif
                </h2>
                <button
                  type="button"
                  onClick={() => toggleEdit("ringkasan")}
                  className={`p-1.5 rounded-lg transition ${
                    editingSection === "ringkasan"
                      ? "text-[#00df82] bg-emerald-500/10"
                      : "text-slate-400 hover:text-[#00df82] hover:bg-emerald-500/10"
                  }`}
                  title={editingSection === "ringkasan" ? "Simpan" : "Edit Ringkasan"}
                >
                  {editingSection === "ringkasan" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              {editingSection === "ringkasan" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={namaUsaha}
                    onChange={(e) => {
                      setNamaUsaha(e.target.value);
                      persistChanges({ namaUsaha: e.target.value });
                    }}
                    placeholder="Nama Usaha"
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-2.5 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900 dark:text-white transition mb-2"
                  />
                  <textarea
                    value={ringkasan}
                    onChange={(e) => {
                      setRingkasan(e.target.value);
                      persistChanges({ ringkasan: e.target.value });
                    }}
                    rows={4}
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {namaUsaha}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                    {ringkasan}
                  </p>
                </div>
              )}
            </div>

            {/* Section 2: Analisis Masalah */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-[#00df82] tracking-tight">
                  2. Analisis Masalah
                </h2>
                <button
                  type="button"
                  onClick={() => toggleEdit("masalah")}
                  className={`p-1.5 rounded-lg transition ${
                    editingSection === "masalah"
                      ? "text-[#00df82] bg-emerald-500/10"
                      : "text-slate-400 hover:text-[#00df82] hover:bg-emerald-500/10"
                  }`}
                  title={editingSection === "masalah" ? "Simpan" : "Edit Analisis Masalah"}
                >
                  {editingSection === "masalah" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              {editingSection === "masalah" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={masalah1}
                    onChange={(e) => {
                      setMasalah1(e.target.value);
                      persistChanges({ masalah1: e.target.value });
                    }}
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={masalah2}
                    onChange={(e) => {
                      setMasalah2(e.target.value);
                      persistChanges({ masalah2: e.target.value });
                    }}
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                  />
                </div>
              ) : (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[#00df82] text-xs font-bold mt-0.5">
                      •
                    </span>
                    <span>{masalah1}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[#00df82] text-xs font-bold mt-0.5">
                      •
                    </span>
                    <span>{masalah2}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Section 3: Target Pasar */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-[#00df82] tracking-tight">
                3. Target Pasar & Keunggulan
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                Mengutamakan segmen pasar lokal dengan strategi harga terjangkau, transparansi kualitas produk/jasa, serta pemanfaatan channel digital untuk menjangkau basis pelanggan setia secara berkelanjutan.
              </p>
            </div>

            {/* Section 4: Proyeksi Keuangan (3 Bulan) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-[#00df82] tracking-tight">
                  4. Proyeksi Keuangan (3 Bulan Pertama)
                </h2>
                <button
                  type="button"
                  onClick={() => toggleEdit("proyeksi")}
                  className={`p-1.5 rounded-lg transition ${
                    editingSection === "proyeksi"
                      ? "text-[#00df82] bg-emerald-500/10"
                      : "text-slate-400 hover:text-[#00df82] hover:bg-emerald-500/10"
                  }`}
                  title={editingSection === "proyeksi" ? "Simpan" : "Edit Proyeksi"}
                >
                  {editingSection === "proyeksi" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-1 dark:border-slate-800/80 dark:bg-slate-900/40">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                      <th className="py-3 px-4">Bulan</th>
                      <th className="py-3 px-4">Modal Awal</th>
                      <th className="py-3 px-4">Operasional</th>
                      <th className="py-3 px-4">Revenue</th>
                      <th className="py-3 px-4 text-emerald-600 dark:text-[#00df82]">
                        Est. Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    {proyeksi.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                          {row.bulan}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {editingSection === "proyeksi" ? (
                            <input
                              type="text"
                              value={row.modal}
                              onChange={(e) =>
                                updateProyeksiField(idx, "modal", e.target.value)
                              }
                              className="w-full min-w-[70px] rounded-lg border border-emerald-400/50 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                            />
                          ) : (
                            row.modal
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {editingSection === "proyeksi" ? (
                            <input
                              type="text"
                              value={row.operasional}
                              onChange={(e) =>
                                updateProyeksiField(idx, "operasional", e.target.value)
                              }
                              className="w-full min-w-[70px] rounded-lg border border-emerald-400/50 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                            />
                          ) : (
                            row.operasional
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {editingSection === "proyeksi" ? (
                            <input
                              type="text"
                              value={row.revenue}
                              onChange={(e) =>
                                updateProyeksiField(idx, "revenue", e.target.value)
                              }
                              className="w-full min-w-[70px] rounded-lg border border-emerald-400/50 bg-slate-50 px-2 py-1 text-xs outline-none focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                            />
                          ) : (
                            row.revenue
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-[#00df82]">
                          {editingSection === "proyeksi" ? (
                            <input
                              type="text"
                              value={row.profit}
                              onChange={(e) =>
                                updateProyeksiField(idx, "profit", e.target.value)
                              }
                              className="w-full min-w-[70px] rounded-lg border border-emerald-400/50 bg-slate-50 px-2 py-1 text-xs font-bold outline-none focus:border-[#00df82] dark:border-slate-700 dark:bg-slate-900 dark:text-[#00df82] transition"
                            />
                          ) : (
                            row.profit
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 print:hidden">
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#00df82] px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-[#00c975] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-950" />
              <span>Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Right Column: Financial Highlights & Mentor */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* Card 1: Data Finansial Terpilih */}
          <div className="rounded-[2.2rem] border border-slate-200 bg-white p-6 sm:p-7 shadow-xl dark:border-slate-800/90 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors space-y-5">
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Data Finansial Terpilih
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Estimasi Modal
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {formatRupiah(modalAwalVal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Rasio UMR Kota
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-[#00df82]">
                  1.52x Lebih Tinggi
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Target Margin Laba
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  42.6%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Petunjuk Mentor Virtual */}
          <div className="rounded-[2.2rem] border-2 border-emerald-500/50 bg-white p-6 sm:p-7 shadow-xl shadow-emerald-500/10 dark:border-emerald-500/50 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00df82]">
              <Lightbulb className="h-4 w-4" />
              <h3 className="text-xs sm:text-sm font-bold">
                Petunjuk Mentor Finansial
              </h3>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
              Proyeksi Bulan ke-3 menunjukkan kenaikan tren profit stabil. Hubungi mentor finansial kami jika ingin mempersiapkan berkas pengajuan modal tambahan mikro.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
