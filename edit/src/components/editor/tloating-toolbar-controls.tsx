"use client";

import {
  ImagePlus,
  Box,
  MousePointer2,
  RotateCcw,
  Shapes,
  Type,
  ZoomIn,
  ZoomOut,
  Play,
  Gift,
  MailOpen,
  Music,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import type {
  CanvasElementType,
  CanvasTool,
  ShapeType,
  MockupType,
} from "@/store/useEditorStore";

interface TloatingToolbarControlsProps {
  zoom: number;
  activeTool: CanvasTool;
  activeMockup?: MockupType;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onAddText: () => void;
  onAddImage: (file: File) => void;
  onAddShape: (shape: ShapeType) => void;
  onSelectCursor: () => void;
  onAddContainer: (type: CanvasElementType) => void;
  canAddElements: boolean;
  onTogglePreview?: () => void;
  onAddGiftButton: () => void;
  onAddMusicButton: () => void;
  onAddCoverButton: () => void;
  onAddOpenInvitationButton: () => void;
}

const iconButtonClassName =
  "h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground";

export default function TloatingToolbarControls({
  zoom,
  activeTool,
  activeMockup,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onAddText,
  onAddImage,
  onAddShape,
  onSelectCursor,
  onAddContainer,
  canAddElements,
  onTogglePreview,
  onAddGiftButton,
  onAddMusicButton,
  onAddCoverButton,
  onAddOpenInvitationButton,
}: TloatingToolbarControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
  const [isContainerMenuOpen, setIsContainerMenuOpen] = useState(false);
  const [isButtonMenuOpen, setIsButtonMenuOpen] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAddImage(file);
    event.target.value = "";
  };

  const shapes: Array<{ type: ShapeType; label: string }> = [
    { type: "line", label: "Garis" },
    { type: "circle", label: "Lingkaran" },
    { type: "square", label: "Kotak" },
    { type: "triangle", label: "Segitiga" },
    { type: "star", label: "Bintang" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-2xl border border-border/60 bg-card/90 p-1.5 shadow-2xl backdrop-blur-xl">
      <Button
        size="icon"
        variant={activeTool === "cursor" ? "secondary" : "ghost"}
        className={iconButtonClassName}
        onClick={onSelectCursor}
        title="Pilih Elemen"
        aria-label="Pilih Elemen"
      >
        <MousePointer2 className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onZoomIn}
        title="Perbesar"
        aria-label="Perbesar"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <span className="min-w-10 text-center font-mono text-xs font-medium text-muted-foreground">
        {zoom}%
      </span>

      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onZoomOut}
        title="Perkecil"
        aria-label="Perkecil"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onResetZoom}
        title="Reset Zoom"
        aria-label="Reset Zoom"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-4 w-[1px] bg-border" />

      <Button
        size="icon"
        variant={activeTool === "text" ? "secondary" : "ghost"}
        className={iconButtonClassName}
        onClick={onAddText}
        disabled={!canAddElements}
        title="Tambah Teks"
        aria-label="Tambah Teks"
      >
        <Type className="h-4 w-4" />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <Button
        size="icon"
        variant={activeTool === "image" ? "secondary" : "ghost"}
        className={iconButtonClassName}
        onClick={() => fileInputRef.current?.click()}
        disabled={!canAddElements}
        title="Tambah Gambar"
        aria-label="Tambah Gambar"
      >
        <ImagePlus className="h-4 w-4" />
      </Button>

      <div className="relative">
        <Button
          size="icon"
          variant={
            activeTool === "button" || isButtonMenuOpen ? "secondary" : "ghost"
          }
          className={iconButtonClassName}
          onClick={() => {
            setIsButtonMenuOpen((prev) => !prev);
            setIsShapeMenuOpen(false);
            setIsContainerMenuOpen(false);
          }}
          title="Tambah Tombol (Buka Undangan / Gift)"
          aria-label="Tambah Tombol"
        >
          {activeMockup === "gift-modal" ? (
            <Gift className="h-4 w-4 text-amber-400" />
          ) : (
            <MailOpen className="h-4 w-4 text-amber-400" />
          )}
        </Button>

        {isButtonMenuOpen && (
          <div className="absolute bottom-12 left-0 min-w-56 rounded-xl border border-border/60 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1">
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
              Opsi Tombol
            </span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-amber-500/20 hover:text-amber-300 text-left transition-colors cursor-pointer"
              onClick={() => {
                if (activeMockup === "cover") onAddCoverButton();
                else onAddOpenInvitationButton();
                setIsButtonMenuOpen(false);
              }}
            >
              <MailOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>Tombol Buka Undangan</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-amber-500/20 hover:text-amber-300 text-left transition-colors cursor-pointer"
              onClick={() => {
                onAddGiftButton();
                setIsButtonMenuOpen(false);
              }}
            >
              <Gift className="h-3.5 w-3.5 text-rose-400" />
              <span>Tombol Kirim Gift</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-emerald-500/20 hover:text-emerald-300 text-left transition-colors cursor-pointer"
              onClick={() => {
                onAddMusicButton();
                setIsButtonMenuOpen(false);
              }}
            >
              <Music className="h-3.5 w-3.5 text-emerald-400" />
              <span>Tombol Putar Musik (Sticky)</span>
            </button>
          </div>
        )}
      </div>
      {isShapeMenuOpen && canAddElements && (
        <div className="absolute bottom-12 left-20 grid grid-cols-2 gap-1 rounded-xl border border-border/50 bg-card p-1.5 shadow-xl">
          {shapes.map((shape) => (
            <button
              key={shape.type}
              type="button"
              className="rounded-lg px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => {
                onAddShape(shape.type);
                setIsShapeMenuOpen(false);
              }}
            >
              {shape.label}
            </button>
          ))}
        </div>
      )}

      {onTogglePreview && (
        <>
          <div className="mx-1 h-4 w-px bg-border/50" />
          <Button
            size="sm"
            variant="default"
            className="h-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs px-3.5 flex items-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer transition-all hover:scale-105 active:scale-95"
            onClick={onTogglePreview}
            title="Putar Simulasi Undangan (Play Preview)"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Play</span>
          </Button>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}
