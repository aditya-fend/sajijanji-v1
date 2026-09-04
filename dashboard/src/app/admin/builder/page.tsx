'use client';

import React from 'react';
import { TopNavbar } from '@/components/builder/TopNavbar';
import { LeftPanel } from '@/components/builder/LeftPanel';
import { RightPanel } from '@/components/builder/RightPanel';
import { Canvas } from '@/components/builder/Canvas';

export default function MasterBuilderPage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 antialiased font-sans">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Canva Dual-Sidebar & Canvas Studio Shell */}
      <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* 1. Left Panel: Canva Navigation Sidebar + Tool Drawer */}
        <LeftPanel />

        {/* 2. Center Panel: Canva Studio Main Canvas Workspace */}
        <main className="flex-1 bg-slate-100/90 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center relative overflow-auto p-4">
          <Canvas />
        </main>

        {/* 3. Right Panel: Canva Properties & Inspector */}
        <RightPanel />
      </div>
    </div>
  );
}
