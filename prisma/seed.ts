import { PrismaClient } from "@prisma/client";
import { jenisUsahaSeedList, kotaSeedList } from "./seed-data";
import { provinsiSeedList } from "./seed-provinsi";

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
  console.log("[Seed] Starting seed for PetaKarrier database...");

  // Seed Kota
  console.log("[Seed] Seeding Kota data...");
  for (const k of kotaSeedList) {
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
  console.log("[Seed] Seeding JenisUsaha data...");
  for (const u of jenisUsahaSeedList) {
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
  console.log("[Seed] Seeding initial PlatformStats...");
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

  // Seed Provinsi (38 Provinsi Nusantara Vector & UMR)
  console.log("[Seed] Seeding Provinsi data (38 Provinsi)...");
  for (const p of provinsiSeedList) {
    await prisma.provinsi.upsert({
      where: { id: p.id },
      update: {
        nama: p.nama,
        wilayah: p.wilayah,
        avgUmr: p.avgUmr,
        minUmr: p.minUmr,
        maxUmr: p.maxUmr,
        cityCount: p.cityCount,
        topSector: p.topSector,
        svgPath: p.svgPath,
        centroidX: p.centroidX,
        centroidY: p.centroidY,
      },
      create: {
        id: p.id,
        nama: p.nama,
        wilayah: p.wilayah,
        avgUmr: p.avgUmr,
        minUmr: p.minUmr,
        maxUmr: p.maxUmr,
        cityCount: p.cityCount,
        topSector: p.topSector,
        svgPath: p.svgPath,
        centroidX: p.centroidX,
        centroidY: p.centroidY,
      },
    });
  }

  console.log("[Seed] Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("[Seed] Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
