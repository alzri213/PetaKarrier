"use server";

import { prisma } from "@/lib/prisma";
import { rekomendasikanUsaha } from "@/lib/logic/rekomendasiUsaha";
import { getDaftarUsaha } from "@/lib/actions/data";
import { ProfilUserSchema, type ProfilUserInput } from "@/lib/validations/analisis";
import type { Rekomendasi } from "@/types";

export interface SubmitAnalisisResponse {
  success: boolean;
  id?: string;
  rekomendasi?: Rekomendasi[];
  error?: string;
}

export async function submitAnalisisAction(
  rawInput: ProfilUserInput
): Promise<SubmitAnalisisResponse> {
  const parsed = ProfilUserSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data profil tidak valid",
    };
  }

  const profil = parsed.data;
  const daftarUsaha = await getDaftarUsaha();
  const rekomendasi = rekomendasikanUsaha(profil, daftarUsaha);

  let analisisId = "local-" + Date.now();

  try {
    const created = await prisma.analisis.create({
      data: {
        minat: profil.minat,
        skill: profil.skill,
        budget: profil.budget,
        waktu: profil.waktu,
        pengalaman: profil.pengalaman,
        rekomendasi: JSON.parse(JSON.stringify(rekomendasi)),
      },
    });
    analisisId = created.id;

    // Update global platform stats increment
    await prisma.platformStats
      .upsert({
        where: { id: "global" },
        update: { totalAnalisis: { increment: 1 } },
        create: { id: "global", totalAnalisis: 1 },
      })
      .catch(() => {});
  } catch (err) {
    console.warn("⚠️ Database insertion failed for Analisis, continuing with local id:", err);
  }

  return {
    success: true,
    id: analisisId,
    rekomendasi,
  };
}

export async function getAnalisisById(id: string) {
  try {
    const data = await prisma.analisis.findUnique({
      where: { id },
      include: {
        usaha: true,
        kota: true,
        sdgImpact: true,
        rencanaBisnis: true,
      },
    });
    return data;
  } catch (err) {
    console.warn("⚠️ Database query failed for getAnalisisById:", err);
    return null;
  }
}
