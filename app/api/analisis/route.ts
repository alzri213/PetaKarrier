import { getAnalisisById, submitAnalisisAction } from "@/lib/actions/analisis";
import { getDaftarUsaha } from "@/lib/actions/data";
import { rekomendasikanUsaha } from "@/lib/logic/rekomendasiUsaha";
import type { ProfilUserInput } from "@/lib/validations/analisis";
import type { ProfilUser } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const analisis = await getAnalisisById(id);

    if (analisis && analisis.rekomendasi) {
      return Response.json({
        id: analisis.id,
        rekomendasi: analisis.rekomendasi,
        minat: analisis.minat,
        pengalaman: analisis.pengalaman,
        budget: analisis.budget,
      });
    }

    // Fallback: return general curated recommendation if id is local or not in db
    const daftarUsaha = await getDaftarUsaha();
    const fallbackProfil: ProfilUser = {
      minat: ["Kuliner", "Jasa", "Kecantikan"],
      skill: ["memasak", "pelayanan"],
      budget: 15_000_000,
      waktu: "full",
      pengalaman: "pemula",
    };
    const fallbackRekomendasi = rekomendasikanUsaha(fallbackProfil, daftarUsaha);

    return Response.json({
      id,
      rekomendasi: fallbackRekomendasi,
      minat: ["Kuliner", "Jasa", "Kecantikan"],
      pengalaman: "pemula",
      budget: 15_000_000,
    });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProfilUserInput;
    const res = await submitAnalisisAction(body);
    if (!res.success) {
      return Response.json({ error: res.error }, { status: 400 });
    }
    return Response.json({ id: res.id, rekomendasi: res.rekomendasi });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
