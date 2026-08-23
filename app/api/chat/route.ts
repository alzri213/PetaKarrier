import { NextRequest } from "next/server";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `Kamu adalah asisten AI PetaKarier — platform akselerator digital untuk UMKM & wirausaha Indonesia.
Kamu membantu pengguna dengan:
- Analisis potensi usaha dan kecocokan profil
- Perhitungan modal, BEP, dan proyeksi keuangan
- Informasi UMR 18 kota di Indonesia
- Penyusunan rencana bisnis
- Dampak SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi)
- Tips dan strategi wirausaha

Jawab dalam Bahasa Indonesia yang ramah, singkat, dan informatif. Gunakan format markdown jika perlu.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY belum dikonfigurasi di .env" },
      { status: 500 }
    );
  }

  try {
    const { messages } = (await request.json()) as {
      messages: { role: string; content: string }[];
    };

    // Gemini requires first message to be from "user"
    // Filter to only user/model messages, skip system-like assistant messages
    const chatMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");

    // If first message is assistant (welcome msg), skip it
    const startIndex = chatMessages.length > 0 && chatMessages[0].role === "assistant" ? 1 : 0;
    const filtered = chatMessages.slice(startIndex);

    if (filtered.length === 0) {
      return Response.json(
        { error: "Kirim pesan terlebih dahulu." },
        { status: 400 }
      );
    }

    const contents = filtered.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      const msg = data?.error?.message || "Gagal menghubungi AI. Coba lagi nanti.";
      return Response.json({ error: msg }, { status: res.status });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak bisa memberikan jawaban saat ini.";

    return Response.json({ text });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
