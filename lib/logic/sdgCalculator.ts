import type { HasilModal, JenisUsaha, KotaData, SdgImpactData } from "@/types";

export function hitungSdgImpact(
  usaha: JenisUsaha,
  kota: KotaData,
  skala: "kecil" | "sedang" | "besar",
  hasilModal: HasilModal
): SdgImpactData {
  // Estimasi serapan tenaga kerja
  let tenagaKerjaDasar = 1; // Founder
  if (skala === "kecil") {
    tenagaKerjaDasar += usaha.gajiKaryawan > 0 ? 1 : 0;
  } else if (skala === "sedang") {
    tenagaKerjaDasar += 2 + (usaha.kategori === "Kuliner" || usaha.kategori === "Jasa" ? 1 : 0);
  } else {
    tenagaKerjaDasar += 4 + (usaha.kategori === "Kuliner" || usaha.kategori === "Agribisnis" ? 2 : 1);
  }

  // Sirkulasi ekonomi lokal bulanan (omzet + pengadaan bahan baku + sewa tempat lokal)
  const potensiPendapatanLokal = Math.round(
    hasilModal.pendapatanBulanan +
      hasilModal.operasionalBulanan * 0.85 +
      kota.sewaTempat
  );

  // Digital readiness score (0 - 100)
  let digitalReadiness = 65;
  if (usaha.tags.includes("sosial-media")) digitalReadiness += 10;
  if (usaha.tags.includes("teknologi")) digitalReadiness += 15;
  if (usaha.tags.includes("desain") || usaha.tags.includes("editing-video")) digitalReadiness += 10;
  digitalReadiness = Math.min(100, digitalReadiness);

  // Inklusivitas level
  let tingkatInklusivitas: "sangat-tinggi" | "tinggi" | "menengah" = "menengah";
  if (usaha.modalMin <= 8_000_000 || usaha.kategori === "Kuliner" || usaha.kategori === "Jasa") {
    tingkatInklusivitas = "sangat-tinggi";
  } else if (usaha.modalMin <= 15_000_000) {
    tingkatInklusivitas = "tinggi";
  }

  // Target SDG 8 relevan
  const targetSDG8 = [
    {
      code: "8.3",
      title: "Mendukung Kewirausahaan, Kreativitas & Inovasi",
      description: "Mendorong formalisasi dan pertumbuhan usaha mikro, kecil, dan menengah (UMKM) melalui akses keuangan dan teknologi.",
      relevance: `Usaha ${usaha.nama} membuka peluang usaha mandiri berbasis modal terjangkau di ${kota.nama}.`,
    },
    {
      code: "8.5",
      title: "Pekerjaan Layak & Pendapatan Produktif",
      description: "Mencapai kesempatan kerja penuh dan produktif serta pekerjaan yang layak untuk semua perempuan dan laki-laki.",
      relevance: `Estimasi laba ${hasilModal.kesimpulan.includes("di atas UMR") ? "mengungguli" : "mendukung"} standar UMR ${kota.nama} dengan jam kerja fleksibel.`,
    },
    {
      code: "8.6",
      title: "Penurunan Proporsi Pemuda Tanpa Kerja (NEET)",
      description: "Secara substansial mengurangi proporsi generasi muda yang tidak bekerja, tidak berpendidikan atau tidak terlatih.",
      relevance: `Menyediakan roadmap terukur bagi pemuda & fresh graduate untuk memulai karier wirausaha mandiri.`,
    },
    {
      code: "8.2",
      title: "Diversifikasi & Peningkatan Produktivitas Ekonomi",
      description: "Mencapai tingkat produktivitas ekonomi yang lebih tinggi melalui diversifikasi, peningkatan mutu teknologi dan inovasi.",
      relevance: `Adopsi digital marketing dan manajemen keuangan terstandar untuk meningkatkan efisiensi operasional.`,
    },
  ];

  const ranMatriks4 = {
    pilar: "Pilar Pembangunan Ekonomi (TPB/SDGs)",
    programPelakuUsaha: "Inkubasi Digital & Fasilitasi Akses Pasar Inklusif untuk UMKM Pemula",
    indikatorDampak: `Penciptaan ${tenagaKerjaDasar} lapangan kerja baru dan perputaran ekonomi lokal estimasi Rp ${(potensiPendapatanLokal / 1_000_000).toFixed(1)} juta/bulan di wilayah ${kota.nama}.`,
  };

  return {
    estimasiLapanganKerja: tenagaKerjaDasar,
    potensiPendapatanLokal,
    tingkatInklusivitas,
    digitalReadiness,
    targetSDG8,
    ranMatriks4,
  };
}
