'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBuilderStore } from '@/store/useBuilderStore';
import { ClientFormPanel } from '@/components/editor/ClientFormPanel';
import { Canvas } from '@/components/builder/Canvas';
import { Heart, LayoutGrid, CheckCircle2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function ClientEditorProjectPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || 'demo-project-1';
  const { setMode, templateName } = useBuilderStore();

  useEffect(() => {
    setMode('client-editor');
  }, [setMode]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 antialiased font-sans select-none">
      {/* Top Navbar Canva Light Theme */}
      <header className="h-14 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-4 flex items-center justify-between select-none z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Client Content Editor</span>
              <span className="text-[10px] bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                Project: {projectId}
              </span>
            </h1>
            <p className="text-[11px] text-white/80 font-medium">
              Real-Time Content Overrides & SEO Settings
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${projectId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-all border border-white/30 backdrop-blur-sm shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Client Dashboard</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-all border border-white/30 backdrop-blur-sm shadow-sm"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Master Builder</span>
          </Link>
        </div>
      </header>

      {/* Split-Screen Workspace */}
      <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Panel Kiri: Form Text Input (w-[420px]) */}
        <ClientFormPanel />

        {/* Panel Kanan: Canvas Interactive Live Studio Workspace (flex-1) */}
        <main className="flex-1 bg-slate-100/90 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center relative overflow-auto p-4">
          <Canvas />
        </main>
      </div>
    </div>
  );
}
