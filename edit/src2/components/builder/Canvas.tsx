"use client";

import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { useBuilderStore } from "@/store/useBuilderStore";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ElementLayer,
  AnimationType,
} from "@/types/builder";
import {
  Lock,
  RotateCcw,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

export const Canvas: React.FC = () => {
  const [replayKey, setReplayKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  const {
    sections,
    activeSectionId,
    setActiveSection,
    getActiveSection,
    getSelectedLayer,
    setSelectedLayer,
    updateLayerPosition,
    getEffectiveLayerContent,
    globalSettings,
    reorderSections,
    removeSection,
  } = useBuilderStore();

  const activeSection = getActiveSection();
  const selectedLayer = getSelectedLayer();

  const activeSectionIndex = sections.findIndex(
    (sec) => sec.id === activeSectionId,
  );

  const backgroundColor =
    activeSection?.contentJson.backgroundColor ||
    globalSettings.primaryColor ||
    "#FFFFFF";

  const layers = activeSection?.contentJson.layers || [];

  const getEntranceVariants = (type: AnimationType) => {
    switch (type) {
      case "loop-wind-leaf":
        return {
          initial: { opacity: 1, scale: 1 },
          animate: {
            rotate: [-8, 14, -6, 12, -8],
            x: [0, 6, -4, 5, 0],
            y: [0, -3, 2, -2, 0],
          },
          transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        };
      case "loop-wind-flower":
        return {
          initial: { opacity: 1, scale: 1 },
          animate: {
            rotate: [0, 18, 4, 22, 0],
            skewX: [0, -8, -2, -10, 0],
            x: [0, 8, 2, 10, 0],
          },
          transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
        };
      case "loop-floating-petal":
        return {
          initial: { opacity: 1, scale: 1 },
          animate: {
            y: [-6, 6, -6],
            rotate: [-4, 4, -4],
            x: [-3, 3, -3],
          },
          transition: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
        };
      case "loop-breathe":
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { scale: [1, 1.04, 1] },
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
        };
      case "wind-flower":
        return {
          initial: { rotate: 20, x: 15, opacity: 0 },
          animate: { rotate: [20, 0, 10, 0], x: [15, 0, 4, 0], opacity: 1 },
          transition: { duration: 1.2, ease: "easeOut" },
        };
      case "leaf-rustle":
        return {
          initial: { rotate: -10, opacity: 0 },
          animate: { rotate: [0, -6, 6, -4, 4, 0], opacity: 1 },
          transition: { duration: 1.5, ease: "easeInOut" },
        };
      case "cloud-drift":
        return {
          initial: { x: -40, opacity: 0 },
          animate: { x: [-40, 0, 10, 0], opacity: 1 },
          transition: { duration: 2.2, ease: "easeInOut" },
        };
      case "ocean-wave":
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: [0, -6, 0, 6, 0], skewY: [0, -2, 0, 2, 0], opacity: 1 },
          transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
        };
      case "smoke-convection":
        return {
          initial: { y: 40, scale: 0.7, opacity: 0 },
          animate: { y: 0, scale: 1, opacity: 1 },
          transition: { duration: 1.6, ease: "easeOut" },
        };
      case "pendulum-swing":
        return {
          initial: { rotate: -35, opacity: 0 },
          animate: { rotate: 0, opacity: 1 },
          transition: { type: "spring", damping: 8, stiffness: 100 },
        };
      case "falling-leaf":
        return {
          initial: { y: -60, x: -20, rotate: -25, opacity: 0 },
          animate: { y: 0, x: 0, rotate: 0, opacity: 1 },
          transition: { type: "spring", damping: 10, stiffness: 60 },
        };
      case "floating-sway":
        return {
          initial: { y: 15, opacity: 0 },
          animate: {
            y: [0, -10, 0, 10, 0],
            rotate: [0, 2, 0, -2, 0],
            opacity: 1,
          },
          transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        };
      case "gravity-drop":
        return {
          initial: { y: -180, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: {
            type: "spring",
            bounce: 0.6,
            damping: 9,
            stiffness: 140,
          },
        };
      case "curved-spiral":
        return {
          initial: { scale: 0.2, rotate: -270, opacity: 0, y: -40 },
          animate: { scale: 1, rotate: 0, opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
        };
      case "pulse-heartbeat":
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: [1, 1.06, 1, 1.04, 1], opacity: 1 },
          transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
        };
      case "slide-up":
        return {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
        };
      case "slide-down":
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
        };
      case "slide-left":
        return {
          initial: { x: 50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "slide-right":
        return {
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
        };
      case "zoom-in":
        return {
          initial: { scale: 0.4, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "zoom-out":
        return {
          initial: { scale: 1.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case "rotate":
        return {
          initial: { rotate: -180, scale: 0.8, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1 },
        };
      case "bounce":
        return {
          initial: { y: -60, opacity: 0 },
          animate: { y: 0, opacity: 1 },
        };
      case "fade":
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case "none":
      default:
        return { initial: { opacity: 1 }, animate: { opacity: 1 } };
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-full w-full bg-[#F8FAFC] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] py-4 px-2 select-none relative overflow-y-auto font-sans">
      {/* 1. Page Header Control Bar */}
      <div className="w-[375px] max-w-full flex items-center justify-between mb-2 text-slate-700 font-medium text-xs bg-white border border-slate-200 shadow-xs rounded-2xl px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            Halaman {activeSection ? activeSection.sectionOrder : 1} -{" "}
            <span className="capitalize text-blue-600">
              {activeSection?.sectionType || "Cover"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          {activeSectionIndex === 0 && sections[1] && (
            <button
              onClick={() => setActiveSection(sections[1].id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors border border-blue-200 mr-1"
            >
              <span>✉ Buka Undangan ➔ Sec 2</span>
            </button>
          )}
          <button
            onClick={() => {
              if (activeSectionIndex > 0) {
                reorderSections(activeSectionIndex, activeSectionIndex - 1);
              }
            }}
            title="Move Section Up"
            className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (activeSectionIndex < sections.length - 1) {
                reorderSections(activeSectionIndex, activeSectionIndex + 1);
              }
            }}
            title="Move Section Down"
            className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setReplayKey((prev) => prev + 1)}
            title="Replay Motion Animations"
            className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (activeSectionId) removeSection(activeSectionId);
            }}
            title="Hapus Halaman Ini"
            className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Fixed Mobile Canvas Card (Clean White Reference Theme) */}
      <div
        className="relative bg-white rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden transition-transform duration-200 my-auto"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
        }}
      >
        {/* Dynamic Island Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-50 flex items-center justify-between px-3 pointer-events-none shadow-md border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/80" />
          </div>
          <div className="w-7 h-1 rounded-full bg-slate-900 border border-slate-800/60" />
        </div>

        {/* Canvas Inner View Area */}
        <div
          className="relative w-full h-full overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: backgroundColor,
            backgroundImage: activeSection?.contentJson.backgroundImage
              ? `url(${activeSection.contentJson.backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => setSelectedLayer(null)}
        >
          {activeSection?.contentJson.backgroundOverlay && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundColor: activeSection.contentJson.backgroundOverlay,
              }}
            />
          )}

          {layers.map((layer: ElementLayer) => {
            if (layer.isHidden) return null;

            const isSelected = selectedLayer?.id === layer.id;
            const content = getEffectiveLayerContent(layer);
            const entranceType = layer.timeline.entrance.type || "fade";
            const motionVariants = getEntranceVariants(entranceType);

            return (
              <Rnd
                key={layer.id}
                bounds="parent"
                size={{
                  width: layer.position.width,
                  height: layer.position.height,
                }}
                position={{
                  x: layer.position.x,
                  y: layer.position.y,
                }}
                disableDragging={layer.isLocked}
                enableResizing={
                  !layer.isLocked && isSelected
                    ? {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                        topRight: true,
                        bottomRight: true,
                        bottomLeft: true,
                        topLeft: true,
                      }
                    : false
                }
                onDragStop={(e, d) => {
                  if (activeSection) {
                    updateLayerPosition(activeSection.id, layer.id, {
                      x: Math.round(d.x),
                      y: Math.round(d.y),
                    });
                  }
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  if (activeSection) {
                    updateLayerPosition(activeSection.id, layer.id, {
                      width: Math.round(parseInt(ref.style.width, 10)),
                      height: Math.round(parseInt(ref.style.height, 10)),
                      x: Math.round(position.x),
                      y: Math.round(position.y),
                    });
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedLayer(layer.id);
                }}
                style={{
                  zIndex: isSelected ? 99 : layer.position.zIndex,
                }}
                className={`group relative transition-shadow ${
                  isSelected
                    ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-transparent shadow-xl rounded-sm"
                    : "hover:ring-1 hover:ring-blue-400/60"
                }`}
              >
                <motion.div
                  key={`${layer.id}-${entranceType}-${replayKey}`}
                  initial={motionVariants.initial}
                  animate={motionVariants.animate}
                  transition={{
                    duration: layer.timeline.entrance.duration ?? 0.8,
                    delay: layer.timeline.entrance.delay ?? 0.1,
                  }}
                  className="w-full h-full relative"
                  style={{
                    transform: layer.position.rotation
                      ? `rotate(${layer.position.rotation}deg)`
                      : undefined,
                    opacity: layer.style.opacity ?? 1,
                  }}
                >
                  {layer.type === "text" && (
                    <div
                      className="w-full h-full flex items-center justify-center leading-tight whitespace-pre-wrap select-none p-1 pointer-events-none font-bold"
                      style={{
                        fontSize: `${layer.style.fontSize || 16}px`,
                        fontFamily:
                          layer.style.fontFamily || "Inter, sans-serif",
                        fontWeight: layer.style.fontWeight || "bold",
                        color: layer.style.color || "#2563EB",
                        textAlign: layer.style.textAlign || "center",
                      }}
                    >
                      {content}
                    </div>
                  )}

                  {layer.type === "image" && (
                    <img
                      src={content}
                      alt={layer.name}
                      className="w-full h-full object-cover select-none pointer-events-none rounded-xl"
                      style={{
                        borderRadius: layer.style.borderRadius
                          ? `${layer.style.borderRadius}px`
                          : undefined,
                      }}
                    />
                  )}

                  {layer.type === "shape" && (
                    <div
                      className="w-full h-full pointer-events-none"
                      style={{
                        backgroundColor:
                          layer.style.backgroundColor || "#2563EB",
                        borderRadius: layer.style.borderRadius
                          ? `${layer.style.borderRadius}px`
                          : "8px",
                      }}
                    />
                  )}

                  {/* Royal Blue Bounding Label (Exact Match with Reference Image `{H1} Title`) */}
                  {isSelected && (
                    <div className="absolute -top-7 left-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-md font-mono font-bold tracking-tight flex items-center gap-1 shadow-md pointer-events-none z-50 whitespace-nowrap">
                      <span>{layer.name}</span>
                      {layer.isLocked && (
                        <Lock className="w-2.5 h-2.5 text-amber-300" />
                      )}
                    </div>
                  )}
                </motion.div>
              </Rnd>
            );
          })}
        </div>

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full z-50 pointer-events-none" />
      </div>

      {/* 3. Bottom Zoom Toolbar */}
      <div className="w-full max-w-xl bg-white border border-slate-200 shadow-md rounded-full px-5 py-2 mt-3 flex items-center justify-between text-xs text-slate-700 font-semibold">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="50"
            max="120"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value, 10))}
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <span className="font-mono text-[11px] font-bold text-slate-700 min-w-[36px]">
            {zoomLevel}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Section {activeSection ? activeSection.sectionOrder : 1}/
            {sections.length}
          </span>
        </div>
      </div>
    </div>
  );
};
