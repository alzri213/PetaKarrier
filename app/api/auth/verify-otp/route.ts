import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Share the same OTP store with send-otp (in production, use Redis or database)
// This is a workaround for the module scope
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number; verified: boolean }>();

// Export function to sync with send-otp store
export function getOTPStore() {
  return otpStore;
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

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
    const storedData = otpStore.get(email);

    if (!storedData) {
      return NextResponse.json(
        { error: "Kode OTP tidak ditemukan atau sudah expired. Silakan minta kode baru." },
        { status: 404 }
      );
    }

    // Check if expired
    if (storedData.expiresAt < Date.now()) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: "Kode OTP sudah expired. Silakan minta kode baru." },
        { status: 410 }
      );
    }

    // Check if already verified
    if (storedData.verified) {
      return NextResponse.json(
        { error: "Kode OTP sudah digunakan. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, storedData.code);

    if (!isValid) {
      // Increment failed attempts
      const attemptsLeft = 3 - (storedData.attempts || 0);
      
      if (attemptsLeft <= 0) {
        otpStore.delete(email);
        return NextResponse.json(
          { error: "Terlalu banyak percobaan gagal. Silakan minta kode OTP baru." },
          { status: 429 }
        );
      }

      storedData.attempts = (storedData.attempts || 0) + 1;
      otpStore.set(email, storedData);

      return NextResponse.json(
        { 
          error: `Kode OTP salah. ${attemptsLeft} percobaan tersisa.`,
          attemptsLeft 
        },
        { status: 400 }
      );
    }

    // Mark as verified (one-time use)
    storedData.verified = true;
    otpStore.set(email, storedData);

    // Clean up after 2 minutes
    setTimeout(() => {
      otpStore.delete(email);
    }, 2 * 60 * 1000);

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
