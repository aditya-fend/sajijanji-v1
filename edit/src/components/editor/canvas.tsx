"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import {
  Play,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Smartphone,
} from "lucide-react";
import TloatingToolbarControls from "@/components/editor/tloating-toolbar-controls";
import WindSwayImage from "@/components/editor/WindSwayImage";
import AnimatedText from "@/components/editor/AnimatedText";
import OpenInvitationButton from "@/components/editor/OpenInvitationButton";
import {
  useEditorStore,
  type CanvasElementType,
  type ShapeType,
} from "@/store/useEditorStore";
import {
  playPhysicsMountAnimation,
  playPhysicsUnmountAnimation,
  setInitialPreMountState,
} from "@/lib/physicsAnimations";

export default function Canvas() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const zoom = useEditorStore((state) => state.zoom);
  const activeTool = useEditorStore((state) => state.activeTool);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const bgColor = useEditorStore((state) => state.bgColor);
  const bgImage = useEditorStore((state) => state.bgImage);
  const bgImageFit = useEditorStore((state) => state.bgImageFit);
  const bgImageOpacity = useEditorStore((state) => state.bgImageOpacity);
  const bgImageBlur = useEditorStore((state) => state.bgImageBlur);
  const bgImagePosX = useEditorStore((state) => state.bgImagePosX);
  const bgImagePosY = useEditorStore((state) => state.bgImagePosY);
  const bgImageScale = useEditorStore((state) => state.bgImageScale);
  const bgImageFixed = useEditorStore((state) => state.bgImageFixed);
  const elements = useEditorStore((state) => state.elements);
  const layers = useEditorStore((state) => state.layers);
  const zoomIn = useEditorStore((state) => state.zoomIn);
  const zoomOut = useEditorStore((state) => state.zoomOut);
  const resetZoom = useEditorStore((state) => state.resetZoom);
  const addElement = useEditorStore((state) => state.addElement);
  const addOpenInvitationButton = useEditorStore(
    (state) => state.addOpenInvitationButton,
  );
  const addOpeningSectionLayout = useEditorStore(
    (state) => state.addOpeningSectionLayout,
  );
  const addContainer = useEditorStore((state) => state.addContainer);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const selectElement = useEditorStore((state) => state.selectElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const deleteElement = useEditorStore((state) => state.deleteElement);
  const duplicateElement = useEditorStore((state) => state.duplicateElement);
  const sectionsCount = useEditorStore((state) => state.sectionsCount);
  const addSection = useEditorStore((state) => state.addSection);
  const removeSection = useEditorStore((state) => state.removeSection);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setIsPreviewMode = useEditorStore((state) => state.setIsPreviewMode);
  const [previewKey, setPreviewKey] = useState(0);

  const selectedContainer = elements.find(
    (element) =>
      element.id === selectedElementId && element.type === "container",
  );
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastPointerPositionRef = useRef<{ xPct: number; yPct: number } | null>(
    null,
  );
  const dragRef = useRef<{
    id: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const elementsRef = useRef(elements);
  const animationKey = elements
    .map(
      (element) =>
        `${element.id}:${element.animation?.mount ?? "none"}:${element.animation?.unmount ?? "none"}:${element.animation?.loop ?? "none"}`,
    )
    .join("|");

  const scrollToSection = (sectionIndex: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: sectionIndex * 720,
        behavior: "smooth",
      });
    }
  };

  const handleRestartPreview = () => {
    setPreviewKey((k) => k + 1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useLayoutEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const drag = dragRef.current;
      const frame = frameRef.current?.getBoundingClientRect();
      if (!drag || !frame) return;
      const deltaX = ((event.clientX - drag.startX) / frame.width) * 100;
      const deltaY = ((event.clientY - drag.startY) / frame.height) * 100;
      if (drag.mode === "move") {
        const newLeft = drag.left + deltaX;
        const newTop = drag.top + deltaY;
        updateElement(drag.id, {
          left: `${newLeft.toFixed(2)}%`,
          top: `${newTop.toFixed(2)}%`,
        });
      } else {
        const deltaPx = (deltaX / 100) * frame.width;
        const deltaPy = (deltaY / 100) * frame.height;
        const targetElement = elementsRef.current.find((e) => e.id === drag.id);

        if (targetElement?.type === "image" || event.shiftKey) {
          const aspectRatio = drag.width / (drag.height || 1);
          const delta =
            Math.abs(deltaPx) > Math.abs(deltaPy)
              ? deltaPx
              : deltaPy * aspectRatio;
          const newWidth = Math.max(24, Math.round(drag.width + delta));
          const newHeight = Math.max(24, Math.round(newWidth / aspectRatio));

          updateElement(drag.id, {
            width: newWidth,
            height: newHeight,
          });
        } else {
          updateElement(drag.id, {
            width: Math.max(24, Math.round(drag.width + deltaPx)),
            height: Math.max(24, Math.round(drag.height + deltaPy)),
          });
        }
      }
    };
    const handlePointerUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [updateElement]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // Shortcut: Ctrl+D / Cmd+D untuk Duplicate Elemen
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "d" &&
        selectedElementId
      ) {
        event.preventDefault();
        duplicateElement(selectedElementId);
        return;
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedElementId
      ) {
        event.preventDefault();
        const element = elements.find((item) => item.id === selectedElementId);
        const animation = element?.animation?.unmount ?? "none";
        const targetElement = frameRef.current?.querySelector<HTMLElement>(
          `[data-element-id="${selectedElementId}"]`,
        );
        if (targetElement && animation !== "none") {
          playPhysicsUnmountAnimation(targetElement, animation, () => {
            deleteElement(selectedElementId);
          });
        } else {
          deleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteElement, duplicateElement, elements, selectedElementId]);

  // Animasi Berjalan Ketika Komponen Mulai Terlihat di Layar Menggunakan IntersectionObserver
  useEffect(() => {
    const scrollRoot = scrollContainerRef.current;
    if (!scrollRoot) return;

    const animatedMap = new Map<string, gsap.core.Tween | null>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const elementId = target.getAttribute("data-element-id");
          if (!elementId) return;

          const element = elementsRef.current.find(
            (item) => item.id === elementId,
          );
          if (!element) return;
          const animation = element.animation ?? {
            mount: "none",
            unmount: "none",
            loop: "none",
          };

          if (entry.isIntersecting) {
            // Jalankan animasi Mount Fisika saat mulai terlihat di layar viewport
            playPhysicsMountAnimation(target, animation.mount, () => {
              // Berikan jeda transisi redaman (settle delay 0.45s) agar elemen tidak kaku sebelum loop dimulai
              if (
                animation.loop !== "none" &&
                animation.loop !== "wind-sway"
              ) {
                const loopConfig =
                  {
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
                  }[animation.loop] ?? { y: -10 };

                const loopTween = gsap.to(target, {
                  ...loopConfig,
                  duration: 1.8,
                  delay: 0.45, // Jeda inersia mulus
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
                animatedMap.set(elementId, loopTween);
              }
            });
          } else {
            // Ketika elemen berada di luar layar, sembunyikan kembali (opacity 0)
            const activeTween = animatedMap.get(elementId);
            if (activeTween) {
              activeTween.kill();
              animatedMap.delete(elementId);
            }
            gsap.killTweensOf(target);
            if (animation.mount !== "none") {
              setInitialPreMountState(target, animation.mount);
            }
          }
        });
      },
      {
        root: scrollRoot,
        threshold: 0.12,
      },
    );

    // Daftarkan observer dan set kondisi awal (opacity: 0) untuk elemen beranimasi mount
    const targets = scrollRoot.querySelectorAll<HTMLElement>(
      "[data-element-id]",
    );
    targets.forEach((el) => {
      const elementId = el.getAttribute("data-element-id");
      const element = elementsRef.current.find(
        (item) => item.id === elementId,
      );
      if (element?.animation?.mount && element.animation.mount !== "none") {
        setInitialPreMountState(el, element.animation.mount);
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      animatedMap.forEach((tw) => tw?.kill());
      animatedMap.clear();
    };
  }, [animationKey, previewKey, isPreviewMode, elements.length]);

  const handleCanvasClick = () => {
    setActiveTool("cursor");
    selectElement(null);
  };

  const handleFramePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    lastPointerPositionRef.current = {
      xPct: (x / rect.width) * 100,
      yPct: (y / rect.height) * 100,
    };
  };

  const handleFramePointerLeave = () => {
    lastPointerPositionRef.current = null;
  };

  const handleFrameDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    lastPointerPositionRef.current = {
      xPct: (x / rect.width) * 100,
      yPct: (y / rect.height) * 100,
    };
  };

  const handleFrameDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const frame = frameRef.current;
      if (frame) {
        const rect = frame.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        handleAddImage(file, {
          xPct: (x / rect.width) * 100,
          yPct: (y / rect.height) * 100,
        });
      } else {
        handleAddImage(file);
      }
    }
  };

  const handleAddImage = (
    file: File,
    customPos?: { xPct?: number; yPct?: number },
  ) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || 200;
      const naturalHeight = img.naturalHeight || 200;
      const maxCanvasWidth = 260;
      let width = naturalWidth;
      let height = naturalHeight;

      if (width > maxCanvasWidth) {
        height = Math.round((maxCanvasWidth / width) * height);
        width = maxCanvasWidth;
      }

      const totalCanvasHeight = sectionsCount * 720;
      let targetTop = "10%";
      let targetLeft = "10%";

      if (selectedContainer) {
        targetTop = "0%";
        targetLeft = "0%";
      } else if (customPos?.xPct !== undefined && customPos?.yPct !== undefined) {
        // Drop langsung di titik mouse
        targetLeft = `${Math.max(0, Math.min(85, customPos.xPct - ((width / 2) / 360) * 100)).toFixed(2)}%`;
        targetTop = `${Math.max(0, Math.min(95, customPos.yPct - ((height / 2) / totalCanvasHeight) * 100)).toFixed(2)}%`;
      } else if (lastPointerPositionRef.current) {
        // Posisi kursor mouse aktif di frame saat tombol upload diklik
        const { xPct, yPct } = lastPointerPositionRef.current;
        targetLeft = `${Math.max(0, Math.min(85, xPct - ((width / 2) / 360) * 100)).toFixed(2)}%`;
        targetTop = `${Math.max(0, Math.min(95, yPct - ((height / 2) / totalCanvasHeight) * 100)).toFixed(2)}%`;
      } else {
        // Posisi tengah section yang sedang aktif dibuka/dilihat oleh user di scroll viewport
        const currentScrollTop = scrollContainerRef.current?.scrollTop || 0;
        const centerTopPx = currentScrollTop + (720 / 2) - (height / 2);
        const centerLeftPx = Math.max(0, (360 - width) / 2);
        targetTop = `${Math.max(0, (centerTopPx / totalCanvasHeight) * 100).toFixed(2)}%`;
        targetLeft = `${Math.max(0, (centerLeftPx / 360) * 100).toFixed(2)}%`;
      }

      addElement("image", {
        content: objectUrl,
        style: "w-full h-full object-contain",
        positionMode: selectedContainer ? "relative" : "absolute",
        parentId: selectedContainer?.id,
        position: { top: targetTop, left: targetLeft },
        width,
        height,
      });
    };
    img.onerror = () => {
      addElement("image", {
        content: objectUrl,
        style: "w-full h-full object-contain",
        positionMode: selectedContainer ? "relative" : "absolute",
        parentId: selectedContainer?.id,
        width: 200,
        height: 200,
      });
    };
    img.src = objectUrl;
  };

  const handleAddShape = (shape: ShapeType) => {
    addElement("shape", {
      shape,
      name: `${shape} shape`,
      positionMode: selectedContainer ? "relative" : "absolute",
      parentId: selectedContainer?.id,
    });
  };

  const handleAddContainer = (type: CanvasElementType) => {
    if (type === "container") {
      addContainer();
      return;
    }
    addContainer();
    const containerId = useEditorStore.getState().selectedElementId;
    addElement(type, {
      parentId: containerId ?? undefined,
      positionMode: "relative",
    });
  };

  const startElementDrag = (
    event: PointerEvent<HTMLDivElement>,
    id: string,
    mode: "move" | "resize",
  ) => {
    if (activeTool !== "cursor") return;
    const element = elements.find((item) => item.id === id);
    const layer = layers.find((item) => item.id === id);
    if (!element || layer?.locked) return;

    // If dragging a nested relative element, target its movable parent container
    let target = element;
    if (mode === "move" && element.positionMode === "relative" && element.parentId) {
      const parent = elements.find((item) => item.id === element.parentId);
      if (parent) {
        target = parent;
      }
    }

    event.stopPropagation();
    event.preventDefault();
    selectElement(element.id);
    dragRef.current = {
      id: target.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      left: parseFloat(target.left) || 0,
      top: parseFloat(target.top) || 0,
      width: target.width,
      height: target.height,
    };
  };

  const renderElement = (el: (typeof elements)[number], fitContent = false) => {
    if (el.type === "container") return null;
    const transform = [
      el.flipX ? "scaleX(-1)" : "",
      el.flipY ? "scaleY(-1)" : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div
        className="relative select-none pointer-events-none"
        style={{
          width: fitContent ? "max-content" : el.width,
          height: fitContent ? "max-content" : el.height,
          opacity: el.opacity,
          transform: el.animation?.loop === "wind-sway" ? undefined : transform,
        }}
      >
        {el.type === "text" && (
          <AnimatedText
            content={el.content}
            effect={el.textEffect ?? "none"}
            className={`${el.style} ${fitContent ? "leading-none whitespace-nowrap" : "h-full w-full"}`}
            fontSize={el.fontSize}
            color={el.color}
            fontWeight={el.fontWeight}
            textAlign={el.textAlign}
          />
        )}
        {el.type === "image" &&
          Boolean(el.content) &&
          (el.animation?.loop === "wind-sway" ? (
            <WindSwayImage
              src={el.content}
              alt="Element"
              className={`${el.style} h-full w-full select-none`}
              objectFit={el.objectFit ?? "contain"}
              borderRadius={el.borderRadius}
              flipX={el.flipX}
              flipY={el.flipY}
            />
          ) : (
            <img
              src={el.content}
              alt="Element"
              draggable={false}
              className={`${el.style} h-full w-full select-none pointer-events-none`}
              style={{
                objectFit: el.objectFit ?? "contain",
                borderRadius: el.borderRadius,
              }}
            />
          ))}
        {el.type === "shape" && (
          <div className={el.style} aria-label={el.shape} />
        )}
        {el.type === "button" && (
          <div className="w-full h-full pointer-events-auto">
            <OpenInvitationButton
              text={el.buttonText || el.content || "Buka Undangan"}
              icon={el.buttonIcon || "mail"}
              variant={el.buttonVariant || "gold-luxury"}
              pulse={el.buttonPulse ?? true}
              className={el.style}
              onClick={() => {
                if (el.buttonAction === "url" && el.buttonUrl) {
                  window.open(el.buttonUrl, "_blank");
                } else {
                  scrollToSection(el.buttonTargetSection ?? 1);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderNestedElement = (
    element: (typeof elements)[number],
    parentId: string,
  ): ReactNode => {
    const elementLayer = layers.find((layer) => layer.id === element.id);
    if (elementLayer?.visible === false) return null;

    const isContainer = element.type === "container";
    const isTextFit =
      element.type === "text" && element.positionMode === "relative";
    const width =
      isContainer && element.widthSizeMode === "full"
        ? "100%"
        : isTextFit || (isContainer && element.widthSizeMode === "fit")
          ? "max-content"
          : element.width;
    const height =
      isContainer && element.heightSizeMode === "full"
        ? "100%"
        : isTextFit || (isContainer && element.heightSizeMode === "fit")
          ? "max-content"
          : element.height;
    const elementStyle = {
      top: element.top,
      left: element.left,
      width,
      height,
      position: element.positionMode ?? "relative",
      opacity:
        element.animation?.mount && element.animation.mount !== "none"
          ? 0
          : element.opacity,
      display: isContainer ? element.display : undefined,
      flexDirection:
        element.display === "flex" ? element.flexDirection : undefined,
      justifyContent:
        element.display === "flex" ? element.justifyContent : undefined,
      alignItems: element.display === "flex" ? element.alignItems : undefined,
      gridTemplateColumns:
        element.display === "grid"
          ? `repeat(${element.gridColumns ?? 2}, minmax(0, 1fr))`
          : undefined,
      gridTemplateRows:
        element.display === "grid"
          ? `repeat(${element.gridRows ?? 1}, minmax(0, 1fr))`
          : undefined,
      paddingTop: element.paddingTop,
      paddingRight: element.paddingRight,
      paddingBottom: element.paddingBottom,
      paddingLeft: element.paddingLeft,
      marginTop: element.marginTop,
      marginRight: element.marginRight,
      marginBottom: element.marginBottom,
      marginLeft: element.marginLeft,
      gap: isContainer ? element.gap : undefined,
      transform: [
        element.flipX ? "scaleX(-1)" : "",
        element.flipY ? "scaleY(-1)" : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    } as CSSProperties;

    const isLocked = Boolean(elementLayer?.locked);
    return (
      <div
        key={element.id}
        data-element-id={element.id}
        className={`relative select-none rounded-lg ${
          isLocked
            ? "pointer-events-none cursor-default"
            : `cursor-grab active:cursor-grabbing ${
                selectedElementId === element.id ||
                (element.parentId && selectedElementId === element.parentId)
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:ring-1 hover:ring-primary/50"
              }`
        }`}
        style={elementStyle}
        onClick={(event) => {
          if (isLocked) return;
          event.stopPropagation();
          selectElement(element.id);
        }}
        onPointerDown={(event) => {
          if (isLocked) return;
          startElementDrag(event, element.id, "move");
        }}
      >
        {isContainer ? (
          <div className="contents">
            {elements
              .filter((child) => child.parentId === element.id)
              .map((child) => renderNestedElement(child, element.id))}
          </div>
        ) : (
          renderElement(element, isTextFit)
        )}
        {!isLocked && selectedElementId === element.id && (
          <div
            className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-background bg-primary z-30"
            onPointerDown={(event) => {
              event.stopPropagation();
              startElementDrag(event, element.id, "resize");
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="flex-1 h-screen bg-neutral-950 relative overflow-hidden flex items-center justify-center select-none"
      onClick={handleCanvasClick} // Deselect saat klik area kosong canvas
    >
      {/* Canvas Grid Background pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #525252 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Top Preview Bar */}
      {isPreviewMode && (
        <div
          className="absolute top-5 z-50 flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-900/90 border border-amber-500/40 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 pr-3 border-r border-border/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 font-sans">
              <Play className="w-3.5 h-3.5 fill-current text-amber-400" /> Mode Preview Undangan
            </span>
          </div>

          <button
            type="button"
            onClick={handleRestartPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Putar ulang animasi dari awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Animasi</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Kembali ke mode editor"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Editor</span>
          </button>
        </div>
      )}

      {/* Floating Toolbar Controls (Hanya aktif saat bukan Preview Mode) */}
      {!isPreviewMode && (
        <TloatingToolbarControls
          zoom={zoom}
          activeTool={activeTool}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onAddText={() => {
            addElement("text", {
              positionMode: selectedContainer ? "relative" : "absolute",
              parentId: selectedContainer?.id,
            });
          }}
          onAddImage={handleAddImage}
          onAddShape={handleAddShape}
          onAddContainer={handleAddContainer}
          canAddElements={isMounted}
          onSelectCursor={() => setActiveTool("cursor")}
          onTogglePreview={() => setIsPreviewMode(true)}
        />
      )}

      {/* Quick Floating Section Navigator Beside Mockup */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-neutral-900/85 border border-border/50 backdrop-blur-md shadow-2xl">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Halaman
        </span>
        {Array.from({ length: sectionsCount }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(index);
            }}
            title={`Scroll ke Section ${index + 1}`}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95 bg-neutral-800 text-neutral-300 hover:bg-primary/20 hover:text-primary hover:border-primary/40 border border-transparent cursor-pointer"
          >
            {index + 1}
          </button>
        ))}
        {!isPreviewMode && (
          <>
            <div className="w-4 h-px bg-border/40 my-1" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addSection();
              }}
              title="Tambah Section Baru"
              className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 cursor-pointer hover:scale-105 active:scale-95"
            >
              +
            </button>
          </>
        )}
      </div>

      {/* Frame Mobile Undangan */}
      <div
        className="transition-transform duration-200 ease-out relative cursor-default"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {/* Mockup Frame Undangan (Mobile Aspect Ratio 9:16 Scrollable) */}
        <div
          ref={scrollContainerRef}
          className="w-[360px] h-[720px] border border-border/60 rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden relative border-amber-500/20 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.3)_transparent]"
          style={{ backgroundColor: bgColor }}
        >
          {/* Header Bar Mockup - Sticky on top */}
          <div className="sticky top-0 left-0 right-0 h-7 bg-black/85 backdrop-blur-md z-30 flex items-center justify-between px-4 pointer-events-auto border-b border-white/5">
            <span className="text-[10px] text-muted-foreground font-mono">
              09:41
            </span>
            <div className="flex gap-1.5 items-center">
              <span className="text-[9px] text-amber-400 font-mono font-medium px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                {sectionsCount} Sections
              </span>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
            </div>
          </div>

          {/* Canvas Render Elements Multi-Section Container */}
          <div
            ref={frameRef}
            key={`preview-frame-${previewKey}`}
            onPointerMove={handleFramePointerMove}
            onPointerLeave={handleFramePointerLeave}
            onDragOver={handleFrameDragOver}
            onDrop={handleFrameDrop}
            className="w-full relative overflow-hidden"
            style={{ height: `${sectionsCount * 720}px` }}
          >
            {/* Background Image Layer: Diimplementasikan ke Semua Section */}
            {bgImage &&
              (bgImageFixed ? (
                // Mode 1: Parallax Sticky (Latar tetap pas di layar 360x720 saat scroll di semua section)
                <div
                  className="sticky top-0 left-0 w-full h-[720px] -mb-[720px] pointer-events-none z-0 transition-all duration-200"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: `${bgImagePosX ?? 50}% ${bgImagePosY ?? 50}%`,
                    backgroundSize:
                      bgImageFit === "custom"
                        ? `${bgImageScale ?? 100}%`
                        : bgImageFit === "contain"
                          ? "contain"
                          : bgImageFit === "repeat"
                            ? "auto"
                            : "cover",
                    backgroundRepeat:
                      bgImageFit === "repeat" ? "repeat" : "no-repeat",
                    opacity: (bgImageOpacity ?? 100) / 100,
                    filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                  }}
                />
              ) : bgImageFit === "cover" ? (
                // Mode 2: Satu gambar membentang di seluruh tinggi semua section
                <div
                  className="absolute inset-0 pointer-events-none z-0 transition-all duration-200"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: `${bgImagePosX ?? 50}% ${bgImagePosY ?? 50}%`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    opacity: (bgImageOpacity ?? 100) / 100,
                    filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                  }}
                />
              ) : (
                // Mode 3: Diterapkan ke SEMUA section (setiap section memiliki gambar background pas 720px)
                Array.from({ length: sectionsCount }, (_, index) => (
                  <div
                    key={`section-bg-layer-${index}`}
                    className="absolute left-0 right-0 pointer-events-none z-0 transition-all duration-200 overflow-hidden"
                    style={{
                      top: `${index * 720}px`,
                      height: "720px",
                      backgroundImage: `url(${bgImage})`,
                      backgroundPosition: `${bgImagePosX ?? 50}% ${bgImagePosY ?? 50}%`,
                      backgroundSize:
                        bgImageFit === "custom"
                          ? `${bgImageScale ?? 100}%`
                          : bgImageFit === "contain"
                            ? "contain"
                            : bgImageFit === "repeat"
                              ? "auto"
                              : "cover",
                      backgroundRepeat:
                        bgImageFit === "repeat" ? "repeat" : "no-repeat",
                      opacity: (bgImageOpacity ?? 100) / 100,
                      filter:
                        bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                    }}
                  />
                ))
              ))}
            {/* Visual Section Dividers & Guides (Hanya di mode Edit) */}
            {!isPreviewMode &&
              Array.from({ length: sectionsCount }, (_, index) => (
                <div
                  key={`section-guide-${index}`}
                  className="absolute left-0 right-0 pointer-events-none select-none border-b border-dashed border-amber-500/20"
                  style={{
                    top: `${index * 720}px`,
                    height: "720px",
                  }}
                >
                  <div className="p-3 flex items-center justify-between opacity-85 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-xs">
                        {index === 0
                          ? "Section 1 • Layar Buka Undangan"
                          : index === 1
                            ? "Section 2 • Cover Utama & Nama Mempelai"
                            : index === 2
                              ? "Section 3 • Rangkaian Acara & Akad"
                              : index === 3
                                ? "Section 4 • Lokasi & Denah"
                                : index === 4
                                  ? "Section 5 • Doa & Ucapan"
                                  : `Section ${index + 1} • Konten Halaman`}
                      </span>
                      {index === 0 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addOpeningSectionLayout();
                            }}
                            className="pointer-events-auto flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 hover:from-amber-500/45 hover:to-yellow-500/45 text-amber-300 border border-amber-400/50 text-[10px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                            title="Generate Layout Lengkap Pembuka (Nama Mempelai, Tamu & Tombol Buka Undangan)"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            <span>✨ Layout Pembuka Lengkap</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addOpenInvitationButton(0);
                            }}
                            className="pointer-events-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            title="Tambah Tombol Buka Undangan Saja ke Section 1"
                          >
                            <span>+ Tombol Saja</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground/70 font-mono">
                      H: 720px
                    </span>
                  </div>
                </div>
              ))}

            {elements
              .filter((element) => !element.parentId)
              .sort(
                (a, b) =>
                  layers.findIndex((layer) => layer.id === a.id) -
                  layers.findIndex((layer) => layer.id === b.id),
              )
              .map((el) => {
                const layer = layers.find((item) => item.id === el.id);
                if (layer?.visible === false) return null;

                const isLocked = Boolean(layer?.locked);
                const isSelected =
                  !isLocked && !isPreviewMode && selectedElementId === el.id;

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    onClick={(e) => {
                      if (isLocked) return;
                      if (isPreviewMode) return;
                      e.stopPropagation();
                      selectElement(el.id);
                    }}
                    onPointerDown={(e) => {
                      if (isLocked || isPreviewMode) return;
                      startElementDrag(e, el.id, "move");
                    }}
                    className={`select-none transition-all rounded-lg ${
                      isLocked
                        ? "pointer-events-none cursor-default"
                        : isPreviewMode
                          ? el.type === "button"
                            ? "pointer-events-auto"
                            : "pointer-events-none cursor-default"
                          : `cursor-grab active:cursor-grabbing ${
                              isSelected
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                : "hover:ring-1 hover:ring-primary/50"
                            }`
                    }`}
                    style={{
                      top: el.top,
                      left: el.left,
                      width:
                        el.type === "container" && el.widthSizeMode === "full"
                          ? "100%"
                          : el.type === "container" &&
                              el.widthSizeMode === "fit"
                            ? "max-content"
                            : el.width,
                      height:
                        el.type === "container" && el.heightSizeMode === "full"
                          ? "100%"
                          : el.type === "container" &&
                              el.heightSizeMode === "fit"
                            ? "max-content"
                            : el.height,
                      opacity:
                        el.animation?.mount && el.animation.mount !== "none"
                          ? 0
                          : el.opacity,
                      position: el.positionMode ?? "absolute",
                      display: el.type === "container" ? el.display : undefined,
                      flexDirection:
                        el.display === "flex" ? el.flexDirection : undefined,
                      justifyContent:
                        el.display === "flex" ? el.justifyContent : undefined,
                      alignItems:
                        el.display === "flex" ? el.alignItems : undefined,
                      gridTemplateColumns:
                        el.display === "grid"
                          ? `repeat(${el.gridColumns ?? 2}, minmax(0, 1fr))`
                          : undefined,
                      gridTemplateRows:
                        el.display === "grid"
                          ? `repeat(${el.gridRows ?? 1}, minmax(0, 1fr))`
                          : undefined,
                      paddingTop: el.paddingTop,
                      paddingRight: el.paddingRight,
                      paddingBottom: el.paddingBottom,
                      paddingLeft: el.paddingLeft,
                      marginTop: el.marginTop,
                      marginRight: el.marginRight,
                      marginBottom: el.marginBottom,
                      marginLeft: el.marginLeft,
                      gap: el.type === "container" ? el.gap : undefined,
                    }}
                  >
                    {el.type === "container" ? (
                      <div className="contents">
                        {elements
                          .filter((child) => child.parentId === el.id)
                          .map((child) => renderNestedElement(child, el.id))}
                      </div>
                    ) : (
                      renderElement(el)
                    )}

                    {/* Handles Bounding Box ala Figma saat di-select di mode Edit */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-primary rounded-xs border border-background pointer-events-none" />
                        <div className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-primary rounded-xs border border-background pointer-events-none" />
                        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary rounded-xs border border-background pointer-events-none" />
                        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary rounded-xs border border-background pointer-events-none" />
                        <div
                          className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-background bg-primary z-30"
                          onPointerDown={(e) =>
                            startElementDrag(e, el.id, "resize")
                          }
                        />
                      </>
                    )}
                  </div>
                );
              })}

            {/* Bottom Add/Remove Section Action Bar (Hanya di mode Edit) */}
            {!isPreviewMode && (
              <div
                className="absolute left-4 right-4 flex items-center justify-center gap-2 pointer-events-auto"
                style={{ top: `${sectionsCount * 720 - 58}px` }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSection();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium rounded-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                >
                  + Tambah Section ({sectionsCount + 1})
                </button>
                {sectionsCount > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium rounded-full bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/40 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    - Hapus Section
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
