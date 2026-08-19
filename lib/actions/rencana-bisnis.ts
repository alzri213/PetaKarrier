"use server";

import { prisma } from "@/lib/prisma";
import { generateRencana } from "@/lib/logic/generateRencana";
import { hitungSdgImpact } from "@/lib/logic/sdgCalculator";
import { formatTanggal } from "@/lib/utils/formatCurrency";
import type { HasilModal, ProfilUser, RencanaBisnisData } from "@/types";

export interface GenerateRencanaResponse {
  success: boolean;
  markdown?: string;
  rencanaId?: string;
  error?: string;
}

export async function generateRencanaAction(
  data: {
    profil: ProfilUser;
    hasilModal: HasilModal;
    analisisId?: string;
  }
): Promise<GenerateRencanaResponse> {
  const { profil, hasilModal, analisisId } = data;

  if (!hasilModal || !hasilModal.usaha || !hasilModal.kota) {
    return {
      success: false,
      error: "Data kalkulasi tidak lengkap",
    };
  }

  const sdgImpact = hitungSdgImpact(
    hasilModal.usaha,
    hasilModal.kota,
    hasilModal.skala,
    hasilModal
  );

  const rencanaData: RencanaBisnisData = {
    profil,
    usaha: hasilModal.usaha,
    kota: hasilModal.kota,
    hasilModal,
    dibuatPada: formatTanggal(new Date().toISOString()),
    sdgImpact,
  };

  const markdown = generateRencana(rencanaData);
  let rencanaId = "rencana-" + Date.now();

  if (analisisId && !analisisId.startsWith("local-")) {
    try {
      // Upsert SDG impact
      await prisma.sdgImpact.upsert({
        where: { analisisId },
        update: {
          estimasiLapanganKerja: sdgImpact.estimasiLapanganKerja,
          potensiPendapatanLokal: sdgImpact.potensiPendapatanLokal,
          tingkatInklusivitas: sdgImpact.tingkatInklusivitas,
          digitalReadiness: sdgImpact.digitalReadiness,
        },
        create: {
          analisisId,
          estimasiLapanganKerja: sdgImpact.estimasiLapanganKerja,
          potensiPendapatanLokal: sdgImpact.potensiPendapatanLokal,
          tingkatInklusivitas: sdgImpact.tingkatInklusivitas,
          digitalReadiness: sdgImpact.digitalReadiness,
        },
      });

      // Upsert RencanaBisnis
      const rb = await prisma.rencanaBisnis.upsert({
        where: { analisisId },
        update: {
          usahaId: hasilModal.usaha.id,
          kotaId: hasilModal.kota.id,
          kontenMd: markdown,
        },
        create: {
          analisisId,
          usahaId: hasilModal.usaha.id,
          kotaId: hasilModal.kota.id,
          kontenMd: markdown,
        },
      });
      rencanaId = rb.id;

      // Increment stats
      await prisma.platformStats
        .upsert({
          where: { id: "global" },
          update: {
            totalRencanaBisnis: { increment: 1 },
            totalEstimasiUMKM: { increment: 1 },
            totalEstimasiKerja: { increment: sdgImpact.estimasiLapanganKerja },
          },
          create: {
            id: "global",
            totalRencanaBisnis: 1,
            totalEstimasiUMKM: 1,
            totalEstimasiKerja: sdgImpact.estimasiLapanganKerja,
          },
        })
        .catch(() => {});
    } catch (err) {
      console.warn("⚠️ Database insertion failed for RencanaBisnis:", err);
    }
  }

  return {
    success: true,
    markdown,
    rencanaId,
  };
}

export async function getRencanaBisnisById(id: string) {
  try {
    const data = await prisma.rencanaBisnis.findUnique({
      where: { id },
      include: {
        analisis: {
          include: {
            sdgImpact: true,
          },
        },
        usaha: true,
        kota: true,
      },
    });
    return data;
  } catch (err) {
    console.warn("⚠️ Database query failed for getRencanaBisnisById:", err);
    return null;
  }
}
