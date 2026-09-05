"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import TloatingToolbarControls from "@/components/editor/tloating-toolbar-controls";
import WindSwayImage from "@/components/editor/WindSwayImage";
import {
  useEditorStore,
  type CanvasElementType,
  type ShapeType,
} from "@/store/useEditorStore";

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
  const selectedContainer = elements.find(
    (element) =>
      element.id === selectedElementId && element.type === "container",
  );
  const frameRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedElementId
      ) {
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        event.preventDefault();
        const element = elements.find((item) => item.id === selectedElementId);
        const animation = element?.animation?.unmount ?? "none";
        const targetElement = frameRef.current?.querySelector<HTMLElement>(
          `[data-element-id="${selectedElementId}"]`,
        );
        if (targetElement && animation !== "none") {
          const offset = {
            "fade-up": { x: 0, y: -24 },
            "fade-right": { x: 24, y: 0 },
            "fade-down": { x: 0, y: 24 },
            "fade-left": { x: -24, y: 0 },
            "fade-in": { x: 0, y: 0 },
            "fade-out": { x: 0, y: 0 },
            "wind-sway": { x: 0, y: 0 },
            none: { x: 0, y: 0 },
          }[animation];
          gsap.set(targetElement, { x: 0, y: 0, opacity: 1 });
          gsap.to(targetElement, {
            ...offset,
            opacity: 0,
            duration: 0.45,
            ease: "power2.in",
            onComplete: () => deleteElement(selectedElementId),
          });
        } else {
          deleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteElement, elements, selectedElementId]);

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const drag = dragRef.current;
      const frame = frameRef.current?.getBoundingClientRect();
      if (!drag || !frame) return;
      const deltaX = ((event.clientX - drag.startX) / frame.width) * 100;
      const deltaY = ((event.clientY - drag.startY) / frame.height) * 100;
      if (drag.mode === "move") {
        updateElement(drag.id, {
          left: `${Math.max(0, Math.min(100, drag.left + deltaX))}%`,
          top: `${Math.max(0, Math.min(100, drag.top + deltaY))}%`,
        });
      } else {
        updateElement(drag.id, {
          width: Math.max(24, drag.width + (deltaX / 100) * frame.width),
          height: Math.max(24, drag.height + (deltaY / 100) * frame.height),
        });
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

  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const context = gsap.context(() => {
      elementsRef.current.forEach((element) => {
        const target = frameRef.current?.querySelector<HTMLElement>(
          `[data-element-id="${element.id}"]`,
        );
        const animation = element.animation;
        if (!target || !animation) return;

        gsap.killTweensOf(target);
        const direction = {
          "fade-up": { x: 0, y: 24 },
          "fade-right": { x: -24, y: 0 },
          "fade-down": { x: 0, y: -24 },
          "fade-left": { x: 24, y: 0 },
          "fade-in": { x: 0, y: 0 },
          "fade-out": { x: 0, y: 0 },
          "wind-sway": { x: 0, y: 0 },
          none: { x: 0, y: 0 },
        }[animation.mount];
        const mountIsFadeOut = animation.mount === "fade-out";
        gsap.set(target, {
          x: direction.x,
          y: direction.y,
          opacity: animation.mount === "none" ? 1 : mountIsFadeOut ? 1 : 0,
        });
        if (animation.mount !== "none") {
          gsap.to(target, {
            x: 0,
            y: 0,
            opacity: mountIsFadeOut ? 0 : 1,
            duration: 0.6,
            ease: "power2.out",
          });
        }

        if (animation.loop !== "none") {
          const loopOffset = {
            "fade-up": { y: -8 },
            "fade-right": { x: 8 },
            "fade-down": { y: 8 },
            "fade-left": { x: -8 },
            "fade-in": { opacity: 0.35 },
            "fade-out": { opacity: 0.35 },
            "wind-sway": {},
            none: {},
          }[animation.loop];
          gsap.to(target, {
            ...loopOffset,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });
    }, frameRef);
    return () => context.revert();
  }, [animationKey]);

  const handleCanvasClick = () => {
    setActiveTool("cursor");
    selectElement(null);
  };

  const handleAddImage = (file: File) => {
    if (!selectedContainer) return;
    addElement("image", { content: URL.createObjectURL(file) });
  };

  const handleAddShape = (shape: ShapeType) => {
    if (!selectedContainer) return;
    addElement("shape", { shape, name: `${shape} shape` });
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
    if (
      !element ||
      layer?.locked ||
      (mode === "move" && element.positionMode === "relative")
    )
      return;
    if (mode === "move" && !isPointerNearEdge(event, event.currentTarget))
      return;
    event.stopPropagation();
    event.preventDefault();
    selectElement(id);
    dragRef.current = {
      id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      left: parseFloat(element.left),
      top: parseFloat(element.top),
      width: element.width,
      height: element.height,
    };
  };

  const isPointerNearEdge = (
    event: PointerEvent<HTMLDivElement>,
    target: HTMLDivElement,
  ) => {
    const bounds = target.getBoundingClientRect();
    const edgeDistance = 10;
    return (
      event.clientX - bounds.left <= edgeDistance ||
      bounds.right - event.clientX <= edgeDistance ||
      event.clientY - bounds.top <= edgeDistance ||
      bounds.bottom - event.clientY <= edgeDistance
    );
  };

  const updateEdgeCursor = (
    event: PointerEvent<HTMLDivElement>,
    element: (typeof elements)[number],
  ) => {
    if (
      selectedElementId !== element.id ||
      element.positionMode === "relative"
    ) {
      event.currentTarget.style.cursor = "default";
      return;
    }
    event.currentTarget.style.cursor = isPointerNearEdge(
      event,
      event.currentTarget,
    )
      ? "move"
      : "default";
  };

  const renderElement = (el: (typeof elements)[number], fitContent = false) => {
    if (el.type === "container") return null;
    return (
      <div
        className="relative"
        style={{
          width: fitContent ? "max-content" : el.width,
          height: fitContent ? "max-content" : el.height,
          opacity: el.opacity,
        }}
      >
        {el.type === "text" && (
          <p
            className={`${el.style} ${fitContent ? "leading-none whitespace-nowrap" : "h-full w-full"}`}
            style={{
              fontSize: el.fontSize,
              color: el.color,
              fontWeight: el.fontWeight,
              textAlign: el.textAlign,
            }}
          >
            {el.content}
          </p>
        )}
        {el.type === "image" &&
          (el.animation?.loop === "wind-sway" ? (
            <WindSwayImage
              src={el.content}
              alt="Element"
              className={`${el.style} h-full w-full`}
              objectFit={el.objectFit}
              borderRadius={el.borderRadius}
            />
          ) : (
            <img
              src={el.content}
              alt="Element"
              className={`${el.style} h-full w-full`}
              style={{ objectFit: el.objectFit, borderRadius: el.borderRadius }}
            />
          ))}
        {el.type === "shape" && (
          <div className={el.style} aria-label={el.shape} />
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
      opacity: element.opacity,
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
    } as CSSProperties;

    return (
      <div
        key={element.id}
        data-element-id={element.id}
        className={`relative cursor-pointer rounded-lg ${selectedElementId === element.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-primary/50"}`}
        style={elementStyle}
        onClick={(event) => {
          event.stopPropagation();
          selectElement(parentId);
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          selectElement(element.id);
        }}
        onPointerDown={(event) => startElementDrag(event, element.id, "move")}
        onPointerMove={(event) => updateEdgeCursor(event, element)}
        onPointerLeave={(event) => {
          event.currentTarget.style.cursor = "default";
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
        {selectedElementId === element.id && (
          <div
            className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-background bg-primary"
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

      <TloatingToolbarControls
        zoom={zoom}
        activeTool={activeTool}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onAddText={() => {
          if (selectedContainer) addElement("text");
        }}
        onAddImage={handleAddImage}
        onAddShape={handleAddShape}
        onAddContainer={handleAddContainer}
        canAddElements={isMounted && Boolean(selectedContainer)}
        onSelectCursor={() => setActiveTool("cursor")}
      />

      {/* Frame Mobile Undangan */}
      <div
        className={`transition-transform duration-200 ease-out relative ${
          activeTool === "cursor" ? "cursor-default" : "cursor-default"
        }`}
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {/* Mockup Frame Undangan (Mobile Aspect Ratio 9:16) */}
        <div
          className="w-[360px] h-[720px] border border-border/60 rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden relative border-amber-500/20"
          style={{ backgroundColor: bgColor }}
        >
          {/* Header Bar Mockup */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black backdrop-blur-xs z-20 flex items-center justify-between px-4">
            <span className="text-[10px] text-muted-foreground font-mono">
              09:41
            </span>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
            </div>
          </div>

          {/* Canvas Render Elements */}
          <div ref={frameRef} className="w-full h-full relative pt-8 p-4">
            {elements
              .filter((element) => !element.parentId)
              .sort(
                (a, b) =>
                  layers.findIndex((layer) => layer.id === a.id) -
                  layers.findIndex((layer) => layer.id === b.id),
              )
              .map((el) => {
                const isSelected = selectedElementId === el.id;
                const layer = layers.find((item) => item.id === el.id);

                if (layer?.visible === false) return null;

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectElement(el.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      selectElement(el.id);
                    }}
                    onPointerDown={(e) => startElementDrag(e, el.id, "move")}
                    onPointerMove={(e) => updateEdgeCursor(e, el)}
                    onPointerLeave={(e) => {
                      e.currentTarget.style.cursor = "default";
                    }}
                    className={`cursor-pointer transition-all rounded-lg ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "hover:ring-1 hover:ring-primary/50"
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
                      opacity: el.opacity,
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
                    <div className="contents">
                      {elements
                        .filter((child) => child.parentId === el.id)
                        .map((child) => renderNestedElement(child, el.id))}
                    </div>

                    {/* Handles Bounding Box ala Figma saat di-select */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-primary rounded-xs border border-background" />
                        <div className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-primary rounded-xs border border-background" />
                        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary rounded-xs border border-background" />
                        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary rounded-xs border border-background" />
                        <div
                          className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-sm border border-background bg-primary"
                          onPointerDown={(e) =>
                            startElementDrag(e, el.id, "resize")
                          }
                        />
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
