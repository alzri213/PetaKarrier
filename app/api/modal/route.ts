import { hitungModalAction } from "@/lib/actions/kalkulator";
import type { HitungModalInputType } from "@/lib/validations/analisis";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as HitungModalInputType;
    const res = await hitungModalAction(input);
    if (!res.success || !res.hasil) {
      return Response.json({ error: res.error }, { status: 400 });
    }
    return Response.json({ hasil: res.hasil });
  } catch {
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
