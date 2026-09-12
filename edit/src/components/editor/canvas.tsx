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
  Gift,
  MailOpen,
  Smartphone,
  Music,
  Upload,
  ArrowUp,
  ArrowDown,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Copy,
  Lock,
  Trash2,
  Layers,
} from "lucide-react";
import TloatingToolbarControls from "@/components/editor/tloating-toolbar-controls";
import WindSwayImage from "@/components/editor/WindSwayImage";
import AnimatedText from "@/components/editor/AnimatedText";
import OpenInvitationButton from "@/components/editor/OpenInvitationButton";
import CountdownTimer from "@/components/editor/CountdownTimer";
import RSVPForm from "@/components/editor/RSVPForm";
import GuestbookList from "@/components/editor/GuestbookList";
import {
  useEditorStore,
  DEFAULT_SECTIONS,
  type CanvasElementType,
  type ShapeType,
  type MockupType,
} from "@/store/useEditorStore";
import { calculateTextBoundingBox } from "@/lib/fontMetrics";
import {
  playPhysicsMountAnimation,
  playPhysicsUnmountAnimation,
  setInitialPreMountState,
} from "@/lib/physicsAnimations";
import { Vector2 } from "@/engine/geometry/Vector2";
import { Matrix2D } from "@/engine/geometry/Matrix2D";
import { CoordinateSystem } from "@/engine/geometry/CoordinateSystem";
import { HitTest, type ObjectTransformState, type HandleType } from "@/engine/interaction/HitTest";
import { ResizeController, type ResizeSession } from "@/engine/interaction/ResizeController";
import { RotateController, type RotateSession } from "@/engine/interaction/RotateController";
import { InteractionStateMachine, InteractionState } from "@/engine/interaction/InteractionStateMachine";

export default function Canvas() {
  const interactionMachineRef = useRef(new InteractionStateMachine());
  const pendingPointerEventRef = useRef<globalThis.PointerEvent | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const capturedElementRef = useRef<HTMLElement | null>(null);
  const capturedPointerIdRef = useRef<number | null>(null);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const zoom = useEditorStore((state) => state.zoom);
  const activeTool = useEditorStore((state) => state.activeTool);
  const activeMockup = useEditorStore((state) => state.activeMockup);
  const setActiveMockup = useEditorStore((state) => state.setActiveMockup);
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
  const addContainer = useEditorStore((state) => state.addContainer);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const selectElement = useEditorStore((state) => state.selectElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const deleteElement = useEditorStore((state) => state.deleteElement);
  const duplicateElement = useEditorStore((state) => state.duplicateElement);
  const bringForward = useEditorStore((state) => state.bringForward);
  const sendBackward = useEditorStore((state) => state.sendBackward);
  const bringToFront = useEditorStore((state) => state.bringToFront);
  const sendToBack = useEditorStore((state) => state.sendToBack);
  const alignElement = useEditorStore((state) => state.alignElement);
  const toggleLayerLock = useEditorStore((state) => state.toggleLayerLock);
  const addOpenInvitationButton = useEditorStore(
    (state) => state.addOpenInvitationButton,
  );
  const sectionsCount = useEditorStore((state) => state.sectionsCount);
  const activeSection = useEditorStore((state) => state.activeSection);
  const setActiveSection = useEditorStore((state) => state.setActiveSection);
  const targetScrollSection = useEditorStore(
    (state) => state.targetScrollSection,
  );
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setIsPreviewMode = useEditorStore((state) => state.setIsPreviewMode);
  const isCoverVisible = useEditorStore((state) => state.isCoverVisible);
  const setIsCoverVisible = useEditorStore((state) => state.setIsCoverVisible);
  const playPreview = useEditorStore((state) => state.playPreview);
  const isGiftModalOpen = useEditorStore((state) => state.isGiftModalOpen);
  const setIsGiftModalOpen = useEditorStore(
    (state) => state.setIsGiftModalOpen,
  );
  const addGiftButton = useEditorStore((state) => state.addGiftButton);
  const isMusicPlaying = useEditorStore((state) => state.isMusicPlaying);
  const toggleMusic = useEditorStore((state) => state.toggleMusic);
  const setIsMusicPlaying = useEditorStore((state) => state.setIsMusicPlaying);
  const audioUrl = useEditorStore((state) => state.audioUrl);
  const addMusicButton = useEditorStore((state) => state.addMusicButton);
  const laptopCoverImage = useEditorStore((state) => state.laptopCoverImage);
  const setLaptopCoverImage = useEditorStore((state) => state.setLaptopCoverImage);
  const laptopFileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollContainerRef = useRef<HTMLDivElement>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [pendingPlacement, setPendingPlacement] = useState<
    | { type: "text" }
    | { type: "image"; file: File }
    | { type: "shape"; shape: ShapeType }
    | { type: "gift" }
    | { type: "music" }
    | { type: "cover-button" }
    | null
  >(null);
  const [coverButtonAdded, setCoverButtonAdded] = useState(false);
  const [giftButtonAdded, setGiftButtonAdded] = useState(false);
  const [activeGuideX, setActiveGuideX] = useState<number | null>(null);
  const [activeGuideY, setActiveGuideY] = useState<number | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const selectedContainer = elements.find(
    (element) =>
      element.id === selectedElementId && element.type === "container",
  );
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const lastPointerPositionRef = useRef<{ xPct: number; yPct: number } | null>(
    null,
  );
  const dragRef = useRef<{
    id: string;
    mode:
      | "move"
      | "rotate"
      | "resize-se"
      | "resize-sw"
      | "resize-ne"
      | "resize-nw"
      | "resize-e"
      | "resize-w"
      | "resize-n"
      | "resize-s";
    startX: number;
    startY: number;
    startLeftPx: number;
    startTopPx: number;
    startWidth: number;
    startHeight: number;
    startFontSize?: number;
    unitLeft: "%" | "px";
    unitTop: "%" | "px";
    zoomScale?: number;
    resizeSession?: ResizeSession;
    rotateSession?: RotateSession;
  } | null>(null);
  const elementsRef = useRef(elements);
  const animationKey = elements
    .map(
      (element) =>
        `${element.id}:${element.animation?.mount ?? "none"}:${element.animation?.unmount ?? "none"}:${element.animation?.loop ?? "none"}`,
    )
    .join("|");

  useEffect(() => {
    if (!isPreviewMode) return;
    const el = previewWrapperRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setPreviewScale(width / 390);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isPreviewMode]);

  const scrollToSection = (sectionIndex: number) => {
    const targetTop = sectionIndex * 844;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
    if (previewScrollContainerRef.current) {
      previewScrollContainerRef.current.scrollTo({
        top: targetTop * previewScale,
        behavior: "smooth",
      });
    }
    setActiveSection(sectionIndex);
  };

  useEffect(() => {
    if (targetScrollSection) {
      const targetTop = targetScrollSection.index * 844;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
      if (previewScrollContainerRef.current) {
        previewScrollContainerRef.current.scrollTo({
          top: targetTop * previewScale,
          behavior: "smooth",
        });
      }
    }
  }, [targetScrollSection, previewScale]);

  const handleRestartPreview = () => {
    setPreviewKey((k) => k + 1);
    setIsCoverVisible(true);
    setIsGiftModalOpen(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setActiveSection(0);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  const handleOpenInvitationFromCover = (targetSection: number = 0) => {
    // 1. Jalankan animasi Cover meluncur naik ke atas
    setIsCoverVisible(false);
    // 2. Putar musik latar belakang otomatis saat buka undangan
    setIsMusicPlaying(true);

    // 3. Arahkan ke Section Opening (index 0)
    scrollToSection(targetSection);
  };

  useLayoutEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    const processPointerMove = () => {
      const event = pendingPointerEventRef.current;
      if (!event) return;
      const drag = dragRef.current;
      if (!drag) return;

      const targetElement = elementsRef.current.find((e) => e.id === drag.id);
      if (!targetElement) return;

      const zoomScale = drag.zoomScale || (zoom / 100) || 1;
      const frameRect = frameRef.current?.getBoundingClientRect();

      const currentWorldPointer = new Vector2(
        frameRect ? (event.clientX - frameRect.left) / zoomScale : event.clientX,
        frameRect ? (event.clientY - frameRect.top) / zoomScale : event.clientY,
      );

      if (drag.mode === "move") {
        const deltaX = (event.clientX - drag.startX) / zoomScale;
        const deltaY = (event.clientY - drag.startY) / zoomScale;
        let newLeftPx = drag.startLeftPx + deltaX;
        let newTopPx = drag.startTopPx + deltaY;

        // Canva Center Line & Section Center Snapping (Threshold 6px unscaled)
        const frameWidth = 390;
        const elWidth = targetElement.width || 100;
        const elHeight = targetElement.height || 100;
        const centerLineX = (frameWidth - elWidth) / 2;

        let guideX: number | null = null;
        let guideY: number | null = null;

        if (Math.abs(newLeftPx - centerLineX) < 6) {
          newLeftPx = centerLineX; // Snap to canvas center
          guideX = 195;
        }

        const secIndex = Math.floor(newTopPx / 844);
        const sectionCenterY = secIndex * 844 + 422 - elHeight / 2;
        if (Math.abs(newTopPx - sectionCenterY) < 6) {
          newTopPx = sectionCenterY;
          guideY = secIndex * 844 + 422;
        }

        setActiveGuideX(guideX);
        setActiveGuideY(guideY);

        // Canva Safety Bounds Clamping: Prevent element from disappearing off screen
        const totalHeight = sectionsCount * 844;
        newLeftPx = Math.max(-elWidth + 24, Math.min(frameWidth - 24, newLeftPx));
        newTopPx = Math.max(0, Math.min(totalHeight - 24, newTopPx));

        // Format position preserving original unit type (px or %)
        if (drag.unitTop === "%") {
          const topPct = ((newTopPx / totalHeight) * 100).toFixed(2);
          const leftPct = ((newLeftPx / frameWidth) * 100).toFixed(2);
          updateElement(drag.id, {
            left: `${leftPct}%`,
            top: `${topPct}%`,
          });
        } else {
          updateElement(drag.id, {
            left: `${Math.round(newLeftPx)}px`,
            top: `${Math.round(newTopPx)}px`,
          });
        }
      } else if (drag.mode === "rotate" && drag.rotateSession) {
        const updated = RotateController.updateRotation(
          drag.rotateSession,
          currentWorldPointer,
          { snapEnable: true, snapThresholdDeg: 5 },
        );
        updateElement(drag.id, { rotation: updated.rotation });
      } else if (drag.resizeSession) {
        const isCorner = ["resize-se", "resize-sw", "resize-ne", "resize-nw"].includes(drag.mode);
        const isText = targetElement.type === "text";

        const updated = ResizeController.updateResize(
          drag.resizeSession,
          currentWorldPointer,
          {
            lockAspectRatio: isCorner,
            minWidth: 20,
            minHeight: 20,
            isTextObject: isText,
            textMode: "scale",
          },
        );

        let newFontSize = drag.startFontSize || 16;
        let fontMetricsBox: ReturnType<typeof calculateTextBoundingBox> | null = null;

        if (isText) {
          const scaleFactor = updated.width / Math.max(1, drag.startWidth);
          newFontSize = Math.max(8, (drag.startFontSize || 16) * scaleFactor);
          fontMetricsBox = calculateTextBoundingBox(targetElement.content || "", {
            fontSize: newFontSize,
            fontFamily: "serif",
            fontWeight: targetElement.fontWeight || "normal",
            containerWidth: updated.width,
          });
        }

        const totalHeight = sectionsCount * 844;
        const frameWidth = 390;

        const posUpdates = {
          left: drag.unitLeft === "%" ? `${((updated.x / frameWidth) * 100).toFixed(4)}%` : `${Number(updated.x.toFixed(2))}px`,
          top: drag.unitTop === "%" ? `${((updated.y / totalHeight) * 100).toFixed(4)}%` : `${Number(updated.y.toFixed(2))}px`,
        };

        if (isText) {
          const cleanedStyle = (targetElement.style || "")
            .replace(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b/g, "")
            .replace(/\btext-\[\d+(\.\d+)?px\]\b/g, "")
            .trim();

          updateElement(drag.id, {
            ...posUpdates,
            fontSize: Number(newFontSize.toFixed(2)),
            style: cleanedStyle,
            width: fontMetricsBox ? fontMetricsBox.width : updated.width,
            height: Math.max(updated.height, fontMetricsBox ? fontMetricsBox.height : 20),
            rotation: updated.rotation,
            flipX: updated.flipX,
            flipY: updated.flipY,
          });
        } else {
          updateElement(drag.id, {
            ...posUpdates,
            width: Number(updated.width.toFixed(2)),
            height: Number(updated.height.toFixed(2)),
            rotation: updated.rotation,
            flipX: updated.flipX,
            flipY: updated.flipY,
          });
        }
      }
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      pendingPointerEventRef.current = event;
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          processPointerMove();
        });
      }
    };

    const handlePointerUp = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (capturedElementRef.current && capturedPointerIdRef.current !== null) {
        try {
          capturedElementRef.current.releasePointerCapture(capturedPointerIdRef.current);
        } catch {
          // Pointer capture release cleanup
        }
        capturedElementRef.current = null;
        capturedPointerIdRef.current = null;
      }
      dragRef.current = null;
      setActiveGuideX(null);
      setActiveGuideY(null);
      interactionMachineRef.current.transitionTo(
        selectedElementId ? InteractionState.SELECTED : InteractionState.IDLE,
        selectedElementId
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [sectionsCount, updateElement, zoom, selectedElementId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // Canva Keyboard Nudge (Panah Atas/Bawah/Kiri/Kanan)
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) &&
        selectedElementId
      ) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const el = elements.find((item) => item.id === selectedElementId);
        if (!el) return;

        const currentLeft = parseFloat(el.left || "0") || 0;
        const currentTop = parseFloat(el.top || "0") || 0;
        const isLeftPct = String(el.left).endsWith("%");
        const isTopPct = String(el.top).endsWith("%");

        let deltaX = 0;
        let deltaY = 0;
        if (event.key === "ArrowLeft") deltaX = -step;
        if (event.key === "ArrowRight") deltaX = step;
        if (event.key === "ArrowUp") deltaY = -step;
        if (event.key === "ArrowDown") deltaY = step;

        const totalHeight = sectionsCount * 844;
        updateElement(selectedElementId, {
          left: isLeftPct
            ? `${(((currentLeft * 3.9) + deltaX) / 390 * 100).toFixed(2)}%`
            : `${Math.round(currentLeft + deltaX)}px`,
          top: isTopPct
            ? `${((((currentTop * totalHeight) / 100) + deltaY) / totalHeight * 100).toFixed(2)}%`
            : `${Math.round(currentTop + deltaY)}px`,
        });
        return;
      }

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
  }, [deleteElement, duplicateElement, elements, selectedElementId, sectionsCount, updateElement]);

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
            // Jika elemen sedang di-drag oleh user, jangan disembunyikan
            if (dragRef.current?.id === elementId) return;

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
    setPendingPlacement(null);
    selectElement(null);
  };

  const getTailwindClassName = (code: string) =>
    code.match(/className\s*[:=]\s*["'{]([^"'}]+)["'}]/)?.[1] ?? "";

  const handleMockupClick = (
    event: PointerEvent<HTMLDivElement>,
    target: "cover" | "gift",
  ) => {
    if (
      (target === "cover" && pendingPlacement?.type !== "cover-button") ||
      (target === "gift" && pendingPlacement?.type !== "gift")
    ) {
      return;
    }
    event.stopPropagation();
    if (target === "cover") setCoverButtonAdded(true);
    else setGiftButtonAdded(true);
    setPendingPlacement(null);
    setActiveTool("cursor");
  };

  const getFramePosition = (event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    return { xPct: (x / rect.width) * 100, yPct: (y / rect.height) * 100 };
  };

  const handleFrameClick = (event: PointerEvent<HTMLDivElement>) => {
    if (!pendingPlacement) {
      handleCanvasClick();
      return;
    }

    // Special placement for sticky gift button (positioned relative to phone viewport)
    if (pendingPlacement.type === "gift") {
      const phoneRect = scrollContainerRef.current?.getBoundingClientRect();
      if (!phoneRect) return;

      event.stopPropagation();
      const btnSize = 48;
      const rawX = event.clientX - phoneRect.left - btnSize / 2;
      const rawY = event.clientY - phoneRect.top - btnSize / 2;
      const clampedX = Math.max(8, Math.min(phoneRect.width - btnSize - 8, rawX));
      const clampedY = Math.max(8, Math.min(phoneRect.height - btnSize - 8, rawY));
      const leftPct = `${((clampedX / phoneRect.width) * 100).toFixed(2)}%`;
      const topPct = `${((clampedY / phoneRect.height) * 100).toFixed(2)}%`;

      addElement("button", {
        name: "Tombol Gift (Sticky)",
        buttonText: "", // Empty string: icon-only button
        buttonIcon: "gift",
        buttonVariant: "gold-luxury",
        buttonAction: "gift-modal",
        positionMode: "fixed",
        width: btnSize,
        height: btnSize,
        buttonShape: "pill",
        buttonPulse: true,
        buttonBgType: "gradient",
        buttonBgColor: "#e11d48",
        buttonBgGradientEnd: "#f59e0b",
        buttonTextColor: "#ffffff",
        buttonBorderColor: "#fcd34d",
        buttonBorderWidth: 1.5,
        buttonBorderRadius: 9999,
        buttonShadow: "luxury",
        position: {
          top: topPct,
          left: leftPct,
        },
        sectionIndex: activeSection,
      });

      setPendingPlacement(null);
      setActiveTool("cursor");
      return;
    }

    // Special placement for sticky music button (positioned relative to phone viewport)
    if (pendingPlacement.type === "music") {
      const phoneRect = scrollContainerRef.current?.getBoundingClientRect();
      if (!phoneRect) return;

      event.stopPropagation();
      const btnSize = 48;
      const rawX = event.clientX - phoneRect.left - btnSize / 2;
      const rawY = event.clientY - phoneRect.top - btnSize / 2;
      const clampedX = Math.max(8, Math.min(phoneRect.width - btnSize - 8, rawX));
      const clampedY = Math.max(8, Math.min(phoneRect.height - btnSize - 8, rawY));
      const leftPct = `${((clampedX / phoneRect.width) * 100).toFixed(2)}%`;
      const topPct = `${((clampedY / phoneRect.height) * 100).toFixed(2)}%`;

      addElement("button", {
        name: "Tombol Putar Musik (Sticky)",
        buttonText: "", // Empty string: icon-only circular button
        buttonIcon: "music",
        buttonVariant: "gold-luxury",
        buttonAction: "toggle-music",
        positionMode: "fixed",
        width: btnSize,
        height: btnSize,
        buttonShape: "pill",
        buttonPulse: true,
        buttonBgType: "gradient",
        buttonBgColor: "#059669",
        buttonBgGradientEnd: "#10b981",
        buttonTextColor: "#ffffff",
        buttonBorderColor: "#6ee7b7",
        buttonBorderWidth: 1.5,
        buttonBorderRadius: 9999,
        buttonShadow: "luxury",
        position: {
          top: topPct,
          left: leftPct,
        },
        sectionIndex: activeSection,
      });

      setPendingPlacement(null);
      setActiveTool("cursor");
      return;
    }

    const position = getFramePosition(event);
    if (!position) return;
    event.stopPropagation();

    const elementPosition = {
      top: `${position.yPct.toFixed(2)}%`,
      left: `${position.xPct.toFixed(2)}%`,
    };

    if (pendingPlacement.type === "image") {
      handleAddImage(pendingPlacement.file, position);
    } else if (pendingPlacement.type === "shape") {
      handleAddShape(pendingPlacement.shape, elementPosition);
    } else if (pendingPlacement.type === "cover-button") {
      addElement("button", {
        name: "Tombol Buka Undangan",
        buttonText: "Buka Undangan",
        buttonIcon: "mail",
        buttonVariant: "gold-luxury",
        buttonAction: "scroll-to-section",
        buttonTargetSection: 0,
        position: elementPosition,
      });
    } else {
      addElement("text", { position: elementPosition });
    }

    setPendingPlacement(null);
    setActiveTool("cursor");
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

      const totalCanvasHeight = sectionsCount * 844;
      let targetTop = "10%";
      let targetLeft = "10%";

      if (selectedContainer) {
        targetTop = "0%";
        targetLeft = "0%";
      } else if (customPos?.xPct !== undefined && customPos?.yPct !== undefined) {
        // Drop langsung di titik mouse
        targetLeft = `${Math.max(0, Math.min(85, customPos.xPct - ((width / 2) / 390) * 100)).toFixed(2)}%`;
        targetTop = `${Math.max(0, Math.min(95, customPos.yPct - ((height / 2) / totalCanvasHeight) * 100)).toFixed(2)}%`;
      } else if (lastPointerPositionRef.current) {
        // Posisi kursor mouse aktif di frame saat tombol upload diklik
        const { xPct, yPct } = lastPointerPositionRef.current;
        targetLeft = `${Math.max(0, Math.min(85, xPct - ((width / 2) / 390) * 100)).toFixed(2)}%`;
        targetTop = `${Math.max(0, Math.min(95, yPct - ((height / 2) / totalCanvasHeight) * 100)).toFixed(2)}%`;
      } else {
        // Posisi tengah section yang sedang aktif dibuka/dilihat oleh user di scroll viewport
        const currentScrollTop = scrollContainerRef.current?.scrollTop || 0;
        const centerTopPx = currentScrollTop + (844 / 2) - (height / 2);
        const centerLeftPx = Math.max(0, (390 - width) / 2);
        targetTop = `${Math.max(0, (centerTopPx / totalCanvasHeight) * 100).toFixed(2)}%`;
        targetLeft = `${Math.max(0, (centerLeftPx / 390) * 100).toFixed(2)}%`;
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

  const handleAddShape = (
    shape: ShapeType,
    position?: { top: string; left: string },
  ) => {
    addElement("shape", {
      shape,
      name: `${shape} shape`,
      positionMode: selectedContainer ? "relative" : "absolute",
      parentId: selectedContainer?.id,
      position,
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
    mode:
      | "move"
      | "rotate"
      | "resize-se"
      | "resize-sw"
      | "resize-ne"
      | "resize-nw"
      | "resize-e"
      | "resize-w"
      | "resize-n"
      | "resize-s" = "move",
  ) => {
    if (activeTool !== "cursor") return;
    if (!interactionMachineRef.current.canStartDrag()) return;

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

    if (mode === "move") {
      interactionMachineRef.current.transitionTo(InteractionState.DRAGGING_OBJECT, target.id);
    } else if (mode === "rotate") {
      interactionMachineRef.current.transitionTo(InteractionState.ROTATING, target.id);
    } else if (mode.startsWith("resize-")) {
      interactionMachineRef.current.transitionTo(InteractionState.RESIZING, target.id, mode);
    }

    if (event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
        capturedElementRef.current = event.currentTarget;
        capturedPointerIdRef.current = event.pointerId;
      } catch {
        // Pointer capture fallback
      }
    }

    selectElement(element.id);

    const zoomScale = Math.max(0.1, (zoom || 100) / 100);
    const frameRect = frameRef.current?.getBoundingClientRect();
    const domEl = frameRef.current?.querySelector<HTMLElement>(`[data-element-id="${target.id}"]`);
    const elRect = domEl?.getBoundingClientRect();

    let startLeftPx = 0;
    let startTopPx = 0;
    let startWidth = target.width;
    let startHeight = target.height;

    const rawLeft = String(target.left || "0").trim();
    const rawTop = String(target.top || "0").trim();
    const unitLeft: "%" | "px" = rawLeft.endsWith("%") ? "%" : "px";
    const unitTop: "%" | "px" = rawTop.endsWith("%") ? "%" : "px";

    if (frameRect && elRect && zoomScale > 0) {
      startLeftPx = (elRect.left - frameRect.left) / zoomScale;
      startTopPx = (elRect.top - frameRect.top) / zoomScale;
      startWidth = Math.round(elRect.width / zoomScale);
      startHeight = Math.round(elRect.height / zoomScale);
    } else {
      const refWidth = 390;
      const refHeight = sectionsCount * 844;
      startLeftPx = unitLeft === "%" ? (parseFloat(rawLeft) / 100) * refWidth : parseFloat(rawLeft) || 0;
      startTopPx = unitTop === "%" ? (parseFloat(rawTop) / 100) * refHeight : parseFloat(rawTop) || 0;
    }

    let startFontSize = target.fontSize || 16;
    if (domEl) {
      const textChild = domEl.querySelector<HTMLElement>("div, span, p") || domEl;
      const computedFS = parseFloat(window.getComputedStyle(textChild).fontSize);
      if (!isNaN(computedFS) && computedFS > 0) {
        startFontSize = computedFS;
      }
    }

    const objectState: ObjectTransformState = {
      x: startLeftPx,
      y: startTopPx,
      width: startWidth,
      height: startHeight,
      rotation: target.rotation || 0,
      scaleX: target.scaleX || 1,
      scaleY: target.scaleY || 1,
      flipX: target.flipX,
      flipY: target.flipY,
    };

    const mouseWorld = new Vector2(
      frameRect ? (event.clientX - frameRect.left) / zoomScale : event.clientX,
      frameRect ? (event.clientY - frameRect.top) / zoomScale : event.clientY,
    );

    let resizeSession: ResizeSession | undefined = undefined;
    let rotateSession: RotateSession | undefined = undefined;

    if (mode.startsWith("resize-")) {
      const handleMap: Record<string, HandleType> = {
        "resize-se": "SE",
        "resize-sw": "SW",
        "resize-ne": "NE",
        "resize-nw": "NW",
        "resize-e": "E",
        "resize-w": "W",
        "resize-n": "N",
        "resize-s": "S",
      };
      const handle = handleMap[mode];
      if (handle) {
        resizeSession = ResizeController.startSession(objectState, mouseWorld, handle);
      }
    } else if (mode === "rotate") {
      rotateSession = RotateController.startSession(objectState, mouseWorld);
    }

    dragRef.current = {
      id: target.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startLeftPx,
      startTopPx,
      startWidth,
      startHeight,
      startFontSize,
      unitLeft,
      unitTop,
      zoomScale,
      resizeSession,
      rotateSession,
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
          el.isGuestbook || el.id.includes("guestbook-list") ? (
            <GuestbookList />
          ) : el.isRsvpForm || el.id.includes("rsvp-form") ? (
            <RSVPForm disabled={!isPreviewMode} />
          ) : el.isCountdown || el.id.includes("countdown-timer") ? (
            <CountdownTimer
              targetDate={el.countdownTargetDate ?? "2026-09-20T08:00"}
              color={el.color ?? "#fcd34d"}
              fontSize={el.fontSize ?? 28}
            />
          ) : (
            <AnimatedText
              content={el.content}
              effect={el.textEffect ?? "none"}
              className={`${el.style} ${fitContent ? "leading-none whitespace-nowrap" : "h-full w-full"}`}
              fontSize={el.fontSize}
              color={el.color}
              fontWeight={el.fontWeight}
              textAlign={el.textAlign}
            />
          )
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
              text={typeof el.buttonText === "string" ? el.buttonText : (el.content || "Buka Undangan")}
              icon={el.buttonIcon || "mail"}
              variant={el.buttonVariant || "gold-luxury"}
              pulse={el.buttonPulse ?? true}
              className={el.style}
              customCode={el.buttonCustomCode}
              bgType={el.buttonBgType}
              bgColor={el.buttonBgColor}
              bgGradientEnd={el.buttonBgGradientEnd}
              textColor={el.buttonTextColor}
              borderColor={el.buttonBorderColor}
              borderWidth={el.buttonBorderWidth}
              borderRadius={el.buttonBorderRadius}
              shape={el.buttonShape}
              fontFamily={el.buttonFontFamily}
              fontSize={el.buttonFontSize}
              fontWeight={el.buttonFontWeight}
              letterSpacing={el.buttonLetterSpacing}
              textTransform={el.buttonTextTransform}
              shadow={el.buttonShadow}
              disabled={!isPreviewMode}
              onClick={() => {
                if (el.buttonAction === "gift-modal") {
                  setIsGiftModalOpen(true);
                } else if (el.buttonAction === "toggle-music") {
                  toggleMusic();
                } else if (el.buttonAction === "url" && el.buttonUrl) {
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
                  ? ""
                  : "hover:ring-1 hover:ring-purple-400/40"
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
              startElementDrag(event, element.id, "resize-se");
            }}
          />
        )}
      </div>
    );
  };

  const renderMockupElements = (
    targetMockup: MockupType,
    fixedOnly: boolean = false,
    mode: "content" | "selection" = "content",
  ) => {
    return elements
      .filter((element) => {
        if (element.parentId) return false;
        const matchesMockup =
          targetMockup === "invitation"
            ? !element.mockupType || element.mockupType === "invitation"
            : element.mockupType === targetMockup;
        if (!matchesMockup) return false;

        if (targetMockup === "invitation") {
          const isFixed = element.positionMode === "fixed";
          return fixedOnly ? isFixed : !isFixed;
        }
        return true;
      })
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

        // MODE SELECTION: Render Transformer UI in an un-clipped overlay (overflow-visible)
        if (mode === "selection") {
          if (!isSelected) return null;

          return (
            <div
              key={`selection-${el.id}`}
              className="absolute pointer-events-none transition-all rounded-lg z-40 overflow-visible"
              style={{
                top: el.top,
                left: el.left,
                width:
                  el.type === "container" && el.widthSizeMode === "full"
                    ? "100%"
                    : el.type === "container" && el.widthSizeMode === "fit"
                      ? "max-content"
                      : el.width,
                height:
                  el.type === "container" && el.heightSizeMode === "full"
                    ? "100%"
                    : el.type === "container" && el.heightSizeMode === "fit"
                      ? "max-content"
                      : el.height,
                position: el.positionMode === "fixed" ? "absolute" : (el.positionMode ?? "absolute"),
                transform: [
                  el.rotation ? `rotate(${el.rotation}deg)` : "",
                  el.flipX ? "scaleX(-1)" : "",
                  el.flipY ? "scaleY(-1)" : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined,
                transformOrigin: "center center",
              }}
            >
              {/* Canva Purple Border Outline Box */}
              <div className="absolute inset-0 border-2 border-[#8b5cf6] pointer-events-none rounded-xs z-30" />

              {/* Rotation Handle above top-center */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-40">
                <div className="w-[1.5px] h-3 bg-[#8b5cf6]" />
                <div
                  className="w-4.5 h-4.5 bg-white border-2 border-[#8b5cf6] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform flex items-center justify-center"
                  onPointerDown={(e) => startElementDrag(e, el.id, "rotate")}
                  title="Putar Objek (Drag untuk rotasi)"
                >
                  <RotateCcw className="w-2.5 h-2.5 text-[#8b5cf6]" />
                </div>
              </div>

              {/* 4 Corner Circle Handles (Uniform Scaling & Font Scaling) */}
              <div
                className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("NW", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-nw")}
                title="Tarik sudut untuk ubah ukuran & font"
              >
                <div className="w-3.5 h-3.5 bg-white border-2 border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("NE", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-ne")}
                title="Tarik sudut untuk ubah ukuran & font"
              >
                <div className="w-3.5 h-3.5 bg-white border-2 border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute -bottom-3 -left-3 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("SW", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-sw")}
                title="Tarik sudut untuk ubah ukuran & font"
              >
                <div className="w-3.5 h-3.5 bg-white border-2 border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("SE", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-se")}
                title="Tarik sudut untuk ubah ukuran & font"
              >
                <div className="w-3.5 h-3.5 bg-white border-2 border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>

              {/* 4 Side Middle Pill Handles (Kiri, Kanan, Atas, Bawah) */}
              <div
                className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("W", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-w")}
                title="Tarik pinggir kiri untuk atur lebar teks"
              >
                <div className="w-1.5 h-4 bg-white border border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("E", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-e")}
                title="Tarik pinggir kanan untuk atur lebar teks"
              >
                <div className="w-1.5 h-4 bg-white border border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("N", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-n")}
                title="Tarik atas untuk atur tinggi"
              >
                <div className="w-4 h-1.5 bg-white border border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-auto z-40 group"
                style={{ cursor: HitTest.getCursorForHandle("S", el.rotation || 0) }}
                onPointerDown={(e) => startElementDrag(e, el.id, "resize-s")}
                title="Tarik bawah untuk atur tinggi"
              >
                <div className="w-4 h-1.5 bg-white border border-[#8b5cf6] rounded-full shadow-md group-hover:scale-125 transition-transform" />
              </div>

              {/* Canva Quick Floating Action Toolbar above element */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-neutral-900/95 border border-amber-500/40 p-1 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => bringForward(el.id)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Maju 1 Layer ke Depan"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => sendBackward(el.id)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Mundur 1 Layer ke Belakang"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => alignElement(el.id, "center-x")}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Rata Tengah Horisontal"
                >
                  <AlignCenterHorizontal className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => alignElement(el.id, "center-y")}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Rata Tengah Vertikal"
                >
                  <AlignCenterVertical className="h-3.5 w-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => duplicateElement(el.id)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Duplikat Elemen (Ctrl+D)"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleLayerLock(el.id)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                  title="Kunci / Buka Kunci Layer"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteElement(el.id)}
                  className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                  title="Hapus Elemen (Delete)"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {el.type === "button" && (
                  <>
                    <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (el.buttonAction === "gift-modal") {
                          setIsGiftModalOpen(true);
                        } else if (el.buttonAction === "toggle-music") {
                          toggleMusic();
                        } else if (el.buttonAction === "url" && el.buttonUrl) {
                          window.open(el.buttonUrl, "_blank");
                        } else {
                          scrollToSection(el.buttonTargetSection ?? 1);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-[10px] shadow-sm hover:bg-amber-400 cursor-pointer transition-all"
                      title="Uji coba aksi tombol ini langsung"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>Uji Tombol</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        }

        // MODE CONTENT: Render layer content only (clipped inside overflow-hidden container)
        return (
          <div
            key={el.id}
            data-element-id={el.id}
            onClick={(e) => {
              if (pendingPlacement) return;
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
                  : `pointer-events-auto cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? ""
                        : "hover:ring-1 hover:ring-purple-400/40"
                    }`
            }`}
            style={{
              top: el.top,
              left: el.left,
              width:
                el.type === "container" && el.widthSizeMode === "full"
                  ? "100%"
                  : el.type === "container" && el.widthSizeMode === "fit"
                    ? "max-content"
                    : el.width,
              height:
                el.type === "container" && el.heightSizeMode === "full"
                  ? "100%"
                  : el.type === "container" && el.heightSizeMode === "fit"
                    ? "max-content"
                    : el.height,
              opacity:
                el.animation?.mount && el.animation.mount !== "none"
                  ? 0
                  : el.opacity,
              position: el.positionMode === "fixed" ? "absolute" : (el.positionMode ?? "absolute"),
              display: el.type === "container" ? el.display : undefined,
              flexDirection:
                el.display === "flex" ? el.flexDirection : undefined,
              justifyContent:
                el.display === "flex" ? el.justifyContent : undefined,
              alignItems: el.display === "flex" ? el.alignItems : undefined,
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
              transform: [
                el.rotation ? `rotate(${el.rotation}deg)` : "",
                el.flipX ? "scaleX(-1)" : "",
                el.flipY ? "scaleY(-1)" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined,
              transformOrigin: "center center",
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
          </div>
        );
      });
  };

  return (
    <div
      className={`flex-1 h-screen bg-neutral-950 relative overflow-hidden flex items-center justify-center select-none ${
        pendingPlacement?.type === "gift" ? "cursor-crosshair" : ""
      }`}
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

      {/* Audio element for background music */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
          preload="auto"
          className="hidden"
        />
      )}

      {/* Floating Notice when Gift Placement is active */}
      {pendingPlacement?.type === "gift" && (
        <div className="absolute top-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs shadow-2xl backdrop-blur-md animate-pulse">
          <Gift className="h-4 w-4" />
          <span>Klik posisi di mockup untuk meletakkan Tombol Gift (Sticky & Ikon Saja)</span>
        </div>
      )}

      {/* Floating Notice when Music Placement is active */}
      {pendingPlacement?.type === "music" && (
        <div className="absolute top-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs shadow-2xl backdrop-blur-md animate-pulse">
          <Music className="h-4 w-4" />
          <span>Klik posisi di mockup untuk meletakkan Tombol Musik (Sticky & Ikon Saja)</span>
        </div>
      )}

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
            onClick={() => setIsGiftModalOpen(!isGiftModalOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Buka / Tampilkan Gift Modal"
          >
            <Gift className="w-3.5 h-3.5 text-rose-400" />
            <span>{isGiftModalOpen ? "Tutup Gift Modal" : "Buka Gift Modal"}</span>
          </button>

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
          activeMockup={activeMockup}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onAddText={() => {
            setPendingPlacement({ type: "text" });
            setActiveTool("text");
          }}
          onAddImage={(file) => {
            setPendingPlacement({ type: "image", file });
            setActiveTool("image");
          }}
          onAddShape={(shape) => {
            setPendingPlacement({ type: "shape", shape });
            setActiveTool("shape");
          }}
          onAddContainer={handleAddContainer}
          onAddGiftButton={() => {
            setPendingPlacement({ type: "gift" });
            setActiveTool("button");
          }}
          onAddMusicButton={() => {
            setPendingPlacement({ type: "music" });
            setActiveTool("button");
          }}
          onAddCoverButton={() => {
            setPendingPlacement({ type: "cover-button" });
            setActiveTool("button");
          }}
          onAddOpenInvitationButton={() => {
            addOpenInvitationButton();
          }}
          canAddElements={isMounted}
          onSelectCursor={handleCanvasClick}
          onTogglePreview={() => {
            playPreview();
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = 0;
            }
          }}
        />
      )}

      <div className="relative z-10 flex w-full flex-col items-center gap-3 px-10 py-6">
        {/* Modern Segmented Mockup Switcher + Play Preview Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl">
            {(
              [
                { id: "invitation", label: "Undangan", icon: Smartphone },
                { id: "cover", label: "Cover", icon: MailOpen },
                { id: "gift-modal", label: "Gift Modal", icon: Gift },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const count = elements.filter(
                (el) =>
                  !el.parentId &&
                  (m.id === "invitation"
                    ? !el.mockupType || el.mockupType === "invitation"
                    : el.mockupType === m.id),
              ).length;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMockup(m.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeMockup === m.id
                      ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                      activeMockup === m.id
                        ? "bg-neutral-950/30 text-neutral-950"
                        : "bg-neutral-800 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tombol Play / Preview Interaktif */}
          <button
            type="button"
            onClick={() => {
              playPreview();
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/25 border border-amber-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Putar Simulasi Undangan & Cover (Play Preview)"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Play Preview</span>
          </button>
        </div>

        {/* Mockup Undangan */}
        {activeMockup === "invitation" && (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              Tampilan Undangan (390 × 844 px)
            </span>
            <div
              className="transition-transform duration-200 ease-out relative cursor-default origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {/* Invitation Container (Pure 390px x 844px without phone bezel) */}
              <div
                className={`w-[390px] h-[844px] overflow-hidden relative shadow-2xl ${
                  pendingPlacement?.type === "gift" ? "cursor-crosshair" : ""
                }`}
                style={{ backgroundColor: bgColor }}
              >
                {/* Scrollable Container for Undangan Sections */}
                <div
                  ref={scrollContainerRef}
                  onScroll={() => {
                    if (scrollContainerRef.current) {
                      const top = scrollContainerRef.current.scrollTop;
                      const idx = Math.min(
                        sectionsCount - 1,
                        Math.max(0, Math.round(top / 844)),
                      );
                      if (idx !== activeSection) {
                        setActiveSection(idx);
                      }
                    }
                  }}
                  className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div
                    ref={frameRef}
                    key={`preview-frame-${previewKey}`}
                    onPointerMove={handleFramePointerMove}
                    onPointerLeave={handleFramePointerLeave}
                    onClick={handleFrameClick}
                    onDragOver={handleFrameDragOver}
                    onDrop={handleFrameDrop}
                    className={`w-full relative overflow-hidden ${
                      pendingPlacement?.type === "gift"
                        ? "cursor-crosshair"
                        : pendingPlacement
                          ? "cursor-copy"
                          : "cursor-default"
                    }`}
                    style={{ height: `${sectionsCount * 844}px` }}
                  >
                    {/* Background Image Layer */}
                    {bgImage &&
                      (bgImageFixed ? (
                        <div
                          className="sticky top-0 left-0 w-full h-[844px] -mb-[844px] pointer-events-none z-0 transition-all duration-200"
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
                        Array.from({ length: sectionsCount }, (_, index) => (
                          <div
                            key={`section-bg-layer-${index}`}
                            className="absolute left-0 right-0 pointer-events-none z-0 transition-all duration-200 overflow-hidden"
                            style={{
                              top: `${index * 844}px`,
                              height: "844px",
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

                    {/* Section Dividers & Badges in Edit Mode */}
                    {!isPreviewMode && activeMockup === "invitation" && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                        {Array.from({ length: sectionsCount }).map((_, idx) => {
                          const isCurrent = activeSection === idx;
                          return (
                            <div
                              key={`section-guide-${idx}`}
                              className="absolute left-0 right-0"
                              style={{ top: `${idx * 844}px`, height: "844px" }}
                            >
                              {/* Garis batas section untuk section 2 ke atas */}
                              {idx > 0 && (
                                <div className="absolute top-0 left-0 right-0 border-t border-dashed border-amber-500/30 flex items-center justify-center">
                                  <span className="bg-neutral-900/90 text-amber-400/80 border border-amber-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono -translate-y-1/2">
                                    Batas Section {idx + 1}
                                  </span>
                                </div>
                              )}
                              {/* Badge Section Header */}
                              <div className="absolute top-2 right-2 pointer-events-auto">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSection(idx);
                                    scrollToSection(idx);
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-md ${
                                    isCurrent
                                      ? "bg-amber-500 text-neutral-950 ring-1 ring-amber-300"
                                      : "bg-neutral-900/80 text-neutral-400 hover:text-amber-300 border border-white/10"
                                  }`}
                                  title={`Klik untuk fokus ke Section ${idx + 1}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-neutral-950 animate-pulse" : "bg-neutral-500"}`} />
                                  <span>Sec {idx + 1}: {DEFAULT_SECTIONS[idx] || `Section ${idx + 1}`}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Render Elements Undangan Content (CLIPPED BY MOCKUP overflow-hidden) */}
                    {renderMockupElements("invitation", false, "content")}

                    {/* Canva Pink Snapping Guide Lines */}
                    {activeGuideX !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-[1.5px] bg-rose-500 z-50 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                        style={{ left: `${activeGuideX}px` }}
                      >
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-bold shadow-md">
                          Tengah
                        </div>
                      </div>
                    )}
                    {activeGuideY !== null && (
                      <div
                        className="absolute left-0 right-0 h-[1.5px] bg-rose-500 z-50 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                        style={{ top: `${activeGuideY}px` }}
                      >
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-bold shadow-md">
                          Tengah Section
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fixed / Sticky Elements Content Overlay on Mockup (CLIPPED) */}
                {(!isPreviewMode || !isCoverVisible) && (
                  <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                    {renderMockupElements("invitation", true, "content")}
                  </div>
                )}

                {/* UNCLIPPED SELECTION TRANSFORMER OVERLAY (OVERFLOW VISIBLE OUTSIDE MOCKUP) */}
                {!isPreviewMode && (
                  <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
                    {renderMockupElements("invitation", false, "selection")}
                    {renderMockupElements("invitation", true, "selection")}
                  </div>
                )}

                {/* Placement Capture Overlay */}
                {pendingPlacement && (
                  <div
                    className={`absolute inset-0 z-40 ${
                      pendingPlacement.type === "gift" ? "cursor-crosshair" : "cursor-copy"
                    }`}
                    onClick={handleFrameClick}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mockup Cover */}
        {activeMockup === "cover" && (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <MailOpen className="h-3.5 w-3.5 text-amber-400" />
              Tampilan Cover Pembuka (390 × 844 px)
            </span>
            <div
              className="transition-transform duration-200 ease-out relative cursor-default origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div
                className="w-[390px] h-[844px] overflow-hidden relative shadow-2xl"
                style={{ backgroundColor: bgColor || "#09090b" }}
              >
                <div
                  ref={frameRef}
                  onPointerMove={handleFramePointerMove}
                  onPointerLeave={handleFramePointerLeave}
                  onClick={handleFrameClick}
                  onDragOver={handleFrameDragOver}
                  onDrop={handleFrameDrop}
                  className={`w-full h-full relative overflow-hidden ${pendingPlacement ? "cursor-copy" : "cursor-default"}`}
                >
                  {bgImage && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0"
                      style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: (bgImageOpacity ?? 100) / 100,
                        filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                      }}
                    />
                  )}
                  {renderMockupElements("cover", false, "content")}
                </div>

                {!isPreviewMode && (
                  <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
                    {renderMockupElements("cover", false, "selection")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mockup Gift Modal */}
        {activeMockup === "gift-modal" && (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-rose-400" />
              Tampilan Gift Modal (Amplop Digital)
            </span>
            <div
              className="transition-transform duration-200 ease-out relative cursor-default origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div
                className="w-[390px] h-[844px] overflow-hidden relative bg-black/80 backdrop-blur-md flex items-center justify-center p-3 shadow-2xl"
              >
                <div
                  ref={frameRef}
                  onPointerMove={handleFramePointerMove}
                  onPointerLeave={handleFramePointerLeave}
                  onClick={handleFrameClick}
                  onDragOver={handleFrameDragOver}
                  onDrop={handleFrameDrop}
                  className={`w-full h-full relative overflow-hidden bg-neutral-900/95 shadow-2xl ${pendingPlacement ? "cursor-copy" : "cursor-default"}`}
                >
                  <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  {renderMockupElements("gift-modal", false, "content")}
                </div>

                {!isPreviewMode && (
                  <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
                    {renderMockupElements("gift-modal", false, "selection")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL SCREEN PREVIEW MODE OVERLAY */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-foreground overflow-hidden font-sans animate-in fade-in duration-300">
          {/* Hidden File Input for Left Cover Laptop Photo Upload */}
          <input
            ref={laptopFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setLaptopCoverImage(url);
              }
            }}
          />

          {/* Top Bar / Header */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-amber-500/20 bg-neutral-900/90 px-4 md:px-6 backdrop-blur-md z-30">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 border border-neutral-700 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 text-amber-400" />
                <span>Kembali ke Editor</span>
              </button>

              <div className="flex items-center gap-2 border-l border-neutral-800 pl-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="text-xs font-bold text-amber-300">
                  Preview Interaktif Undangan (390 × 844 px)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGiftModalOpen(!isGiftModalOpen)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Buka / Tutup Digital Wallet Modal"
              >
                <Gift className="h-3.5 w-3.5 text-rose-400" />
                <span>{isGiftModalOpen ? "Tutup Gift Modal" : "Buka Gift Modal"}</span>
              </button>

              <button
                type="button"
                onClick={handleRestartPreview}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Mulai ulang alur simulasi dari Cover Pembuka"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart Animasi</span>
              </button>
            </div>
          </header>

          {/* Main Content Area (Split-Screen View for Laptop/Desktop) */}
          <div className="flex flex-1 overflow-hidden w-full h-full relative">
            {/* LEFT PANEL: Cover Laptop (Full remaining width, NO empty room) */}
            <div className="hidden lg:flex flex-1 h-full relative flex-col justify-between overflow-hidden border-r border-amber-500/20 bg-neutral-950 p-8 select-none">
              {/* Cover Laptop Photo Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${laptopCoverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"})`,
                  filter: "brightness(0.85) contrast(1.05)",
                }}
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />

              {/* Top Bar inside Cover Laptop */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 border border-amber-500/30">
                  <Smartphone className="h-3.5 w-3.5 text-amber-400 rotate-90" />
                  <span className="text-xs font-semibold text-amber-300 tracking-wide uppercase">Cover Laptop</span>
                </div>

                <button
                  type="button"
                  onClick={() => laptopFileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-full bg-black/75 hover:bg-black/95 text-amber-300 border border-amber-500/40 px-4 py-2 text-xs font-semibold backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl"
                  title="Ganti foto latar belakang Cover Laptop"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Ganti Foto Cover Laptop</span>
                </button>
              </div>

              {/* Center Archway & Couple Title (Matching reference photo vibe) */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-8 rounded-3xl bg-black/50 backdrop-blur-md border border-amber-500/30 max-w-xl shadow-2xl space-y-4">
                  <span className="text-xs uppercase font-bold tracking-[0.3em] text-amber-300/90 font-serif">
                    WE'RE GETTING MARRIED
                  </span>
                  <h1 className="text-4xl md:text-6xl font-serif text-amber-100 font-bold tracking-wide leading-tight drop-shadow-lg">
                    Romeo & Juliet
                  </h1>
                  <p className="text-sm font-sans text-amber-200/80 tracking-widest uppercase">
                    Minggu, 20 September 2026
                  </p>
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto pt-1" />
                </div>
              </div>

              {/* Bottom Copyright Footer matching user reference image */}
              <div className="relative z-10 text-center pt-3 border-t border-white/10 backdrop-blur-sm bg-black/50 rounded-2xl py-2.5 px-4 max-w-xl mx-auto">
                <p className="text-[11px] font-sans text-neutral-300/90 tracking-wide flex items-center justify-center gap-1.5">
                  <span>Copyright © 2026 by</span>
                  <span className="font-bold text-amber-300">sajijanji.co</span>.
                  <span>This invitation saves paper and reduces carbon footprint 🌱</span>
                </p>
              </div>
            </div>

            {/* RIGHT PANEL: Interactive Phone Preview Container (Proportional real mobile scaling, NO empty room) */}
            <div
              ref={previewWrapperRef}
              className="w-full lg:w-[420px] xl:w-[450px] h-full flex-1 lg:flex-none flex items-center justify-center bg-neutral-950 lg:border-l border-amber-500/20 relative overflow-hidden"
            >
              <div
                className="w-full h-full overflow-hidden bg-neutral-950 flex flex-col relative shadow-2xl items-center"
                style={{ backgroundColor: bgColor || "#09090b" }}
              >
                {/* Scrollable Container for Undangan Sections */}
                <div
                  ref={previewScrollContainerRef}
                  onScroll={() => {
                    if (previewScrollContainerRef.current) {
                      const top = previewScrollContainerRef.current.scrollTop;
                      const scaledHeight = 844 * previewScale;
                      const idx = Math.min(
                        sectionsCount - 1,
                        Math.max(0, Math.round(top / scaledHeight)),
                      );
                      if (idx !== activeSection) {
                        setActiveSection(idx);
                      }
                    }
                  }}
                  className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                  <div
                    className="w-[390px] relative origin-top transition-transform duration-75 mx-auto"
                    style={{
                      transform: `scale(${previewScale})`,
                      height: `${sectionsCount * 844 * previewScale}px`,
                      marginBottom: `${sectionsCount * 844 * (previewScale - 1)}px`,
                    }}
                  >
                    <div
                      key={`preview-frame-mode-${previewKey}`}
                      className="w-[390px] relative overflow-hidden"
                      style={{ height: `${sectionsCount * 844}px` }}
                    >
                    {/* Background Image Layer */}
                    {bgImage &&
                      (bgImageFixed ? (
                        <div
                          className="sticky top-0 left-0 w-full h-[844px] -mb-[844px] pointer-events-none z-0 transition-all duration-200"
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
                            backgroundRepeat: bgImageFit === "repeat" ? "repeat" : "no-repeat",
                            opacity: (bgImageOpacity ?? 100) / 100,
                            filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                          }}
                        />
                      ) : bgImageFit === "cover" ? (
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
                        Array.from({ length: sectionsCount }, (_, index) => (
                          <div
                            key={`section-bg-preview-${index}`}
                            className="absolute left-0 right-0 pointer-events-none z-0 transition-all duration-200 overflow-hidden"
                            style={{
                              top: `${index * 844}px`,
                              height: "844px",
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
                              backgroundRepeat: bgImageFit === "repeat" ? "repeat" : "no-repeat",
                              opacity: (bgImageOpacity ?? 100) / 100,
                              filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                            }}
                          />
                        ))
                      ))}

                    {/* Render In-Flow Undangan Elements */}
                    {renderMockupElements("invitation", false)}
                  </div>
                </div>
              </div>

                {/* Sticky Circular Buttons Overlay (Only when cover is opened) */}
                {!isCoverVisible && (
                  <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                    {renderMockupElements("invitation", true)}

                    {/* Default Sticky Gift Button if user hasn't created a custom fixed gift element */}
                    {!elements.some((el) => el.positionMode === "fixed" && el.buttonAction === "gift-modal") && (
                      <button
                        type="button"
                        onClick={() => setIsGiftModalOpen(true)}
                        className="absolute bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xl flex items-center justify-center border-2 border-amber-300 pointer-events-auto hover:scale-110 active:scale-95 transition-all animate-pulse"
                        title="Amplop Digital / Gift"
                      >
                        <Gift className="h-6 w-6 text-white" />
                      </button>
                    )}

                    {/* Default Sticky Music Button if user hasn't created a custom fixed music element */}
                    {!elements.some((el) => el.positionMode === "fixed" && el.buttonAction === "toggle-music") && (
                      <button
                        type="button"
                        onClick={toggleMusic}
                        className={`absolute bottom-6 left-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl flex items-center justify-center border-2 border-emerald-300 pointer-events-auto hover:scale-110 active:scale-95 transition-all ${
                          isMusicPlaying ? "animate-spin [animation-duration:4s]" : "opacity-80"
                        }`}
                        title={isMusicPlaying ? "Matikan Musik" : "Putar Musik"}
                      >
                        <Music className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>
                )}

                {/* Preview Mode Cover Overlay - Slide Up Animation */}
                <div
                  className={`absolute inset-0 z-40 w-full h-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isCoverVisible
                      ? "translate-y-0 opacity-100 pointer-events-auto"
                      : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                  style={{ backgroundColor: bgColor || "#09090b" }}
                >
                  {bgImage && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0"
                      style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: (bgImageOpacity ?? 100) / 100,
                        filter: bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : undefined,
                      }}
                    />
                  )}
                  {elements
                    .filter(
                      (el) =>
                        !el.parentId &&
                        el.mockupType === "cover" &&
                        layers.find((l) => l.id === el.id)?.visible !== false,
                    )
                    .sort(
                      (a, b) =>
                        layers.findIndex((layer) => layer.id === a.id) -
                        layers.findIndex((layer) => layer.id === b.id),
                    )
                    .map((el) => (
                      <div
                        key={el.id}
                        style={{
                          top: el.top,
                          left: el.left,
                          width: el.width,
                          height: el.height,
                          opacity: el.opacity,
                          position: el.positionMode ?? "absolute",
                        }}
                        className={el.type === "button" ? "pointer-events-auto z-20" : "pointer-events-none"}
                      >
                        {el.type === "button" ? (
                          <div className="w-full h-full">
                            <OpenInvitationButton
                              text={typeof el.buttonText === "string" ? el.buttonText : (el.content || "Buka Undangan")}
                              icon={el.buttonIcon || "mail"}
                              variant={el.buttonVariant || "gold-luxury"}
                              pulse={el.buttonPulse ?? true}
                              className={el.style}
                              customCode={el.buttonCustomCode}
                              bgType={el.buttonBgType}
                              bgColor={el.buttonBgColor}
                              bgGradientEnd={el.buttonBgGradientEnd}
                              textColor={el.buttonTextColor}
                              borderColor={el.buttonBorderColor}
                              borderWidth={el.buttonBorderWidth}
                              borderRadius={el.buttonBorderRadius}
                              shape={el.buttonShape}
                              fontFamily={el.buttonFontFamily}
                              fontSize={el.buttonFontSize}
                              fontWeight={el.buttonFontWeight}
                              letterSpacing={el.buttonLetterSpacing}
                              textTransform={el.buttonTextTransform}
                              shadow={el.buttonShadow}
                              onClick={() => handleOpenInvitationFromCover(el.buttonTargetSection ?? 0)}
                            />
                          </div>
                        ) : (
                          renderElement(el)
                        )}
                      </div>
                    ))}
                </div>

                {/* Preview Mode Gift Modal Overlay */}
                {isGiftModalOpen && (
                  <div
                    className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black/80 px-4 backdrop-blur-md"
                    onClick={() => setIsGiftModalOpen(false)}
                  >
                    <div
                      className="w-full h-[580px] max-h-[90%] rounded-3xl border border-amber-500/30 bg-neutral-900/95 shadow-2xl relative overflow-hidden p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {elements
                        .filter(
                          (el) =>
                            !el.parentId &&
                            el.mockupType === "gift-modal" &&
                            layers.find((l) => l.id === el.id)?.visible !== false,
                        )
                        .map((el) => (
                          <div
                            key={el.id}
                            style={{
                              top: el.top,
                              left: el.left,
                              width: el.width,
                              height: el.height,
                              opacity: el.opacity,
                              position: el.positionMode ?? "absolute",
                            }}
                            className={el.type === "button" ? "pointer-events-auto" : "pointer-events-none"}
                          >
                            {el.type === "button" ? (
                              <div className="w-full h-full">
                                <OpenInvitationButton
                                  text={typeof el.buttonText === "string" ? el.buttonText : (el.content || "Tutup")}
                                  icon={el.buttonIcon || "none"}
                                  variant={el.buttonVariant || "minimal-outline"}
                                  pulse={false}
                                  className={el.style}
                                  customCode={el.buttonCustomCode}
                                  bgType={el.buttonBgType}
                                  bgColor={el.buttonBgColor}
                                  bgGradientEnd={el.buttonBgGradientEnd}
                                  textColor={el.buttonTextColor}
                                  borderColor={el.buttonBorderColor}
                                  borderWidth={el.buttonBorderWidth}
                                  borderRadius={el.buttonBorderRadius}
                                  shape={el.buttonShape}
                                  fontFamily={el.buttonFontFamily}
                                  fontSize={el.buttonFontSize}
                                  fontWeight={el.buttonFontWeight}
                                  letterSpacing={el.buttonLetterSpacing}
                                  textTransform={el.buttonTextTransform}
                                  shadow={el.buttonShadow}
                                  onClick={() => setIsGiftModalOpen(false)}
                                />
                              </div>
                            ) : (
                              renderElement(el)
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
