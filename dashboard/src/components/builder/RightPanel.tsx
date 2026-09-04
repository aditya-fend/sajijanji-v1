'use client';

import React, { useState, useRef } from 'react';
import {
  Sliders,
  Sparkles,
  Move,
  Type,
  Image as ImageIcon,
  Lock,
  Eye,
  Trash2,
  Copy,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Clock,
  Upload,
  LayoutGrid,
  ChevronLeft,
  ChevronDown,
  Layers,
  Zap,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize,
  Minimize,
  CircleDot,
  Radio,
} from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { AnimationType } from '@/types/builder';
import { ColorPickerModal } from '@/components/builder/ColorPickerModal';
import { MotionPreviewBox } from '@/components/builder/MotionPreviewBox';

const FONT_FAMILY_PRESETS = [
  { name: 'Gilroy', family: 'Gilroy, sans-serif' },
  { name: 'Playfair Display', family: 'Playfair Display, serif' },
  { name: 'Great Vibes', family: 'Great Vibes, cursive' },
  { name: 'Cinzel', family: 'Cinzel, serif' },
  { name: 'Cormorant Garamond', family: 'Cormorant Garamond, serif' },
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
];

const MOTION_PHYSICS_CATALOG: { type: AnimationType; label: string; desc: string; physicsTheory: string }[] = [
  {
    type: 'loop-wind-leaf',
    label: 'Daun Tertiup Angin (Looping)',
    desc: 'Langsung bergerak bergoyang tertiup angin terus menerus tanpa animasi masuk',
    physicsTheory: 'Continuous Aero Harmonic Oscillation',
  },
  {
    type: 'loop-wind-flower',
    label: 'Bunga Tertiup Angin (Looping)',
    desc: 'Langsung bergerak melengkung tertiup angin kencang secara berulang',
    physicsTheory: 'Continuous Wind Torque Flutter',
  },
  {
    type: 'wind-flower',
    label: 'Bunga Tertiup Angin (Entrance)',
    desc: 'Kelopak melengkung tertiup angin saat pertama masuk',
    physicsTheory: 'Aero-Damping & Bending Torque',
  },
  {
    type: 'leaf-rustle',
    label: 'Daun Bergoyang Sepoi',
    desc: 'Daun bergetar lembut ditiup sepoi-sepoi angin',
    physicsTheory: 'High-Freq Harmonic Flutter & Turbulence',
  },
  {
    type: 'cloud-drift',
    label: 'Awan Bergerak Hanyut',
    desc: 'Awan melayang horizontal lambat menenangkan',
    physicsTheory: 'Atmospheric Laminar Drag Vector',
  },
  {
    type: 'ocean-wave',
    label: 'Ombak Samudra Wave',
    desc: 'Bergulung naik turun seperti riak gelombang laut',
    physicsTheory: 'Hydrodynamic Wave Superposition',
  },
  {
    type: 'smoke-convection',
    label: 'Asap Membumbung Drift',
    desc: 'Membumbung ke atas, membesar & menipis transparan',
    physicsTheory: 'Thermal Buoyancy Convection Currents',
  },
  {
    type: 'pendulum-swing',
    label: 'Ayunan Pendulum Jam',
    desc: 'Mengayun melengkung seperti pendulum lonceng jam',
    physicsTheory: 'Gravitational Pendulum Arc Equilibrium',
  },
  {
    type: 'falling-leaf',
    label: 'Daun Melayang Jatuh',
    desc: 'Gerakan daun melayang & bergoyang tertiup angin',
    physicsTheory: 'Fluid Drag & Pendulum Oscillations',
  },
  {
    type: 'floating-sway',
    label: 'Bunga Terapung',
    desc: 'Gerakan mengapung di atas gelombang air yang lembut',
    physicsTheory: 'Archimedes Buoyancy Wave Harmonic',
  },
  {
    type: 'gravity-drop',
    label: 'Gravitasi Drop Membal',
    desc: 'Elemen jatuh bebas dan memantul dengan redaman',
    physicsTheory: 'Newton Free-Fall Gravity (e = 0.6)',
  },
  {
    type: 'bounce',
    label: 'Membal Pegas Elastis',
    desc: 'Bouncing kenyal saat pertama kali elemen tampil',
    physicsTheory: "Hooke's Law Damped Spring",
  },
  {
    type: 'curved-spiral',
    label: 'Pusaran Spiral 360',
    desc: 'Berputar melingkar spiral menuju pusat kanvas',
    physicsTheory: 'Angular Momentum & Polar Decay',
  },
  {
    type: 'pulse-heartbeat',
    label: 'Denyut Detak Jantung',
    desc: 'Berdenyut ritmis menyerupai detakan jantung',
    physicsTheory: 'Cardiac Harmonic Resonance',
  },
];

export const RightPanel: React.FC = () => {
  const [inspectorTab, setInspectorTab] = useState<'style' | 'motion'>('style');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const {
    getActiveSection,
    getSelectedLayer,
    updateLayerStyle,
    updateLayerTimeline,
    updateLayer,
    removeLayer,
    toggleLayerLock,
    updateSectionBackground,
    setCurrentTime,
    setIsPlaying,
  } = useBuilderStore();

  const activeSection = getActiveSection();
  const selectedLayer = getSelectedLayer();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSection && selectedLayer) {
      const objectUrl = URL.createObjectURL(file);
      updateLayer(activeSection.id, selectedLayer.id, {
        content: objectUrl,
        type: 'image',
        name: file.name.split('.')[0] || 'Uploaded Media',
      });
    }
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSection) {
      const objectUrl = URL.createObjectURL(file);
      updateSectionBackground(activeSection.id, {
        backgroundImage: objectUrl,
      });
    }
  };

  const triggerMotionPreview = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // IF NO LAYER IS SELECTED: SHOW SECTION BACKGROUND INSPECTOR
  if (!selectedLayer || !activeSection) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none font-sans shadow-xs">
        <input
          type="file"
          ref={bgFileInputRef}
          accept="image/*"
          onChange={handleBgFileUpload}
          className="hidden"
        />

        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Desain Background Section</span>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-100 uppercase">
            {activeSection?.sectionType || 'Section'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-slate-700">
            <p className="font-bold text-slate-900 mb-0.5">
              Halaman {activeSection?.sectionOrder} - Background
            </p>
            <p className="text-[11px] text-slate-500">
              Upload wallpaper background atau sesuaikan warna tema section.
            </p>
          </div>

          <button
            onClick={() => bgFileInputRef.current?.click()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Wallpaper BG</span>
          </button>
        </div>
      </aside>
    );
  }

  const currentEntrance = selectedLayer.timeline?.entrance?.type || 'fade';
  const currentDuration = selectedLayer.timeline?.entrance?.duration ?? 0.8;
  const currentDelay = selectedLayer.timeline?.entrance?.delay ?? 0.1;

  // IF LAYER IS SELECTED: SHOW MODERN RIGHT INSPECTOR WITH MOTION CONTROLS
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none font-sans shadow-xs">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.svg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
          <ChevronLeft className="w-4 h-4 text-slate-400 cursor-pointer" />
          <span className="truncate max-w-[150px]">{selectedLayer.name || 'Header'}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleLayerLock(activeSection.id, selectedLayer.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              selectedLayer.isLocked ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => removeLayer(activeSection.id, selectedLayer.id)}
            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Switcher: Style vs Motion & Animasi */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-slate-100/70 border-b border-slate-200">
        <button
          onClick={() => setInspectorTab('style')}
          className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            inspectorTab === 'style'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Style & Teks</span>
        </button>
        <button
          onClick={() => setInspectorTab('motion')}
          className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            inspectorTab === 'motion'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Fitur Motion</span>
        </button>
      </div>

      {inspectorTab === 'style' ? (
        /* STYLE & TYPOGRAPHY INSPECTOR */
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* TEXT Group Title */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TEXT & TYPOGRAPHY
            </span>

            {/* 1. Font Family Select */}
            <select
              value={selectedLayer.style.fontFamily || 'Gilroy, sans-serif'}
              onChange={(e) =>
                updateLayerStyle(activeSection.id, selectedLayer.id, {
                  fontFamily: e.target.value,
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              {FONT_FAMILY_PRESETS.map((f, idx) => (
                <option key={idx} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>

            {/* 2. Weight & Size Control Bar */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedLayer.style.fontWeight || 'bold'}
                onChange={(e) =>
                  updateLayerStyle(activeSection.id, selectedLayer.id, {
                    fontWeight: e.target.value,
                  })
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="normal">Regular</option>
                <option value="bold">Bold</option>
                <option value="700">700 Extra</option>
              </select>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="text-slate-400 font-mono">Aa</span>
                <input
                  type="number"
                  value={selectedLayer.style.fontSize || 14}
                  onChange={(e) =>
                    updateLayerStyle(activeSection.id, selectedLayer.id, {
                      fontSize: parseInt(e.target.value, 10) || 14,
                    })
                  }
                  className="w-10 bg-transparent text-right font-mono focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono">px</span>
              </div>
            </div>

            {/* 3. Color Field Trigger */}
            <div className="relative">
              <div
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer hover:border-blue-500 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-md border border-slate-300 shadow-xs"
                    style={{ backgroundColor: selectedLayer.style.color || '#2563EB' }}
                  />
                  <span className="font-mono">{selectedLayer.style.color || '#2563EB'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {showColorPicker && (
                <ColorPickerModal
                  color={selectedLayer.style.color || '#2563EB'}
                  onChange={(newColor) =>
                    updateLayerStyle(activeSection.id, selectedLayer.id, { color: newColor })
                  }
                  onClose={() => setShowColorPicker(false)}
                />
              )}
            </div>

            {/* 4. Text Alignment Buttons */}
            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    updateLayerStyle(activeSection.id, selectedLayer.id, {
                      textAlign: align,
                    })
                  }
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-all ${
                    selectedLayer.style.textAlign === align
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-4 h-4" />}
                  {align === 'center' && <AlignCenter className="w-4 h-4" />}
                  {align === 'right' && <AlignRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* 5. Margin / Padding Visual Box Inspector */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                PADDING & SPACING
              </span>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between text-xs font-mono font-bold text-slate-500 space-y-2">
                <span>15px</span>
                <div className="w-full flex items-center justify-between border-y border-slate-200 py-3 px-2">
                  <span>15px</span>
                  <div className="w-20 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-[11px]">
                    20px
                  </div>
                  <span>15px</span>
                </div>
                <span>15px</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FITUR MOTION & ANIMATION ENGINE INSPECTOR */
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Header Banner */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900">
            <span className="font-bold block mb-0.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" /> Fitur Motion & Physics Engine
            </span>
            Atur pergerakan animasi saat elemen pertama kali muncul di layar HP.
          </div>

          {/* Test Motion Trigger Button */}
          <button
            onClick={triggerMotionPreview}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Putar Uji Coba Motion</span>
          </button>

          {/* Motion Presets Grid with Live Animation Previews */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              PILIH PRESEN ANIMASI & TEORI FISIKA (LIVE PREVIEW)
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {MOTION_PHYSICS_CATALOG.map((preset) => {
                const isSelected = currentEntrance === preset.type;

                return (
                  <MotionPreviewBox
                    key={preset.type}
                    type={preset.type}
                    label={preset.label}
                    desc={preset.desc}
                    physicsTheory={preset.physicsTheory}
                    isSelected={isSelected}
                    onSelect={() => {
                      updateLayerTimeline(activeSection.id, selectedLayer.id, {
                        entrance: {
                          type: preset.type,
                          duration: currentDuration,
                          delay: currentDelay,
                        },
                      });
                      triggerMotionPreview();
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Timing Controls (Duration & Delay) */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              WAKTU & TIMING MOTION
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Durasi Animasi:</span>
                <span className="font-mono font-bold text-blue-600">{currentDuration} detik</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={currentDuration}
                onChange={(e) => {
                  const newDur = parseFloat(e.target.value);
                  updateLayerTimeline(activeSection.id, selectedLayer.id, {
                    entrance: {
                      type: currentEntrance,
                      duration: newDur,
                      delay: currentDelay,
                    },
                  });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Delay Kemunculan:</span>
                <span className="font-mono font-bold text-blue-600">{currentDelay} detik</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={currentDelay}
                onChange={(e) => {
                  const newDelay = parseFloat(e.target.value);
                  updateLayerTimeline(activeSection.id, selectedLayer.id, {
                    entrance: {
                      type: currentEntrance,
                      duration: currentDuration,
                      delay: newDelay,
                    },
                  });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
