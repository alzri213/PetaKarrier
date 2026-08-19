"use server";

import { prisma } from "@/lib/prisma";
import { hitungModal } from "@/lib/logic/hitungModal";
import { getDaftarUsaha, getDaftarKota } from "@/lib/actions/data";
import { HitungModalSchema, type HitungModalInputType } from "@/lib/validations/analisis";
import type { HasilModal } from "@/types";

export interface HitungModalResponse {
  success: boolean;
  hasil?: HasilModal;
  error?: string;
}

export async function hitungModalAction(
  rawInput: HitungModalInputType,
  analisisId?: string
): Promise<HitungModalResponse> {
  const parsed = HitungModalSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Input kalkulasi tidak valid",
    };
  }

  const input = parsed.data;
  const daftarUsaha = await getDaftarUsaha();
  const daftarKota = await getDaftarKota();

  const hasil = hitungModal(input, daftarUsaha, daftarKota);
  if (!hasil) {
    return {
      success: false,
      error: "Data jenis usaha atau kota tidak ditemukan",
    };
  }

  if (analisisId && !analisisId.startsWith("local-")) {
    try {
      await prisma.analisis.update({
        where: { id: analisisId },
        data: {
          usahaId: input.usahaId,
          kotaId: input.kotaId,
          skala: input.skala,
          hasilModal: JSON.parse(JSON.stringify(hasil)),
        },
      });
    } catch (err) {
      console.warn("⚠️ Database update failed for Analisis modal calculation:", err);
    }
  }

  return {
    success: true,
    hasil,
  };
}
