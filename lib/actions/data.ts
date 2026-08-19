"use server";

import { prisma } from "@/lib/prisma";
import type { JenisUsaha, KotaData, KategoriUsaha } from "@/types";
import fallbackJenisUsaha from "@/lib/data/jenisUsaha.json";
import fallbackKota from "@/lib/data/umr.json";

export async function getDaftarUsaha(): Promise<JenisUsaha[]> {
  try {
    const list = await prisma.jenisUsaha.findMany({
      orderBy: { nama: "asc" },
    });
    if (list && list.length > 0) {
      return list as unknown as JenisUsaha[];
    }
  } catch (err) {
    console.warn("⚠️ Database query failed, using fallback static data:", err);
  }
  return fallbackJenisUsaha as unknown as JenisUsaha[];
}

export async function getUsahaById(id: string): Promise<JenisUsaha | null> {
  try {
    const usaha = await prisma.jenisUsaha.findUnique({
      where: { id },
    });
    if (usaha) return usaha as unknown as JenisUsaha;
  } catch (err) {
    console.warn("⚠️ Database query failed, using fallback static data:", err);
  }
  const found = (fallbackJenisUsaha as unknown as JenisUsaha[]).find((u) => u.id === id);
  return found ?? null;
}

export async function getDaftarKota(): Promise<KotaData[]> {
  try {
    const list = await prisma.kota.findMany({
      orderBy: { nama: "asc" },
    });
    if (list && list.length > 0) {
      return list as unknown as KotaData[];
    }
  } catch (err) {
    console.warn("⚠️ Database query failed, using fallback static data:", err);
  }
  return fallbackKota as unknown as KotaData[];
}

export async function getKotaById(id: string): Promise<KotaData | null> {
  try {
    const kota = await prisma.kota.findUnique({
      where: { id },
    });
    if (kota) return kota as unknown as KotaData;
  } catch (err) {
    console.warn("⚠️ Database query failed, using fallback static data:", err);
  }
  const found = (fallbackKota as unknown as KotaData[]).find((k) => k.id === id);
  return found ?? null;
}

export async function getUsahaByKategori(kategori: KategoriUsaha): Promise<JenisUsaha[]> {
  try {
    const list = await prisma.jenisUsaha.findMany({
      where: { kategori },
      orderBy: { nama: "asc" },
    });
    if (list && list.length > 0) {
      return list as unknown as JenisUsaha[];
    }
  } catch (err) {
    console.warn("⚠️ Database query failed, using fallback static data:", err);
  }
  return (fallbackJenisUsaha as unknown as JenisUsaha[]).filter((u) => u.kategori === kategori);
}
