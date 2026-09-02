export interface UnifiedSessionState {
  analisisId?: string | null;
  selectedUsahaId: string;
  selectedKotaId: string;
  skala?: string;
  modalAwal?: number;
  operasional?: number;
  hasCalculated?: boolean;
  profil?: {
    minat: string[];
    skill: string[];
    budget: number;
    waktu: string;
    pengalaman: string;
  };
  rekomendasi?: any[];
  businessPlan?: {
    namaUsaha?: string;
    ringkasan?: string;
    masalah1?: string;
    masalah2?: string;
    proyeksi?: any[];
  };
  lastUpdated?: string;
}

export const UNIFIED_SESSION_KEY = "petakarier_active_session";

export function getLocalSessionState(): UnifiedSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UNIFIED_SESSION_KEY);
    if (raw) return JSON.parse(raw);

    // Fallback migration from older separate keys if present
    const oldKalk = localStorage.getItem("petakarier_kalkulator_form");
    const oldPerb = localStorage.getItem("petakarier_perbandingan_form");
    const oldProfil = localStorage.getItem("konekumkm-profil");
    const oldUsaha = localStorage.getItem("konekumkm-usaha");

    if (oldKalk || oldPerb || oldProfil || oldUsaha) {
      const parsedKalk = oldKalk ? JSON.parse(oldKalk) : {};
      const parsedPerb = oldPerb ? JSON.parse(oldPerb) : {};
      const parsedProfil = oldProfil ? JSON.parse(oldProfil) : {};
      const parsedUsaha = oldUsaha ? JSON.parse(oldUsaha) : {};

      const merged: UnifiedSessionState = {
        analisisId: parsedProfil.analisisId || parsedUsaha.analisisId || null,
        selectedUsahaId: parsedKalk.selectedUsahaId || parsedPerb.selectedUsahaId || parsedUsaha.usahaId || "kedai-kopi",
        selectedKotaId: parsedKalk.selectedKotaId || parsedPerb.selectedKotaId || "dki-jakarta",
        modalAwal: parsedKalk.modalAwal,
        operasional: parsedKalk.operasional,
        hasCalculated: parsedKalk.hasCalculated,
        profil: parsedProfil.profil,
      };
      localStorage.setItem(UNIFIED_SESSION_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch {}
  return null;
}

export function setLocalSessionState(partial: Partial<UnifiedSessionState>) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalSessionState() || {
      selectedUsahaId: "kedai-kopi",
      selectedKotaId: "dki-jakarta",
    };
    const updated: UnifiedSessionState = {
      ...current,
      ...partial,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(UNIFIED_SESSION_KEY, JSON.stringify(updated));

    // Also mirror to legacy keys for backward compatibility
    localStorage.setItem("petakarier_kalkulator_form", JSON.stringify({
      selectedUsahaId: updated.selectedUsahaId,
      selectedKotaId: updated.selectedKotaId,
      modalAwal: updated.modalAwal,
      operasional: updated.operasional,
      hasCalculated: updated.hasCalculated,
      activeModalAwal: updated.modalAwal,
      activeOperasional: updated.operasional,
      activeUsahaId: updated.selectedUsahaId,
      activeKotaId: updated.selectedKotaId,
    }));
    localStorage.setItem("petakarier_perbandingan_form", JSON.stringify({
      selectedKotaId: updated.selectedKotaId,
      selectedUsahaId: updated.selectedUsahaId,
    }));

    window.dispatchEvent(new CustomEvent("petakarier_session_updated", { detail: updated }));
  } catch {}
}
