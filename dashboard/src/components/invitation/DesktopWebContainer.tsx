'use client';

import React from 'react';
import { Smartphone, Monitor, Globe, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, X } from 'lucide-react';

export type ContainerViewMode = 'desktop-web' | 'mobile-phone' | 'full-web';

interface DesktopWebContainerProps {
  coverImage?: string;
  coupleNames?: string;
  children: React.ReactNode;
  activeSectionIndex: number;
  totalSections: number;
  viewMode?: ContainerViewMode;
  onViewModeChange?: (mode: ContainerViewMode) => void;
  onPrevSection?: () => void;
  onNextSection?: () => void;
  onOpenInvitation?: () => void;
  isPlayingAudio?: boolean;
  onToggleAudio?: () => void;
  isModalPreview?: boolean;
  onCloseModal?: () => void;
}

export const DesktopWebContainer: React.FC<DesktopWebContainerProps> = ({
  coverImage = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop&q=80',
  coupleNames = 'Vidi & Hening',
  children,
  activeSectionIndex,
  totalSections,
  viewMode = 'desktop-web',
  onViewModeChange,
  onPrevSection,
  onNextSection,
  onOpenInvitation,
  isPlayingAudio = false,
  onToggleAudio,
  isModalPreview = false,
  onCloseModal,
}) => {
  return (
    <div className="relative w-full h-screen min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Fullscreen Widescreen Background Cover Image (Visible behind & on left/right sidebars) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        {/* Subtle Side Gradients for Seamless Depth */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950/30 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950/30 to-transparent pointer-events-none" />
      </div>

      {/* 2. Floating Top Right Control Panel & View Mode Switcher */}
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-2xl">
        {onViewModeChange && (
          <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/20 mr-1">
            <button
              onClick={() => onViewModeChange('desktop-web')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                viewMode === 'desktop-web'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Desktop Web Mode (Layar Kiri-Kanan Panorama)"
            >
              <Monitor className="w-3 h-3" />
              <span>Web Desktop</span>
            </button>
            <button
              onClick={() => onViewModeChange('mobile-phone')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                viewMode === 'mobile-phone'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
              title="Simulasi Frame HP Smartphone"
            >
              <Smartphone className="w-3 h-3" />
              <span>Frame HP</span>
            </button>
          </div>
        )}

        {onOpenInvitation && activeSectionIndex === 0 && (
          <button
            onClick={onOpenInvitation}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-semibold shadow-md hover:brightness-110 transition-all border border-purple-400/40"
          >
            <Sparkles className="w-3 h-3" />
            <span>Buka Undangan</span>
          </button>
        )}

        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isPlayingAudio
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3 h-3 text-slate-400" />
            )}
            <span>{isPlayingAudio ? 'Musik ON' : 'Musik OFF'}</span>
          </button>
        )}

        {isModalPreview && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors"
            title="Tutup Preview"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Main Center Frame Area (Extends Flush from Top to Copyright Footer) */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center overflow-hidden">
        {/* Navigation Arrow Left */}
        {onPrevSection && viewMode !== 'full-web' && (
          <button
            onClick={onPrevSection}
            disabled={activeSectionIndex === 0}
            className="hidden md:flex p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-200 hover:text-white hover:bg-purple-600 hover:border-purple-500 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-2xl mr-4 shrink-0 z-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Center Mobile Canvas Container */}
        <div
          className={`relative w-full max-w-full md:max-w-[480px] h-[calc(100vh-2.5rem)] flex flex-col bg-white overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-slate-200/40 transition-all ${
            viewMode === 'mobile-phone'
              ? 'rounded-[36px] my-auto h-[calc(100vh-6rem)] max-h-[820px] ring-8 ring-slate-900'
              : 'rounded-none'
          }`}
        >
          {/* Mobile Notch only when in phone frame mode */}
          {viewMode === 'mobile-phone' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-50 flex items-center justify-center shadow-md border border-slate-800/60 pointer-events-none">
              <div className="w-6 h-1 rounded-full bg-slate-800" />
            </div>
          )}

          {/* Invitation Content Canvas */}
          <div className="w-full h-full relative overflow-hidden flex-1">
            {children}
          </div>
        </div>

        {/* Navigation Arrow Right */}
        {onNextSection && viewMode !== 'full-web' && (
          <button
            onClick={onNextSection}
            disabled={activeSectionIndex === totalSections - 1}
            className="hidden md:flex p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-200 hover:text-white hover:bg-purple-600 hover:border-purple-500 disabled:opacity-20 disabled:pointer-events-none transition-all shadow-2xl ml-4 shrink-0 z-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </main>

      {/* 4. Bottom Copyright Bar (Exact Match with Reference Photo) */}
      <footer className="relative z-30 w-full h-10 bg-white text-slate-700 border-t border-slate-200 flex items-center justify-center px-4 shadow-md shrink-0">
        <p className="text-[11px] sm:text-xs text-slate-600 font-sans tracking-wide text-center">
          Copyright ©2026 by <span className="font-semibold text-slate-800">sajijanji.co</span>. This invitation saves paper and reduce carbon footprint 🌿
        </p>
      </footer>
    </div>
  );
};
