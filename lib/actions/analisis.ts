"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
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
    const session = await auth();
    let userId: string | undefined = undefined;

    if (session?.user?.email) {
      const userRecord = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (userRecord) {
        userId = userRecord.id;
      }
    }

    const defaultUsahaId = rekomendasi[0]?.usaha.id ?? "kedai-kopi";

    const created = await prisma.analisis.create({
      data: {
        userId,
        minat: profil.minat,
        skill: profil.skill,
        budget: profil.budget,
        waktu: profil.waktu,
        pengalaman: profil.pengalaman,
        rekomendasi: JSON.parse(JSON.stringify(rekomendasi)),
        usahaId: defaultUsahaId,
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
    console.warn("[Analisis] Database insertion failed, continuing with local id:", err);
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
    console.warn("[Analisis] Database query failed for getAnalisisById:", err);
    return null;
  }
}

/**
 * Fetch the active user's latest analysis session from PostgreSQL
 */
export async function getUserActiveAnalisis() {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;

    const userRecord = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!userRecord) return null;

    const latestAnalisis = await prisma.analisis.findFirst({
      where: { userId: userRecord.id },
      orderBy: { updatedAt: "desc" },
      include: {
        usaha: true,
        kota: true,
        sdgImpact: true,
        rencanaBisnis: true,
      },
    });

    return latestAnalisis;
  } catch (err) {
    console.warn("[Analisis] Database query failed for getUserActiveAnalisis:", err);
    return null;
  }
}

/**
 * Update financial & city calculator parameters on the active analysis in PostgreSQL
 */
export async function updateKalkulatorAction(input: {
  analisisId?: string | null;
  usahaId: string;
  kotaId: string;
  skala?: string;
  modalAwal?: number;
  operasional?: number;
  hasilModal?: any;
}) {
  try {
    const session = await auth();
    let userId: string | undefined = undefined;

    if (session?.user?.email) {
      const userRecord = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (userRecord) userId = userRecord.id;
    }

    // If we have an existing analysis ID
    if (input.analisisId && !input.analisisId.startsWith("local-")) {
      const updated = await prisma.analisis.update({
        where: { id: input.analisisId },
        data: {
          usahaId: input.usahaId,
          kotaId: input.kotaId,
          skala: input.skala || "sedang",
          hasilModal: input.hasilModal ? JSON.parse(JSON.stringify(input.hasilModal)) : undefined,
          ...(userId ? { userId } : {}),
        },
      });
      return { success: true, id: updated.id };
    }

    // If user is logged in, update user's latest analysis
    if (userId) {
      const latest = await prisma.analisis.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (latest) {
        const updated = await prisma.analisis.update({
          where: { id: latest.id },
          data: {
            usahaId: input.usahaId,
            kotaId: input.kotaId,
            skala: input.skala || "sedang",
            hasilModal: input.hasilModal ? JSON.parse(JSON.stringify(input.hasilModal)) : undefined,
          },
        });
        return { success: true, id: updated.id };
      }
    }

    return { success: true, id: input.analisisId };
  } catch (err) {
    console.warn("[Analisis] Failed to update kalkulator action in database:", err);
    return { success: false, error: "Gagal menyimpan kalkulasi ke database" };
  }
}

/**
 * Save and persist custom business plan to PostgreSQL
 */
export async function saveBusinessPlanAction(input: {
  analisisId?: string | null;
  usahaId: string;
  kotaId: string;
  namaUsaha: string;
  ringkasan: string;
  masalah1: string;
  masalah2: string;
  proyeksi: any[];
  kontenMd?: string;
}) {
  try {
    const session = await auth();
    let effectiveAnalisisId = input.analisisId;

    if (!effectiveAnalisisId || effectiveAnalisisId.startsWith("local-")) {
      if (session?.user?.email) {
        const userRecord = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (userRecord) {
          const latest = await prisma.analisis.findFirst({
            where: { userId: userRecord.id },
            orderBy: { updatedAt: "desc" },
          });
          if (latest) effectiveAnalisisId = latest.id;
        }
      }
    }

    if (!effectiveAnalisisId || effectiveAnalisisId.startsWith("local-")) {
      return { success: true, message: "Disimpan secara lokal" };
    }

    const payload = JSON.stringify({
      namaUsaha: input.namaUsaha,
      ringkasan: input.ringkasan,
      masalah1: input.masalah1,
      masalah2: input.masalah2,
      proyeksi: input.proyeksi,
      kontenMd: input.kontenMd || "",
    });

    await prisma.rencanaBisnis.upsert({
      where: { analisisId: effectiveAnalisisId },
      update: {
        usahaId: input.usahaId,
        kotaId: input.kotaId,
        kontenMd: payload,
      },
      create: {
        analisisId: effectiveAnalisisId,
        usahaId: input.usahaId,
        kotaId: input.kotaId,
        kontenMd: payload,
      },
    });

    // Update global platform stats increment
    await prisma.platformStats
      .upsert({
        where: { id: "global" },
        update: { totalRencanaBisnis: { increment: 1 } },
        create: { id: "global", totalRencanaBisnis: 1 },
      })
      .catch(() => {});

    return { success: true };
  } catch (err) {
    console.warn("[Analisis] Failed to save business plan to database:", err);
    return { success: false, error: "Gagal menyimpan rencana bisnis ke database" };
  }
}
