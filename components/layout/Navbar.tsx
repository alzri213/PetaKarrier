"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Camera, Trash2, Upload, User as UserIcon, MessageSquare, Accessibility, Eye, EyeOff } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/analisis", label: "Analisis Potensi" },
  { href: "/kalkulator", label: "Kalkulator BEP" },
  { href: "/perbandingan", label: "Banding UMR" },
  { href: "/rencana-bisnis", label: "Business Plan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(true);
  const [showA11yWidget, setShowA11yWidget] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync widget visibility from localStorage & DOM classes
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem("petakarier_widget_chat");
      const savedA11y = localStorage.getItem("petakarier_widget_a11y");
      if (savedChat !== null) {
        const isVisible = savedChat === "true";
        setShowChatWidget(isVisible);
        document.documentElement.classList.toggle("hide-chat-widget", !isVisible);
      }
      if (savedA11y !== null) {
        const isVisible = savedA11y === "true";
        setShowA11yWidget(isVisible);
        document.documentElement.classList.toggle("hide-a11y-widget", !isVisible);
      }
    } catch {}
  }, []);

  const toggleChatWidget = () => {
    setShowChatWidget((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("petakarier_widget_chat", String(next));
      } catch {}
      document.documentElement.classList.toggle("hide-chat-widget", !next);
      return next;
    });
  };

  const toggleA11yWidget = () => {
    setShowA11yWidget((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("petakarier_widget_a11y", String(next));
      } catch {}
      document.documentElement.classList.toggle("hide-a11y-widget", !next);
      return next;
    });
  };

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  // Load avatar from localStorage or session
  useEffect(() => {
    if (session?.user?.email) {
      try {
        const saved = localStorage.getItem(`petakarier_avatar_${session.user.email}`);
        if (saved) {
          setUserAvatar(saved);
        } else if (session.user.image) {
          setUserAvatar(session.user.image);
        }
      } catch {}
    }
  }, [session?.user?.email, session?.user?.image]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Photo Upload with Automatic Canvas Compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Harap pilih file gambar (JPG, PNG, WebP).");
      return;
    }

    // Max 10MB raw limit before compression
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Resize to 256x256 square for optimal performance
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Gagal memproses gambar.");
          return;
        }

        // Draw centered square crop
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        setUserAvatar(dataUrl);

        if (session?.user?.email) {
          try {
            localStorage.setItem(`petakarier_avatar_${session.user.email}`, dataUrl);
          } catch {}
        }

        toast.success("Foto profil berhasil diperbarui!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setUserAvatar(null);
    if (session?.user?.email) {
      try {
        localStorage.removeItem(`petakarier_avatar_${session.user.email}`);
      } catch {}
    }
    toast.success("Foto profil dihapus.");
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-[#030712]/95 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/80 shadow-md dark:shadow-black/20"
            : "bg-white dark:bg-[#030712] border-b border-slate-200/60 dark:border-slate-800/50"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Brand Logo & Text: Peta Karier */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-emerald-500/30 bg-white">
              <Image
                src="/logo-utama.png"
                alt="PetaKarier Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Peta <span className="text-[#00df82] font-extrabold">Karier</span>
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-[#00df82] font-bold"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />

            {isLoggedIn ? (
              /* ═══ LOGGED IN: User Avatar & Dropdown ═══ */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-4 transition hover:bg-slate-100 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-emerald-500/50 shadow-sm"
                >
                  {userAvatar ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-emerald-400/80 shadow-sm">
                      <Image
                        src={userAvatar}
                        alt={session?.user?.name || "Foto Profil"}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00df82] text-sm font-bold text-slate-950 shadow-sm">
                      {userInitial}
                    </div>
                  )}

                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[130px] truncate">
                    {session?.user?.name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu with Profile Photo Upload Options */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0a0f1d]"
                    >
                      {/* User Header with Avatar & Quick Camera Trigger */}
                      <div className="border-b border-slate-100 dark:border-slate-800/80 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            {userAvatar ? (
                              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-emerald-400 shadow-md">
                                <Image
                                  src={userAvatar}
                                  alt="Foto Profil"
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00df82] text-base font-extrabold text-slate-950 shadow-md">
                                {userInitial}
                              </div>
                            )}

                            {/* Camera overlay icon */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                              <Camera className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white break-words">
                              {session?.user?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Photo Actions */}
                      <div className="p-1.5 border-b border-slate-100 dark:border-slate-800/80 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-600 dark:hover:text-[#00df82]"
                        >
                          <Camera className="h-4 w-4 text-emerald-500" />
                          <span>{userAvatar ? "Ganti Foto Profil" : "Upload Foto Profil"}</span>
                        </button>

                        {userAvatar && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span>Hapus Foto Profil</span>
                          </button>
                        )}
                      </div>

                      {/* Sign Out Action */}
                      <div className="p-1.5">
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ═══ LOGGED OUT: Login & Daftar Buttons ═══ */
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#00df82] px-6 py-2.5 text-sm font-bold text-slate-950 shadow-md transition-all duration-200 hover:bg-[#00c975] hover:scale-105 active:scale-95"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: ThemeToggle + Hamburger Menu Trigger */}
          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[320px] flex-col bg-[#060a14] p-6 text-slate-100 shadow-2xl justify-between border-l border-slate-800/90 overflow-y-auto"
            >
              <div>
                {/* ── Top Header: Logo + Close ── */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden border border-emerald-500/30 bg-white shadow-sm">
                      <Image
                        src="/logo-utama.png"
                        alt="PetaKarier Logo"
                        width={32}
                        height={32}
                        className="h-full w-full object-contain p-0.5"
                      />
                    </div>
                    <span className="text-lg font-extrabold text-white tracking-tight">
                      Peta <span className="text-[#00df82]">Karier</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 text-slate-400 transition-colors hover:text-white cursor-pointer"
                    aria-label="Tutup menu sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Show user info with photo upload in mobile drawer */}
                {isLoggedIn && (
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0c1322] p-3 border border-slate-800">
                    <div className="flex items-center gap-3 min-w-0">
                      {userAvatar ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-400 shadow-sm">
                          <Image
                            src={userAvatar}
                            alt="Foto Profil"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00df82] text-sm font-black text-slate-950">
                          {userInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl bg-[#0b2b24] text-[#00df82] border border-emerald-500/30 hover:bg-[#0f3830] transition cursor-pointer"
                      title="Upload Foto"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* ── Navigation Links ── */}
                <div className="mt-6 flex flex-col space-y-3">
                  {NAV_LINKS.map((link) => {
                    const active = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`text-sm font-bold tracking-tight transition-colors py-1 ${
                          active
                            ? "text-[#00df82]"
                            : "text-slate-200 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* ── KONTROL WIDGET ── */}
                <div className="mt-8">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    KONTROL WIDGET
                  </span>

                  <div className="mt-3 space-y-2.5">
                    {/* Chat AI Widget Toggle Card */}
                    <div
                      onClick={toggleChatWidget}
                      className="flex items-center justify-between rounded-2xl border border-slate-800/90 bg-[#0c1322] p-3.5 transition hover:border-slate-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2b24] text-[#00df82] border border-emerald-500/30">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          Chat AI Widget
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChatWidget();
                        }}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black transition cursor-pointer ${
                          showChatWidget
                            ? "bg-[#00df82] text-slate-950 shadow-sm"
                            : "border border-slate-700 bg-slate-800/80 text-slate-400"
                        }`}
                      >
                        {showChatWidget ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>ON</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>OFF</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Aksesibilitas Widget Toggle Card */}
                    <div
                      onClick={toggleA11yWidget}
                      className="flex items-center justify-between rounded-2xl border border-slate-800/90 bg-[#0c1322] p-3.5 transition hover:border-slate-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2b24] text-[#00df82] border border-emerald-500/30">
                          <Accessibility className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          Aksesibilitas Widget
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleA11yWidget();
                        }}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black transition cursor-pointer ${
                          showA11yWidget
                            ? "bg-[#00df82] text-slate-950 shadow-sm"
                            : "border border-slate-700 bg-slate-800/80 text-slate-400"
                        }`}
                      >
                        {showA11yWidget ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>ON</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>OFF</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bottom Action Buttons ── */}
              <div className="border-t border-slate-800/80 pt-5 space-y-2.5">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 py-3.5 text-sm font-bold text-red-400 transition hover:bg-red-950/40 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center rounded-full border border-slate-800 bg-[#0c1322] py-3.5 text-sm font-bold text-white transition hover:bg-[#141e34] active:scale-[0.98]"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center rounded-full bg-[#00df82] py-3.5 text-sm font-bold text-slate-950 transition hover:bg-[#00c975] active:scale-[0.98]"
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
