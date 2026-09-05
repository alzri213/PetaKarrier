import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wilayah = searchParams.get("wilayah");

    // Filter by wilayah if provided
    const kota = await prisma.kota.findMany({
      where: wilayah ? { wilayah } : undefined,
      orderBy: [
        { wilayah: "asc" },
        { provinsi: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: kota,
      count: kota.length,
    });
  } catch (error) {
    console.error("Error fetching kota:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch kota data",
      },
      { status: 500 }
    );
  }
}
