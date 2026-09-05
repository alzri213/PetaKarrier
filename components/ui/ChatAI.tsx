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
  Trash2,
  Copy,
  Check,
  BadgeCheck,
  History,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import ChatMarkdown from "@/components/ui/ChatMarkdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const SUGGESTIONS = [
  "Bagaimana cara memulai usaha makanan rumahan?",
  "Berapa modal minimal buka kedai kopi?",
  "Tips lolos pendanaan KUR untuk UMKM baru",
  "Bagaimana cara menghitung BEP usaha?",
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Halo! Saya asisten AI PetaKarier.\n\nAda yang bisa saya bantu seputar:\n1. **Analisis Potensi Usaha** & ide bisnis terkurasi\n2. **Kalkulasi Modal & Titik Impas (BEP)** di 38 provinsi\n3. **Komparasi Laba vs Standar UMR 2026**\n4. **Penyusunan Rencana Bisnis Siap KUR**",
};

const CHAT_HISTORY_KEY = "petakarier_chat_history";
const CHAT_SESSIONS_KEY = "petakarier_chat_sessions";

export default function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { data: session } = useSession();
  const hasLoadedHistory = useRef(false);
  const isDraggingRef = useRef(false);

  const historyKey = session?.user?.email
    ? `${CHAT_HISTORY_KEY}_${session.user.email}`
    : CHAT_HISTORY_KEY;
  const sessionsKey = session?.user?.email
    ? `${CHAT_SESSIONS_KEY}_${session.user.email}`
    : CHAT_SESSIONS_KEY;

  const createConversation = (conversationMessages: Message[] = [INITIAL_MESSAGE]): ChatConversation => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "Percakapan baru",
    messages: conversationMessages,
    updatedAt: Date.now(),
  });

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(sessionsKey);
      const savedHistory = localStorage.getItem(historyKey);
      let restored: ChatConversation[] = [];

      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions) as ChatConversation[];
        if (Array.isArray(parsedSessions)) restored = parsedSessions;
      } else if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as Message[];
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          restored = [{ ...createConversation(parsedHistory), title: "Percakapan sebelumnya" }];
        }
      }

      const firstConversation = restored[0] || createConversation();
      setConversations(restored.length > 0 ? restored : [firstConversation]);
      setActiveConversationId(firstConversation.id);
      setMessages(firstConversation.messages);
    } catch {
      // Ignore malformed or unavailable browser storage.
      const fallback = createConversation();
      setConversations([fallback]);
      setActiveConversationId(fallback.id);
      setMessages(fallback.messages);
    } finally {
      hasLoadedHistory.current = true;
    }
  }, [historyKey, sessionsKey]);

  useEffect(() => {
    if (!hasLoadedHistory.current || !activeConversationId) return;
    try {
      const updatedConversations = conversations.map((conversation) =>
        conversation.id === activeConversationId
          ? { ...conversation, messages, updatedAt: Date.now() }
          : conversation
      );
      localStorage.setItem(sessionsKey, JSON.stringify(updatedConversations));
      localStorage.setItem(historyKey, JSON.stringify(messages));
    } catch {
      // Ignore unavailable browser storage.
    }
  }, [historyKey, sessionsKey, messages, conversations, activeConversationId]);

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) {
      setUserAvatar(null);
      return;
    }

    try {
      // Prioritas: localStorage > session.user.image > gravatar/initial
      const savedAvatar = localStorage.getItem(`petakarier_avatar_${email}`);
      if (savedAvatar) {
        setUserAvatar(savedAvatar);
      } else if (session?.user?.image) {
        setUserAvatar(session.user.image);
      } else {
        setUserAvatar(null);
      }
    } catch {
      setUserAvatar(session?.user?.image || null);
    }
  }, [session?.user?.email, session?.user?.image]);

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
    setConversations((prev) => prev.map((conversation) =>
      conversation.id === activeConversationId && conversation.title === "Percakapan baru"
        ? { ...conversation, title: text.trim().slice(0, 48) }
        : conversation
    ));
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
    setInput("");
    const remaining = conversations.filter((conversation) => conversation.id !== activeConversationId);
    const nextConversation = remaining[0] || createConversation();
    setConversations(remaining.length > 0 ? remaining : [nextConversation]);
    setActiveConversationId(nextConversation.id);
    setMessages(nextConversation.messages);
    try {
      localStorage.removeItem(historyKey);
      localStorage.setItem(sessionsKey, JSON.stringify(remaining.length > 0 ? remaining : [nextConversation]));
    } catch {
      // Ignore unavailable browser storage.
    }
  };

  const startNewChat = () => {
    const newConversation = createConversation();
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMessages(newConversation.messages);
    setInput("");
    setIsHistoryOpen(false);
  };

  const selectConversation = (conversation: ChatConversation) => {
    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
    setInput("");
    setIsHistoryOpen(false);
  };

  const deleteConversation = (conversationId: string) => {
    const remaining = conversations.filter((conversation) => conversation.id !== conversationId);
    const nextConversation = remaining[0] || createConversation();
    setConversations(remaining.length > 0 ? remaining : [nextConversation]);

    if (conversationId === activeConversationId) {
      setActiveConversationId(nextConversation.id);
      setMessages(nextConversation.messages);
    }
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
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 200);
        }}
        onClick={() => {
          if (isDraggingRef.current) return;
          setIsOpen((v) => !v);
        }}
        className="fixed bottom-5 right-4 sm:right-6 z-[45] flex h-14 w-14 items-center justify-center
                   rounded-full bg-[#00df82] text-slate-950 shadow-xl shadow-emerald-500/30
                   transition-shadow duration-300 hover:bg-[#00c975]
                   border-2 border-emerald-300/60 cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Chat dengan AI (Bisa digeser)"
        title="Tanya AI PetaKarier (Tahan & Geser untuk memindahkan)"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-950 pointer-events-none" />
        ) : (
          <MessageCircle className="h-6 w-6 text-slate-950 fill-slate-950/20 pointer-events-none" />
        )}
      </motion.button>

      {/* ═══ Chat window ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.8 }}
            className="fixed bottom-20 right-3 sm:right-6 z-[57] flex w-[calc(100vw-1.5rem)] max-w-[420px] sm:w-[420px]
                       flex-col overflow-hidden rounded-[2rem] border border-slate-200
                       bg-white shadow-2xl shadow-slate-400/30 dark:border-white/15
                       dark:bg-[#0a0f1d] dark:shadow-black/80"
            style={{ height: "min(560px, calc(100vh - 110px))" }}
          >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1428]/95">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-emerald-400/40">
                    <Image
                      src="/logo-utama.png"
                      alt="Logo PetaKarier"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-50 bg-emerald-400 animate-pulse dark:border-[#0d1428]" />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1 text-sm font-extrabold text-slate-900 leading-tight dark:text-white">
                      Asisten PetaKarier
                      <span title="Akun terverifikasi">
                        <BadgeCheck
                          className="h-4 w-4 shrink-0 fill-sky-400/20 text-sky-400"
                          aria-label="Akun terverifikasi"
                        />
                      </span>
                    </h3>
                    <p className="text-[11px] font-semibold text-[#00df82] flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online • AI Terverifikasi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen((open) => !open)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200
                               bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:border-white/10
                               dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.1] dark:hover:text-white"
                    title="Lihat history chat"
                    aria-label="Lihat history chat"
                  >
                    <History className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={resetChat}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200
                               bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:border-white/10
                               dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.1] dark:hover:text-white"
                    title="Hapus history chat"
                    aria-label="Hapus history chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200
                               bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:border-white/10
                               dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.1] dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isHistoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    className="absolute inset-0 z-20 flex h-full w-full max-w-none origin-bottom-right flex-col overflow-hidden rounded-[inherit] bg-white dark:bg-[#0a0f1d]"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">History</h4>
                      <button
                        type="button"
                        onClick={() => setIsHistoryOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                        aria-label="Tutup history"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                      <input
                        type="search"
                        value={historySearch}
                        onChange={(event) => setHistorySearch(event.target.value)}
                        placeholder="Cari history"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-white/15 dark:bg-white/[0.05] dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={startNewChat}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00df82] px-3 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-[#00c975]"
                      >
                        <Plus className="h-4 w-4" /> Chat baru
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                      <p className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Percakapan terbaru
                      </p>
                      <div className="space-y-1">
                        {conversations
                          .filter((conversation) => conversation.title.toLowerCase().includes(historySearch.toLowerCase()))
                          .map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
                                conversation.id === activeConversationId
                                  ? "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                                  : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => selectConversation(conversation)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {conversation.title}
                                </span>
                                <span className="mt-0.5 block text-[10px] text-slate-500 dark:text-slate-400">
                                  {new Date(conversation.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteConversation(conversation.id)}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                title="Hapus percakapan"
                                aria-label={`Hapus ${conversation.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                            : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm dark:bg-white/[0.07] dark:text-slate-100 dark:border-white/10"
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
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors py-0.5 px-1.5 rounded hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:text-[#00df82] dark:hover:bg-white/5"
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 font-bold text-sm mt-0.5 dark:text-emerald-400">
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={session?.user?.name || "Foto Profil"}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : session?.user?.name ? (
                          <span className="uppercase">
                            {session.user.name.charAt(0)}
                          </span>
                        ) : (
                          <User className="h-4 w-4" />
                        )}
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
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-100 border border-slate-200 px-4 py-3 dark:bg-white/[0.07] dark:border-white/10">
                      <Loader2 className="h-4 w-4 animate-spin text-[#00df82]" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Menyusun jawaban...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions (show when few messages) */}
              {messages.length <= 1 && (
                <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-[#0d1428]/60">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Saran pertanyaan:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1.5
                                   text-[11px] font-semibold text-slate-700 transition-colors
                                   hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 text-left cursor-pointer dark:border-white/15
                                   dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-[#00df82]/50 dark:hover:bg-[#00df82]/10 dark:hover:text-[#00df82]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar */}
              <div className="border-t border-slate-200 bg-slate-50/95 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1428]/95">
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
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3
                               text-[13px] text-slate-900 placeholder-slate-400 outline-none
                               transition-all focus:border-emerald-500 focus:bg-emerald-50
                               disabled:opacity-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white
                               dark:focus:border-[#00df82]/60 dark:focus:bg-white/[0.1]"
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
        )}
      </AnimatePresence>
    </>
  );
}
