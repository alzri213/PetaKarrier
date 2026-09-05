import { formatRupiah } from "@/lib/utils/formatCurrency";
import type { JenisUsaha, ProfilUser, Rekomendasi } from "@/types";
import { jenisUsahaSeedList } from "@/prisma/seed-data";

const fallbackJenisUsaha = jenisUsahaSeedList as unknown as JenisUsaha[];

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
  // If the business category is directly chosen by user, give top score 100, otherwise 0
  return minat.includes(usaha.kategori) ? 100 : 0;
}

function skorSkill(usaha: JenisUsaha, skill: string[]): number {
  if (skill.length === 0) return 70; // Neutral baseline if user has no specific skill selected
  const matchingTags = usaha.tags.filter((t) => skill.includes(t));
  if (matchingTags.length === 0) return 30;
  const ratio = matchingTags.length / Math.max(1, usaha.tags.length);
  return Math.min(100, Math.round(50 + ratio * 50));
}

function skorBudget(usaha: JenisUsaha, budget: number): number {
  if (budget >= usaha.modalMin) {
    if (budget <= usaha.modalMax * 1.5) return 100;
    return 90;
  }
  const kekurangan = usaha.modalMin - budget;
  const rasio = kekurangan / usaha.modalMin;
  if (rasio <= 0.2) return 70;
  if (rasio <= 0.4) return 50;
  return 20;
}

function bonusPengalaman(usaha: JenisUsaha, pengalaman: string): number {
  if (pengalaman === "pemula") {
    return usaha.modalMin <= 12_000_000 || usaha.cocokUntuk.toLowerCase().includes("pemula") ? 10 : 0;
  }
  if (pengalaman === "mahir" || pengalaman === "sudah") {
    return usaha.potensi >= 4 ? 10 : 5;
  }
  return 5;
}

function bonusWaktu(usaha: JenisUsaha, waktu: string): number {
  if (waktu === "parttime" || waktu === "sampling" || waktu === "fleksibel") {
    const ringan = ["jastip", "les-privat", "content-creator", "makanan-rumahan", "jasa-web-digital", "desain-grafis", "distro-thrift"];
    return ringan.includes(usaha.id) ? 10 : 0;
  }
  if (waktu === "full") {
    const fullTimeUsaha = ["kedai-kopi", "katering-rumahan", "barbershop-salon", "laundry-kiloan", "cuci-steam", "frozen-food", "hidroponik"];
    return fullTimeUsaha.includes(usaha.id) ? 10 : 5;
  }
  return 5;
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
    const bPengalaman = bonusPengalaman(usaha, profil.pengalaman);
    const bWaktu = bonusWaktu(usaha, profil.waktu);

    // Weighted Score: Minat is king (45%), Skill (25%), Budget (20%), plus Experience & Time bonuses (10%)
    const skor = Math.min(
      100,
      Math.round(sMinat * 0.45 + sSkill * 0.25 + sBudget * 0.20 + bPengalaman + bWaktu)
    );

    const alasanParts: string[] = [];
    if (sMinat >= 90) alasanParts.push(`sesuai minat sektor ${usaha.kategori}`);
    if (sSkill >= 75) alasanParts.push("keahlian Anda sangat mendukung eksekusi usaha ini");
    if (sBudget >= 90) alasanParts.push("modal awal Anda mencukupi kebutuhan pembukaan usaha");
    else if (sBudget >= 60)
      alasanParts.push("modal awal mendekati estimasi minimum dengan penyesuaian alat");
    else
      alasanParts.push("dapat dimulai bertahap dari skala rumahan/pre-order");

    const alasan =
      alasanParts.length > 0
        ? alasanParts.join(", ")
        : "bisa Anda mulai dengan alokasi modal dan waktu yang tersedia";

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

  // Sort descending by calculated score
  hasil.sort((a, b) => b.skor - a.skor);

  return hasil.slice(0, 3).map((h) => ({
    ...h,
    alasan: `${h.usaha.cocokUntuk}. ${h.alasan} Perkiraan modal awal ${formatRupiah(
      h.estimasiModal
    )}.`,
  }));
}

export { SKILL_KATEGORI };
