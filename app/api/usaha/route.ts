import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    const usaha = await prisma.jenisUsaha.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: { nama: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: usaha,
      count: usaha.length,
    });
  } catch (error) {
    console.error("Error fetching jenis usaha:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch jenis usaha data from database",
      },
      { status: 500 }
    );
  }
}
