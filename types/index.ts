export type KategoriUsaha =
  | "Kuliner"
  | "Fashion"
  | "Kreatif"
  | "Jasa"
  | "Agribisnis"
  | "Digital"
  | "Kecantikan"
  | "Pendidikan";

export interface JenisUsaha {
  id: string;
  nama: string;
  kategori: KategoriUsaha;
  emoji: string;
  deskripsi: string;
  tags: string[];
  modalMin: number;
  modalMax: number;
  peralatan: number;
  bahanBakuBulanan: number;
  gajiKaryawan: number;
  promosiBulanan: number;
  revenueBulanan: number;
  marginBulanan: number;
  resiko: string;
  potensi: 1 | 2 | 3 | 4 | 5;
  cocokUntuk: string;
}

export interface KotaData {
  id: string;
  nama: string;
  provinsi: string;
  umr: number;
  sewaTempat: number;
  utilitas: number;
  retribusi: number;
}

export interface ProfilUser {
  minat: KategoriUsaha[];
  skill: string[];
  budget: number;
  waktu: "full" | "parttime" | "sampling";
  pengalaman: "pemula" | "pernah" | "sudah";
}

export interface Rekomendasi {
  usaha: JenisUsaha;
  skor: number;
  skorMinat: number;
  skorSkill: number;
  skorBudget: number;
  alasan: string;
  estimasiModal: number;
  sdgScore?: number;
  lapanganKerjaEstimasi?: number;
}

export interface HitungModalInput {
  usahaId: string;
  kotaId: string;
  skala: "kecil" | "sedang" | "besar";
}

export interface HasilModal {
  usaha: JenisUsaha;
  kota: KotaData;
  skala: "kecil" | "sedang" | "besar";
  modalAwal: number;
  rincianModal: {
    peralatan: number;
    sewaMuka: number;
    bahanBakuAwal: number;
    perizinan: number;
    promosiAwal: number;
  };
  operasionalBulanan: number;
  pendapatanBulanan: number;
  labaBulanan: number;
  marginBulanan: number;
  breakEvenBulan: number;
  umrKota: number;
  modalSetaraUMR: number;
  selisihVsUMR: number;
  kesimpulan: string;
  proyeksi12Bulan?: Array<{
    bulan: number;
    pendapatan: number;
    biaya: number;
    laba: number;
    kumulatif: number;
  }>;
}

export interface RencanaBisnisData {
  profil: ProfilUser;
  usaha: JenisUsaha;
  kota: KotaData;
  hasilModal: HasilModal;
  dibuatPada: string;
  sdgImpact?: SdgImpactData;
}

export interface SdgImpactData {
  estimasiLapanganKerja: number;
  potensiPendapatanLokal: number;
  tingkatInklusivitas: "sangat-tinggi" | "tinggi" | "menengah";
  digitalReadiness: number;
  targetSDG8: Array<{
    code: string;
    title: string;
    description: string;
    relevance: string;
  }>;
  ranMatriks4: {
    pilar: string;
    programPelakuUsaha: string;
    indikatorDampak: string;
  };
}

export interface PlatformStatsData {
  totalAnalisis: number;
  totalRencanaBisnis: number;
  totalEstimasiUMKM: number;
  totalEstimasiKerja: number;
  totalKotaAktif: number;
}

export interface ResourceItem {
  id: string;
  kategori: "perizinan" | "pembiayaan" | "digital" | "pelatihan" | "komunitas";
  judul: string;
  deskripsi: string;
  link: string;
  badge: string;
  icon: string;
}
