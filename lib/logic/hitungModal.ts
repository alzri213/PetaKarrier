import type { HasilModal, HitungModalInput, JenisUsaha, KotaData } from "@/types";
import fallbackJenisUsaha from "@/lib/data/jenisUsaha.json";
import fallbackKota from "@/lib/data/umr.json";

const JENIS_USAHA = fallbackJenisUsaha as unknown as JenisUsaha[];
const KOTA = fallbackKota as unknown as KotaData[];

const SKALA_PENGALI: Record<string, { opex: number; revenue: number; aset: number }> = {
  kecil: { opex: 1, revenue: 1, aset: 1 },
  sedang: { opex: 1.6, revenue: 1.75, aset: 1.5 },
  besar: { opex: 2.4, revenue: 2.8, aset: 2.2 },
};

const SEWA_MUKA_BULAN = 3;
const PERIZINAN = 800_000;

export function hitungModal(
  input: HitungModalInput,
  customUsahaList?: JenisUsaha[],
  customKotaList?: KotaData[]
): HasilModal | null {
  const usahaList = customUsahaList && customUsahaList.length > 0 ? customUsahaList : JENIS_USAHA;
  const kotaList = customKotaList && customKotaList.length > 0 ? customKotaList : KOTA;

  const usaha = usahaList.find((u) => u.id === input.usahaId);
  const kota = kotaList.find((k) => k.id === input.kotaId);
  if (!usaha || !kota) return null;

  const pengali = SKALA_PENGALI[input.skala] ?? SKALA_PENGALI.kecil;

  const peralatan = Math.round(usaha.peralatan * pengali.aset);
  const sewaMuka = kota.sewaTempat * SEWA_MUKA_BULAN;
  const bahanBakuAwal = Math.round(usaha.bahanBakuBulanan * pengali.opex);
  const perizinan = PERIZINAN;
  const promosiAwal = Math.round(usaha.promosiBulanan * pengali.opex);

  const modalAwal =
    peralatan + sewaMuka + bahanBakuAwal + perizinan + promosiAwal;

  const biayaKota = kota.sewaTempat + kota.utilitas + kota.retribusi;
  const operasionalBulanan = Math.round(
    (usaha.bahanBakuBulanan + usaha.gajiKaryawan + usaha.promosiBulanan) *
      pengali.opex +
      biayaKota
  );

  const pendapatanBulanan = Math.round(usaha.revenueBulanan * pengali.revenue);
  const labaBulanan = Math.round(
    usaha.marginBulanan * pengali.revenue - biayaKota
  );

  const breakEvenBulan = labaBulanan > 0 ? modalAwal / labaBulanan : Infinity;
  const modalSetaraUMR = modalAwal / kota.umr;
  const selisihVsUMR = labaBulanan - kota.umr;
  const rasioUMR = (labaBulanan / kota.umr) * 100;

  let kesimpulan: string;
  if (labaBulanan <= 0) {
    kesimpulan = `Skala ${input.skala} ini belum cukup menghasilkan laba. Coba naikkan skala atau pilih usaha dengan efisiensi biaya lebih tinggi.`;
  } else if (selisihVsUMR > 0) {
    kesimpulan = `Dengan estimasi laba ${formatRupiah(
      labaBulanan
    )}/bulan, usaha ini ${rasioUMR.toFixed(
      0
    )}% di atas UMR ${kota.nama} (${formatRupiah(kota.umr)}). Modal kembali dalam ±${formatRupiahBulan(
      breakEvenBulan
    )}.`;
  } else {
    kesimpulan = `Laba bulanan masih di bawah UMR ${kota.nama}. Mulailah sebagai usaha sampingan atau tingkatkan kapasitas pemasaran digital.`;
  }

  // 12-month projections
  const proyeksi12Bulan = Array.from({ length: 12 }, (_, index) => {
    const bulan = index + 1;
    const rampFactor = Math.min(1, 0.6 + (bulan * 0.4) / 6); // 60% start, 100% by month 6
    const rev = Math.round(pendapatanBulanan * rampFactor);
    const opex = Math.round(operasionalBulanan * (0.85 + rampFactor * 0.15));
    const laba = rev - opex;
    return {
      bulan,
      pendapatan: rev,
      biaya: opex,
      laba,
      kumulatif: 0, // calculated below
    };
  });

  let kumulatif = -modalAwal;
  for (const item of proyeksi12Bulan) {
    kumulatif += item.laba;
    item.kumulatif = kumulatif;
  }

  return {
    usaha,
    kota,
    skala: input.skala,
    modalAwal,
    rincianModal: {
      peralatan,
      sewaMuka,
      bahanBakuAwal,
      perizinan,
      promosiAwal,
    },
    operasionalBulanan,
    pendapatanBulanan,
    labaBulanan,
    marginBulanan: Math.round((labaBulanan / pendapatanBulanan) * 100),
    breakEvenBulan,
    umrKota: kota.umr,
    modalSetaraUMR,
    selisihVsUMR,
    kesimpulan,
    proyeksi12Bulan,
  };
}

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export function formatRupiahBulan(bulan: number): string {
  const dibulatkan = Math.ceil(bulan);
  return `${dibulatkan} bulan`;
}

export { KOTA, JENIS_USAHA };
