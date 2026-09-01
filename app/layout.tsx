import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import AccessibilityPanel from "@/components/ui/AccessibilityPanel";
import ChatAI from "@/components/ui/ChatAI";
import InitialPageLoader from "@/components/ui/InitialPageLoader";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petakarier.vercel.app"),
  title: {
    default: "PetaKarier — Ekosistem Perencanaan Usaha & Karir Wirausaha",
    template: "%s · PetaKarier",
  },
  description:
    "PetaKarier memberdayakan generasi muda dan pelaku usaha Indonesia melalui analisis potensi usaha cerdas, kalkulator modal & break-even per kota, komparasi UMR, serta penyusunan rencana bisnis otomatis selaras dengan SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi) dan RAN TPB Matriks 4.",
  keywords: [
    "PetaKarier",
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
  icons: {
    icon: [
      { url: "/logo-utama.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo-utama.png",
    apple: "/logo-utama.png",
  },
  openGraph: {
    title: "PetaKarier — Ekosistem Perencanaan Usaha & Karir Wirausaha",
    description:
      "Akselerasi wirausaha muda Indonesia melalui peta karier bisnis terukur, simulasi modal real-time, dan roadmap aksi selaras SDG 8.",
    url: "https://petakarier.vercel.app",
    siteName: "PetaKarier",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/logo-utama.png",
        width: 512,
        height: 512,
        alt: "Logo Resmi PetaKarier",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PetaKarier — Ekosistem Perencanaan Usaha & Karir Wirausaha",
    description:
      "Akselerasi wirausaha muda Indonesia melalui peta karier bisnis terukur, simulasi modal real-time, dan roadmap aksi selaras SDG 8.",
    images: ["/logo-utama.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Navbar />
            <InitialPageLoader />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
            <AccessibilityPanel />
            <ChatAI />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
