"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Edit2,
  Download,
  Check,
} from "lucide-react";
import { toast } from "sonner";

type EditingSection = null | "ringkasan" | "masalah" | "proyeksi";

export default function BusinessPlan() {
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  // Editable state fields with default values matching reference design
  const [namaUsaha, setNamaUsaha] = useState("Kopi Kebersamaan");
  const [ringkasan, setRingkasan] = useState(
    'Rencana bisnis ini disusun untuk mendirikan "Kopi Kebersamaan", sebuah usaha warung kopi berkonsep modern namun terjangkau di kawasan padat domisili Surabaya. Target pasar utama adalah mahasiswa dan pekerja kreatif yang membutuhkan ruang kerja nyaman dengan harga bersahabat.'
  );
  const [masalah1, setMasalah1] = useState(
    "Kurangnya ruang komunal bersahabat yang dilengkapi koneksi internet andal di Surabaya Timur."
  );
  const [masalah2, setMasalah2] = useState(
    "Harga kopi cafe modern waralaba yang kurang terjangkau untuk kebutuhan konsumsi rutin harian."
  );

  // Financial Projection Data (3 Months) — now editable
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

  const handleExportPDF = () => {
    const el = document.getElementById("plan-dokumen");
    if (!el) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Pop-up diblokir browser. Izinkan pop-up untuk halaman ini.");
      return;
    }

    const content = el.innerHTML;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rencana Bisnis — PetaKarier</title>
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
    /* Header */
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
    /* Two-column layout */
    .layout { display: flex; gap: 2rem; align-items: flex-start; }
    .col-main { flex: 1 1 60%; }
    .col-side { flex: 0 0 30%; min-width: 200px; }
    /* Main card */
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    /* Section headings */
    .section-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #16a34a;
      margin-bottom: 0.5rem;
    }
    /* Body text */
    .body-text { color: #334155; font-size: 0.8rem; line-height: 1.7; }
    /* Bullet list */
    ul.problem-list { list-style: disc; padding-left: 1.2rem; color: #334155; font-size: 0.8rem; }
    ul.problem-list li { margin-bottom: 0.3rem; }
    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 0.78rem; margin-top: 0.5rem; }
    thead tr { background: #f8fafc; }
    th { padding: 8px 10px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.05em; color: #64748b; border-bottom: 2px solid #e2e8f0; }
    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    td:first-child { font-weight: 600; color: #0f172a; }
    td:last-child { font-weight: 700; color: #16a34a; }
    /* Sidebar cards */
    .side-card { border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; }
    .side-card h3 { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem; }
    .side-row { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.5rem; }
    .side-row .label { color: #64748b; }
    .side-row .value { font-weight: 700; color: #0f172a; }
    .side-row .value.green { color: #16a34a; }
    .mentor-card { border: 2px solid #16a34a; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; }
    .mentor-title { font-size: 0.8rem; font-weight: 700; color: #16a34a; margin-bottom: 0.5rem; }
    .mentor-text { font-size: 0.75rem; color: #334155; line-height: 1.6; }
    /* Footer */
    .print-footer { margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; font-size: 0.65rem; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 1rem; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>Rencana Bisnis Anda</h1>
    <p>Draf rencana bisnis terstruktur otomatis yang siap direalisasikan dan diajukan ke calon investor.</p>
    <span class="print-badge">Auto-Generated by AI · PetaKarier</span>
  </div>

  <div class="layout">
    <div class="col-main">
      <div class="card">
        <p class="section-title">1. Ringkasan Eksekutif</p>
        <p class="body-text">${document.querySelector("#plan-dokumen [data-print='ringkasan']")?.textContent ?? ""}</p>
      </div>
      <div class="card">
        <p class="section-title">2. Analisis Masalah</p>
        <ul class="problem-list">
          <li class="body-text">${document.querySelector("#plan-dokumen [data-print='masalah1']")?.textContent ?? ""}</li>
          <li class="body-text">${document.querySelector("#plan-dokumen [data-print='masalah2']")?.textContent ?? ""}</li>
        </ul>
      </div>
      <div class="card">
        <p class="section-title">3. Proyeksi Keuangan (3 Bulan Pertama)</p>
        <table>
          <thead>
            <tr>
              <th>Bulan</th><th>Modal</th><th>Operasional</th><th>Revenue</th><th>Est. Profit</th>
            </tr>
          </thead>
          <tbody id="print-table-body"></tbody>
        </table>
      </div>
    </div>
    <div class="col-side">
      <div class="side-card">
        <h3>Data Finansial Terpilih</h3>
        <div class="side-row"><span class="label">Estimasi Modal</span><span class="value">${document.querySelector("#plan-dokumen [data-print='modal']")?.textContent ?? "Rp 45.000.000"}</span></div>
        <div class="side-row"><span class="label">Rasio UMR Kota</span><span class="value green">${document.querySelector("#plan-dokumen [data-print='umr']")?.textContent ?? "1.52× Lebih Tinggi"}</span></div>
        <div class="side-row"><span class="label">Target Margin Laba</span><span class="value">${document.querySelector("#plan-dokumen [data-print='margin']")?.textContent ?? "42.6%"}</span></div>
      </div>
      <div class="mentor-card">
        <p class="mentor-title">&#x2728; Petunjuk Mentor Virtual</p>
        <p class="mentor-text">${document.querySelector("#plan-dokumen [data-print='mentor']")?.textContent ?? ""}</p>
      </div>
    </div>
  </div>

  <div class="print-footer">
    Dicetak dari PetaKarier &mdash; Platform Akselerasi Wirausaha Muda Indonesia &middot; Selaras RAN TPB / SDG 8
  </div>

  <script>
    // Inject proyeksi table rows from data attribute
    const rows = ${JSON.stringify(proyeksi)};
    const tbody = document.getElementById('print-table-body');
    rows.forEach(function(r) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>' + r.bulan + '</td><td>' + r.modal + '</td><td>' + r.operasional + '</td><td>' + r.revenue + '</td><td>' + r.profit + '</td>';
      tbody.appendChild(tr);
    });
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
      // Save & close current section
      setEditingSection(null);
      toast.success("Perubahan berhasil disimpan!");
    } else {
      // Close any open section, open the new one
      setEditingSection(section);
    }
  };

  const updateProyeksiField = (
    index: number,
    field: "modal" | "operasional" | "revenue" | "profit",
    value: string
  ) => {
    setProyeksi((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div id="plan-dokumen" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* ══════════════════════════════════════════════════════════════════
          TOP HEADER: TITLE, SUBTITLE & AUTO-GENERATED BY AI PILL BADGE
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rencana Bisnis Anda
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Draf rencana bisnis terstruktur otomatis yang siap direalisasikan dan diajukan ke calon investor.
          </p>
        </div>

        {/* Right Badge: AUTO-GENERATED BY AI */}
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:bg-slate-900/80 dark:text-[#00df82] dark:border-emerald-500/40 shadow-sm">
            AUTO-GENERATED BY AI
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN 2-COLUMN LAYOUT: CONTENT CARD (LEFT) & FINANCIAL SIDEBAR (RIGHT)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: MAIN BUSINESS PLAN SECTIONS & ACTIONS ── */}
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
                <textarea
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                  autoFocus
                />
              ) : (
                <p data-print="ringkasan" className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                  {ringkasan}
                </p>
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
                    onChange={(e) => setMasalah1(e.target.value)}
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={masalah2}
                    onChange={(e) => setMasalah2(e.target.value)}
                    className="w-full rounded-xl border border-emerald-400/50 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#00df82] focus:ring-1 focus:ring-[#00df82]/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition"
                  />
                </div>
              ) : (
                <ul className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">•</span>
                    <span data-print="masalah1">{masalah1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">•</span>
                    <span data-print="masalah2">{masalah2}</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Section 3: Proyeksi Keuangan (3 Bulan Pertama) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-emerald-600 dark:text-[#00df82] tracking-tight">
                  3. Proyeksi Keuangan (3 Bulan Pertama)
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

              {/* Financial Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[440px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0f172a]/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="py-3 px-4">Bulan</th>
                        <th className="py-3 px-4">Modal</th>
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

        {/* ── RIGHT COLUMN: DATA FINANSIAL TERPILIH & MENTOR VIRTUAL ── */}
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
                <span data-print="modal" className="font-extrabold text-slate-900 dark:text-white">
                  Rp 45.000.000
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Rasio UMR Kota
                </span>
                <span data-print="umr" className="font-extrabold text-emerald-600 dark:text-[#00df82]">
                  1.52× Lebih Tinggi
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Target Margin Laba
                </span>
                <span data-print="margin" className="font-extrabold text-slate-900 dark:text-white">
                  42.6%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Petunjuk Mentor Virtual (Highlighted with Green Border) */}
          <div className="rounded-[2.2rem] border-2 border-emerald-500/50 bg-white p-6 sm:p-7 shadow-xl shadow-emerald-500/10 dark:border-emerald-500/50 dark:bg-[#0a0f1d] dark:shadow-2xl transition-colors space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00df82]">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-xs sm:text-sm font-bold">
                Petunjuk Mentor Virtual
              </h3>
            </div>

            <p data-print="mentor" className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
              Proyeksi Bulan ke-3 menunjukkan kenaikan tren profit stabil. Hubungi mentor finansial kami jika ingin mempersiapkan berkas pengajuan modal tambahan mikro.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
