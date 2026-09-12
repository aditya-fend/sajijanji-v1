"use client";

import { useState } from "react";
import {
  useEditorStore,
  DEFAULT_SECTIONS,
  getElementSectionIndex,
} from "@/store/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Type,
  Image as ImageIcon,
  Square,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Layers,
  LayoutTemplate,
  PanelsTopLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Navigation,
  FolderOpen,
  Gift,
  Music,
} from "lucide-react";

// Dummy Data Template (Grid 2 Kolom)
const TEMPLATES = [
  {
    id: "tpl-1",
    name: "Jawa Elegant",
    category: "Traditional",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "tpl-2",
    name: "Minimalist Gold",
    category: "Modern",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "tpl-3",
    name: "Floral Sage",
    category: "Botanical",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "tpl-4",
    name: "Rustic Wood",
    category: "Vintage",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&auto=format&fit=crop&q=80",
  },
];

export default function SecondarySidebar() {
  const activeTab = useEditorStore((state) => state.activeTab);
  const activeMockup = useEditorStore((state) => state.activeMockup);
  const setActiveMockup = useEditorStore((state) => state.setActiveMockup);
  const searchQuery = useEditorStore((state) => state.searchQuery);
  const setSearchQuery = useEditorStore((state) => state.setSearchQuery);
  const layers = useEditorStore((state) => state.layers);
  const elements = useEditorStore((state) => state.elements);
  const toggleLayerVisibility = useEditorStore(
    (state) => state.toggleLayerVisibility,
  );
  const toggleLayerLock = useEditorStore((state) => state.toggleLayerLock);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const selectElement = useEditorStore((state) => state.selectElement);
  const moveLayer = useEditorStore((state) => state.moveLayer);
  const bringForward = useEditorStore((state) => state.bringForward);
  const sendBackward = useEditorStore((state) => state.sendBackward);
  const sectionsCount = useEditorStore((state) => state.sectionsCount);
  const activeSection = useEditorStore((state) => state.activeSection);
  const scrollToSection = useEditorStore((state) => state.scrollToSection);
  const addSection = useEditorStore((state) => state.addSection);
  const removeSection = useEditorStore((state) => state.removeSection);
  const addElement = useEditorStore((state) => state.addElement);
  const addOpenInvitationButton = useEditorStore(
    (state) => state.addOpenInvitationButton,
  );
  const addGiftButton = useEditorStore((state) => state.addGiftButton);
  const addMusicButton = useEditorStore((state) => state.addMusicButton);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    asChild: boolean;
  } | null>(null);
  const [layerViewMode, setLayerViewMode] = useState<
    "active-section" | "all-sections"
  >("active-section");
  const [collapsedSections, setCollapsedSections] = useState<
    Record<number, boolean>
  >({});

  const toggleSectionCollapse = (index: number) => {
    setCollapsedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Toggle visibility layer
  const toggleVisibility = (id: string) => {
    toggleLayerVisibility(id);
  };

  // Toggle lock status layer
  const toggleLock = (id: string) => {
    toggleLayerLock(id);
  };

  const renderLayer = (layer: (typeof layers)[number], depth = 0) => {
    const childLayers = layers.filter((candidate) => {
      const element = elements.find((item) => item.id === candidate.id);
      const currentElement = elements.find((item) => item.id === layer.id);
      return element?.parentId === currentElement?.id;
    });
    const isContainer = layer.type === "container";
    const isDropTarget = dropTarget?.id === layer.id;

    return (
      <div key={layer.id} className="relative">
        {isDropTarget && (
          <div
            className="absolute -top-1 h-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            style={{
              left: depth * 16 + (dropTarget.asChild ? 16 : 0),
              right: 0,
            }}
          />
        )}
        <div
          onClick={() => {
            if (layer.mockupType && layer.mockupType !== activeMockup) {
              setActiveMockup(layer.mockupType);
            }
            selectElement(layer.id);
            selectElement(layer.id);
            if (!layer.mockupType || layer.mockupType === "invitation") {
              const el = elements.find((e) => e.id === layer.id);
              const sectionIdx = getElementSectionIndex(
                el || layer,
                elements,
                sectionsCount,
              );
              scrollToSection(sectionIdx);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (draggedLayerId && draggedLayerId !== layer.id) {
              setDropTarget({ id: layer.id, asChild: isContainer });
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (draggedLayerId && dropTarget) {
              moveLayer(draggedLayerId, layer.id, dropTarget.asChild);
            }
            setDraggedLayerId(null);
            setDropTarget(null);
          }}
          className={`group relative flex items-center justify-between rounded-xl border p-2 text-xs transition-all ${
            !layer.visible
              ? "border-transparent bg-background/20 opacity-50"
              : "border-border/30 bg-background/50 hover:border-border"
          } ${selectedElementId === layer.id ? "ring-1 ring-primary" : ""}`}
          style={{ marginLeft: depth * 16 }}
        >
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <span
              draggable
              onDragStart={(event) => {
                event.stopPropagation();
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", layer.id);
                setDraggedLayerId(layer.id);
              }}
              onDragEnd={() => {
                setDraggedLayerId(null);
                setDropTarget(null);
              }}
              className="cursor-grab active:cursor-grabbing"
              title="Geser layer untuk mengatur hierarchy"
            >
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
            </span>
            {layer.type === "container" ? (
              <Layers className="h-3.5 w-3.5 text-primary" />
            ) : layer.type === "text" ? (
              <Type className="h-3.5 w-3.5 text-blue-400" />
            ) : layer.type === "image" ? (
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Square className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span className="truncate font-medium text-foreground">
              {layer.name}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                bringForward(layer.id);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-amber-400"
              title="Maju 1 Layer ke Depan"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                sendBackward(layer.id);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-amber-400"
              title="Mundur 1 Layer ke Belakang"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleVisibility(layer.id);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Sembunyikan / Tampilkan"
            >
              {layer.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3 text-destructive" />
              )}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleLock(layer.id);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Kunci Layer"
            >
              {layer.locked ? (
                <Lock className="h-3 w-3 text-amber-500" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        {childLayers.map((child) => renderLayer(child, depth + 1))}
      </div>
    );
  };

  return (
    <aside className="w-80 h-screen bg-card/60 backdrop-blur-xl border-r border-border/40 flex flex-col shrink-0 z-20 select-none">
      {/* Dynamic Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeTab === "templates" ? (
            <LayoutTemplate className="h-4 w-4 text-primary" />
          ) : activeTab === "sections" ? (
            <PanelsTopLeft className="h-4 w-4 text-primary" />
          ) : (
            <Layers className="h-4 w-4 text-primary" />
          )}
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {activeTab === "templates"
              ? "Pilih Template"
              : activeTab === "sections"
                ? "Pengaturan Section"
                : "Pengaturan Layer"}
          </h2>
        </div>
        {activeTab === "sections" && (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {sectionsCount} Halaman
          </span>
        )}
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-4">
        {/* ================= TAB 1: LIST TEMPLATE (2 KOLOM) ================= */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            {/* Search Template */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari template..."
                className="pl-8 text-xs h-9 rounded-xl border-border/50 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Grid 2 Kolom Template */}
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="group relative rounded-xl border border-border/40 bg-background/30 overflow-hidden cursor-pointer hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="aspect-3/4 w-full overflow-hidden bg-muted relative">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <Button
                        size="sm"
                        className="h-7 text-[10px] rounded-lg w-full"
                      >
                        Gunakan
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate text-foreground">
                      {tpl.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {tpl.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PENGATURAN LAYER ================= */}
        {activeTab === "layers" && (
          <div className="space-y-3">
            {/* Mockup Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-background/50 border border-border/40">
              {(
                [
                  { id: "invitation", label: "Undangan" },
                  { id: "cover", label: "Cover" },
                  { id: "gift-modal", label: "Gift Modal" },
                ] as const
              ).map((m) => {
                const count = layers.filter((l) =>
                  m.id === "invitation"
                    ? !l.mockupType || l.mockupType === "invitation"
                    : l.mockupType === m.id,
                ).length;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMockup(m.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      activeMockup === m.id
                        ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <span>{m.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                        activeMockup === m.id
                          ? "bg-primary-foreground/25 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Jika Mockup Undangan: Section-Aware Layer Manager */}
            {activeMockup === "invitation" ? (
              <div className="space-y-2.5">
                {/* Section Selector Bar & Filter Toggle */}
                <div className="p-2.5 rounded-2xl bg-neutral-900/90 border border-amber-500/20 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] font-bold text-foreground truncate">
                        Section {activeSection + 1}: {DEFAULT_SECTIONS[activeSection] || `Section ${activeSection + 1}`}
                      </span>
                    </div>
                    {/* Toggle Mode: Section Ini vs Semua */}
                    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-neutral-950 border border-border/40">
                      <button
                        type="button"
                        onClick={() => setLayerViewMode("active-section")}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                          layerViewMode === "active-section"
                            ? "bg-amber-500 text-neutral-950 font-bold shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Tampilkan layer khusus section yang sedang aktif dibuka"
                      >
                        Section Aktif
                      </button>
                      <button
                        type="button"
                        onClick={() => setLayerViewMode("all-sections")}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                          layerViewMode === "all-sections"
                            ? "bg-amber-500 text-neutral-950 font-bold shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Tampilkan semua section secara terorganisir"
                      >
                        Semua
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Quick Section Selector */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                    {DEFAULT_SECTIONS.slice(0, sectionsCount).map((secName, idx) => {
                      const isCurrent = activeSection === idx;
                      const count = layers.filter((l) => {
                        if (l.mockupType && l.mockupType !== "invitation") return false;
                        const el = elements.find((e) => e.id === l.id);
                        return getElementSectionIndex(el || l, elements, sectionsCount) === idx;
                      }).length;

                      return (
                        <button
                          key={secName}
                          type="button"
                          onClick={() => scrollToSection(idx)}
                          className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-amber-500/20 border border-amber-400/60 text-amber-300 font-semibold shadow-xs"
                              : "bg-neutral-950/60 border border-border/30 text-neutral-400 hover:text-foreground hover:border-border"
                          }`}
                        >
                          <span>{idx + 1}. {secName}</span>
                          <span
                            className={`text-[8px] px-1 rounded-full ${
                              isCurrent
                                ? "bg-amber-400 text-neutral-950 font-bold"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MODE 1: SECTION AKTIF */}
                {layerViewMode === "active-section" && (
                  <div className="space-y-1.5">
                    {(() => {
                      const sectionLayers = layers.filter((layer) => {
                        if (layer.mockupType && layer.mockupType !== "invitation") return false;
                        if (elements.find((el) => el.id === layer.id)?.parentId) return false;
                        const el = elements.find((e) => e.id === layer.id);
                        return (
                          getElementSectionIndex(el || layer, elements, sectionsCount) ===
                          activeSection
                        );
                      });

                      if (sectionLayers.length === 0) {
                        return (
                          <div className="p-5 text-center border border-dashed border-amber-500/30 rounded-2xl bg-amber-500/5 space-y-3">
                            <Layers className="h-6 w-6 text-amber-400/50 mx-auto" />
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-foreground">
                                Section {activeSection + 1} ({DEFAULT_SECTIONS[activeSection] || `Section ${activeSection + 1}`}) masih kosong
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Belum ada elemen di section ini. Tambahkan elemen baru:
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] border-border/60 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-400/50"
                                onClick={() => addElement("text")}
                              >
                                <Type className="h-3 w-3 mr-1 text-blue-400" />
                                <span>+ Teks</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] border-border/60 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-400/50"
                                onClick={() => addOpenInvitationButton(activeSection)}
                              >
                                <Square className="h-3 w-3 mr-1 text-amber-400" />
                                <span>+ Tombol</span>
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] border-rose-500/40 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400/60 font-semibold flex items-center justify-center gap-1"
                                onClick={() => addGiftButton(activeSection)}
                              >
                                <Gift className="h-3.5 w-3.5 text-rose-400" />
                                <span>+ Gift Sticky</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 font-semibold flex items-center justify-center gap-1"
                                onClick={() => addMusicButton(activeSection)}
                              >
                                <Music className="h-3.5 w-3.5 text-emerald-400" />
                                <span>+ Musik Sticky</span>
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-1 pb-1">
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {sectionLayers.length} layer di section ini
                            </span>
                            <span className="text-[10px] text-amber-400/80 font-mono">
                              Posisi {activeSection * 844}px - {(activeSection + 1) * 844}px
                            </span>
                          </div>
                          {sectionLayers.map((layer) => renderLayer(layer))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODE 2: SEMUA SECTION (GROUPED BY SECTION) */}
                {layerViewMode === "all-sections" && (
                  <div className="space-y-2">
                    {DEFAULT_SECTIONS.slice(0, sectionsCount).map((secName, idx) => {
                      const isCurrent = activeSection === idx;
                      const isCollapsed = Boolean(collapsedSections[idx]);
                      const secLayers = layers.filter((layer) => {
                        if (layer.mockupType && layer.mockupType !== "invitation") return false;
                        if (elements.find((el) => el.id === layer.id)?.parentId) return false;
                        const el = elements.find((e) => e.id === layer.id);
                        return getElementSectionIndex(el || layer, elements, sectionsCount) === idx;
                      });

                      return (
                        <div
                          key={`section-group-${idx}`}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isCurrent
                              ? "border-amber-500/50 bg-neutral-900/80 shadow-md shadow-amber-500/5"
                              : "border-border/40 bg-neutral-950/40"
                          }`}
                        >
                          {/* Header Folder Section */}
                          <div
                            onClick={() => scrollToSection(idx)}
                            className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSectionCollapse(idx);
                                }}
                                className="p-0.5 rounded hover:bg-neutral-800 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                {isCollapsed ? (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <div className="min-w-0">
                                <span
                                  className={`text-xs font-semibold truncate block ${
                                    isCurrent ? "text-amber-300" : "text-foreground"
                                  }`}
                                >
                                  {idx + 1}. {secName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isCurrent && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950">
                                  Aktif
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-400">
                                {secLayers.length}
                              </span>
                            </div>
                          </div>

                          {/* Content Layers Section */}
                          {!isCollapsed && (
                            <div className="p-2 pt-0 space-y-1 border-t border-border/20 mt-1">
                              {secLayers.length === 0 ? (
                                <p className="text-[10px] text-muted-foreground/60 italic py-1 text-center">
                                  Kosong (belum ada elemen)
                                </p>
                              ) : (
                                secLayers.map((layer) => renderLayer(layer))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Komponen Mockup Cover atau Gift Modal */
              <div>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Komponen mockup {activeMockup === "cover" ? "cover pembuka" : "gift modal digital"}.
                </p>
                {(() => {
                  const currentLayers = layers.filter(
                    (layer) =>
                      layer.mockupType === activeMockup &&
                      !elements.find((element) => element.id === layer.id)?.parentId,
                  );

                  if (currentLayers.length === 0) {
                    return (
                      <div className="p-6 text-center border border-dashed border-border/40 rounded-xl space-y-2">
                        <Layers className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                        <p className="text-xs text-muted-foreground font-medium">
                          Belum ada layer di mockup {activeMockup}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-1">
                      {currentLayers.map((layer) => renderLayer(layer))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PENGATURAN SECTION ================= */}
        {activeTab === "sections" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                Klik section untuk langsung mengarahkan tampilan canvas.
              </p>
            </div>

            {/* Quick Actions Add/Remove Section */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-background/40 border border-border/40">
              <button
                type="button"
                onClick={removeSection}
                disabled={sectionsCount <= 1}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Kurangi section"
              >
                <Minus className="h-3.5 w-3.5" />
                <span>Kurangi</span>
              </button>
              <div className="h-4 w-px bg-border/40" />
              <button
                type="button"
                onClick={addSection}
                disabled={sectionsCount >= 10}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Tambah section"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* List Sections dengan Click to Scroll */}
            <div className="space-y-1.5">
              {DEFAULT_SECTIONS.slice(0, sectionsCount).map((section, index) => {
                const isActive = activeSection === index;
                return (
                  <div
                    key={section}
                    role="button"
                    tabIndex={0}
                    onClick={() => scrollToSection(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToSection(index);
                      }
                    }}
                    className={`group relative flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition-all cursor-pointer outline-none ${
                      isActive
                        ? "border-primary/80 bg-primary/15 text-primary shadow-sm shadow-primary/10 ring-1 ring-primary/40 font-medium"
                        : "border-border/40 bg-background/40 hover:border-primary/50 hover:bg-background/80 hover:translate-x-0.5 text-foreground"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex flex-col">
                        <span className="truncate font-medium text-xs">
                          {section}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70">
                          Posisi: {index * 844}px
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {isActive ? (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                          </span>
                          <span>Aktif</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <Navigation className="h-3 w-3 mr-1 text-primary" />
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}

