"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
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
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    asChild: boolean;
  } | null>(null);

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
          onClick={() => selectElement(layer.id)}
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
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleVisibility(layer.id);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {layer.visible ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-destructive" />
              )}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleLock(layer.id);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {layer.locked ? (
                <Lock className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
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
          ) : (
            <Layers className="h-4 w-4 text-primary" />
          )}
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {activeTab === "templates" ? "Pilih Template" : "Pengaturan Layer"}
          </h2>
        </div>
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
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground mb-3">
              Urutkan dan kelola visibilitas elemen canvas.
            </p>

            <div className="space-y-1">
              {layers
                .filter(
                  (layer) =>
                    !elements.find((element) => element.id === layer.id)
                      ?.parentId,
                )
                .map((layer) => renderLayer(layer))}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
