import { create } from "zustand";

export type SidebarTab = "templates" | "layers";
export type CanvasTool = "cursor" | "text" | "image" | "shape" | "button";
export type CanvasElementType = "container" | "text" | "image" | "shape" | "button";
export type ShapeType = "line" | "circle" | "square" | "triangle" | "star";
export type ContainerSizeMode = "fit" | "custom" | "full";
export type ContainerDisplay = "block" | "flex" | "grid";
export type ButtonVariantType =
  | "gold-luxury"
  | "glassmorphism"
  | "pulse-glow"
  | "rose-romantic"
  | "minimal-outline";
export type ButtonIconType =
  | "mail"
  | "mail-open"
  | "heart"
  | "sparkles"
  | "music"
  | "chevron-down"
  | "none";
export type ButtonActionType = "scroll-to-section" | "url";
export type AnimationName =
  | "none"
  | "fade-up"
  | "fade-right"
  | "fade-down"
  | "fade-left"
  | "fade-in"
  | "fade-out"
  | "spring-pop"
  | "bounce-drop"
  | "pendulum-swing"
  | "magnetic-pull"
  | "zoom-blur"
  | "float-rise"
  | "spring-collapse"
  | "drop-fade"
  | "pendulum-exit"
  | "zoom-out-warp"
  | "wind-sway";

export type TextEffectType =
  | "none"
  | "typewriter"
  | "stagger-chars"
  | "stagger-words"
  | "shimmer-gold"
  | "wave-float"
  | "blur-reveal"
  | "neon-pulse";

export interface ElementAnimationConfig {
  mount: AnimationName;
  unmount: AnimationName;
  loop: AnimationName;
}

export interface EditorCanvasElement {
  id: string;
  type: CanvasElementType;
  content: string;
  style: string;
  top: string;
  left: string;
  transform?: string;
  shape?: ShapeType;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  opacity?: number;
  fontWeight?: "normal" | "bold";
  textAlign?: "left" | "center" | "right";
  objectFit?: "cover" | "contain" | "fill";
  borderRadius?: number;
  parentId?: string;
  positionMode?: "relative" | "absolute" | "fixed" | "sticky";
  widthSizeMode?: ContainerSizeMode;
  heightSizeMode?: ContainerSizeMode;
  display?: ContainerDisplay;
  flexDirection?: "row" | "column";
  justifyContent?:
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  gridColumns?: number;
  gridRows?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  gap?: number;
  flipX?: boolean;
  flipY?: boolean;
  textEffect?: TextEffectType;
  buttonText?: string;
  buttonIcon?: ButtonIconType;
  buttonVariant?: ButtonVariantType;
  buttonAction?: ButtonActionType;
  buttonTargetSection?: number;
  buttonPulse?: boolean;
  buttonUrl?: string;
  animation?: ElementAnimationConfig;
}

export interface EditorLayer {
  id: string;
  name: string;
  type: CanvasElementType;
  visible: boolean;
  locked: boolean;
}

interface EditorState {
  activeTab: SidebarTab;
  selectedElementId: string | null;
  activeTool: CanvasTool;
  zoom: number;
  searchQuery: string;
  elements: EditorCanvasElement[];
  layers: EditorLayer[];
  fontSize: number[];
  opacity: number[];
  fontFamily: string;
  textColor: string;
  bgColor: string;
  bgImage: string | null;
  bgImageFit: "cover" | "contain" | "repeat" | "section-cover" | "custom";
  bgImageOpacity: number;
  bgImageBlur: number;
  bgImagePosX: number; // 0% - 100%
  bgImagePosY: number; // 0% - 100%
  bgImageScale: number; // 20% - 300%
  bgImageFixed: boolean; // Parallax / Sticky to viewport
  pendingImageFile: File | null;
  setActiveTab: (tab: SidebarTab) => void;
  selectElement: (id: string | null) => void;
  setActiveTool: (tool: CanvasTool) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSearchQuery: (query: string) => void;
  setBgColor: (value: string) => void;
  setBgImage: (value: string | null) => void;
  setBgImageFit: (
    value: "cover" | "contain" | "repeat" | "section-cover" | "custom",
  ) => void;
  setBgImageOpacity: (value: number) => void;
  setBgImageBlur: (value: number) => void;
  setBgImagePosX: (value: number) => void;
  setBgImagePosY: (value: number) => void;
  setBgImageScale: (value: number) => void;
  setBgImageFixed: (value: boolean) => void;
  addElement: (
    type: CanvasElementType,
    options?: {
      content?: string;
      style?: string;
      name?: string;
      shape?: ShapeType;
      position?: { top: string; left: string };
      width?: number;
      height?: number;
      parentId?: string;
      positionMode?: "relative" | "absolute" | "fixed" | "sticky";
      flipX?: boolean;
      flipY?: boolean;
      buttonText?: string;
      buttonIcon?: ButtonIconType;
      buttonVariant?: ButtonVariantType;
      buttonAction?: ButtonActionType;
      buttonTargetSection?: number;
      buttonPulse?: boolean;
      buttonUrl?: string;
    },
  ) => void;
  addOpenInvitationButton: (sectionIndex?: number) => void;
  addOpeningSectionLayout: () => void;
  addContainer: () => void;
  updateElement: (id: string, updates: Partial<EditorCanvasElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (
    id: string,
    options?: { mirrorHorizontal?: boolean; mirrorVertical?: boolean },
  ) => void;
  flipElementHorizontal: (id: string) => void;
  flipElementVertical: (id: string) => void;
  moveLayer: (id: string, targetId: string, asChild?: boolean) => void;
  setPendingImageFile: (file: File | null) => void;
  setFontSize: (value: number[]) => void;
  setOpacity: (value: number[]) => void;
  setFontFamily: (value: string) => void;
  setTextColor: (value: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  sectionsCount: number;
  addSection: () => void;
  removeSection: () => void;
  setSectionsCount: (count: number) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  togglePreviewMode: () => void;
}

const initialElements: EditorCanvasElement[] = [];
const initialLayers: EditorLayer[] = [];

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: "templates",
  selectedElementId: null,
  activeTool: "cursor",
  zoom: 100,
  searchQuery: "",
  elements: initialElements,
  layers: initialLayers,
  sectionsCount: 3,
  isPreviewMode: false,
  fontSize: [24],
  opacity: [100],
  fontFamily: "caveat",
  textColor: "#fcd34d",
  bgColor: "#ffffff",
  bgImage: null,
  bgImageFit: "cover",
  bgImageOpacity: 100,
  bgImageBlur: 0,
  bgImagePosX: 50,
  bgImagePosY: 50,
  bgImageScale: 100,
  bgImageFixed: false,
  pendingImageFile: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  selectElement: (selectedElementId) => set({ selectedElementId }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 50), 150) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 10, 150) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 10, 50) })),
  resetZoom: () => set({ zoom: 100 }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsPreviewMode: (isPreviewMode) =>
    set({
      isPreviewMode,
      selectedElementId: isPreviewMode ? null : undefined,
    }),
  togglePreviewMode: () =>
    set((state) => ({
      isPreviewMode: !state.isPreviewMode,
      selectedElementId: !state.isPreviewMode ? null : state.selectedElementId,
    })),
  addSection: () =>
    set((state) => ({ sectionsCount: Math.min(10, state.sectionsCount + 1) })),
  removeSection: () =>
    set((state) => ({ sectionsCount: Math.max(1, state.sectionsCount - 1) })),
  setSectionsCount: (sectionsCount) =>
    set({ sectionsCount: Math.max(1, Math.min(10, sectionsCount)) }),
  addOpeningSectionLayout: () =>
    set((state) => {
      const now = Date.now();
      const titleId = `text-sub-${now}`;
      const nameId = `text-couple-${now + 1}`;
      const dateId = `text-date-${now + 2}`;
      const guestBoxId = `container-guest-${now + 3}`;
      const guestLabelId = `text-guest-lbl-${now + 4}`;
      const guestNameId = `text-guest-name-${now + 5}`;
      const btnId = `button-open-${now + 6}`;

      const newElements: EditorCanvasElement[] = [
        {
          id: titleId,
          type: "text",
          content: "THE WEDDING OF",
          style: "font-sans tracking-[0.25em] font-semibold text-center uppercase",
          top: "14%",
          left: "5%",
          width: 324,
          height: 30,
          fontSize: 12,
          color: "#fcd34d",
          opacity: 1,
          fontWeight: "bold",
          textAlign: "center",
          textEffect: "shimmer-gold",
          animation: { mount: "fade-down", unmount: "none", loop: "none" },
        },
        {
          id: nameId,
          type: "text",
          content: "Romeo & Juliet",
          style: "font-serif text-center font-bold",
          top: "20%",
          left: "5%",
          width: 324,
          height: 60,
          fontSize: 34,
          color: "#ffffff",
          opacity: 1,
          fontWeight: "bold",
          textAlign: "center",
          textEffect: "blur-reveal",
          animation: { mount: "zoom-blur", unmount: "none", loop: "none" },
        },
        {
          id: dateId,
          type: "text",
          content: "Minggu, 20 Oktober 2026",
          style: "font-sans text-center text-xs tracking-wider",
          top: "30%",
          left: "5%",
          width: 324,
          height: 28,
          fontSize: 13,
          color: "#e4e4e7",
          opacity: 1,
          fontWeight: "normal",
          textAlign: "center",
          animation: { mount: "fade-in", unmount: "none", loop: "none" },
        },
        {
          id: guestBoxId,
          type: "container",
          content: "",
          style: "bg-black/40 border border-amber-400/30 backdrop-blur-md rounded-2xl shadow-xl",
          top: "46%",
          left: "8%",
          width: 302,
          height: 110,
          opacity: 1,
          positionMode: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 12,
          paddingRight: 12,
          gap: 4,
          animation: { mount: "fade-up", unmount: "none", loop: "none" },
        },
        {
          id: guestLabelId,
          parentId: guestBoxId,
          type: "text",
          content: "Kepada Yth. Bapak/Ibu/Saudara/i:",
          style: "font-sans text-center",
          top: "0%",
          left: "0%",
          width: 260,
          height: 24,
          fontSize: 11,
          color: "#a1a1aa",
          positionMode: "relative",
          opacity: 1,
          textAlign: "center",
          animation: { mount: "none", unmount: "none", loop: "none" },
        },
        {
          id: guestNameId,
          parentId: guestBoxId,
          type: "text",
          content: "Tamu Undangan Terhormat",
          style: "font-sans font-bold text-center tracking-wide",
          top: "0%",
          left: "0%",
          width: 260,
          height: 32,
          fontSize: 16,
          color: "#fcd34d",
          positionMode: "relative",
          opacity: 1,
          fontWeight: "bold",
          textAlign: "center",
          animation: { mount: "none", unmount: "none", loop: "none" },
        },
        {
          id: btnId,
          type: "button",
          content: "Buka Undangan",
          buttonText: "Buka Undangan",
          buttonIcon: "mail",
          buttonVariant: "gold-luxury",
          buttonAction: "scroll-to-section",
          buttonTargetSection: 1, // Mengarah langsung ke Section 2 (Cover Utama & Nama Mempelai)
          buttonPulse: true,
          style: "",
          top: "68%",
          left: "15%",
          width: 252,
          height: 50,
          opacity: 1,
          positionMode: "absolute",
          borderRadius: 9999,
          animation: { mount: "spring-pop", unmount: "none", loop: "none" },
        },
      ];

      const newLayers: EditorLayer[] = [
        { id: titleId, name: "Sub-judul Cover", type: "text", visible: true, locked: false },
        { id: nameId, name: "Nama Mempelai Pembuka", type: "text", visible: true, locked: false },
        { id: dateId, name: "Tanggal Acara", type: "text", visible: true, locked: false },
        { id: guestBoxId, name: "Box Penerima Tamu", type: "container", visible: true, locked: false },
        { id: guestLabelId, name: "Label Kepada Yth.", type: "text", visible: true, locked: false },
        { id: guestNameId, name: "Nama Tamu Undangan", type: "text", visible: true, locked: false },
        { id: btnId, name: "Tombol Buka Undangan", type: "button", visible: true, locked: false },
      ];

      return {
        elements: [...state.elements, ...newElements],
        layers: [...state.layers, ...newLayers],
        selectedElementId: btnId,
      };
    }),
  addOpenInvitationButton: (sectionIndex = 0) =>
    set((state) => {
      const id = `button-open-invitation-${Date.now()}`;
      const targetTop =
        sectionIndex === 0
          ? "75%"
          : `${sectionIndex * 720 + 520}px`;
      const newButton: EditorCanvasElement = {
        id,
        type: "button",
        content: "Buka Undangan",
        buttonText: "Buka Undangan",
        buttonIcon: "mail",
        buttonVariant: "gold-luxury",
        buttonAction: "scroll-to-section",
        buttonTargetSection: Math.min(sectionIndex + 1, Math.max(1, state.sectionsCount - 1)),
        buttonPulse: true,
        style: "",
        top: targetTop,
        left: "17%",
        width: 236,
        height: 48,
        opacity: 1,
        positionMode: "absolute",
        borderRadius: 9999,
        flipX: false,
        flipY: false,
        animation: {
          mount: "spring-pop",
          unmount: "none",
          loop: "none",
        },
      };

      return {
        elements: [...state.elements, newButton],
        layers: [
          ...state.layers,
          {
            id,
            name: "Tombol Buka Undangan",
            type: "button",
            visible: true,
            locked: false,
          },
        ],
        selectedElementId: id,
      };
    }),
  addElement: (type, options = {}) =>
    set((state) => {
      const id = `layer-${Date.now() + 1}`;
      const position = options.position;
      const selectedContainer = state.elements.find(
        (element) =>
          element.id === state.selectedElementId &&
          element.type === "container",
      );
      const defaultShapeStyle =
        options.shape === "line"
          ? "h-0.5 w-32 bg-amber-300"
          : options.shape === "circle"
            ? "h-24 w-24 rounded-full border-2 border-amber-300/80 bg-amber-300/30"
            : options.shape === "triangle"
              ? "h-0 w-0 border-x-[48px] border-b-[84px] border-x-transparent border-b-amber-300/70"
              : options.shape === "star"
                ? "h-24 w-24 bg-amber-300/70 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_100%,50%_73%,21%_100%,32%_57%,2%_35%,39%_35%)]"
                : "h-24 w-24 rounded-xl border-2 border-amber-300/80 bg-amber-300/30";
      const isBtn = type === "button";
      const newElement: EditorCanvasElement = {
        id,
        type,
        content:
          options.content ??
          (type === "text"
            ? "Teks baru"
            : isBtn
              ? options.buttonText ?? "Buka Undangan"
              : ""),
        style:
          options.style ??
          (type === "text"
            ? "font-sans text-xl text-foreground text-center font-bold"
            : type === "image"
              ? "h-48 w-40 rounded-xl border border-amber-500/20 object-cover shadow-xl"
              : isBtn
                ? ""
                : defaultShapeStyle),
        top: position?.top ?? (selectedContainer ? "0%" : isBtn ? "75%" : "10%"),
        left: position?.left ?? (selectedContainer ? "0%" : isBtn ? "18%" : "10%"),
        shape: options.shape,
        parentId: options.parentId ?? selectedContainer?.id,
        positionMode:
          options.positionMode ?? (selectedContainer ? "relative" : "absolute"),
        width:
          options.width ??
          (type === "image" ? 160 : type === "text" ? 180 : isBtn ? 230 : 96),
        height:
          options.height ??
          (type === "image" ? 192 : type === "text" ? 44 : isBtn ? 48 : 96),
        fontSize: type === "text" ? 20 : undefined,
        color: type === "text" ? "#fcd34d" : undefined,
        opacity: 1,
        fontWeight: type === "text" ? "bold" : undefined,
        textAlign: type === "text" ? "center" : undefined,
        objectFit: type === "image" ? "contain" : undefined,
        borderRadius: isBtn ? 9999 : 0,
        flipX: options.flipX ?? false,
        flipY: options.flipY ?? false,
        buttonText: isBtn ? options.buttonText ?? "Buka Undangan" : undefined,
        buttonIcon: isBtn ? options.buttonIcon ?? "mail" : undefined,
        buttonVariant: isBtn ? options.buttonVariant ?? "gold-luxury" : undefined,
        buttonAction: isBtn ? options.buttonAction ?? "scroll-to-section" : undefined,
        buttonTargetSection: isBtn ? options.buttonTargetSection ?? 1 : undefined,
        buttonPulse: isBtn ? options.buttonPulse ?? true : undefined,
        buttonUrl: isBtn ? options.buttonUrl : undefined,
        animation: {
          mount: isBtn ? "spring-pop" : "none",
          unmount: "none",
          loop: "none",
        },
      };

      return {
        elements: [...state.elements, newElement],
        layers: [
          ...state.layers,
          {
            id,
            name:
              options.name ??
              (type === "text"
                ? "Teks Baru"
                : type === "image"
                  ? "Gambar"
                  : type === "container"
                    ? "Container"
                    : isBtn
                      ? "Tombol Buka Undangan"
                      : `${options.shape ?? "Shape"}`),
            type,
            visible: true,
            locked: false,
          },
        ],
        selectedElementId: id,
      };
    }),
  addContainer: () => {
    const containerId = `container-${Date.now()}`;
    set((state) => {
      const newContainer: EditorCanvasElement = {
        id: containerId,
        type: "container",
        content: "",
        style: "border border-dashed border-amber-500/30 rounded-xl",
        top: "10%",
        left: "5%",
        width: 300,
        height: 180,
        opacity: 1,
        positionMode: "absolute",
        widthSizeMode: "full",
        heightSizeMode: "fit",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        gap: 8,
        flipX: false,
        flipY: false,
        animation: { mount: "none", unmount: "none", loop: "none" },
      };
      return {
        elements: [...state.elements, newContainer],
        layers: [
          ...state.layers,
          {
            id: containerId,
            name: "Container Baru",
            type: "container",
            visible: true,
            locked: false,
          },
        ],
        selectedElementId: containerId,
      };
    });
  },
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element,
      ),
    })),
  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
      layers: state.layers.filter((layer) => layer.id !== id),
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
    })),
  duplicateElement: (id, options = {}) =>
    set((state) => {
      const originalElement = state.elements.find((el) => el.id === id);
      const originalLayer = state.layers.find((layer) => layer.id === id);
      if (!originalElement) return state;

      const newId = `${originalElement.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const origLeft = parseFloat(originalElement.left) || 0;
      const origTop = parseFloat(originalElement.top) || 0;

      const newElement: EditorCanvasElement = {
        ...originalElement,
        id: newId,
        left: `${Math.min(80, origLeft + 4).toFixed(2)}%`,
        top: `${Math.min(80, origTop + 4).toFixed(2)}%`,
        flipX: options.mirrorHorizontal
          ? !originalElement.flipX
          : (originalElement.flipX ?? false),
        flipY: options.mirrorVertical
          ? !originalElement.flipY
          : (originalElement.flipY ?? false),
      };

      const originalLayerIndex = state.layers.findIndex((l) => l.id === id);
      const newLayer: EditorLayer = {
        id: newId,
        name: `${originalLayer?.name || originalElement.type} (Copy)`,
        type: originalElement.type,
        visible: true,
        locked: false,
      };

      const newLayers = [...state.layers];
      if (originalLayerIndex >= 0) {
        newLayers.splice(originalLayerIndex + 1, 0, newLayer);
      } else {
        newLayers.push(newLayer);
      }

      return {
        elements: [...state.elements, newElement],
        layers: newLayers,
        selectedElementId: newId,
      };
    }),
  flipElementHorizontal: (id) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, flipX: !el.flipX } : el,
      ),
    })),
  flipElementVertical: (id) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, flipY: !el.flipY } : el,
      ),
    })),
  moveLayer: (id, targetId, asChild = false) =>
    set((state) => {
      const index = state.layers.findIndex((layer) => layer.id === id);
      const targetIndex = state.layers.findIndex(
        (layer) => layer.id === targetId,
      );
      if (index < 0 || targetIndex < 0 || index === targetIndex) return state;
      const layers = [...state.layers];
      const [movedLayer] = layers.splice(index, 1);
      const targetLayer = layers.find((layer) => layer.id === targetId);
      if (!targetLayer) return state;
      const targetElement = state.elements.find(
        (element) => element.id === targetId,
      );
      const movedElement = state.elements.find((element) => element.id === id);
      if (!movedElement) return state;

      const nextParentId = asChild ? targetId : targetElement?.parentId;
      const elements = state.elements.map((element) =>
        element.id === id
          ? {
            ...element,
            parentId: nextParentId,
            positionMode: nextParentId
              ? ("relative" as const)
              : ("absolute" as const),
            top: nextParentId ? "0%" : element.top,
            left: nextParentId ? "0%" : element.left,
          }
          : element,
      );
      layers.splice(asChild ? targetIndex + 1 : targetIndex, 0, movedLayer);
      return { layers, elements };
    }),
  setFontSize: (fontSize) => set({ fontSize }),
  setPendingImageFile: (pendingImageFile) => set({ pendingImageFile }),
  setOpacity: (opacity) => set({ opacity }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setTextColor: (textColor) => set({ textColor }),
  setBgColor: (bgColor) => set({ bgColor }),
  setBgImage: (bgImage) => set({ bgImage }),
  setBgImageFit: (bgImageFit) => set({ bgImageFit }),
  setBgImageOpacity: (bgImageOpacity) => set({ bgImageOpacity }),
  setBgImageBlur: (bgImageBlur) => set({ bgImageBlur }),
  setBgImagePosX: (bgImagePosX) => set({ bgImagePosX }),
  setBgImagePosY: (bgImagePosY) => set({ bgImagePosY }),
  setBgImageScale: (bgImageScale) => set({ bgImageScale }),
  setBgImageFixed: (bgImageFixed) => set({ bgImageFixed }),
  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer,
      ),
    })),
  toggleLayerLock: (id) =>
    set((state) => {
      const isTargetSelected = state.selectedElementId === id;
      const targetLayer = state.layers.find((layer) => layer.id === id);
      const willLock = !targetLayer?.locked;
      return {
        layers: state.layers.map((layer) =>
          layer.id === id ? { ...layer, locked: !layer.locked } : layer,
        ),
        selectedElementId:
          isTargetSelected && willLock ? null : state.selectedElementId,
      };
    }),
}));
