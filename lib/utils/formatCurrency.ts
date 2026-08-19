export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

export function formatRupiahSingkat(angka: number): string {
  if (angka >= 1_000_000_000) return `Rp${(angka / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (angka >= 1_000_000) return `Rp${(angka / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (angka >= 1_000) return `Rp${(angka / 1_000).toFixed(0)} rb`;
  return `Rp${angka}`;
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
