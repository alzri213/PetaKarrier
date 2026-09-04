import { NextRequest } from "next/server";

// Active Google Gemini model endpoints
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
];

const SYSTEM_PROMPT = `Kamu adalah Asisten AI Resmi PetaKarier — platform akselerator dan inkubator digital wirausaha muda & UMKM Indonesia.
Karakter & Gaya Komunikasi:
- Ramah, cerdas, solutif, santun, dan profesional (menggunakan Bahasa Indonesia yang natural dan luwes).
- Memiliki pengetahuan mendalam seputar kewirausahaan, analisis potensi usaha, perhitungan modal, titik impas (BEP), perbandingan upah UMR regional di Indonesia (Data 2026), perizinan usaha (OSS NIB), sertifikasi halal, dan pengajuan KUR.
- Jawab pertanyaan apa pun yang diajukan pengguna secara langsung, relevan, dan kontekstual. Jika ditanya siapa yang membuatmu atau identitasmu, jelaskan dengan ramah bahwa kamu adalah Asisten Cerdas PetaKarier.
- Selalu format jawaban secara terstruktur dan rapi menggunakan Markdown (gunakan **Teks Tebal** untuk poin penting, penomoran urut 1., 2., 3., atau bullet points jika relevan).`;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Network error";
}

// In-memory rate limiter: max 15 requests per minute per client IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_LENGTH = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  clientData.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  if (isRateLimited(clientIp)) {
    return Response.json(
      { error: "Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mengirim pesan lagi." },
      { status: 429 }
    );
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.messages)) {
      return Response.json(
        { error: "Format request tidak valid." },
        { status: 400 }
      );
    }

    const { messages } = body as {
      messages: { role: string; content: string }[];
    };

    const chatMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    const startIndex = chatMessages.length > 0 && chatMessages[0].role === "assistant" ? 1 : 0;
    const filtered = chatMessages.slice(startIndex).slice(-MAX_HISTORY_LENGTH);

    if (filtered.length === 0) {
      return Response.json(
        { error: "Kirim pesan terlebih dahulu." },
        { status: 400 }
      );
    }

    const latestMessage = filtered[filtered.length - 1];
    if (latestMessage.role === "user" && latestMessage.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Pesan terlalu panjang (maksimal ${MAX_MESSAGE_LENGTH} karakter).` },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return Response.json({
        text: `⚠️ **Kunci API Gemini Belum Dikonfigurasi**\n\nHarap masukkan \`GEMINI_API_KEY\` Anda di dalam file \`.env\` agar asisten AI dapat memproses jawaban secara live.`,
      });
    }

    const contents = filtered.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let lastError = "";

    // Call live Google Gemini LLM
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return Response.json({ text });
          }
        } else {
          const errData = await res.json();
          lastError = errData?.error?.message || `HTTP ${res.status}`;
        }
      } catch (err: unknown) {
        lastError = getErrorMessage(err);
      }
    }

    return Response.json({
      text: `⚠️ **Gagal Menghubungi Google Gemini LLM**\n\n${lastError ? `*Detail kendala: ${lastError}*` : ""}\n\nPastikan kuota API Key aktif atau periksa koneksi internet Anda.`,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return Response.json({
      text: "Terjadi kesalahan saat memproses pesan. Silakan coba lagi beberapa saat lagi.",
    });
  }
}
