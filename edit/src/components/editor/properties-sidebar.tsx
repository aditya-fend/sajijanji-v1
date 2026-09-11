"use client";

import { useState, useRef } from "react";
import {
  useEditorStore,
  type AnimationName,
  type ContainerSizeMode,
  type TextEffectType,
  type ButtonIconType,
  type ButtonVariantType,
} from "@/store/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ImageIcon,
  Sliders,
  Type,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  Trash2,
  Image as LucideImage,
  Palette,
  Plus,
  Minus,
  Check,
  Smartphone,
  Eye,
  Move,
  ZoomIn,
  Crosshair,
  Grid3X3,
  Layers,
  Mail,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import {
  MOUNT_ANIMATION_OPTIONS,
  UNMOUNT_ANIMATION_OPTIONS,
  playPhysicsMountAnimation,
  playPhysicsUnmountAnimation,
} from "@/lib/physicsAnimations";

const LOOP_OPTIONS = [
  { value: "none" as AnimationName, label: "None (Static)" },
  { value: "wind-sway" as AnimationName, label: "🍃 Wind Sway (Hembusan Angin Lentur)" },
  { value: "fade-up" as AnimationName, label: "↕️ Float Oscillation (Osilasi Terapung)" },
  { value: "fade-right" as AnimationName, label: "↔️ Sway Oscillation (Osilasi Mengayun)" },
  { value: "fade-in" as AnimationName, label: "✨ Pulse Glow (Denyut Cahaya)" },
];

import gsap from "gsap";

function AnimationPanel({
  elementId,
  animation,
  onChange,
}: {
  elementId: string;
  animation?: {
    mount: AnimationName;
    unmount: AnimationName;
    loop: AnimationName;
  };
  onChange: (key: "mount" | "unmount" | "loop", value: AnimationName) => void;
}) {
  const current = animation ?? {
    mount: "none",
    unmount: "none",
    loop: "none",
  };

  const playMountPreview = () => {
    const target = document.querySelector<HTMLElement>(
      `[data-element-id="${elementId}"]`,
    );
    if (!target) return;
    gsap.killTweensOf(target);
    playPhysicsMountAnimation(target, current.mount, () => {
      if (current.loop !== "none" && current.loop !== "wind-sway") {
        const loopConfig: Record<AnimationName, gsap.TweenVars> = {
          "fade-up": { y: -14, filter: "blur(1px)" },
          "fade-right": { x: 14, filter: "blur(1px)" },
          "fade-down": { y: 14, filter: "blur(1px)" },
          "fade-left": { x: -14, filter: "blur(1px)" },
          "fade-in": { opacity: 0.35, filter: "blur(2px)" },
          "fade-out": { opacity: 0.35, filter: "blur(2px)" },
          "spring-pop": { scale: 1.05 },
          "bounce-drop": { y: 8 },
          "pendulum-swing": { rotation: 5 },
          "magnetic-pull": { x: 8 },
          "zoom-blur": { scale: 1.06 },
          "float-rise": { y: -16 },
          "spring-collapse": {},
          "drop-fade": {},
          "pendulum-exit": {},
          "zoom-out-warp": {},
          "wind-sway": {},
          none: {},
        };

        gsap.to(target, {
          ...(loopConfig[current.loop] ?? { y: -10 }),
          duration: 1.8,
          delay: 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
  };

  const playUnmountPreview = () => {
    const target = document.querySelector<HTMLElement>(
      `[data-element-id="${elementId}"]`,
    );
    if (!target) return;
    playPhysicsUnmountAnimation(target, current.unmount, () => {
      // Re-mount target smoothly after unmount preview finishes
      setTimeout(() => {
        playPhysicsMountAnimation(target, current.mount);
      }, 300);
    });
  };

  const selectedMountObj = MOUNT_ANIMATION_OPTIONS.find((o) => o.value === current.mount);
  const selectedUnmountObj = UNMOUNT_ANIMATION_OPTIONS.find((o) => o.value === current.unmount);

  return (
    <div className="space-y-4">
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
        <p className="font-semibold text-amber-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Teori Fisika & Dynamic Blur
        </p>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Animasi menggunakan kurva inersia, pegas Hooke teredam (*damped oscillator*), gravitasi pantul, dan motion blur berbasis kecepatan.
        </p>
      </div>

      {/* 1. Animasi Masuk (Mount) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="font-semibold text-xs text-foreground">
            Animasi Masuk (Mount)
          </Label>
          <span className="text-[10px] text-amber-400 font-mono">
            {selectedMountObj?.category ?? "Fisika"}
          </span>
        </div>
        <select
          value={current.mount}
          onChange={(event) => {
            const val = event.target.value as AnimationName;
            onChange("mount", val);
          }}
          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
        >
          {MOUNT_ANIMATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedMountObj?.physicsTheory && (
          <p className="text-[10px] text-muted-foreground italic pl-1">
            ⚡ {selectedMountObj.physicsTheory}
          </p>
        )}
      </div>

      {/* 2. Animasi Keluar (Unmount) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="font-semibold text-xs text-foreground">
            Animasi Keluar (Unmount)
          </Label>
          <span className="text-[10px] text-amber-400 font-mono">
            {selectedUnmountObj?.category ?? "Fisika"}
          </span>
        </div>
        <select
          value={current.unmount}
          onChange={(event) => {
            const val = event.target.value as AnimationName;
            onChange("unmount", val);
          }}
          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
        >
          {UNMOUNT_ANIMATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedUnmountObj?.physicsTheory && (
          <p className="text-[10px] text-muted-foreground italic pl-1">
            ⚡ {selectedUnmountObj.physicsTheory}
          </p>
        )}
      </div>

      {/* 3. Animasi Berulang (Loop) */}
      <div className="space-y-1.5">
        <Label className="font-semibold text-xs text-foreground">
          Animasi Berulang (Loop)
        </Label>
        <select
          value={current.loop}
          onChange={(event) => {
            const val = event.target.value as AnimationName;
            onChange("loop", val);
          }}
          className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
        >
          {LOOP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={playMountPreview}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-2 text-xs font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Test Putar Animasi Masuk (Blur)
        </button>
        <button
          type="button"
          onClick={playUnmountPreview}
          className="flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border px-3 py-2 text-xs font-medium transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Test Putar Animasi Keluar (Unmount)
        </button>
      </div>
    </div>
  );
}

const BG_IMAGE_PRESETS = [
  {
    name: "Cream Watercolor Floral",
    category: "Floral",
    url: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Luxury Gold White Marble",
    category: "Marble",
    url: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dark Velvet Obsidian",
    category: "Dark Luxury",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Emerald Botanical Leaf",
    category: "Botanical",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Blush Romantic Rose",
    category: "Romantic",
    url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Vintage Linen Texture",
    category: "Texture",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
  },
];

const COLOR_PRESETS = [
  { label: "Pure White", color: "#ffffff" },
  { label: "Ivory Cream", color: "#faf6f0" },
  { label: "Champagne Warm", color: "#f5eee6" },
  { label: "Soft Sage", color: "#eef2eb" },
  { label: "Dusty Blush", color: "#fbf0f2" },
  { label: "Dark Obsidian", color: "#111113" },
  { label: "Deep Emerald", color: "#0c1815" },
  { label: "Midnight Navy", color: "#0d1322" },
];

function CanvasPropertiesSidebar() {
  const bgColor = useEditorStore((state) => state.bgColor);
  const bgImage = useEditorStore((state) => state.bgImage);
  const bgImageFit = useEditorStore((state) => state.bgImageFit);
  const bgImageOpacity = useEditorStore((state) => state.bgImageOpacity);
  const bgImageBlur = useEditorStore((state) => state.bgImageBlur);
  const bgImagePosX = useEditorStore((state) => state.bgImagePosX);
  const bgImagePosY = useEditorStore((state) => state.bgImagePosY);
  const bgImageScale = useEditorStore((state) => state.bgImageScale);
  const bgImageFixed = useEditorStore((state) => state.bgImageFixed);

  const setBgColor = useEditorStore((state) => state.setBgColor);
  const setBgImage = useEditorStore((state) => state.setBgImage);
  const setBgImageFit = useEditorStore((state) => state.setBgImageFit);
  const setBgImageOpacity = useEditorStore((state) => state.setBgImageOpacity);
  const setBgImageBlur = useEditorStore((state) => state.setBgImageBlur);
  const setBgImagePosX = useEditorStore((state) => state.setBgImagePosX);
  const setBgImagePosY = useEditorStore((state) => state.setBgImagePosY);
  const setBgImageScale = useEditorStore((state) => state.setBgImageScale);
  const setBgImageFixed = useEditorStore((state) => state.setBgImageFixed);

  const sectionsCount = useEditorStore((state) => state.sectionsCount);
  const addSection = useEditorStore((state) => state.addSection);
  const removeSection = useEditorStore((state) => state.removeSection);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setBgImage(objectUrl);
      // Default to section-cover so all sections immediately get the background
      setBgImageFit("section-cover");
      setBgImageScale(100);
      setBgImagePosX(50);
      setBgImagePosY(50);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setBgImage(objectUrl);
      setBgImageFit("section-cover");
      setBgImageScale(100);
      setBgImagePosX(50);
      setBgImagePosY(50);
    }
  };

  const handleThumbnailClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((event.clientY - rect.top) / rect.height) * 100)));
    setBgImagePosX(x);
    setBgImagePosY(y);
  };

  const ANCHOR_POINTS = [
    { label: "↖", x: 0, y: 0, title: "Kiri Atas" },
    { label: "↑", x: 50, y: 0, title: "Tengah Atas" },
    { label: "↗", x: 100, y: 0, title: "Kanan Atas" },
    { label: "←", x: 0, y: 50, title: "Kiri Tengah" },
    { label: "•", x: 50, y: 50, title: "Tepat di Tengah" },
    { label: "→", x: 100, y: 50, title: "Kanan Tengah" },
    { label: "↙", x: 0, y: 100, title: "Kiri Bawah" },
    { label: "↓", x: 50, y: 100, title: "Tengah Bawah" },
    { label: "↘", x: 100, y: 100, title: "Kanan Bawah" },
  ];

  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col border-l border-border/40 bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Properti Canvas & Mockup
          </h2>
        </div>
        <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400 border border-amber-500/20">
          <Smartphone className="h-3 w-3" />
          360 × 720
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-5">
          {/* 1. Upload Gambar Background Mockup Frame */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <LucideImage className="h-3.5 w-3.5 text-amber-400" />
                Gambar Background Mockup
              </Label>
              {bgImage && (
                <button
                  type="button"
                  onClick={() => setBgImage(null)}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Hapus background gambar"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {bgImage ? (
              <div className="space-y-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3">
                {/* Interactive Focal Point Thumbnail Preview */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Crosshair className="h-3 w-3 text-amber-400" />
                      Klik Thumbnail untuk Atur Titik Fokus
                    </span>
                    <span className="font-mono text-[10px] text-amber-400">
                      {bgImagePosX}%, {bgImagePosY}%
                    </span>
                  </div>

                  <div
                    onClick={handleThumbnailClick}
                    className="relative h-36 w-full overflow-hidden rounded-xl border border-border/60 bg-neutral-950 shadow-inner group cursor-crosshair select-none"
                    title="Klik di mana saja pada gambar untuk memindahkan fokus background"
                  >
                    <img
                      src={bgImage}
                      alt="Mockup Frame Background"
                      className="h-full w-full object-contain pointer-events-none"
                    />

                    {/* Target Focal Crosshair Indicator */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 flex items-center justify-center"
                      style={{
                        left: `${bgImagePosX}%`,
                        top: `${bgImagePosY}%`,
                      }}
                    >
                      <div className="h-6 w-6 rounded-full border-2 border-amber-400 bg-amber-400/20 shadow-lg animate-pulse" />
                      <div className="absolute h-1.5 w-1.5 rounded-full bg-amber-400" />
                    </div>

                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-semibold text-neutral-950 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Upload className="h-2.5 w-2.5" />
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBgImage(null);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* 9-Point Focal Anchor Quick Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Grid3X3 className="h-3 w-3 text-amber-400" />
                      Posisi Titik Sudut Fokus (Anchor)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {ANCHOR_POINTS.map((pt) => {
                      const isActive =
                        bgImagePosX === pt.x && bgImagePosY === pt.y;
                      return (
                        <button
                          key={pt.title}
                          type="button"
                          onClick={() => {
                            setBgImagePosX(pt.x);
                            setBgImagePosY(pt.y);
                          }}
                          className={`h-7 rounded-lg border text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                            isActive
                              ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50"
                              : "border-border/60 bg-neutral-900/60 text-muted-foreground hover:bg-neutral-800 hover:text-foreground"
                          }`}
                          title={pt.title}
                        >
                          {pt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mode Fit Background */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Mode Penyesuaian Ukuran (Fit)
                  </Label>
                  <select
                    value={bgImageFit}
                    onChange={(e) =>
                      setBgImageFit(
                        e.target.value as
                          | "custom"
                          | "cover"
                          | "contain"
                          | "repeat"
                          | "section-cover",
                      )
                    }
                    className="h-8 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="section-cover">Terapkan ke Semua Section (Pas 720px per Halaman)</option>
                    <option value="custom">Bebas / Kustom (Skala & Posisi Slider ke Semua Section)</option>
                    <option value="contain">Muat Utuh Tanpa Terpotong (Contain di Semua Section)</option>
                    <option value="cover">1 Gambar Membentang Panjang (Cover Seluruh Canvas)</option>
                    <option value="repeat">Pola Motif Berulang (Tile Repeat)</option>
                  </select>
                </div>

                {/* Zoom / Skala Gambar Background */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ZoomIn className="h-3 w-3 text-amber-400" />
                      Skala / Zoom Gambar
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-amber-400">{bgImageScale}%</span>
                      {bgImageScale !== 100 && (
                        <button
                          type="button"
                          onClick={() => setBgImageScale(100)}
                          className="text-[9px] text-muted-foreground hover:text-amber-400 underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <Slider
                    value={[bgImageScale]}
                    onValueChange={(val) =>
                      setBgImageScale(Array.isArray(val) ? val[0] : (val as number))
                    }
                    min={20}
                    max={250}
                    step={1}
                  />
                  <div className="flex gap-1 pt-0.5">
                    {[50, 100, 125, 150].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setBgImageScale(scale)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-mono border transition-all ${
                          bgImageScale === scale
                            ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                            : "bg-neutral-900/50 border-border/40 text-muted-foreground hover:bg-neutral-800"
                        }`}
                      >
                        {scale}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posisi Geser X & Y Slider */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Posisi X (Kiri-Kanan)</span>
                      <span className="font-mono text-amber-400">{bgImagePosX}%</span>
                    </div>
                    <Slider
                      value={[bgImagePosX]}
                      onValueChange={(val) =>
                        setBgImagePosX(Array.isArray(val) ? val[0] : (val as number))
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Posisi Y (Atas-Bawah)</span>
                      <span className="font-mono text-amber-400">{bgImagePosY}%</span>
                    </div>
                    <Slider
                      value={[bgImagePosY]}
                      onValueChange={(val) =>
                        setBgImagePosY(Array.isArray(val) ? val[0] : (val as number))
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                {/* Parallax / Fixed Viewport Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setBgImageFixed(!bgImageFixed)}
                    className={`flex items-center justify-between w-full p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      bgImageFixed
                        ? "border-amber-400/50 bg-amber-500/15 text-amber-300 shadow-sm"
                        : "border-border/60 bg-neutral-900/60 text-muted-foreground hover:bg-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-left">
                      <Smartphone className={`h-4 w-4 ${bgImageFixed ? "text-amber-400" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-semibold text-foreground text-[11px]">
                          Latar Diam di Layar (Fixed / Parallax)
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {bgImageFixed
                            ? "Aktif: Background tetap diam saat halaman di-scroll"
                            : "Nonaktif: Background bergulir mengikuti halaman"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`h-4 w-7 rounded-full transition-colors flex items-center p-0.5 ${
                        bgImageFixed ? "bg-amber-400 justify-end" : "bg-neutral-700 justify-start"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full bg-neutral-950 shadow-sm" />
                    </span>
                  </button>
                </div>

                <Separator />

                {/* Opacity Gambar Background */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Transparansi Gambar</span>
                    <span className="font-mono text-amber-400">{bgImageOpacity}%</span>
                  </div>
                  <Slider
                    value={[bgImageOpacity]}
                    onValueChange={(val) =>
                      setBgImageOpacity(Array.isArray(val) ? val[0] : (val as number))
                    }
                    min={5}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Blur / Bokeh Background */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Efek Blur (Depth of Field)</span>
                    <span className="font-mono text-amber-400">{bgImageBlur}px</span>
                  </div>
                  <Slider
                    value={[bgImageBlur]}
                    onValueChange={(val) =>
                      setBgImageBlur(Array.isArray(val) ? val[0] : (val as number))
                    }
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                    : "border-border/60 bg-muted/20 hover:border-amber-500/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Upload Background Mockup
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Klik atau seret file gambar ke sini (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preset Koleksi Tekstur Mewah Undangan */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Preset Background Mewah
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {BG_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setBgImage(preset.url);
                    setBgImageFit("section-cover");
                  }}
                  className={`group relative h-16 w-full overflow-hidden rounded-xl border text-left transition-all hover:scale-105 cursor-pointer ${
                    bgImage === preset.url
                      ? "border-amber-400 ring-2 ring-amber-400/40"
                      : "border-border/60 hover:border-amber-500/50"
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1 right-1 truncate text-[9px] font-medium text-white/90">
                    {preset.category}
                  </span>
                  {bgImage === preset.url && (
                    <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-neutral-950 shadow">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* 2. Warna Dasar Mockup Frame (Background Color) */}
          <div className="space-y-2.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Palette className="h-3.5 w-3.5 text-amber-400" />
              Warna Dasar Mockup (Tint/Solid)
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
              />
              <Input
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                className="h-9 flex-1 font-mono text-xs uppercase"
              />
            </div>

            {/* Quick Color Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => setBgColor(preset.color)}
                  style={{ backgroundColor: preset.color }}
                  className={`h-5 w-5 rounded-full border transition-transform hover:scale-110 cursor-pointer shadow-xs ${
                    bgColor.toLowerCase() === preset.color.toLowerCase()
                      ? "border-amber-400 ring-2 ring-amber-400/40"
                      : "border-neutral-700/60"
                  }`}
                  title={`${preset.label} (${preset.color})`}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* 3. Pengaturan Section / Halaman Canvas */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Jumlah Halaman (Sections)
              </Label>
              <span className="font-mono text-xs font-bold text-amber-400">
                {sectionsCount} Halaman
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={removeSection}
                disabled={sectionsCount <= 1}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground transition-all hover:bg-secondary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" />
                Kurangi Halaman
              </button>
              <button
                type="button"
                onClick={addSection}
                disabled={sectionsCount >= 10}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/30 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed active:scale-95 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Halaman
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default function RightPropertiesSidebar() {
  const [activeTab, setActiveTab] = useState<"properties" | "animation">(
    "properties",
  );
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const element = useEditorStore((state) =>
    state.elements.find((item) => item.id === selectedElementId),
  );
  const updateElement = useEditorStore((state) => state.updateElement);
  const duplicateElement = useEditorStore((state) => state.duplicateElement);
  const flipElementHorizontal = useEditorStore(
    (state) => state.flipElementHorizontal,
  );
  const flipElementVertical = useEditorStore(
    (state) => state.flipElementVertical,
  );
  const sectionsCount = useEditorStore((state) => state.sectionsCount);

  if (!element) {
    return <CanvasPropertiesSidebar />;
  }

  const update = (updates: Parameters<typeof updateElement>[1]) =>
    updateElement(element.id, updates);
  const sliderValue = (value: number | readonly number[]) =>
    Array.isArray(value) ? value[0] : value;
  const isText = element.type === "text";
  const isImage = element.type === "image";
  const isButton = element.type === "button";
  const isContainer = element.type === "container";
  const setSpacing = (
    kind: "padding" | "margin",
    axis: "all" | "x" | "y" | "top" | "right" | "bottom" | "left",
    value: number,
  ) => {
    const prefix = kind;
    if (axis === "all") {
      update({
        [`${prefix}Top`]: value,
        [`${prefix}Right`]: value,
        [`${prefix}Bottom`]: value,
        [`${prefix}Left`]: value,
      });
    } else if (axis === "x") {
      update({ [`${prefix}Right`]: value, [`${prefix}Left`]: value });
    } else if (axis === "y") {
      update({ [`${prefix}Top`]: value, [`${prefix}Bottom`]: value });
    } else {
      update({ [`${prefix}${axis[0].toUpperCase()}${axis.slice(1)}`]: value });
    }
  };
  const spacingInput = (
    label: string,
    value: number | undefined,
    onChange: (value: number) => void,
  ) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value ?? 0}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="h-8 text-xs"
      />
    </div>
  );

  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col border-l border-border/40 bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          {isText ? (
            <Type className="h-4 w-4 text-primary" />
          ) : isButton ? (
            <Mail className="h-4 w-4 text-amber-400" />
          ) : (
            <ImageIcon className="h-4 w-4 text-primary" />
          )}
          <h2 className="text-sm font-semibold text-foreground">
            {isText
              ? "Properti Teks"
              : isImage
                ? "Properti Gambar"
                : isButton
                  ? "Properti Buka Undangan"
                  : isContainer
                    ? "Properti Container"
                    : "Properti Shape"}
          </h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {element.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 border-b border-border/40 p-2">
        <button
          type="button"
          onClick={() => setActiveTab("properties")}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${activeTab === "properties" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
        >
          {isContainer
            ? "Container"
            : isText
              ? "Teks"
              : isImage
                ? "Gambar"
                : isButton
                  ? "Tombol"
                  : "Shape"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("animation")}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${activeTab === "animation" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Animasi
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {activeTab === "properties" ? (
          <div className="space-y-5">
            {/* Action Box: Duplikasi & Cermin (Mirroring) */}
            <div className="space-y-2 rounded-xl bg-secondary/40 border border-border/50 p-3">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FlipHorizontal className="h-3.5 w-3.5 text-primary" />
                Duplikasi & Cermin (Mirroring)
              </Label>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => duplicateElement(element.id)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-background hover:bg-secondary text-foreground border border-border/60 px-2.5 py-1.5 text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
                  title="Duplikasi Elemen (Shortcut: Ctrl+D)"
                >
                  <Copy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Duplikasi</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    duplicateElement(element.id, { mirrorHorizontal: true })
                  }
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
                  title="Duplikasi dan otomatis cerminkan secara horizontal (cocok untuk hiasan bunga kiri & kanan)"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  <span>Dup + Mirror</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => flipElementHorizontal(element.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    element.flipX
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background hover:bg-secondary text-foreground border-border/60"
                  }`}
                  title="Cermin Horizontal (Kiri ↔ Kanan)"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  <span>Flip X {element.flipX ? "✓" : ""}</span>
                </button>
                <button
                  type="button"
                  onClick={() => flipElementVertical(element.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    element.flipY
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background hover:bg-secondary text-foreground border-border/60"
                  }`}
                  title="Cermin Vertikal (Atas ↕ Bawah)"
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  <span>Flip Y {element.flipY ? "✓" : ""}</span>
                </button>
              </div>
            </div>

            <Separator />

            {isText && (
              <>
                <div className="space-y-2">
                  <Label>Isi teks</Label>
                  <Input
                    value={element.content}
                    onChange={(event) =>
                      update({ content: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ukuran font: {element.fontSize ?? 20}px</Label>
                  <Slider
                    value={[element.fontSize ?? 20]}
                    onValueChange={(value) =>
                      update({ fontSize: sliderValue(value) })
                    }
                    min={8}
                    max={120}
                    step={1}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label>Warna teks</Label>
                  <input
                    type="color"
                    value={element.color ?? "#fcd34d"}
                    onChange={(event) => update({ color: event.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border border-border"
                  />
                </div>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => update({ textAlign: align })}
                      className={`flex-1 rounded border p-2 text-xs ${element.textAlign === align ? "bg-primary text-primary-foreground" : "border-border"}`}
                    >
                      {align}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Animasi Tipografi Teks
                    </Label>
                    <span className="text-[10px] text-amber-400/80 font-mono">
                      {element.textEffect ?? "none"}
                    </span>
                  </div>
                  <select
                    value={element.textEffect ?? "none"}
                    onChange={(event) =>
                      update({
                        textEffect: event.target.value as TextEffectType,
                      })
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="none">None (Teks Statis)</option>
                    <option value="typewriter">
                      ⌨️ Typewriter (Mengetik Huruf per Huruf)
                    </option>
                    <option value="stagger-chars">
                      ✨ Stagger Characters (Huruf Membuncah)
                    </option>
                    <option value="stagger-words">
                      💬 Stagger Words (Kata per Kata)
                    </option>
                    <option value="shimmer-gold">
                      👑 Gold Foil Shimmer (Kilau Emas Mengalir)
                    </option>
                    <option value="wave-float">
                      🌊 Wave Floating (Gelombang Terapung)
                    </option>
                    <option value="blur-reveal">
                      🔍 Blur Focus Reveal (Fokus Terbuka)
                    </option>
                    <option value="neon-pulse">
                      💡 Romantic Glow Pulse (Denyut Cahaya)
                    </option>
                  </select>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Animasi tipografi dirancang khusus untuk kutipan romantis,
                    nama mempelai, dan salam pembuka.
                  </p>
                </div>
              </>
            )}

            {isImage && (
              <>
                <div className="space-y-2">
                  <Label>Fit gambar</Label>
                  <select
                    value={element.objectFit ?? "contain"}
                    onChange={(event) =>
                      update({
                        objectFit: event.target.value as
                          | "cover"
                          | "contain"
                          | "fill",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                  >
                    <option value="contain">Contain (Utuh tanpa terpotong)</option>
                    <option value="cover">Cover (Penuh)</option>
                    <option value="fill">Fill (Regang)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Radius: {element.borderRadius ?? 0}px</Label>
                  <Slider
                    value={[element.borderRadius ?? 0]}
                    onValueChange={(value) =>
                      update({ borderRadius: sliderValue(value) })
                    }
                    min={0}
                    max={80}
                    step={1}
                  />
                </div>
              </>
            )}

            {isButton && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Teks Tombol</Label>
                  <Input
                    value={element.buttonText ?? element.content ?? "Buka Undangan"}
                    onChange={(event) =>
                      update({
                        buttonText: event.target.value,
                        content: event.target.value,
                      })
                    }
                    placeholder="Contoh: Buka Undangan"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Pilihan Ikon</Label>
                  <select
                    value={element.buttonIcon ?? "mail"}
                    onChange={(event) =>
                      update({
                        buttonIcon: event.target.value as ButtonIconType,
                      })
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="mail">✉️ Amplop Surat (Buka saat Hover)</option>
                    <option value="mail-open">💌 Surat Terbuka</option>
                    <option value="heart">💖 Hati Romantis (Love)</option>
                    <option value="sparkles">✨ Sparkles (Kilauan Bintang)</option>
                    <option value="music">🎵 Nada Musik</option>
                    <option value="chevron-down">⬇️ Panah ke Bawah</option>
                    <option value="none">Tanpa Ikon</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Tema Visual Tombol</Label>
                  <select
                    value={element.buttonVariant ?? "gold-luxury"}
                    onChange={(event) =>
                      update({
                        buttonVariant: event.target.value as ButtonVariantType,
                      })
                    }
                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="gold-luxury">👑 Gold Luxury Pill (Mewah Emas)</option>
                    <option value="glassmorphism">🪟 Glassmorphism (Kaca Blur Transparan)</option>
                    <option value="pulse-glow">🌟 Amber Pulse Glow (Kilau Denyut Terang)</option>
                    <option value="rose-romantic">🌹 Rose Pink Romantic (Anggun Romantis)</option>
                    <option value="minimal-outline">🖤 Dark Minimal Outline (Garis Emas Elegan)</option>
                  </select>
                </div>

                {/* Toggle Pulse Glow Animation */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Efek Gelombang Denyut (Pulse Wave)
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Cahaya denyut animasi menarik perhatian tamu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ buttonPulse: !(element.buttonPulse ?? true) })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      element.buttonPulse ?? true
                        ? "bg-amber-400 text-neutral-950 shadow-sm shadow-amber-400/50"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {(element.buttonPulse ?? true) ? "Aktif" : "Mati"}
                  </button>
                </div>

                {/* Aksi Klik Buka Undangan */}
                <div className="space-y-2.5 rounded-xl bg-secondary/50 border border-border/60 p-3">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MousePointerClick className="h-3.5 w-3.5 text-primary" />
                    Aksi Ketika Tombol Diklik
                  </Label>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => update({ buttonAction: "scroll-to-section" })}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        (element.buttonAction ?? "scroll-to-section") === "scroll-to-section"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                    >
                      <span>Scroll Halaman</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => update({ buttonAction: "url" })}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        element.buttonAction === "url"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border/60 hover:text-foreground"
                      }`}
                    >
                      <span>Buka Link URL</span>
                    </button>
                  </div>

                  {(element.buttonAction ?? "scroll-to-section") === "scroll-to-section" ? (
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-[11px] text-muted-foreground">Target Halaman / Section Tujuan</Label>
                      <select
                        value={element.buttonTargetSection ?? 1}
                        onChange={(event) =>
                          update({
                            buttonTargetSection: Number(event.target.value),
                          })
                        }
                        className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                      >
                        {Array.from({ length: Math.max(2, sectionsCount) }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0
                              ? "Section 1 (Cover / Sampul)"
                              : i === 1
                                ? "Section 2 (Mempelai & Acara)"
                                : i === 2
                                  ? "Section 3 (Lokasi & Waktu)"
                                  : i === 3
                                    ? "Section 4 (Doa & Ucapan)"
                                    : `Section ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-[11px] text-muted-foreground">URL Tautan</Label>
                      <Input
                        value={element.buttonUrl ?? ""}
                        onChange={(event) => update({ buttonUrl: event.target.value })}
                        placeholder="https://..."
                        className="h-8 text-xs"
                      />
                    </div>
                  )}

                  {/* Tombol Test Trigger Langsung */}
                  <button
                    type="button"
                    onClick={() => {
                      const btnDom = document.querySelector<HTMLElement>(`[data-element-id="${element.id}"]`);
                      if (btnDom) {
                        gsap.killTweensOf(btnDom);
                        gsap.timeline()
                          .to(btnDom, { scale: 0.92, duration: 0.1, ease: "power2.out" })
                          .to(btnDom, { scale: 1.05, duration: 0.2, ease: "back.out(2)" })
                          .to(btnDom, { scale: 1, duration: 0.15, ease: "power2.inOut" });
                      }
                      const scrollEl = document.querySelector<HTMLElement>(".overflow-y-auto");
                      if (scrollEl) {
                        scrollEl.scrollTo({
                          top: (element.buttonTargetSection ?? 1) * 720,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-current text-amber-400" />
                    <span>Uji Coba Animasi & Scroll Buka Undangan</span>
                  </button>
                </div>
              </div>
            )}

            {isContainer && (
              <div className="space-y-2">
                <Label>Lebar container</Label>
                <select
                  value={element.widthSizeMode ?? "fit"}
                  onChange={(event) =>
                    update({
                      widthSizeMode: event.target.value as ContainerSizeMode,
                    })
                  }
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  <option value="fit">Fit content</option>
                  <option value="custom">Custom</option>
                  <option value="full">Full parent</option>
                </select>
              </div>
            )}

            {isContainer && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="font-semibold">Display container</Label>
                  <select
                    value={element.display ?? "block"}
                    onChange={(event) =>
                      update({
                        display: event.target.value as
                          | "block"
                          | "flex"
                          | "grid",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                  >
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                  </select>
                  {element.display === "flex" && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={element.flexDirection ?? "row"}
                        onChange={(event) =>
                          update({
                            flexDirection: event.target.value as
                              | "row"
                              | "column",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="row">Row</option>
                        <option value="column">Column</option>
                      </select>
                      <select
                        value={element.justifyContent ?? "flex-start"}
                        onChange={(event) =>
                          update({
                            justifyContent: event.target.value as
                              | "flex-start"
                              | "center"
                              | "flex-end"
                              | "space-between"
                              | "space-around"
                              | "space-evenly",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="flex-start">Justify start</option>
                        <option value="center">Justify center</option>
                        <option value="flex-end">Justify end</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                        <option value="space-evenly">Space evenly</option>
                      </select>
                      <select
                        value={element.alignItems ?? "stretch"}
                        onChange={(event) =>
                          update({
                            alignItems: event.target.value as
                              | "flex-start"
                              | "center"
                              | "flex-end"
                              | "stretch",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="stretch">Align stretch</option>
                        <option value="flex-start">Align start</option>
                        <option value="center">Align center</option>
                        <option value="flex-end">Align end</option>
                      </select>
                    </div>
                  )}
                  {element.display === "grid" && (
                    <div className="grid grid-cols-2 gap-2">
                      {spacingInput("Kolom", element.gridColumns, (value) =>
                        update({ gridColumns: Math.max(1, value) }),
                      )}
                      {spacingInput("Baris", element.gridRows, (value) =>
                        update({ gridRows: Math.max(1, value) }),
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Gap antar elemen: {element.gap ?? 0}px</Label>
                  <Input
                    type="number"
                    min={0}
                    value={element.gap ?? 0}
                    onChange={(event) =>
                      update({ gap: Math.max(0, Number(event.target.value)) })
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Padding</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {spacingInput("Semua", element.paddingTop, (value) =>
                      setSpacing("padding", "all", value),
                    )}
                    {spacingInput("Sumbu X", element.paddingLeft, (value) =>
                      setSpacing("padding", "x", value),
                    )}
                    {spacingInput("Sumbu Y", element.paddingTop, (value) =>
                      setSpacing("padding", "y", value),
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {spacingInput("Atas", element.paddingTop, (value) =>
                      setSpacing("padding", "top", value),
                    )}
                    {spacingInput("Kanan", element.paddingRight, (value) =>
                      setSpacing("padding", "right", value),
                    )}
                    {spacingInput("Bawah", element.paddingBottom, (value) =>
                      setSpacing("padding", "bottom", value),
                    )}
                    {spacingInput("Kiri", element.paddingLeft, (value) =>
                      setSpacing("padding", "left", value),
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Margin</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {spacingInput("Semua", element.marginTop, (value) =>
                      setSpacing("margin", "all", value),
                    )}
                    {spacingInput("Sumbu X", element.marginLeft, (value) =>
                      setSpacing("margin", "x", value),
                    )}
                    {spacingInput("Sumbu Y", element.marginTop, (value) =>
                      setSpacing("margin", "y", value),
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {spacingInput("Atas", element.marginTop, (value) =>
                      setSpacing("margin", "top", value),
                    )}
                    {spacingInput("Kanan", element.marginRight, (value) =>
                      setSpacing("margin", "right", value),
                    )}
                    {spacingInput("Bawah", element.marginBottom, (value) =>
                      setSpacing("margin", "bottom", value),
                    )}
                    {spacingInput("Kiri", element.marginLeft, (value) =>
                      setSpacing("margin", "left", value),
                    )}
                  </div>
                </div>
              </>
            )}

            {isContainer && (
              <div className="space-y-2">
                <Label>Tinggi container</Label>
                <select
                  value={element.heightSizeMode ?? "fit"}
                  onChange={(event) =>
                    update({
                      heightSizeMode: event.target.value as ContainerSizeMode,
                    })
                  }
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  <option value="fit">Fit content</option>
                  <option value="custom">Custom</option>
                  <option value="full">Full parent</option>
                </select>
              </div>
            )}

            <Separator />
            <div className="space-y-2">
              <Label>
                Opacity: {Math.round((element.opacity ?? 1) * 100)}%
              </Label>
              <Slider
                value={[Math.round((element.opacity ?? 1) * 100)]}
                onValueChange={(value) =>
                  update({ opacity: sliderValue(value) / 100 })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Lebar</Label>
                <Input
                  type="number"
                  value={element.width}
                  onChange={(event) =>
                    update({ width: Math.max(1, Number(event.target.value)) })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Tinggi</Label>
                <Input
                  type="number"
                  value={element.height}
                  onChange={(event) =>
                    update({ height: Math.max(1, Number(event.target.value)) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Posisi X</Label>
                <Input
                  value={element.left}
                  onChange={(event) => update({ left: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Posisi Y</Label>
                <Input
                  value={element.top}
                  onChange={(event) => update({ top: event.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Position CSS</Label>
              <select
                value={element.positionMode ?? "relative"}
                onChange={(event) =>
                  update({
                    positionMode: event.target.value as
                      | "relative"
                      | "absolute"
                      | "fixed"
                      | "sticky",
                  })
                }
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
                <option value="sticky">Sticky</option>
              </select>
            </div>
          </div>
        ) : (
          <AnimationPanel
            elementId={element.id}
            animation={element.animation}
            onChange={(key, value) =>
              updateElement(element.id, {
                animation: {
                  mount: element.animation?.mount ?? "none",
                  unmount: element.animation?.unmount ?? "none",
                  loop: element.animation?.loop ?? "none",
                  [key]: value,
                },
              })
            }
          />
        )}
      </ScrollArea>
    </aside>
  );
}
