export { auth as proxy } from "@/auth";

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
