import test from "node:test";
import assert from "node:assert/strict";
import { hitungModal } from "../lib/logic/hitungModal";
import { hitungSdgImpact } from "../lib/logic/sdgCalculator";
import { rekomendasikanUsaha } from "../lib/logic/rekomendasiUsaha";
import { generateRencana } from "../lib/logic/generateRencana";
import { jenisUsahaSeedList, kotaSeedList } from "../prisma/seed-data";
import type { JenisUsaha, KotaData, ProfilUser, RencanaBisnisData } from "../types";

test("hitungModal menghitung modal dan BEP dengan benar", () => {
  const result = hitungModal({
    usahaId: "makanan-rumahan",
    kotaId: "aceh",
    skala: "kecil",
  });

  assert.ok(result !== null);
  assert.ok(result.modalAwal > 0);
  assert.ok(result.operasionalBulanan > 0);
  assert.ok(result.pendapatanBulanan > 0);
  assert.ok(typeof result.breakEvenBulan === "number");
  assert.ok(result.proyeksi12Bulan && result.proyeksi12Bulan.length === 12);
});

test("hitungModal mengembalikan null jika usaha atau kota tidak valid", () => {
  const result = hitungModal({
    usahaId: "usaha-tidak-ada",
    kotaId: "kota-tidak-ada",
    skala: "kecil",
  });

  assert.equal(result, null);
});

test("hitungSdgImpact menghasilkan estimasi serapan kerja dan target SDG 8", () => {
  const usaha = jenisUsahaSeedList[0] as unknown as JenisUsaha;
  const kota = kotaSeedList[0] as unknown as KotaData;
  const hasilModal = hitungModal({
    usahaId: usaha.id,
    kotaId: kota.id,
    skala: "kecil",
  });

  assert.ok(hasilModal !== null);
  const sdg = hitungSdgImpact(usaha, kota, "kecil", hasilModal);

  assert.ok(sdg.estimasiLapanganKerja >= 1);
  assert.ok(sdg.potensiPendapatanLokal > 0);
  assert.ok(sdg.digitalReadiness >= 0 && sdg.digitalReadiness <= 100);
  assert.ok(sdg.targetSDG8.length >= 3);
  assert.ok(sdg.ranMatriks4.pilar.length > 0);
});

test("rekomendasikanUsaha menghasilkan rekomendasi berperingkat", () => {
  const profil: ProfilUser = {
    minat: ["Kuliner"],
    skill: ["memasak", "manajemen-waktu"],
    budget: 10_000_000,
    pengalaman: "pemula",
    waktu: "fleksibel",
  };

  const rekomendasi = rekomendasikanUsaha(profil);
  assert.ok(Array.isArray(rekomendasi));
  assert.ok(rekomendasi.length > 0);
  assert.ok(rekomendasi[0].skor >= rekomendasi[rekomendasi.length - 1].skor);
  assert.equal(rekomendasi[0].usaha.kategori, "Kuliner");
});

test("generateRencana menghasilkan proposal bisnis lengkap", () => {
  const profil: ProfilUser = {
    minat: ["Kuliner"],
    skill: ["memasak"],
    budget: 10_000_000,
    pengalaman: "pemula",
    waktu: "fleksibel",
  };
  const usaha = jenisUsahaSeedList[0] as unknown as JenisUsaha;
  const kota = kotaSeedList[0] as unknown as KotaData;
  const hasilModal = hitungModal({
    usahaId: usaha.id,
    kotaId: kota.id,
    skala: "kecil",
  });
  assert.ok(hasilModal !== null);

  const data: RencanaBisnisData = {
    profil,
    usaha,
    kota,
    hasilModal,
    dibuatPada: new Date().toISOString(),
  };

  const rencanaMarkdown = generateRencana(data);
  assert.ok(typeof rencanaMarkdown === "string");
  assert.ok(rencanaMarkdown.includes("Dokumen Rencana Bisnis"));
  assert.ok(rencanaMarkdown.includes(usaha.nama));
});
