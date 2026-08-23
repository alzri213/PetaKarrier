import { formatRupiah } from "@/lib/utils/formatCurrency";
import type { JenisUsaha, ProfilUser, Rekomendasi } from "@/types";
import fallbackJenisUsaha from "@/lib/data/jenisUsaha.json";

const SKILL_KATEGORI: Record<string, string[]> = {
  Kuliner: ["memasak", "peracik-kopi", "logistik", "kemasan", "manajemen-waktu"],
  Fashion: ["fashion", "foto-produk", "sablon", "desain", "sosial-media"],
  Kreatif: ["desain", "fotografi", "editing-video", "sosial-media", "public-speaking"],
  Jasa: ["ketelitian", "pelayanan", "teknik", "negosiasi", "manajemen-waktu"],
  Agribisnis: ["berkebun", "teknologi", "riset"],
  Digital: ["teknologi", "editing-video", "sosial-media", "desain", "negosiasi"],
  Kecantikan: ["pelayanan", "ketelitian", "sosial-media", "fashion"],
  Pendidikan: ["public-speaking", "ketelitian", "manajemen-waktu", "teknologi"],
};

function skorMinat(usaha: JenisUsaha, minat: string[]): number {
  if (minat.length === 0) return 50;
  return minat.includes(usaha.kategori) ? 100 : 35;
}

function skorSkill(usaha: JenisUsaha, skill: string[]): number {
  if (skill.length === 0) return 55;
  const cocok = usaha.tags.filter((t) => skill.includes(t)).length;
  const bobot = Math.min(1, cocok / Math.min(usaha.tags.length, 2));
  return Math.round(40 + bobot * 60);
}

function skorBudget(usaha: JenisUsaha, budget: number): number {
  if (budget >= usaha.modalMin) {
    if (budget >= usaha.modalMax * 0.7) return 100;
    return 85;
  }
  const kekurangan = usaha.modalMin - budget;
  const rasio = kekurangan / usaha.modalMin;
  if (rasio <= 0.15) return 70;
  if (rasio <= 0.3) return 55;
  return 25;
}

function bonusWaktu(usaha: JenisUsaha, waktu: string): number {
  if (waktu === "parttime") {
    const ringan = ["jastip", "les-privat", "content-creator", "makanan-rumahan", "jasa-web-digital"];
    return ringan.includes(usaha.id) ? 5 : 0;
  }
  return 2;
}

export function rekomendasikanUsaha(
  profil: ProfilUser,
  customUsahaList?: JenisUsaha[]
): Rekomendasi[] {
  const dataList = customUsahaList && customUsahaList.length > 0
    ? customUsahaList
    : (fallbackJenisUsaha as unknown as JenisUsaha[]);

  const hasil: Rekomendasi[] = dataList.map((usaha) => {
    const sMinat = skorMinat(usaha, profil.minat);
    const sSkill = skorSkill(usaha, profil.skill);
    const sBudget = skorBudget(usaha, profil.budget);
    const skor = Math.round(
      sMinat * 0.4 + sSkill * 0.3 + sBudget * 0.3 + bonusWaktu(usaha, profil.waktu)
    );

    const alasanParts: string[] = [];
    if (sMinat >= 90) alasanParts.push("sesuai bidang yang kamu minati");
    if (sSkill >= 80) alasanParts.push("keterampilanmu sangat mendukung usaha ini");
    if (sBudget >= 90) alasanParts.push("modal awal terpenuhi dengan budget kamu");
    else if (sBudget >= 55)
      alasanParts.push("hanya butuh pengaturan budget ekstra kecil");
    else if (sBudget < 55)
      alasanParts.push("kamu bisa mulai skala lebih kecil lalu naik bertahap");

    const alasan =
      alasanParts.length > 0
        ? alasanParts.join(", ")
        : "bisa kamu mulai dengan modal & waktu yang kamu punya";

    const sdgScore = Math.round(
      (usaha.potensi * 20) * 0.4 + (usaha.marginBulanan > 4_000_000 ? 90 : 75) * 0.6
    );

    const lapanganKerja = usaha.gajiKaryawan > 0 ? 2 : 1;

    return {
      usaha,
      skor,
      skorMinat: sMinat,
      skorSkill: sSkill,
      skorBudget: sBudget,
      alasan: alasan.charAt(0).toUpperCase() + alasan.slice(1) + ".",
      estimasiModal: Math.round((usaha.modalMin + usaha.modalMax) / 2),
      sdgScore,
      lapanganKerjaEstimasi: lapanganKerja,
    };
  });

  hasil.sort((a, b) => b.skor - a.skor);
  return hasil.slice(0, 3).map((h) => ({
    ...h,
    alasan: `${h.usaha.cocokUntuk}. ${h.alasan} Perkiraan modal awal ${formatRupiah(
      h.estimasiModal
    )}.`,
  }));
}

export { SKILL_KATEGORI };
