"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Loader2,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import ChatMarkdown from "@/components/ui/ChatMarkdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Bagaimana cara memulai usaha makanan rumahan?",
  "Berapa modal minimal buka kedai kopi?",
  "Tips lolos pendanaan KUR untuk UMKM baru",
  "Bagaimana cara menghitung BEP usaha?",
];

export default function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! 👋 Saya asisten AI PetaKarier.\n\nAda yang bisa saya bantu seputar:\n1. **Analisis Potensi Usaha** & ide bisnis terkurasi\n2. **Kalkulasi Modal & Titik Impas (BEP)** di 18 kota\n3. **Komparasi Laba vs Standar UMR 2026**\n4. **Penyusunan Rencana Bisnis Siap KUR**",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Gagal menghubungi AI." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gagal terhubung ke server. Periksa koneksi internet kamu.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Halo! 👋 Saya asisten AI PetaKarier.\n\nAda yang bisa saya bantu seputar:\n1. **Analisis Potensi Usaha** & ide bisnis terkurasi\n2. **Kalkulasi Modal & Titik Impas (BEP)** di 18 kota\n3. **Komparasi Laba vs Standar UMR 2026**\n4. **Penyusunan Rencana Bisnis Siap KUR**",
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* ═══ Floating trigger button ═══ */}
      <motion.button
        id="chat-ai-trigger"
        drag
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.15, cursor: "grabbing" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-4 sm:right-6 z-[45] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center
                   rounded-full bg-[#00df82] text-slate-950 shadow-xl shadow-emerald-500/30
                   transition-shadow duration-300 hover:bg-[#00c975]
                   border-2 border-emerald-300/60 cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Chat dengan AI (Bisa digeser)"
        title="Tanya AI PetaKarier (Tahan & Geser untuk memindahkan)"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-950 pointer-events-none" />
        ) : (
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-slate-950 fill-slate-950/20 pointer-events-none" />
        )}
      </motion.button>

      {/* ═══ Chat window ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[56] bg-black/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.8 }}
              className="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 z-[57] flex w-auto sm:w-[420px] max-w-[420px]
                         flex-col overflow-hidden rounded-[2rem] border border-white/15
                         bg-[#0a0f1d] shadow-2xl shadow-black/80"
              style={{ height: "min(560px, calc(100vh - 110px))", willChange: "transform" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1428]/95 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-emerald-400/40">
                    <Image
                      src="/logo-utama.png"
                      alt="Logo PetaKarier"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0d1428] bg-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white leading-tight">Asisten PetaKarier</h3>
                    <p className="text-[11px] font-semibold text-[#00df82] flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online • AI Terverifikasi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={resetChat}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10
                               bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.1] hover:text-white cursor-pointer"
                    title="Reset chat"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10
                               bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.1] hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages Container with ChatGPT / Claude Style Markdown */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white p-1 mt-0.5 border border-emerald-400/40 shadow-sm overflow-hidden">
                        <Image
                          src="/logo-utama.png"
                          alt="PetaKarier"
                          width={24}
                          height={24}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-1">
                      <div
                        className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed transition-all ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-sm shadow-md"
                            : "bg-white/[0.07] text-slate-100 border border-white/10 rounded-tl-sm shadow-sm"
                        }`}
                      >
                        <ChatMarkdown content={msg.content} />
                      </div>

                      {/* Copy Action on Assistant message */}
                      {msg.role === "assistant" && (
                        <div className="flex items-center justify-start pl-1">
                          <button
                            type="button"
                            onClick={() => copyMessage(msg.content, i)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-[#00df82] transition-colors py-0.5 px-1.5 rounded hover:bg-white/5 cursor-pointer"
                            title="Salin jawaban"
                          >
                            {copiedIndex === i ? (
                              <>
                                <Check className="h-3 w-3 text-[#00df82]" />
                                <span className="text-[#00df82]">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white p-1 border border-emerald-400/40 shadow-sm overflow-hidden">
                      <Image
                        src="/logo-utama.png"
                        alt="PetaKarier"
                        width={24}
                        height={24}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white/[0.07] border border-white/10 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-[#00df82]" />
                      <span className="text-xs font-semibold text-slate-300">Menyusun jawaban...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions (show when few messages) */}
              {messages.length <= 1 && (
                <div className="border-t border-white/10 bg-[#0d1428]/60 px-4 py-3">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Saran pertanyaan:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5
                                   text-[11px] font-semibold text-slate-300 transition-colors
                                   hover:border-[#00df82]/50 hover:bg-[#00df82]/10 hover:text-[#00df82] text-left cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar */}
              <div className="border-t border-white/10 bg-[#0d1428]/95 p-3 backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya seputar modal, BEP, atau ide usaha..."
                    disabled={isLoading}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3
                               text-[13px] text-white placeholder-slate-400 outline-none
                               transition-all focus:border-[#00df82]/60 focus:bg-white/[0.1]
                               disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
                               bg-[#00df82] text-slate-950 font-black shadow-lg shadow-emerald-500/20
                               transition-all duration-200 hover:scale-105 active:scale-95
                               disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-slate-950" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
