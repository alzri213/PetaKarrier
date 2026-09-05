import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/auth/userStore";
import { verifyPassword } from "@/lib/auth/hash";

function generateOTP(): string {
  return randomInt(100000, 1000000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, password: rawPassword, recaptchaToken } = await request.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const password = typeof rawPassword === "string" ? rawPassword : "";

    if (!email || !password || !recaptchaToken) {
      return NextResponse.json(
        { error: "Email, password, dan verifikasi keamanan diperlukan" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY tidak ditemukan di environment variables");
      return NextResponse.json(
        { error: "Konfigurasi server tidak lengkap" },
        { status: 500 }
      );
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: recaptchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.error("reCAPTCHA rejected request", {
        errors: recaptchaData["error-codes"] ?? [],
        hostname: recaptchaData.hostname ?? null,
        score: recaptchaData.score ?? null,
        action: recaptchaData.action ?? null,
      });
      return NextResponse.json(
        {
          error: "Verifikasi reCAPTCHA gagal. Pastikan domain Vercel terdaftar pada key reCAPTCHA production.",
        },
        { status: 400 }
      );
    }

    // Solusi 1: Validasi Kredensial (Akun & Password) Sebelum Mengirim OTP
    const user = await findUserByEmail(email);
    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "Email atau password salah. Silakan periksa kembali." },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah. Silakan periksa kembali." },
        { status: 401 }
      );
    }

    const now = new Date();
    const existingOTP = await prisma.otpVerification.findFirst({
      where: { email, expiresAt: { gt: now }, verifiedAt: null },
      orderBy: { createdAt: "desc" },
    });

    // Limit OTP sends per email across all serverless instances.
    if (existingOTP && existingOTP.sendAttempts >= 3) {
      const timeLeft = Math.max(1, Math.ceil((existingOTP.expiresAt.getTime() - Date.now()) / 1000 / 60));
      return NextResponse.json(
        { error: `Terlalu banyak percobaan. Coba lagi dalam ${timeLeft} menit.` },
        { status: 429 }
      );
    }

    const nextAttempts = (existingOTP?.sendAttempts || 0) + 1;

    // Solusi 2: Batalkan/hapus semua OTP lama yang belum diverifikasi agar tidak ada desinkronisasi kode
    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS tidak ditemukan di environment variables");
      return NextResponse.json(
        { error: "Konfigurasi email server tidak lengkap" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PetaKarier Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kode OTP Login Anda - PetaKarier",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 16px 0; background-color: #f8fafc; }
            .container { width: 100%; max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08); }
            .header { background: linear-gradient(135deg, #00df82 0%, #00c975 100%); padding: 28px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; }
            .content { padding: 28px 24px; }
            .otp-box { background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%); border: 2px solid #00df82; border-radius: 12px; padding: 22px 16px; text-align: center; margin: 24px 0; }
            .otp-code { font-size: 40px; font-weight: 900; color: #065f46; letter-spacing: 5px; margin: 8px 0; font-family: 'Courier New', monospace; }
            .info-box { background-color: #f1f5f9; border-left: 4px solid #00df82; padding: 14px 16px; border-radius: 8px; margin: 18px 0; }
            .footer { background-color: #f8fafc; padding: 24px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #64748b; font-size: 13px; margin: 5px 0; }
            .warning { color: #dc2626; font-size: 13px; margin-top: 20px; }
            .button { display: inline-block; background-color: #00df82; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; margin: 20px 0; }
            ul { text-align: left; color: #475569; line-height: 1.8; }
            @media only screen and (max-width: 600px) {
              body { padding: 0; }
              .container { border-radius: 0; }
              .content { padding: 24px 20px; }
              .otp-code { font-size: 36px; letter-spacing: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PetaKarier Security</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Kode Verifikasi Login Anda</p>
            </div>
            
            <div class="content">
              <p style="font-size: 15px; color: #1e293b; line-height: 1.55;">
                Halo,<br><br>
                Anda atau seseorang mencoba masuk ke akun PetaKarier Anda. Gunakan kode OTP berikut untuk melanjutkan proses login:
              </p>

              <div class="otp-box">
                <p style="margin: 0; font-size: 13px; color: #059669; font-weight: 700;">KODE OTP ANDA</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 13px; color: #065f46;">
                  Kode ini berlaku selama <strong>10 menit</strong>
                </p>
              </div>

              <div class="info-box">
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                  <strong>Penting untuk Keamanan Anda:</strong>
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Jangan bagikan kode ini kepada siapa pun</li>
                  <li>Tim PetaKarier tidak akan pernah meminta kode OTP Anda</li>
                  <li>Kode ini hanya valid untuk 1 kali penggunaan</li>
                  <li>Abaikan email ini jika Anda tidak melakukan login</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 30px;">
                Jika tombol tidak berfungsi, salin dan tempel kode di atas ke halaman login.
              </p>

              <p class="warning" style="text-align: center;">
                Jika Anda <strong>tidak</strong> mencoba login, segera amankan akun Anda dan ubah password.
              </p>
            </div>

            <div class="footer">
              <p><strong>PetaKarier</strong> - Platform Akselerator Wirausaha Muda Indonesia</p>
              <p>Selaras dengan SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi</p>
              <p style="margin-top: 15px;">
                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
              </p>
              <p style="margin-top: 10px; font-size: 12px;">
                © ${new Date().getFullYear()} PetaKarier. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        PetaKarier - Kode OTP Login Anda
        
        Kode OTP: ${otp}
        
        Kode ini berlaku selama 10 menit.
        
        PENTING:
        - Jangan bagikan kode ini kepada siapa pun
        - Tim PetaKarier tidak akan pernah meminta kode OTP Anda
        - Kode ini hanya valid untuk 1 kali penggunaan
        
        Jika Anda tidak mencoba login, segera amankan akun Anda.
        
        Terima kasih,
        Tim PetaKarier
      `,
    };

    await transporter.sendMail(mailOptions);

    await prisma.otpVerification.create({
      data: {
        email,
        code: hashedOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        sendAttempts: nextAttempts,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kode OTP telah dikirim ke email Anda. Periksa inbox atau folder spam.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        error: "Gagal mengirim kode OTP. Silakan coba lagi.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
