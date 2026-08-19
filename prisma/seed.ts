import { PrismaClient } from "@prisma/client";
import jenisUsahaList from "../lib/data/jenisUsaha.json";
import kotaList from "../lib/data/umr.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for KonekUMKM database...");

  // Seed Kota
  console.log("📍 Seeding Kota data...");
  for (const k of kotaList) {
    await prisma.kota.upsert({
      where: { id: k.id },
      update: {
        nama: k.nama,
        provinsi: k.provinsi,
        umr: k.umr,
        sewaTempat: k.sewaTempat,
        utilitas: k.utilitas,
        retribusi: k.retribusi,
      },
      create: {
        id: k.id,
        nama: k.nama,
        provinsi: k.provinsi,
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
