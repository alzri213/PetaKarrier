import { PrismaClient } from "@prisma/client";
import jenisUsahaList from "../lib/data/jenisUsaha.json";
import kotaList from "../lib/data/umr.json";

const prisma = new PrismaClient();

function getWilayah(provinsi: string): string {
  if (["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau"].includes(provinsi)) return "Sumatera";
  if (["Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur"].includes(provinsi)) return "Jawa";
  if (["Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur"].includes(provinsi)) return "Nusa Tenggara";
  if (["Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara"].includes(provinsi)) return "Kalimantan";
  if (["Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat"].includes(provinsi)) return "Sulawesi";
  if (["Maluku", "Maluku Utara"].includes(provinsi)) return "Maluku";
  if (["Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"].includes(provinsi)) return "Papua";
  return "Jawa";
}

async function main() {
  console.log("🌱 Starting seed for PetaKarrier database...");

  // Seed Kota
  console.log("📍 Seeding Kota data...");
  for (const k of kotaList) {
    await prisma.kota.upsert({
      where: { id: k.id },
      update: {
        nama: k.nama,
        provinsi: k.provinsi,
        wilayah: getWilayah(k.provinsi),
        umr: k.umr,
        sewaTempat: k.sewaTempat,
        utilitas: k.utilitas,
        retribusi: k.retribusi,
      },
      create: {
        id: k.id,
        nama: k.nama,
        provinsi: k.provinsi,
        wilayah: getWilayah(k.provinsi),
        umr: k.umr,
        sewaTempat: k.sewaTempat,
        utilitas: k.utilitas,
        retribusi: k.retribusi,
      },
    });
  }

  // Seed JenisUsaha
  console.log("🏢 Seeding JenisUsaha data...");
  for (const u of jenisUsahaList) {
    await prisma.jenisUsaha.upsert({
      where: { id: u.id },
      update: {
        nama: u.nama,
        kategori: u.kategori,
        emoji: u.emoji,
        deskripsi: u.deskripsi,
        tags: u.tags,
        modalMin: u.modalMin,
        modalMax: u.modalMax,
        peralatan: u.peralatan,
        bahanBakuBulanan: u.bahanBakuBulanan,
        gajiKaryawan: u.gajiKaryawan,
        promosiBulanan: u.promosiBulanan,
        revenueBulanan: u.revenueBulanan,
        marginBulanan: u.marginBulanan,
        resiko: u.resiko,
        potensi: u.potensi,
        cocokUntuk: u.cocokUntuk,
      },
      create: {
        id: u.id,
        nama: u.nama,
        kategori: u.kategori,
        emoji: u.emoji,
        deskripsi: u.deskripsi,
        tags: u.tags,
        modalMin: u.modalMin,
        modalMax: u.modalMax,
        peralatan: u.peralatan,
        bahanBakuBulanan: u.bahanBakuBulanan,
        gajiKaryawan: u.gajiKaryawan,
        promosiBulanan: u.promosiBulanan,
        revenueBulanan: u.revenueBulanan,
        marginBulanan: u.marginBulanan,
        resiko: u.resiko,
        potensi: u.potensi,
        cocokUntuk: u.cocokUntuk,
      },
    });
  }

  // Seed PlatformStats
  console.log("📊 Seeding initial PlatformStats...");
  await prisma.platformStats.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      totalAnalisis: 1420,
      totalRencanaBisnis: 890,
      totalEstimasiUMKM: 560,
      totalEstimasiKerja: 1680,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
