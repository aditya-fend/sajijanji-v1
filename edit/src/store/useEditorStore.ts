import { create } from "zustand";

export type SidebarTab = "templates" | "layers";
export type CanvasTool = "cursor" | "text" | "image" | "shape";
export type CanvasElementType = "container" | "text" | "image" | "shape";
export type ShapeType = "line" | "circle" | "square" | "triangle" | "star";
export type ContainerSizeMode = "fit" | "custom" | "full";
export type ContainerDisplay = "block" | "flex" | "grid";
export type AnimationName =
  | "none"
  | "fade-up"
  | "fade-right"
  | "fade-down"
  | "fade-left"
  | "fade-in"
  | "fade-out"
  | "wind-sway";

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
  pendingImageFile: File | null;
  setActiveTab: (tab: SidebarTab) => void;
  selectElement: (id: string | null) => void;
  setActiveTool: (tool: CanvasTool) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSearchQuery: (query: string) => void;
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
    },
  ) => void;
  addContainer: () => void;
  updateElement: (id: string, updates: Partial<EditorCanvasElement>) => void;
  deleteElement: (id: string) => void;
  moveLayer: (id: string, targetId: string, asChild?: boolean) => void;
  setPendingImageFile: (file: File | null) => void;
  setFontSize: (value: number[]) => void;
  setOpacity: (value: number[]) => void;
  setFontFamily: (value: string) => void;
  setTextColor: (value: string) => void;
  setBgColor: (value: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
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
  fontSize: [24],
  opacity: [100],
  fontFamily: "caveat",
  textColor: "#fcd34d",
  bgColor: "#ffffff",
  pendingImageFile: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  selectElement: (selectedElementId) => set({ selectedElementId }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 50), 150) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 10, 150) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 10, 50) })),
  resetZoom: () => set({ zoom: 100 }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
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
      const newElement: EditorCanvasElement = {
        id,
        type,
        content: options.content ?? (type === "text" ? "Teks baru" : ""),
        style:
          options.style ??
          (type === "text"
            ? "font-sans text-xl text-foreground text-center font-bold"
            : type === "image"
              ? "h-48 w-40 rounded-xl border border-amber-500/20 object-cover shadow-xl"
              : defaultShapeStyle),
        top: position?.top ?? (selectedContainer ? "0%" : "10%"),
        left: position?.left ?? (selectedContainer ? "0%" : "10%"),
        shape: options.shape,
        parentId: options.parentId ?? selectedContainer?.id,
        positionMode:
          options.positionMode ?? (selectedContainer ? "relative" : "absolute"),
        width:
          options.width ??
          (type === "image" ? 160 : type === "text" ? 180 : 96),
        height:
          options.height ??
          (type === "image" ? 192 : type === "text" ? 44 : 96),
        fontSize: type === "text" ? 20 : undefined,
        color: type === "text" ? "#fcd34d" : undefined,
        opacity: 1,
        fontWeight: type === "text" ? "bold" : undefined,
        textAlign: type === "text" ? "center" : undefined,
        objectFit: type === "image" ? "cover" : undefined,
        borderRadius: type === "image" ? 16 : undefined,
        animation: { mount: "none", unmount: "none", loop: "none" },
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
                  ? "Gambar Baru"
                  : "Shape Baru"),
            type,
            visible: true,
            locked: false,
          },
        ],
        activeTool: type === "container" ? "cursor" : type,
        selectedElementId: id,
      };
    }),
  addContainer: () => {
    set((state) => {
      const containerId = `container-${Date.now()}`;
      const selectedContainer = state.elements.find(
        (element) =>
          element.id === state.selectedElementId &&
          element.type === "container",
      );
      const container: EditorCanvasElement = {
        id: containerId,
        type: "container",
        content: "",
        style: "border border-border/30 bg-transparent",
        top: "0%",
        left: "0%",
        width: 240,
        height: 180,
        parentId: selectedContainer?.id,
        positionMode: "relative",
        widthSizeMode: "fit",
        heightSizeMode: "fit",
        display: "block",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "stretch",
        gridColumns: 2,
        gridRows: 1,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        gap: 0,
        animation: { mount: "none", unmount: "none", loop: "none" },
      };
      return {
        elements: [...state.elements, container],
        layers: [
          ...state.layers,
          {
            id: containerId,
            name: "Container",
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
  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer,
      ),
    })),
  toggleLayerLock: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, locked: !layer.locked } : layer,
      ),
    })),
}));
