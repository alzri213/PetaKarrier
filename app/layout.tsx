import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import ChatAI from "@/components/ui/ChatAI";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "KonekUMKM — Ekosistem Pemberdayaan & Perencanaan Usaha Inklusif",
    template: "%s · KonekUMKM",
  },
  description:
    "KonekUMKM memberdayakan generasi muda dan pelaku usaha Indonesia melalui analisis potensi usaha cerdas, kalkulator modal & break-even per kota, komparasi UMR, serta penyusunan rencana bisnis otomatis selaras dengan SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi) dan RAN TPB Matriks 4.",
  keywords: [
    "KonekUMKM",
    "Pemberdayaan UMKM",
    "SDG 8",
    "Pekerjaan Layak",
    "Pertumbuhan Ekonomi Inklusif",
    "RAN TPB Matriks 4",
    "Kalkulator Modal Usaha",
    "Break Even Point",
    "UMR Kota Indonesia",
    "Rencana Bisnis Otomatis",
    "Wirausaha Muda",
    "ITechnoCup 2026",
  ],
  openGraph: {
    title: "KonekUMKM — Ekosistem Pemberdayaan & Perencanaan Usaha Inklusif",
    description:
      "Akselerasi wirausaha muda Indonesia melalui peta karier bisnis terukur, simulasi modal real-time, dan roadmap aksi selaras SDG 8.",
    type: "website",
    locale: "id_ID",
    siteName: "KonekUMKM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable}`}>
        <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-slate-900 selection:bg-green-500/30 selection:text-green-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
        <AccessibilityPanel />
        <ChatAI />
      </body>
    </html>
  );
}
