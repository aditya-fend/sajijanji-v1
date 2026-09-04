'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Search,
  FileText,
  Palette,
  Users,
  Settings,
  FolderPlus,
  ChevronDown,
  Sparkles,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Share2,
  Edit,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Layers,
  Heart,
  BarChart3,
  MessageCircle,
  Eye,
  Wand2,
} from 'lucide-react';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showPromo, setShowPromo] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F6F8] font-sans text-slate-800 antialiased select-none">
      {/* 1. LEFT SIDEBAR (Lunor Reference Design) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 z-20">
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Logo Brand Header Dropdown */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-sm text-slate-900 tracking-tight">Sajijanji SaaS</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari proyek / fitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/70 border border-slate-200/60 rounded-xl pl-9 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all font-sans"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              /
            </span>
          </div>

          {/* Quick Stats Links */}
          <div className="space-y-0.5 text-xs font-medium text-slate-600">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Analitik Pengunjung</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Semua Proyek (150)</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Main Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'Dashboard'
                  ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard Utama</span>
            </button>

            <Link
              href="/admin/projects"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>+ Buat Proyek Baru</span>
            </Link>

            <Link
              href="/editor/demo-project-1"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all"
            >
              <Edit className="w-4 h-4 text-amber-500" />
              <span>Fitur A: Client Editor</span>
            </Link>

            <Link
              href="/dashboard/demo-project-1"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Fitur B: WA Link & RSVP</span>
            </Link>

            <Link
              href="/admin/builder"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all"
            >
              <Palette className="w-4 h-4 text-purple-600" />
              <span>Fitur C: Master Builder</span>
              <span className="ml-auto text-[9px] font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                PRO
              </span>
            </Link>

            <Link
              href="/romeo-juliet"
              target="_blank"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Fitur D: Preview Web</span>
            </Link>
          </nav>

          <hr className="border-slate-100" />

          {/* Folder Categories Tree */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Template Elegant Floral
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Template Minimalist Modern
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Template Rustic Garden
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Upgrade Promo Bottom Card */}
        {showPromo && (
          <div className="p-4 border-t border-slate-100">
            <div className="relative bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <button
                onClick={() => setShowPromo(false)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">Platform SaaS Undangan</h4>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Kelola ratusan proyek undangan digital tanpa batas.
                </p>
              </div>

              <Link
                href="/admin/projects"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Undangan Baru</span>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Controls Bar */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">Admin Dashboard SaaS</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Update 2 menit lalu
            </span>

            <Link
              href="/admin/projects"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Proyek Baru</span>
            </Link>

            <Link
              href="/admin/builder"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>🎨 Master Builder</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Banner Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Selamat Datang di Sajijanji Studio! 👋
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola undangan pernikahan digital, buat tautan tamu WhatsApp, dan sesuaikan template studio.
            </p>
          </div>

          {/* 3. TOP STAT CARDS (4 Feature Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Undangan Aktif */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">Undangan Aktif</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">150</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Tamu Konfirmasi RSVP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:border-emerald-300 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">Tamu Konfirmasi (RSVP)</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">267</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Total Pengunjung */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:border-indigo-300 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">Total Pengunjung</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">1,480</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Template Master Catalog */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:border-purple-300 transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">Template Master</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">12</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 4. MIDDLE ROW: ANALYTICS & RECENT INVITATION PROJECTS TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Visitor & RSVP Analytics */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Statistik Pengunjung & Konfirmasi RSVP</h3>
                  <p className="text-xs text-slate-400">Tren lalu lintas pengunjung & respon RSVP 6 bulan terakhir</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700">
                  <span>Jan - Jun</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Curve Area Chart SVG */}
              <div className="w-full h-48 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Curve Path 1 (Blue Solid Curve) */}
                  <path
                    d="M 0,110 Q 70,120 120,70 T 250,20 T 370,80 T 500,40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />

                  {/* Curve Path 2 (Emerald Dotted Curve) */}
                  <path
                    d="M 0,130 Q 70,80 120,100 T 250,40 T 370,110 T 500,70"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                </svg>

                <div className="absolute bottom-0 inset-x-0 flex justify-between text-[11px] text-slate-400 font-medium px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>

            {/* Right Box: Recent Invitation Projects List */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Proyek Undangan Terbaru</h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari..."
                    className="w-28 bg-slate-100/70 border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Compact Recent List */}
              <div className="divide-y divide-slate-100 text-xs space-y-1">
                {[
                  { name: 'Undangan Romeo & Juliet', client: 'Romeo & Juliet', date: '2026-08', id: 'demo-project-1' },
                  { name: 'Undangan Vidi & Hening', client: 'Vidi & Hening', date: '2026-08', id: 'demo-project-2' },
                  { name: 'Undangan Rian & Maya', client: 'Rian & Maya', date: '2026-08', id: 'demo-project-3' },
                  { name: 'Undangan Dimas & Anisa', client: 'Dimas & Anisa', date: '2026-08', id: 'demo-project-4' },
                  { name: 'Undangan Farhan & Clara', client: 'Farhan & Clara', date: '2026-08', id: 'demo-project-5' },
                ].map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Heart className="w-4 h-4 text-blue-600 shrink-0 fill-blue-100" />
                      <span className="font-bold text-slate-800 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/editor/${item.id}`}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-[10px] font-bold transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/${item.id}`}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold transition-colors"
                      >
                        WA Link
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. BOTTOM SECTION: ACTIVE PROJECTS & SYSTEM FEATURE BUTTONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daftar Proyek Undangan & Fitur Sistem</h3>
                <p className="text-xs text-slate-500">Pilih tombol fitur pada proyek untuk mengedit konten, membuat link WA, atau membuka Master Builder</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Inisialisasi Proyek Baru</span>
                </Link>
              </div>
            </div>

            {/* 4 Cards Grid with Explicit Feature Buttons matching User Request */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  id: 'demo-project-1',
                  title: 'Romeo & Juliet',
                  desc: 'The Wedding of Romeo & Juliet Capulet',
                  count: '240+ Tamu',
                  slug: 'romeo-juliet',
                },
                {
                  id: 'demo-project-2',
                  title: 'Vidi & Hening',
                  desc: 'The Wedding of Vidi & Hening',
                  count: '150+ Tamu',
                  slug: 'vidi-hening',
                },
                {
                  id: 'demo-project-3',
                  title: 'Rian & Maya',
                  desc: 'Rustic Botanical Wedding Celebration',
                  count: '89+ Tamu',
                  slug: 'rian-maya',
                },
                {
                  id: 'demo-project-4',
                  title: 'Dimas & Anisa',
                  desc: 'Luxury Gold & Royal Navy Ceremony',
                  count: '350+ Tamu',
                  slug: 'dimas-anisa',
                },
              ].map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  {/* Top Mockup Box */}
                  <div className="w-full h-32 bg-white rounded-xl border border-slate-200/80 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <div className="w-12 h-1.5 rounded-full bg-slate-200" />
                      <span className="font-bold text-blue-600">{proj.count}</span>
                    </div>

                    <div className="my-auto text-center space-y-1">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold text-xs shadow-xs">
                        <Heart className="w-4 h-4 fill-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 block truncate">{proj.title}</span>
                    </div>

                    <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-600" />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{proj.desc}</p>
                  </div>

                  {/* EXPLICIT FEATURE BUTTONS A, B, C, D FOR THIS SYSTEM */}
                  <div className="space-y-1.5 pt-1">
                    {/* Fitur A: Client Editor */}
                    <Link
                      href={`/editor/${proj.id}`}
                      className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-between transition-all shadow-xs"
                    >
                      <span className="flex items-center gap-1.5">
                        <Edit className="w-3.5 h-3.5" />
                        <span>Fitur A: Edit Konten</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                    </Link>

                    {/* Fitur B: WA Guest & RSVP Dashboard */}
                    <Link
                      href={`/dashboard/${proj.id}`}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fitur B: WA Link & RSVP</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                    </Link>

                    {/* Fitur C & D Action Bar */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <Link
                        href="/admin/builder"
                        className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-slate-200"
                        title="Fitur C: Master Builder Studio"
                      >
                        <Palette className="w-3 h-3 text-purple-600" />
                        <span>Fitur C: Builder</span>
                      </Link>

                      <Link
                        href={`/${proj.slug}`}
                        target="_blank"
                        className="py-1 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-indigo-200"
                        title="Fitur D: Preview Web Live"
                      >
                        <Eye className="w-3 h-3 text-indigo-600" />
                        <span>Fitur D: Web</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
