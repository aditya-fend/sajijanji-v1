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
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import type {
  CanvasElementType,
  CanvasTool,
  ShapeType,
} from "@/store/useEditorStore";

interface TloatingToolbarControlsProps {
  zoom: number;
  activeTool: CanvasTool;
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
}

const iconButtonClassName =
  "h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground";

export default function TloatingToolbarControls({
  zoom,
  activeTool,
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
}: TloatingToolbarControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
  const [isContainerMenuOpen, setIsContainerMenuOpen] = useState(false);

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
    <div
      className="absolute bottom-6 z-30 flex items-center gap-1.5 rounded-2xl border border-border/50 bg-card/80 p-1.5 shadow-xl backdrop-blur-md"
      onClick={(event) => event.stopPropagation()}
    >
      <Button
        size="icon"
        variant={activeTool === "cursor" ? "secondary" : "ghost"}
        className={iconButtonClassName}
        onClick={onSelectCursor}
        title="Mode cursor"
        aria-label="Kembali ke mode cursor"
      >
        <MousePointer2 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={() => setIsContainerMenuOpen((open) => !open)}
        title="Tambah container"
        aria-label="Tambah container"
      >
        <Box className="h-4 w-4" />
      </Button>
      {isContainerMenuOpen && (
        <div className="absolute bottom-12 left-24 grid gap-1 rounded-xl border border-border/50 bg-card p-1.5 shadow-xl">
          {(["container", "text", "image", "shape"] as CanvasElementType[]).map(
            (type) => (
              <button
                key={type}
                type="button"
                className="rounded-lg px-3 py-1.5 text-left text-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => {
                  onAddContainer(type);
                  setIsContainerMenuOpen(false);
                }}
              >
                {type === "container"
                  ? "Container kosong"
                  : `Container + ${type}`}
              </button>
            ),
          )}
        </div>
      )}

      <div className="mx-1 h-4 w-px bg-border/50" />

      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onAddText}
        disabled={!canAddElements}
        title="Tambah teks"
        aria-label="Tambah teks"
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={() => fileInputRef.current?.click()}
        disabled={!canAddElements}
        title="Tambah gambar"
        aria-label="Tambah gambar"
      >
        <ImagePlus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={() => setIsShapeMenuOpen((open) => !open)}
        disabled={!canAddElements}
        title="Tambah shape"
        aria-label="Tambah shape"
      >
        <Shapes className="h-4 w-4" />
      </Button>
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

      <div className="mx-1 h-4 w-px bg-border/50" />

      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onZoomOut}
        title="Zoom out"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="min-w-12 px-2 text-center font-mono text-xs font-medium text-foreground">
        {zoom}%
      </span>
      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onZoomIn}
        title="Zoom in"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={iconButtonClassName}
        onClick={onResetZoom}
        title="Reset zoom"
        aria-label="Reset zoom"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>

      {onTogglePreview && (
        <>
          <div className="mx-1 h-4 w-px bg-border/50" />
          <Button
            size="sm"
            variant="default"
            className="h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs px-3 flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            onClick={onTogglePreview}
            title="Lihat Hasil Akhir (Play Preview)"
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
