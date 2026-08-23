import { formatRupiah } from "@/lib/utils/formatCurrency";
import type { RencanaBisnisData } from "@/types";

const LABEL_SKALA: Record<string, string> = {
  kecil: "Skala Kecil (1 Orang / Rintisan Mandiri)",
  sedang: "Skala Sedang (Tim 2–4 Orang)",
  besar: "Skala Besar (Ekspansi & Komersial Penuh)",
};

export function generateRencana(data: RencanaBisnisData): string {
  const { profil, usaha, kota, hasilModal, sdgImpact } = data;
  const be = hasilModal.breakEvenBulan;
  const bulanBE = Number.isFinite(be) ? Math.ceil(be) : 12;

  const tenagaKerja = sdgImpact?.estimasiLapanganKerja ?? (hasilModal.skala === "besar" ? 5 : hasilModal.skala === "sedang" ? 3 : 1);

  return `# 📋 Dokumen Rencana Bisnis — ${usaha.nama}

**Diterbitkan Oleh:** Platform PetaKarier · Selaras RAN TPB / SDG 8 Indonesia
**Tanggal Pembuatan:** ${data.dibuatPada}
**Status Validasi:** Siap Eksekusi & Pengajuan Pendanaan

---

## 1. Ringkasan Eksekutif (Executive Summary)

Usaha **${usaha.nama}** (${usaha.emoji}) merupakan model usaha terkurasi pada kategori **${usaha.kategori}**, dirancang khusus berdasarkan profil kapabilitas, ketersediaan modal awal, serta potensi ekonomi lokal di wilayah **${kota.nama}, ${kota.provinsi}**.

- **Domisili Operasional:** ${kota.nama}, ${kota.provinsi}
- **Klasifikasi Skala:** ${LABEL_SKALA[hasilModal.skala]}
- **Kebutuhan Modal Awal:** ${formatRupiah(hasilModal.modalAwal)}
- **Estimasi Laba Bersih/Bulan:** ${formatRupiah(hasilModal.labaBulanan)} (Margin: ${hasilModal.marginBulanan}%)
- **Target Balik Modal (Break-Even Point):** ±${bulanBE} Bulan
- **Benchmark Upah Minimum (${kota.nama}):** ${formatRupiah(hasilModal.labaBulanan)}/bulan vs UMR ${formatRupiah(kota.umr)}

---

## 2. Profil Pendiri & Strategi Eksekusi

- **Bidang Minat Utama:** ${profil.minat.join(", ") || "Wirausaha Umum"}
- **Keahlian Unggulan:** ${profil.skill.join(", ") || "Komitmen Belajar Cepat"}
- **Modal yang Dialokasikan:** ${formatRupiah(profil.budget)}
- **Alokasi Waktu Operasional:** ${
    profil.waktu === "full"
      ? "Full-Time (Fokus Penuh & Skalabilitas Cepat)"
      : profil.waktu === "parttime"
      ? "Part-Time (Usaha Sampingan Produktif)"
      : "Tahap Validasi (Sampling Pasar)"
  }
- **Tingkat Pengalaman:** ${
    profil.pengalaman === "pemula"
      ? "Wirausaha Pemula (Didampingi SOP Terstandar)"
      : profil.pengalaman === "pernah"
      ? "Pernah Berjualan (Memiliki Pemahaman Pasar Dasar)"
      : "Sudah Berjalan (Fokus Optimasi & Ekspansi)"
  }

---

## 3. Value Proposition & Analisis SWOT

### Nilai Tambah (Value Proposition)
${usaha.deskripsi}

**Target Kecocokan:** ${usaha.cocokUntuk}.

### Matriks Analisis SWOT

| Aspek | Analisis Strategis |
|---|---|
| **Strengths (Kekuatan)** | Biaya awal terjangkau, fleksibilitas inovasi produk, pemanfaatan ekosistem digital (social commerce). |
| **Weaknesses (Kelemahan)** | Brand recognition masih baru, kapasitas produksi awal terbatas pada batch per hari. |
| **Opportunities (Peluang)** | Pertumbuhan daya beli masyarakat di ${kota.nama} (UMR ${formatRupiah(kota.umr)}), kemudahan pembayaran QRIS/e-wallet. |
| **Threats (Tantangan)** | ${usaha.resiko}. Fluktuasi harga bahan baku. |

---

## 4. Rincian Alokasi Modal & Kelayakan Finansial

Total estimasi investasi awal yang diperlukan: **${formatRupiah(hasilModal.modalAwal)}**

| Pos Alokasi | Biaya Investasi | Keterangan |
|---|---|---|
| Peralatan & Perlengkapan Aset | ${formatRupiah(hasilModal.rincianModal.peralatan)} | Mesin, tools, workstation kerja |
| Sewa Muka Tempat (3 Bulan) | ${formatRupiah(hasilModal.rincianModal.sewaMuka)} | Lokasi strategis di ${kota.nama} |
| Bahan Baku & Stok Perdana | ${formatRupiah(hasilModal.rincianModal.bahanBakuAwal)} | Buffer operasional awal |
| Legalitas & Perizinan (NIB/PIRT) | ${formatRupiah(hasilModal.rincianModal.perizinan)} | OSS RBA & sertifikasi dasar |
| Kampanye Promosi Awal | ${formatRupiah(hasilModal.rincianModal.promosiAwal)} | Ads digital, kemasan tester, banner |

### Proyeksi Arus Kas Bulanan
- **Estimasi Omzet Penjualan:** ${formatRupiah(hasilModal.pendapatanBulanan)} / bulan
- **Total Beban Operasional:** ${formatRupiah(hasilModal.operasionalBulanan)} / bulan
- **Laba Bersih Sebelum Pajak:** ${formatRupiah(hasilModal.labaBulanan)} / bulan
- **Status Ekonomi vs UMR:** ${
    hasilModal.selisihVsUMR >= 0
      ? `Laba usaha LEBIH TINGGI ${formatRupiah(hasilModal.selisihVsUMR)}/bulan (+${((hasilModal.labaBulanan / kota.umr) * 100).toFixed(0)}%) dari gaji UMR ${kota.nama}.`
      : `Laba usaha masih di bawah UMR ${kota.nama} selisih ${formatRupiah(Math.abs(hasilModal.selisihVsUMR))}. Disarankan untuk skala pendampingan kerja hingga volume naik.`
  }

---

## 5. Keselarasan SDG 8 & RAN TPB Matriks 4 (Pelaku Usaha)

Usaha ini berkontribusi langsung pada pencapaian **Sustainable Development Goals (SDG) 8**: *Pekerjaan Layak dan Pertumbuhan Ekonomi*:

1. **Target 8.3 (Dukungan UMKM & Formalisasi):** Mendorong legalitas resmi via NIB di OSS RBA serta pencatatan keuangan digital terstruktur.
2. **Target 8.5 (Pekerjaan Layak & Inklusif):** Menyerap estimasi **${tenagaKerja} tenaga kerja produktif** dengan tingkat pendapatan yang layak.
3. **Target 8.6 (Pemberdayaan Pemuda):** Mengintegrasikan generasi muda ke dalam aktivitas ekonomi bernilai tambah tinggi.
4. **Matriks 4 RAN TPB:** Mendukung pilar pembangunan ekonomi nasional melalui penguatan rantai pasok lokal di ${kota.provinsi}.

---

## 6. Rencana Aksi Eksekusi 90 Hari (Roadmap)

\`\`\`
Minggu 1-2: Legalitas & Setup ──► Minggu 3-4: Pengadaan & Uji Coba ──► Minggu 5-8: Soft Launch & QRIS ──► Minggu 9-12: Scale & Partnership
\`\`\`

- **Minggu 1–2:** Pendaftaran NIB via OSS, finalisasi resep/katalog, penyiapan akun perbankan & QRIS.
- **Minggu 3–4:** Pengadaan peralatan inti, uji rasa/sampel produk ke 20 orang pertama, pembuatan materi promosi.
- **Minggu 5–8:** Soft launching, penetrasi pasar via WhatsApp & Instagram, aktivasi ulasan bintang 5.
- **Minggu 9–12:** Evaluasi unit economics bulanan, rekrutmen reseller/mitra lokal, penambahan kapasitas batch.

---
*Dokumen ini disusun otomatis secara objektif oleh AI Engine PetaKarier. Pastikan validasi pasar lapangan sebelum komitmen modal penuh.*
`;
}
