'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Share2,
  Copy,
  Check,
  Users,
  Sparkles,
  ExternalLink,
  Edit,
  Heart,
  RefreshCw,
  Send,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

export interface DashboardGuestState {
  guestName: string;
  customGreeting?: string;
  generatedUrl: string;
  waApiUrl: string;
  copied: boolean;
}

export interface RsvpResponse {
  id: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  guestCount: number;
  message: string;
  createdAt: string;
}

export default function ClientDashboardPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || 'demo-project-1';

  // State Management for WhatsApp Guest Link Generator
  const [guestState, setGuestState] = useState<DashboardGuestState>({
    guestName: '',
    customGreeting: '',
    generatedUrl: '',
    waApiUrl: '',
    copied: false,
  });

  // RSVP Monitoring State
  const [rsvps] = useState<RsvpResponse[]>([
    {
      id: 'rsvp-1',
      guestName: 'Budi Santoso & Keluarga',
      attendance: 'hadir',
      guestCount: 2,
      message: 'Selamat untuk Romeo & Juliet, semoga senantiasa diberikan kebahagiaan!',
      createdAt: '2026-08-09 14:20',
    },
    {
      id: 'rsvp-2',
      guestName: 'Siti Rahma',
      attendance: 'hadir',
      guestCount: 1,
      message: 'Happy wedding! Wish you all the happiness in the world.',
      createdAt: '2026-08-09 15:10',
    },
    {
      id: 'rsvp-3',
      guestName: 'Ahmad Fauzi',
      attendance: 'tidak_hadir',
      guestCount: 0,
      message: 'Mohon maaf belum bisa hadir dikarenakan tugas luar kota.',
      createdAt: '2026-08-09 16:45',
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const slug = 'romeo-juliet';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sajijanji.co';

  const handleGenerateGuestLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestState.guestName.trim()) return;

    const trimmedGuest = guestState.guestName.trim();
    const encodedGuestParam = encodeURIComponent(trimmedGuest);
    const invitationLink = `${baseUrl}/${slug}?to=${encodedGuestParam}`;

    const greetingNote = guestState.customGreeting?.trim()
      ? guestState.customGreeting.trim()
      : 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.';

    const rawMessage = `Kepada Yth. ${trimmedGuest},\n\n${greetingNote}\n\nBerikut tautan undangan digital kami:\n${invitationLink}\n\nTerima kasih.`;

    const encodedWaMessage = encodeURIComponent(rawMessage);
    const waUrl = `https://wa.me/?text=${encodedWaMessage}`;

    setGuestState({
      ...guestState,
      generatedUrl: invitationLink,
      waApiUrl: waUrl,
      copied: false,
    });
  };

  const handleCopyLink = () => {
    if (!guestState.generatedUrl) return;
    navigator.clipboard.writeText(guestState.generatedUrl);
    setGuestState({ ...guestState, copied: true });
    setTimeout(() => {
      setGuestState((prev) => ({ ...prev, copied: false }));
    }, 2000);
  };

  const handleSyncGoogleSheets = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('Semua data RSVP berhasil disinkronkan ke Google Sheets!');
    }, 1200);
  };

  const totalAttending = rsvps.reduce(
    (acc, rsvp) => acc + (rsvp.attendance === 'hadir' ? rsvp.guestCount : 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white/90 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Client Dashboard</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold">
                Project: {projectId}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">Generator tautan tamu WhatsApp & pemantauan RSVP</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/editor/${projectId}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-blue-600" />
            <span>Edit Konten</span>
          </Link>
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </Link>
        </div>
      </header>

      {/* Body Content */}
      <main className="max-w-6xl w-full mx-auto p-6 space-y-8 flex-1">
        {/* Feature A: WhatsApp Guest Link Generator */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">WhatsApp Guest Link Generator</h2>
                <p className="text-xs text-slate-500">Buat tautan undangan personal untuk setiap tamu undangan</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
              WhatsApp Engine
            </span>
          </div>

          <form onSubmit={handleGenerateGuestLink} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Tamu (Guest Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso & Pasangan"
                  value={guestState.guestName}
                  onChange={(e) => setGuestState({ ...guestState, guestName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Pesan Tambahan (Opsional Note)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tanpa mengurangi rasa hormat..."
                  value={guestState.customGreeting}
                  onChange={(e) => setGuestState({ ...guestState, customGreeting: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Tautan WhatsApp Tamu</span>
            </button>
          </form>

          {/* Generated Result Box */}
          {guestState.generatedUrl && (
            <div className="p-4 bg-slate-50/80 border border-blue-200 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Tautan Undangan Khusus Berhasil Dibuat:</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">Status: Ready to Share</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-blue-600 font-bold overflow-x-auto shadow-xs">
                {guestState.generatedUrl}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                >
                  {guestState.copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-blue-600" />
                  )}
                  <span>{guestState.copied ? 'Tautan Tersalin!' : 'Copy Link'}</span>
                </button>

                <a
                  href={guestState.waApiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Direct WhatsApp Message (wa.me)</span>
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Feature B: RSVP Monitoring & Google Sheets Integration */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">RSVP Monitoring & Data Guestbook</h2>
                <p className="text-xs text-slate-500">Pantau konfirmasi kehadiran tamu & sinkronkan ke Google Sheets</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono">
                Total Hadir: {totalAttending} Orang
              </span>

              <button
                onClick={handleSyncGoogleSheets}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync to Google Sheets'}</span>
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* RSVP Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nama Tamu</th>
                  <th className="py-3.5 px-4">Status Kehadiran</th>
                  <th className="py-3.5 px-4 text-center">Jumlah Tamu</th>
                  <th className="py-3.5 px-4">Pesan & Ucapan</th>
                  <th className="py-3.5 px-4 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{rsvp.guestName}</td>
                    <td className="py-3.5 px-4">
                      {rsvp.attendance === 'hadir' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Hadir
                        </span>
                      )}
                      {rsvp.attendance === 'tidak_hadir' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Tidak Hadir
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600">
                      {rsvp.guestCount} Orang
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs italic">{rsvp.message}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400 font-semibold">
                      {rsvp.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
