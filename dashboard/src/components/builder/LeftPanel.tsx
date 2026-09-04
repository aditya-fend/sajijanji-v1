'use client';

import React, { useState, useRef } from 'react';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Type,
  Image as ImageIcon,
  Square,
  MousePointer,
  Sparkles,
  Upload,
  Frame,
  Circle,
  Sparkle,
  Shapes,
  Minus,
  Search,
  Mic,
  Palette,
  LayoutGrid,
  Shield,
  User,
  Settings,
  LogOut,
  Zap,
  Play,
} from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { LayerType, SECTION_TYPES_LIST, AnimationType } from '@/types/builder';
import { TEMPLATE_PRESETS_CATALOG } from '@/data/mockTemplate';
import { MotionPreviewBox } from '@/components/builder/MotionPreviewBox';

type LeftNavTab = 'template' | 'elemen' | 'teks' | 'motion' | 'unggahan' | 'background' | 'layers';

const SHAPE_ELEMENT_PRESETS = [
  {
    name: 'Persegi Soft Card',
    type: 'shape' as LayerType,
    width: 250,
    height: 150,
    style: { borderRadius: 20, backgroundColor: '#FAF6F0', borderWidth: 1, borderColor: '#E8DFD8' },
  },
  {
    name: 'Lingkaran Accent',
    type: 'shape' as LayerType,
    width: 180,
    height: 180,
    style: { borderRadius: 9999, backgroundColor: '#F3E9E0', borderWidth: 2, borderColor: '#D9C8B8' },
  },
  {
    name: 'Pill Badge Label',
    type: 'shape' as LayerType,
    width: 200,
    height: 48,
    style: { borderRadius: 9999, backgroundColor: '#1E293B', color: '#FFFFFF' },
  },
  {
    name: 'Garis Pembatas',
    type: 'shape' as LayerType,
    width: 240,
    height: 4,
    style: { borderRadius: 2, backgroundColor: '#D4AF37' },
  },
  {
    name: 'Bingkai Emas Square',
    type: 'shape' as LayerType,
    width: 220,
    height: 220,
    style: { borderRadius: 16, backgroundColor: 'transparent', borderWidth: 3, borderColor: '#D4AF37' },
  },
  {
    name: 'Bingkai Emas Oval Ring',
    type: 'shape' as LayerType,
    width: 200,
    height: 240,
    style: { borderRadius: 9999, backgroundColor: 'transparent', borderWidth: 3, borderColor: '#D4AF37' },
  },
];

const BACKGROUND_PRESETS = [
  {
    name: 'Soft Cream Floral',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vintage Botanical',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Luxury Parchment',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Romantic Rose Wall',
    url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
  },
];

export const LeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeftNavTab>('elemen');
  const [searchQuery, setSearchQuery] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const elementImageInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const {
    sections,
    activeSectionId,
    setActiveSection,
    selectedLayerId,
    setSelectedLayer,
    reorderLayerZIndex,
    addLayer,
    removeLayer,
    getActiveSection,
    updateSectionBackground,
    applyBackgroundToAllSections,
    templateName,
    setTemplateName,
    updateGlobalSettings,
  } = useBuilderStore();

  const activeSection = getActiveSection();
  const layers = activeSection
    ? [...activeSection.contentJson.layers].sort((a, b) => b.position.zIndex - a.position.zIndex)
    : [];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSectionId) {
      const objectUrl = URL.createObjectURL(file);
      addLayer(activeSectionId, 'image', {
        name: file.name.split('.')[0] || 'Uploaded Photo',
        content: objectUrl,
        position: { x: 87, y: 150, width: 200, height: 200, zIndex: 99 },
        style: { borderRadius: 16, objectFit: 'cover' },
      });
    }
  };

  const handleElementImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSectionId) {
      const objectUrl = URL.createObjectURL(file);
      addLayer(activeSectionId, 'image', {
        name: `Elemen ${file.name.split('.')[0] || 'Custom'}`,
        content: objectUrl,
        position: { x: 62, y: 120, width: 250, height: 200, zIndex: 99 },
        style: { opacity: 1, objectFit: 'contain' },
      });
    }
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSectionId) {
      const objectUrl = URL.createObjectURL(file);
      updateSectionBackground(activeSectionId, { backgroundImage: objectUrl });
    }
  };

  const handleAddShapePreset = (item: (typeof SHAPE_ELEMENT_PRESETS)[0]) => {
    if (!activeSectionId) return;

    addLayer(activeSectionId, item.type, {
      name: item.name,
      content: '',
      position: {
        x: Math.round((375 - item.width) / 2),
        y: 150,
        width: item.width,
        height: item.height,
        zIndex: 99,
      },
      style: item.style,
    });
  };

  const handleAddFramePreset = (preset: 'circle' | 'rounded' | 'gold-border') => {
    if (!activeSectionId) return;

    if (preset === 'circle') {
      addLayer(activeSectionId, 'image', {
        name: 'Bingkai Foto Lingkaran',
        content: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        position: { x: 87, y: 150, width: 200, height: 200, zIndex: 99 },
        style: { borderRadius: 9999, borderWidth: 4, borderColor: '#D9C8B8', objectFit: 'cover' },
      });
    } else if (preset === 'rounded') {
      addLayer(activeSectionId, 'image', {
        name: 'Bingkai Foto Soft Rounded',
        content: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        position: { x: 62, y: 150, width: 250, height: 300, zIndex: 99 },
        style: { borderRadius: 24, borderWidth: 2, borderColor: '#E8DFD8', objectFit: 'cover' },
      });
    } else if (preset === 'gold-border') {
      addLayer(activeSectionId, 'image', {
        name: 'Bingkai Vintage Gold',
        content: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        position: { x: 62, y: 150, width: 250, height: 300, zIndex: 99 },
        style: { borderRadius: 16, borderWidth: 5, borderColor: '#D4AF37', objectFit: 'cover' },
      });
    }
  };

  const handleAddTextPreset = (textType: 'title' | 'subtitle' | 'body') => {
    if (!activeSectionId) return;

    if (textType === 'title') {
      addLayer(activeSectionId, 'text', {
        name: 'Judul Utama',
        content: 'The Wedding Of',
        position: { x: 37, y: 80, width: 300, height: 50, zIndex: 99 },
        style: { fontSize: 24, fontFamily: 'Playfair Display, serif', color: '#1E293B', textAlign: 'center' },
      });
    } else if (textType === 'subtitle') {
      addLayer(activeSectionId, 'text', {
        name: 'Sub Judul / Nama',
        content: 'Romeo & Juliet',
        position: { x: 37, y: 140, width: 300, height: 60, zIndex: 99 },
        style: { fontSize: 32, fontFamily: 'Great Vibes, cursive', color: '#2563EB', textAlign: 'center' },
      });
    } else if (textType === 'body') {
      addLayer(activeSectionId, 'text', {
        name: 'Paragraf Teks',
        content: 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.',
        position: { x: 37, y: 220, width: 300, height: 80, zIndex: 99 },
        style: { fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#475569', textAlign: 'center' },
      });
    }
  };

  return (
    <div className="flex h-full select-none font-sans">
      {/* Hidden File Inputs */}
      <input type="file" ref={photoInputRef} accept="image/*" onChange={handlePhotoUpload} className="hidden" />
      <input type="file" ref={elementImageInputRef} accept="image/*,.svg" onChange={handleElementImageUpload} className="hidden" />
      <input type="file" ref={bgFileInputRef} accept="image/*" onChange={handleBgFileUpload} className="hidden" />

      {/* 1. SLIM LEFTMOST ICON SIDEBAR (Matching Reference Design) */}
      <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center justify-between py-4 z-20 shadow-xs">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Top Royal Blue Logo Badge */}
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>

          {/* Navigation Icons with Royal Blue Active Pill */}
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => setActiveTab('template')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'template' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Template Catalog"
            >
              <LayoutGrid className="w-5 h-5" />
              {activeTab === 'template' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('elemen')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'elemen' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Elements & Shapes"
            >
              <Shapes className="w-5 h-5" />
              {activeTab === 'elemen' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('teks')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'teks' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Text Layers"
            >
              <Type className="w-5 h-5" />
              {activeTab === 'teks' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('motion')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'motion' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Fitur Motion & Physics Engine"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              {activeTab === 'motion' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('unggahan')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'unggahan' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Upload Media"
            >
              <Upload className="w-5 h-5" />
              {activeTab === 'unggahan' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('background')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'background' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Background Design"
            >
              <Palette className="w-5 h-5" />
              {activeTab === 'background' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('layers')}
              className={`w-full py-3 relative flex items-center justify-center transition-colors ${
                activeTab === 'layers' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Layers & Sections"
            >
              <Layers className="w-5 h-5" />
              {activeTab === 'layers' && (
                <div className="w-1 h-6 bg-blue-600 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom User Avatar & Settings Controls */}
        <div className="flex flex-col items-center gap-3 w-full border-t border-slate-100 pt-3">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <button className="text-slate-400 hover:text-slate-700 p-1" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-rose-600 p-1" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. CANVA TOOL SUB-PANEL CONTENT DRAWER (w-72 Clean White Theme) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full z-10">
        {/* TAB 1: ELEMEN */}
        {activeTab === 'elemen' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Elemen & Shapes</span>
                <span className="text-[10px] text-blue-600 font-mono">MODERN STUDIO</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <Mic className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 cursor-pointer hover:text-blue-600" />
              </div>

              <button
                onClick={() => elementImageInputRef.current?.click()}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Custom Graphic</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Shapes & Badges</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SHAPE_ELEMENT_PRESETS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddShapePreset(item)}
                      className="group p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-blue-500 hover:bg-blue-50/40 hover:shadow-xs transition-all text-left flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-600 shadow-xs">
                        {item.name.includes('Lingkaran') && <Circle className="w-4 h-4" />}
                        {item.name.includes('Persegi') && <Square className="w-4 h-4" />}
                        {item.name.includes('Pill') && <Shield className="w-4 h-4" />}
                        {item.name.includes('Garis') && <Minus className="w-4 h-4" />}
                        {item.name.includes('Bingkai') && <Frame className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] text-slate-700 group-hover:text-blue-600 font-semibold truncate">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEKS */}
        {activeTab === 'teks' && (
          <div className="flex-1 flex flex-col h-full p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900">Typography Presets</h3>
              <p className="text-[11px] text-slate-500">Pilih tipe teks yang ingin dimasukkan ke kanvas</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleAddTextPreset('title')}
                className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-2xl text-left shadow-xs group transition-all"
              >
                <span className="text-base font-serif font-bold text-slate-900 block group-hover:text-blue-600">
                  Judul Utama (Title)
                </span>
                <span className="text-[10px] text-slate-400">Playfair Display / Serif Font</span>
              </button>

              <button
                onClick={() => handleAddTextPreset('subtitle')}
                className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-2xl text-left shadow-xs group transition-all"
              >
                <span className="text-sm font-serif italic text-blue-600 block group-hover:text-blue-700">
                  Sub-Judul / Nama Pasangan
                </span>
                <span className="text-[10px] text-slate-400">Script & Cursive Font</span>
              </button>

              <button
                onClick={() => handleAddTextPreset('body')}
                className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-2xl text-left shadow-xs group transition-all"
              >
                <span className="text-xs font-sans text-slate-700 block group-hover:text-slate-900">
                  Paragraf Teks Deskripsi
                </span>
                <span className="text-[10px] text-slate-400">Inter / Body Font</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB MOTION & ANIMATION PRESETS WITH LIVE PREVIEWS */}
        {activeTab === 'motion' && (
          <div className="flex-1 flex flex-col h-full p-4 space-y-4 overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fitur Motion & Physics Engine</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pratinjau langsung animasi fisika sebelum diterapkan ke elemen kanvas.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                KATALOG ANIMASI FISIKA (LIVE PREVIEW)
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    type: 'loop-wind-leaf' as AnimationType,
                    label: 'Daun Tertiup Angin (Looping Direct)',
                    desc: 'Langsung bergoyang tanpa animasi masuk',
                    physicsTheory: 'Continuous Aero Oscillation',
                  },
                  {
                    type: 'loop-wind-flower' as AnimationType,
                    label: 'Bunga Tertiup Angin (Looping Direct)',
                    desc: 'Langsung melengkung tertiup angin terus menerus',
                    physicsTheory: 'Continuous Wind Torque',
                  },
                  {
                    type: 'wind-flower' as AnimationType,
                    label: 'Bunga Tertiup Angin (Entrance)',
                    desc: 'Kelopak melengkung tertiup angin kencang',
                    physicsTheory: 'Aero-Damping & Torque',
                  },
                  {
                    type: 'leaf-rustle' as AnimationType,
                    label: 'Daun Bergoyang Sepoi',
                    desc: 'Daun bergetar lembut ditiup angin sepoi',
                    physicsTheory: 'Harmonic Flutter Turbulence',
                  },
                  {
                    type: 'cloud-drift' as AnimationType,
                    label: 'Awan Bergerak Hanyut',
                    desc: 'Awan melayang horizontal lambat',
                    physicsTheory: 'Atmospheric Drag Vector',
                  },
                  {
                    type: 'ocean-wave' as AnimationType,
                    label: 'Ombak Samudra Wave',
                    desc: 'Bergulung naik turun seperti riak laut',
                    physicsTheory: 'Hydrodynamic Wave',
                  },
                  {
                    type: 'smoke-convection' as AnimationType,
                    label: 'Asap Membumbung Drift',
                    desc: 'Membumbung ke atas, membesar & menipis',
                    physicsTheory: 'Thermal Buoyancy Convection',
                  },
                  {
                    type: 'pendulum-swing' as AnimationType,
                    label: 'Ayunan Pendulum Jam',
                    desc: 'Mengayun melengkung seperti pendulum jam',
                    physicsTheory: 'Gravitational Pendulum Arc',
                  },
                  {
                    type: 'falling-leaf' as AnimationType,
                    label: 'Daun Melayang Jatuh',
                    desc: 'Gerakan daun melayang & bergoyang',
                    physicsTheory: 'Fluid Drag & Oscillations',
                  },
                  {
                    type: 'floating-sway' as AnimationType,
                    label: 'Bunga Terapung',
                    desc: 'Gerakan mengapung di atas gelombang air',
                    physicsTheory: 'Archimedes Buoyancy Wave',
                  },
                  {
                    type: 'gravity-drop' as AnimationType,
                    label: 'Gravitasi Drop Membal',
                    desc: 'Elemen jatuh bebas dan memantul',
                    physicsTheory: 'Newton Free-Fall (e = 0.6)',
                  },
                  {
                    type: 'bounce' as AnimationType,
                    label: 'Membal Pegas Elastis',
                    desc: 'Bouncing kenyal saat pertama tampil',
                    physicsTheory: "Hooke's Damped Spring",
                  },
                  {
                    type: 'curved-spiral' as AnimationType,
                    label: 'Pusaran Spiral 360',
                    desc: 'Berputar melingkar spiral ke pusat',
                    physicsTheory: 'Angular Momentum Decay',
                  },
                  {
                    type: 'pulse-heartbeat' as AnimationType,
                    label: 'Denyut Detak Jantung',
                    desc: 'Berdenyut ritmis seperti detak jantung',
                    physicsTheory: 'Cardiac Resonance',
                  },
                ].map((m) => {
                  const selLayer = useBuilderStore.getState().getSelectedLayer();
                  const isSelected = selLayer?.timeline?.entrance?.type === m.type;

                  return (
                    <MotionPreviewBox
                      key={m.type}
                      type={m.type}
                      label={m.label}
                      desc={m.desc}
                      physicsTheory={m.physicsTheory}
                      isSelected={isSelected}
                      onSelect={() => {
                        const activeSec = getActiveSection();
                        const targetLayer = useBuilderStore.getState().getSelectedLayer();
                        if (activeSec && targetLayer) {
                          useBuilderStore.getState().updateLayerTimeline(activeSec.id, targetLayer.id, {
                            entrance: {
                              type: m.type,
                              duration: 0.8,
                              delay: 0.1,
                            },
                          });
                          useBuilderStore.getState().setCurrentTime(0);
                          useBuilderStore.getState().setIsPlaying(true);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'unggahan' && (
          <div className="flex-1 flex flex-col h-full p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900">Upload Media</h3>
              <p className="text-[11px] text-slate-500">Upload foto atau ilustrasi dari komputer Anda</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => photoInputRef.current?.click()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Foto Pasangan</span>
              </button>

              <button
                onClick={() => elementImageInputRef.current?.click()}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Upload Gambar Elemen (PNG)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BACKGROUND */}
        {activeTab === 'background' && (
          <div className="flex-1 flex flex-col h-full p-4 space-y-4 overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900">Desain Background</h3>
              <p className="text-[11px] text-slate-500">Ubah gambar background section</p>
            </div>

            <button
              onClick={() => bgFileInputRef.current?.click()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Wallpaper BG</span>
            </button>

            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">Preset Wallpaper</span>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      activeSectionId &&
                      updateSectionBackground(activeSectionId, { backgroundImage: preset.url })
                    }
                    className="group p-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-left"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover rounded-lg mb-1" />
                    <span className="text-[10px] text-slate-600 group-hover:text-blue-600 truncate block font-medium">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LAYERS */}
        {activeTab === 'layers' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-white">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Section Aktif (1-12)
              </label>
              <select
                value={activeSectionId || ''}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-blue-600 font-bold focus:outline-none focus:border-blue-600"
              >
                {sections.map((sec) => {
                  const secInfo = SECTION_TYPES_LIST.find((s) => s.type === sec.sectionType);
                  return (
                    <option key={sec.id} value={sec.id}>
                      {sec.sectionOrder}. {secInfo ? secInfo.label.split('. ')[1] : sec.sectionType}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {layers.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl m-2">
                  <Layers className="w-6 h-6 mb-1 opacity-40 text-blue-600" />
                  <p className="font-medium text-slate-600">Belum ada layer</p>
                </div>
              ) : (
                layers.map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        <span className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                          {layer.type === 'text' && <Type className="w-3.5 h-3.5 text-blue-600" />}
                          {layer.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />}
                          {layer.type === 'shape' && <Square className="w-3.5 h-3.5 text-amber-600" />}
                          {layer.type === 'button' && <MousePointer className="w-3.5 h-3.5 text-pink-600" />}
                        </span>
                        <span className="truncate text-xs font-semibold">{layer.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSectionId) reorderLayerZIndex(activeSectionId, layer.id, 'moveUp');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSectionId) reorderLayerZIndex(activeSectionId, layer.id, 'moveDown');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSectionId) removeLayer(activeSectionId, layer.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TEMPLATE */}
        {activeTab === 'template' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="text-xs font-bold text-slate-900">Katalog Template</h3>
              <p className="text-[11px] text-slate-500">Pilih tema preset master (12 Sections)</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {TEMPLATE_PRESETS_CATALOG.map((tpl) => {
                const isActive = templateName === tpl.name;
                return (
                  <div
                    key={tpl.id}
                    className={`group bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
                      isActive ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="relative h-36 bg-slate-100 overflow-hidden">
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      {isActive && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                          Aktif
                        </span>
                      )}
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h4 className="text-xs font-bold text-white truncate">{tpl.name}</h4>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <button
                        onClick={() => {
                          setTemplateName(tpl.name);
                          applyBackgroundToAllSections({ backgroundColor: tpl.bgColor });
                          updateGlobalSettings({
                            primaryColor: tpl.bgColor,
                            fontHeading: tpl.fontFamily,
                          });
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Template Aktif' : 'Gunakan Template Ini'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
