import { submitAnalisisAction } from "@/lib/actions/analisis";
import type { ProfilUserInput } from "@/lib/validations/analisis";

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
