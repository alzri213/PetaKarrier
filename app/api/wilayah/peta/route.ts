import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let rows: any[] = [];
    if (prisma.provinsi && typeof prisma.provinsi.findMany === "function") {
      rows = await prisma.provinsi.findMany({
        orderBy: { nama: "asc" },
      });
    } else {
      rows = await prisma.$queryRaw<any[]>`SELECT id, nama, wilayah, "avgUmr", "minUmr", "maxUmr", "cityCount", "topSector", "svgPath", "centroidX", "centroidY" FROM "Provinsi" ORDER BY nama ASC`;
    }

    return NextResponse.json(
      {
        viewBox: "0 0 1000 380",
        width: 1000,
        height: 380,
        totalProvinces: rows.length,
        provinces: rows.map((p) => ({
          id: String(p.id),
          name: p.nama,
          wilayah: p.wilayah,
          avgUmr: Number(p.avgUmr),
          minUmr: Number(p.minUmr),
          maxUmr: Number(p.maxUmr),
          cityCount: Number(p.cityCount),
          topSector: p.topSector,
          path: p.svgPath,
          centroid: [Number(p.centroidX), Number(p.centroidY)],
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching provinces from DB:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data peta provinsi dari database" },
      { status: 500 }
    );
  }
}
