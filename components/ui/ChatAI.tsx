"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  RotateCcw,
} from "lucide-react";

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
        "Halo! 👋 Saya asisten AI KonekUMKM. Ada yang bisa saya bantu seputar usaha, modal, atau rencana bisnis?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
          "Halo! 👋 Saya asisten AI KonekUMKM. Ada yang bisa saya bantu seputar usaha, modal, atau rencana bisnis?",
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* ═══ Floating trigger button ═══ */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-[55] flex h-14 w-14 items-center justify-center
                   rounded-full bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-400
                   text-white shadow-lg shadow-teal-500/30
                   transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-teal-500/40
                   active:scale-95"
        aria-label="Chat dengan AI"
        title="Tanya AI KonekUMKM"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-teal-400/30" />
        )}
      </button>

      {/* ═══ Chat window ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[56] bg-black/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.8 }}
              className="fixed bottom-36 right-4 z-[57] flex w-[calc(100vw-2rem)] max-w-[400px]
                         flex-col overflow-hidden rounded-3xl border border-white/10
                         bg-[#0a0e1c] shadow-2xl shadow-black/60 sm:right-4"
              style={{ height: "min(520px, calc(100vh - 180px))", willChange: "transform" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1226]/90 px-5 py-3.5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400">
                    <Bot className="h-4.5 w-4.5 text-white" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d1226] bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">AI KonekUMKM</h3>
                    <p className="text-[10px] font-semibold text-emerald-400">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={resetChat}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10
                               bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                    title="Reset chat"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10
                               bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-teal-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-br-md"
                          : "bg-white/[0.06] text-slate-200 border border-white/8 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 mt-0.5">
                        <User className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/20">
                      <Bot className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/8 px-4 py-3">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-400" />
                      <span className="text-xs text-slate-400">Berpikir...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions (show when few messages) */}
              {messages.length <= 1 && (
                <div className="border-t border-white/8 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Saran pertanyaan:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5
                                   text-[10px] font-semibold text-slate-400 transition-colors
                                   hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-white/10 bg-[#0a0e1c]/90 p-3 backdrop-blur-xl">
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
                    placeholder="Tanya apa saja..."
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5
                               text-[13px] text-white placeholder-slate-500 outline-none
                               transition-colors focus:border-teal-500/40 focus:bg-white/[0.08]
                               disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                               bg-gradient-to-br from-teal-500 to-teal-600 text-white
                               transition-all duration-200 hover:scale-105 active:scale-95
                               disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <Send className="h-4 w-4" />
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
