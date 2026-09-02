import { NextRequest } from "next/server";

// Active Google Gemini model endpoints
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.6-flash",
];

const SYSTEM_PROMPT = `Kamu adalah Asisten AI Resmi PetaKarier — platform akselerator dan inkubator digital wirausaha muda & UMKM Indonesia.
Karakter & Gaya Komunikasi:
- Ramah, cerdas, solutif, santun, dan profesional (menggunakan Bahasa Indonesia yang natural dan luwes).
- Memiliki pengetahuan mendalam seputar kewirausahaan, analisis potensi usaha, perhitungan modal, titik impas (BEP), perbandingan upah UMR regional di Indonesia (Data 2026), perizinan usaha (OSS NIB), sertifikasi halal, dan pengajuan KUR.
- Jawab pertanyaan apa pun yang diajukan pengguna secara langsung, relevan, dan kontekstual. Jika ditanya siapa yang membuatmu atau identitasmu, jelaskan dengan ramah bahwa kamu adalah Asisten Cerdas PetaKarier.
- Selalu format jawaban secara terstruktur dan rapi menggunakan Markdown (gunakan **Teks Tebal** untuk poin penting, penomoran urut 1., 2., 3., atau bullet points jika relevan).`;

export async function POST(request: NextRequest) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    const { messages } = (await request.json()) as {
      messages: { role: string; content: string }[];
    };

    const chatMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");
    const startIndex = chatMessages.length > 0 && chatMessages[0].role === "assistant" ? 1 : 0;
    const filtered = chatMessages.slice(startIndex);

    if (filtered.length === 0) {
      return Response.json(
        { error: "Kirim pesan terlebih dahulu." },
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
      } catch (err: any) {
        lastError = err?.message || "Network error";
      }
    }

    return Response.json({
      text: `⚠️ **Gagal Menghubungi Google Gemini LLM**\n\n${lastError ? `*Detail kendala: ${lastError}*` : ""}\n\nPastikan kuota API Key aktif atau periksa koneksi internet Anda.`,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return Response.json({
      text: "Terjadi kesalahan saat memproses pesan. Silakan coba lagi beberapa saat lagi.",
    });
  }
}
