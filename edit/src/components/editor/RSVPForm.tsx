"use client";

import { useState } from "react";
import { CheckCircle2, User, Users, MessageSquare, Send } from "lucide-react";

interface RSVPFormProps {
  disabled?: boolean;
  className?: string;
}

export default function RSVPForm({ disabled = false, className = "" }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [status, setStatus] = useState<"hadir" | "ragu" | "tidak">("hadir");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!name.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={`w-full max-w-[324px] mx-auto p-4 rounded-2xl bg-neutral-900/90 border border-amber-500/30 backdrop-blur-md shadow-2xl text-left select-none pointer-events-auto ${className}`}>
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="font-serif text-lg font-bold text-amber-300">Terima Kasih!</h4>
          <p className="text-xs text-neutral-300 max-w-[240px]">
            Konfirmasi kehadiran atas nama <span className="font-semibold text-amber-200">{name}</span> telah tersimpan.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 text-[11px] text-amber-400/80 hover:text-amber-300 underline font-medium cursor-pointer"
          >
            Ubah konfirmasi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Input Nama */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1.5">
              <User className="h-3 w-3 text-amber-400" />
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8 px-3 rounded-lg bg-neutral-800/80 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors"
            />
          </div>

          {/* Konfirmasi Kehadiran */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-300/90">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "hadir", label: "Hadir ✨" },
                { id: "ragu", label: "Ragu 🤔" },
                { id: "tidak", label: "Absen 🙏" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer text-center ${
                    status === item.id
                      ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-neutral-800/60 text-neutral-300 border-white/10 hover:border-amber-400/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jumlah Tamu (Hanya jika hadir) */}
          {status === "hadir" && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1.5">
                <Users className="h-3 w-3 text-amber-400" />
                Jumlah Tamu
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full h-8 px-3 rounded-lg bg-neutral-800/80 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/60 transition-colors cursor-pointer"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
                <option value="4">4 Orang</option>
              </select>
            </div>
          )}

          {/* Pesan / Ucapan */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3 text-amber-400" />
              Pesan / Ucapan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Tuliskan ucapan & doa Anda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-lg bg-neutral-800/80 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full h-9 mt-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Send className="h-3.5 w-3.5 fill-current" />
            <span>Kirim Konfirmasi</span>
          </button>
        </form>
      )}
    </div>
  );
}
