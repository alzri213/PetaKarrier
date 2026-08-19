import { KOTA } from "@/lib/logic/hitungModal";
import type { KotaData } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const kota = KOTA.find((k) => k.id === id);
    if (!kota) {
      return Response.json({ error: "Kota tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ kota });
  }

  const ringkas: Pick<KotaData, "id" | "nama" | "provinsi" | "umr">[] = KOTA.map(
    ({ id, nama, provinsi, umr }) => ({ id, nama, provinsi, umr })
  );
  return Response.json({ kota: ringkas });
}
