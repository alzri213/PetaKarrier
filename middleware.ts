export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/analisis/:path*",
    "/kalkulator/:path*",
    "/perbandingan/:path*",
    "/rencana-bisnis/:path*",
    "/sdg-impact/:path*",
    "/komunitas/:path*",
  ],
};
