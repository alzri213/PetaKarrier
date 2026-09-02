import { Lightbulb } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050914] text-white px-4">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00df82]/[0.06] blur-[150px]" />
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Brand Text Logo */}
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-white">Peta </span>
          <span className="text-[#00df82] font-black drop-shadow-[0_0_20px_rgba(0,223,130,0.4)]">
            Karier
          </span>
        </div>

        {/* Precision Circular Spinner with Organic Radial Glow (Zero Square Clipping) */}
        <div className="relative my-8 flex h-16 w-16 items-center justify-center">
          {/* Soft Organic Glow */}
          <div className="pointer-events-none absolute h-14 w-14 rounded-full bg-[#00df82]/20 blur-xl" />

          {/* Static Background Ring */}
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#0d2222"
              strokeWidth="4.5"
              fill="transparent"
            />
          </svg>

          {/* Rotating Glowing Arc */}
          <svg className="h-full w-full overflow-visible animate-spin text-[#00df82]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#00df82"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray="240"
              strokeDashoffset="160"
            />
          </svg>
        </div>

        {/* Subtitle */}
        <h2 className="text-base font-bold text-white tracking-tight">
          Menyiapkan data platform untuk kamu...
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Menganalisis potensi regional, tren pasar, dan kesesuaian modal
        </p>

        {/* Tips Banner */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#0a1120]/80 px-5 py-3 shadow-xl backdrop-blur-md max-w-md text-left">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#00df82]/10 border border-[#00df82]/20 text-[#00df82]">
            <Lightbulb className="h-4 w-4" />
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Tips: Siapkan data estimasi modal awal usahamu sebelum melanjutkan ke kalkulator BEP.
          </p>
        </div>
      </div>
    </div>
  );
}
