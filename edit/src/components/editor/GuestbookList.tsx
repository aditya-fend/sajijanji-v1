"use client";

import { MessageSquareQuote, Heart, CheckCircle2 } from "lucide-react";

interface GuestMessage {
  id: string;
  name: string;
  status: "Hadir" | "Ragu-ragu" | "Absen";
  message: string;
  time: string;
}

const DEFAULT_MESSAGES: GuestMessage[] = [
  {
    id: "msg-1",
    name: "Budi & Keluarga",
    status: "Hadir",
    message: "Selamat untuk Romeo & Juliet! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.",
    time: "2 jam lalu",
  },
  {
    id: "msg-2",
    name: "Siti Rahma",
    status: "Hadir",
    message: "Happy wedding Romeo & Juliet! Wish you a lifetime of love and happiness together! ✨",
    time: "5 jam lalu",
  },
  {
    id: "msg-3",
    name: "Andi Pratama",
    status: "Hadir",
    message: "Barakallah lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat ya brother!",
    time: "1 hari lalu",
  },
  {
    id: "msg-4",
    name: "Clara & Partner",
    status: "Ragu-ragu",
    message: "Selamat atas pernikahan kalian berdua, semoga dilancarkan seluruh rangkaian acara!",
    time: "2 hari lalu",
  },
];

interface GuestbookListProps {
  className?: string;
  messages?: GuestMessage[];
}

export default function GuestbookList({
  className = "",
  messages = DEFAULT_MESSAGES,
}: GuestbookListProps) {
  return (
    <div
      className={`w-full max-w-[324px] mx-auto select-none pointer-events-auto text-left ${className}`}
    >
      <div className="rounded-2xl bg-neutral-900/90 border border-amber-500/30 backdrop-blur-md p-3.5 shadow-2xl space-y-3">
        {/* Header Count */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
            <MessageSquareQuote className="h-4 w-4 text-amber-400" />
            <span>Doa & Ucapan Tamu</span>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {messages.length} Ucapan
          </span>
        </div>

        {/* Scrollable Messages Container */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-xl bg-neutral-800/70 border border-white/5 space-y-1.5 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Heart className="h-3 w-3 text-amber-400 fill-amber-400/30" />
                  </div>
                  <span className="font-semibold text-xs text-white truncate">
                    {msg.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      msg.status === "Hadir"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : msg.status === "Ragu-ragu"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed italic font-serif pl-1">
                "{msg.message}"
              </p>

              <div className="flex justify-end text-[9px] font-mono text-neutral-500">
                <span>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
