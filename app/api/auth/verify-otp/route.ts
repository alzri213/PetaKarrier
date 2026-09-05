import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, otp } = await request.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan kode OTP diperlukan" },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Format kode OTP tidak valid. Harus 6 digit angka." },
        { status: 400 }
      );
    }

    // Get stored OTP data
    const storedData = await prisma.otpVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!storedData) {
      return NextResponse.json(
        { error: "Kode OTP tidak ditemukan atau sudah expired. Silakan minta kode baru." },
        { status: 404 }
      );
    }

    // Check if expired
    if (storedData.expiresAt < new Date()) {
      await prisma.otpVerification.delete({ where: { id: storedData.id } });
      return NextResponse.json(
        { error: "Kode OTP sudah expired. Silakan minta kode baru." },
        { status: 410 }
      );
    }

    // Check if already verified
    if (storedData.verifiedAt) {
      return NextResponse.json(
        { error: "Kode OTP sudah digunakan. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, storedData.code);

    if (!isValid) {
      // Increment failed attempts
      const attemptsLeft = 3 - storedData.verifyAttempts;
      
      if (attemptsLeft <= 0) {
        await prisma.otpVerification.delete({ where: { id: storedData.id } });
        return NextResponse.json(
          { error: "Terlalu banyak percobaan gagal. Silakan minta kode OTP baru." },
          { status: 429 }
        );
      }

      await prisma.otpVerification.update({
        where: { id: storedData.id },
        data: { verifyAttempts: { increment: 1 } },
      });

      return NextResponse.json(
        { 
          error: `Kode OTP salah. ${attemptsLeft} percobaan tersisa.`,
          attemptsLeft 
        },
        { status: 400 }
      );
    }

    // Mark as verified (one-time use)
    await prisma.otpVerification.update({
      where: { id: storedData.id },
      data: { verifiedAt: new Date() },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kode OTP berhasil diverifikasi!",
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      {
        error: "Gagal memverifikasi kode OTP. Silakan coba lagi.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
