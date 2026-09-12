import { create } from "zustand";

export type SidebarTab = "templates" | "layers" | "sections";
export type MockupType = "invitation" | "cover" | "gift-modal";
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
  | "gift"
  | "sparkles"
  | "music"
  | "chevron-down"
  | "none";
export type ButtonActionType = "scroll-to-section" | "url" | "gift-modal" | "toggle-music";
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

export type ButtonBgType = "gradient" | "solid" | "glass" | "outline";
export type ButtonShapeType = "pill" | "rounded-xl" | "rounded-md" | "square";
export type ButtonShadowType = "none" | "soft" | "glow" | "luxury";

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
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  textEffect?: TextEffectType;
  buttonText?: string;
  buttonIcon?: ButtonIconType;
  buttonVariant?: ButtonVariantType;
  buttonAction?: ButtonActionType;
  buttonTargetSection?: number;
  buttonPulse?: boolean;
  buttonUrl?: string;
  buttonCustomCode?: string;
  buttonBgType?: ButtonBgType;
  buttonBgColor?: string;
  buttonBgGradientEnd?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  buttonBorderWidth?: number;
  buttonBorderRadius?: number;
  buttonShape?: ButtonShapeType;
  buttonFontFamily?: string;
  buttonFontSize?: number;
  buttonFontWeight?: string;
  buttonLetterSpacing?: string;
  buttonTextTransform?: "uppercase" | "capitalize" | "none";
  buttonShadow?: ButtonShadowType;
  animation?: ElementAnimationConfig;
  mockupType?: MockupType;
  sectionIndex?: number;
  isCountdown?: boolean;
  countdownTargetDate?: string;
  isRsvpForm?: boolean;
  isGuestbook?: boolean;
}

export interface EditorLayer {
  id: string;
  name: string;
  type: CanvasElementType;
  visible: boolean;
  locked: boolean;
  mockupType?: MockupType;
  sectionIndex?: number;
}

export function getElementSectionIndex(
  element: { top?: string | number; sectionIndex?: number; parentId?: string; id?: string },
  elements?: EditorCanvasElement[],
  sectionsCount: number = 10,
): number {
  if (element.sectionIndex !== undefined && element.sectionIndex !== null) {
    return Math.min(sectionsCount - 1, Math.max(0, element.sectionIndex));
  }

  // If element has parent container, inherit parent's section
  if (element.parentId && elements) {
    const parent = elements.find((e) => e.id === element.parentId);
    if (parent) {
      return getElementSectionIndex(parent, elements, sectionsCount);
    }
  }

  const topVal = element.top;
  if (topVal === undefined || topVal === null) return 0;

  if (typeof topVal === "number") {
    return Math.min(sectionsCount - 1, Math.max(0, Math.floor(topVal / 844)));
  }

  const topStr = String(topVal).trim();
  if (topStr.endsWith("px")) {
    const px = parseFloat(topStr);
    return Math.min(sectionsCount - 1, Math.max(0, Math.floor(px / 844)));
  }

  if (topStr.endsWith("%")) {
    const pct = parseFloat(topStr);
    if (isNaN(pct)) return 0;
    if (pct >= 100) {
      return Math.min(sectionsCount - 1, Math.max(0, Math.floor(pct / 100)));
    }
    return Math.min(sectionsCount - 1, Math.max(0, Math.floor((pct / 100) * sectionsCount)));
  }

  const raw = parseFloat(topStr);
  if (!isNaN(raw)) {
    if (raw > 100) {
      return Math.min(sectionsCount - 1, Math.max(0, Math.floor(raw / 844)));
    }
    return Math.min(sectionsCount - 1, Math.max(0, Math.floor((raw / 100) * sectionsCount)));
  }

  return 0;
}

interface EditorState {
  activeTab: SidebarTab;
  activeMockup: MockupType;
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
  laptopCoverImage: string | null;
  setLaptopCoverImage: (url: string | null) => void;
  pendingImageFile: File | null;
  setActiveTab: (tab: SidebarTab) => void;
  setActiveMockup: (mockup: MockupType) => void;
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
    options?: Partial<EditorCanvasElement> & {
      name?: string;
      position?: { top: string; left: string };
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
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  alignElement: (
    id: string,
    alignment: "left" | "center-x" | "right" | "top" | "center-y" | "bottom",
  ) => void;
  setPendingImageFile: (file: File | null) => void;
  setFontSize: (value: number[]) => void;
  setOpacity: (value: number[]) => void;
  setFontFamily: (value: string) => void;
  setTextColor: (value: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  sectionsCount: number;
  activeSection: number;
  targetScrollSection: { index: number; timestamp: number } | null;
  addSection: () => void;
  removeSection: () => void;
  setSectionsCount: (count: number) => void;
  setActiveSection: (index: number) => void;
  scrollToSection: (index: number) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  togglePreviewMode: () => void;
  isCoverVisible: boolean;
  setIsCoverVisible: (visible: boolean) => void;
  playPreview: () => void;
  isGiftModalOpen: boolean;
  setIsGiftModalOpen: (open: boolean) => void;
  openGiftModal: () => void;
  addGiftButton: (sectionIndex?: number) => void;
  isMusicPlaying: boolean;
  audioUrl: string | null;
  toggleMusic: () => void;
  setIsMusicPlaying: (playing: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  addMusicButton: (sectionIndex?: number) => void;
}

export const DEFAULT_SECTIONS = [
  "Opening",
  "Ayat / Quote",
  "Mempelai",
  "Tempat dan Tanggal Event",
  "Countdown",
  "Love Story",
  "Gallery",
  "RSVP",
  "Guestbook",
  "Closing",
];

const noAnim: ElementAnimationConfig = { mount: "none", unmount: "none", loop: "none" };

const initialCoverElements: EditorCanvasElement[] = [
  {
    id: "cover-photo", type: "image", mockupType: "cover",
    content: "", style: "rounded-2xl border-2 border-amber-500/20 bg-neutral-800/60 shadow-2xl",
    top: "90px", left: "95px", width: 200, height: 250, opacity: 1,
    objectFit: "cover", borderRadius: 16, positionMode: "absolute", animation: noAnim,
  },
  {
    id: "cover-title", type: "text", mockupType: "cover",
    content: "THE WEDDING OF",
    style: "font-sans tracking-[0.25em] font-semibold text-center uppercase",
    top: "365px", left: "33px", width: 324, height: 28,
    fontSize: 11, color: "#fcd34d", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "cover-names", type: "text", mockupType: "cover",
    content: "Romeo & Juliet",
    style: "font-serif text-center font-bold",
    top: "405px", left: "33px", width: 324, height: 56,
    fontSize: 32, color: "#ffffff", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "cover-kepada", type: "text", mockupType: "cover",
    content: "Kepada Yth. Bapak/Ibu/Saudara/i:",
    style: "font-sans text-center",
    top: "525px", left: "33px", width: 324, height: 24,
    fontSize: 11, color: "#a1a1aa", opacity: 1, textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "cover-guest", type: "text", mockupType: "cover",
    content: "Tamu Undangan Terhormat",
    style: "font-sans font-bold text-center tracking-wide",
    top: "555px", left: "33px", width: 324, height: 32,
    fontSize: 16, color: "#fcd34d", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "cover-btn", type: "button", mockupType: "cover",
    content: "Buka Undangan", buttonText: "Buka Undangan",
    buttonIcon: "mail", buttonVariant: "gold-luxury", buttonAction: "scroll-to-section",
    buttonTargetSection: 0, buttonPulse: true,
    buttonBgType: "gradient", buttonBgColor: "#d97706", buttonBgGradientEnd: "#eab308",
    buttonTextColor: "#0a0a0a", buttonBorderColor: "#fcd34d", buttonBorderWidth: 1,
    buttonBorderRadius: 9999, buttonShape: "pill", buttonFontSize: 13, buttonFontWeight: "bold", buttonShadow: "glow",
    style: "", top: "680px", left: "69px", width: 252, height: 50, opacity: 1,
    positionMode: "absolute", borderRadius: 9999, animation: noAnim,
  },
];

const initialCoverLayers: EditorLayer[] = [
  { id: "cover-photo", name: "Foto Kedua Mempelai", type: "image", visible: true, locked: false, mockupType: "cover" },
  { id: "cover-title", name: "The Wedding Of", type: "text", visible: true, locked: false, mockupType: "cover" },
  { id: "cover-names", name: "Nama Kedua Mempelai", type: "text", visible: true, locked: false, mockupType: "cover" },
  { id: "cover-kepada", name: "Kepada Yth.", type: "text", visible: true, locked: false, mockupType: "cover" },
  { id: "cover-guest", name: "Nama Penerima Undangan", type: "text", visible: true, locked: false, mockupType: "cover" },
  { id: "cover-btn", name: "Tombol Buka Undangan", type: "button", visible: true, locked: false, mockupType: "cover" },
];

const initialGiftElements: EditorCanvasElement[] = [
  {
    id: "gift-icon", type: "shape", mockupType: "gift-modal",
    content: "", shape: "circle",
    style: "h-16 w-16 rounded-full bg-amber-500/20 border-2 border-amber-400/40 shadow-lg",
    top: "80px", left: "163px", width: 64, height: 64, opacity: 1,
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-title", type: "text", mockupType: "gift-modal",
    content: "Amplop Digital",
    style: "font-serif text-center font-bold",
    top: "160px", left: "33px", width: 324, height: 40,
    fontSize: 22, color: "#ffffff", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-desc", type: "text", mockupType: "gift-modal",
    content: "Doa dan dukungan Anda merupakan hadiah terbaik bagi kami.",
    style: "font-sans text-center",
    top: "210px", left: "33px", width: 324, height: 40,
    fontSize: 12, color: "#a1a1aa", opacity: 1, textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-bank", type: "text", mockupType: "gift-modal",
    content: "Bank BCA",
    style: "font-sans font-semibold text-center uppercase tracking-wider",
    top: "280px", left: "33px", width: 324, height: 28,
    fontSize: 13, color: "#fcd34d", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-account", type: "text", mockupType: "gift-modal",
    content: "1234 5678 9012",
    style: "font-mono text-center font-bold tracking-widest",
    top: "320px", left: "33px", width: 324, height: 32,
    fontSize: 18, color: "#ffffff", opacity: 1, fontWeight: "bold", textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-holder", type: "text", mockupType: "gift-modal",
    content: "a.n. Romeo & Juliet",
    style: "font-sans text-center",
    top: "360px", left: "33px", width: 324, height: 24,
    fontSize: 12, color: "#a1a1aa", opacity: 1, textAlign: "center",
    positionMode: "absolute", animation: noAnim,
  },
  {
    id: "gift-btn", type: "button", mockupType: "gift-modal",
    content: "Tutup", buttonText: "Tutup",
    buttonIcon: "none", buttonVariant: "minimal-outline", buttonAction: "gift-modal",
    buttonPulse: false,
    buttonBgType: "outline", buttonBgColor: "transparent", buttonTextColor: "#fcd34d",
    buttonBorderColor: "rgba(252, 211, 77, 0.5)", buttonBorderWidth: 1, buttonBorderRadius: 9999,
    buttonShape: "pill", buttonFontSize: 13, buttonFontWeight: "bold", buttonShadow: "none",
    style: "", top: "440px", left: "95px", width: 200, height: 44, opacity: 1,
    positionMode: "absolute", borderRadius: 9999, animation: noAnim,
  },
];

const initialGiftLayers: EditorLayer[] = [
  { id: "gift-icon", name: "Ikon Gift", type: "shape", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-title", name: "Judul Gift", type: "text", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-desc", name: "Deskripsi Gift", type: "text", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-bank", name: "Nama Bank", type: "text", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-account", name: "Nomor Rekening", type: "text", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-holder", name: "Pemilik Rekening", type: "text", visible: true, locked: false, mockupType: "gift-modal" },
  { id: "gift-btn", name: "Tombol Tutup Modal", type: "button", visible: true, locked: false, mockupType: "gift-modal" },
];

const initialInvitationElements: EditorCanvasElement[] = [
  // SECTION 1: OPENING (sectionIndex: 0, top: 0px - 844px)
  {
    id: "inv-bismillah",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 0,
    content: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم",
    style: "font-serif text-center font-medium",
    top: "220px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 18,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-wedding-title",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 0,
    content: "THE WEDDING OF",
    style: "font-sans tracking-[0.25em] font-semibold text-center uppercase",
    top: "276px",
    left: "33px",
    width: 324,
    height: 24,
    fontSize: 11,
    color: "#fcd34d",
    opacity: 1,
    fontWeight: "bold",
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-couple-names",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 0,
    content: "Romeo & Juliet",
    style: "font-serif text-center font-bold",
    top: "316px",
    left: "33px",
    width: 324,
    height: 64,
    fontSize: 34,
    color: "#ffffff",
    opacity: 1,
    fontWeight: "bold",
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-date",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 0,
    content: "Sabtu, 12 September 2026",
    style: "font-sans text-center font-medium tracking-wide",
    top: "400px",
    left: "33px",
    width: 324,
    height: 28,
    fontSize: 13,
    color: "#e4e4e7",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 2: AYAT / QUOTE (sectionIndex: 1, top: 844px - 1688px)
  {
    id: "inv-quote-text",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 1,
    content: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    style: "font-serif text-center font-medium italic leading-relaxed",
    top: "1180px",
    left: "33px",
    width: 324,
    height: 120,
    fontSize: 13,
    color: "#e4e4e7",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-quote-ref",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 1,
    content: "(QS. Ar-Rum: 21)",
    style: "font-sans text-center font-semibold tracking-wider",
    top: "1320px",
    left: "33px",
    width: 324,
    height: 28,
    fontSize: 13,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 3: MEMPELAI (sectionIndex: 2, top: 1688px - 2532px)
  {
    id: "inv-sec2-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "Mempelai Pria & Wanita",
    style: "font-serif text-center font-bold",
    top: "1940px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-groom-name",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "Romeo Montague",
    style: "font-serif text-center font-bold",
    top: "2000px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 20,
    color: "#ffffff",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-groom-parents",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "Putra dari Bpk. Montague & Ibu Montague",
    style: "font-sans text-center",
    top: "2044px",
    left: "33px",
    width: 324,
    height: 24,
    fontSize: 11,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-with-symbol",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "&",
    style: "font-serif text-center font-bold",
    top: "2084px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 24,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-bride-name",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "Juliet Capulet",
    style: "font-serif text-center font-bold",
    top: "2130px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 20,
    color: "#ffffff",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-bride-parents",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 2,
    content: "Putri dari Bpk. Capulet & Ibu Capulet",
    style: "font-sans text-center",
    top: "2174px",
    left: "33px",
    width: 324,
    height: 24,
    fontSize: 11,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 4: TEMPAT & TANGGAL (sectionIndex: 3, top: 2532px - 3376px)
  {
    id: "inv-sec3-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 3,
    content: "Waktu & Tempat Acara",
    style: "font-serif text-center font-bold",
    top: "2840px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-sec3-date",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 3,
    content: "Akad Nikah: 08.00 WIB\nResepsi: 11.00 - 14.00 WIB",
    style: "font-sans text-center tracking-wide leading-relaxed",
    top: "2896px",
    left: "33px",
    width: 324,
    height: 60,
    fontSize: 13,
    color: "#ffffff",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-sec3-venue",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 3,
    content: "Grand Ballroom Hotel Mulia, Jakarta",
    style: "font-sans text-center font-medium",
    top: "2970px",
    left: "33px",
    width: 324,
    height: 30,
    fontSize: 12,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 5: COUNTDOWN (sectionIndex: 4, top: 3376px - 4220px)
  {
    id: "inv-countdown-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 4,
    content: "Hitung Mundur Hari Bahagia",
    style: "font-serif text-center font-bold",
    top: "3710px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-countdown-timer",
    type: "text",
    isCountdown: true,
    countdownTargetDate: "2026-09-20T08:00",
    mockupType: "invitation",
    sectionIndex: 4,
    content: "12 : 08 : 45 : 30",
    style: "bg-transparent font-mono text-center font-bold tracking-widest",
    top: "3766px",
    left: "33px",
    width: 324,
    height: 80,
    fontSize: 28,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 6: LOVE STORY (sectionIndex: 5, top: 4220px - 5064px)
  {
    id: "inv-story-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 5,
    content: "Cerita Cinta Kami",
    style: "font-serif text-center font-bold",
    top: "4550px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-story-text",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 5,
    content: "Berawal dari sebuah pertemuan sederhana di musim semi, kami tumbuh bersama membawa harapan hingga akhirnya memutuskan mengikat janji suci selamanya.",
    style: "font-serif text-center font-medium italic leading-relaxed",
    top: "4606px",
    left: "33px",
    width: 324,
    height: 100,
    fontSize: 13,
    color: "#e4e4e7",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 7: GALLERY (sectionIndex: 6, top: 5064px - 5908px)
  {
    id: "inv-gallery-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 6,
    content: "Galeri Momen Bahagia",
    style: "font-serif text-center font-bold",
    top: "5390px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-gallery-sub",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 6,
    content: "Kumpulan kenangan manis perjalanan cinta kami",
    style: "font-sans text-center",
    top: "5436px",
    left: "33px",
    width: 324,
    height: 30,
    fontSize: 12,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 8: RSVP (sectionIndex: 7, top: 5908px - 6752px)
  {
    id: "inv-rsvp-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 7,
    content: "Konfirmasi Kehadiran",
    style: "font-serif text-center font-bold",
    top: "6020px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-rsvp-desc",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 7,
    content: "Mohon konfirmasi kehadiran Anda untuk membantu memfasilitasi kenyamanan acara.",
    style: "font-sans text-center",
    top: "6066px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 11,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-rsvp-form",
    type: "text",
    isRsvpForm: true,
    mockupType: "invitation",
    sectionIndex: 7,
    content: "",
    style: "w-full h-full",
    top: "6112px",
    left: "33px",
    width: 324,
    height: 500,
    opacity: 1,
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 9: GUESTBOOK (sectionIndex: 8, top: 6752px - 7596px)
  {
    id: "inv-guestbook-heading",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 8,
    content: "Ucapan & Doa Restu",
    style: "font-serif text-center font-bold",
    top: "6860px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-guestbook-desc",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 8,
    content: "Berikut pesan & doa hangat dari kerabat serta sahabat terkasih:",
    style: "font-sans text-center",
    top: "6906px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 11,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-guestbook-list",
    type: "text",
    isGuestbook: true,
    mockupType: "invitation",
    sectionIndex: 8,
    content: "",
    style: "w-full h-full",
    top: "6952px",
    left: "33px",
    width: 324,
    height: 500,
    opacity: 1,
    positionMode: "absolute",
    animation: noAnim,
  },

  // SECTION 10: CLOSING (sectionIndex: 9, top: 7596px - 8440px)
  {
    id: "inv-closing-thanks",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 9,
    content: "Terima Kasih",
    style: "font-serif text-center font-bold",
    top: "7920px",
    left: "33px",
    width: 324,
    height: 36,
    fontSize: 22,
    color: "#fcd34d",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-closing-text",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 9,
    content: "Merupakan suatu kehormatan & kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    style: "font-sans text-center leading-relaxed",
    top: "7966px",
    left: "33px",
    width: 324,
    height: 80,
    fontSize: 12,
    color: "#a1a1aa",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },
  {
    id: "inv-closing-names",
    type: "text",
    mockupType: "invitation",
    sectionIndex: 9,
    content: "Romeo & Juliet",
    style: "font-serif text-center font-bold",
    top: "8056px",
    left: "33px",
    width: 324,
    height: 44,
    fontSize: 28,
    color: "#ffffff",
    opacity: 1,
    textAlign: "center",
    positionMode: "absolute",
    animation: noAnim,
  },

  // STICKY BUTTONS (Fixed overlay across sections - Default action buttons)
  {
    id: "inv-sticky-gift-btn",
    type: "button",
    mockupType: "invitation",
    content: "",
    buttonText: "",
    buttonIcon: "gift",
    buttonVariant: "gold-luxury",
    buttonAction: "gift-modal",
    buttonPulse: true,
    buttonBgType: "gradient",
    buttonBgColor: "#e11d48",
    buttonBgGradientEnd: "#f59e0b",
    buttonTextColor: "#ffffff",
    buttonBorderColor: "#fcd34d",
    buttonBorderWidth: 1.5,
    buttonBorderRadius: 9999,
    buttonShape: "pill",
    buttonShadow: "luxury",
    style: "",
    top: "84%",
    left: "80%",
    width: 48,
    height: 48,
    opacity: 1,
    positionMode: "fixed",
    borderRadius: 9999,
    animation: noAnim,
  },
  {
    id: "inv-sticky-music-btn",
    type: "button",
    mockupType: "invitation",
    content: "",
    buttonText: "",
    buttonIcon: "music",
    buttonVariant: "gold-luxury",
    buttonAction: "toggle-music",
    buttonPulse: true,
    buttonBgType: "gradient",
    buttonBgColor: "#059669",
    buttonBgGradientEnd: "#10b981",
    buttonTextColor: "#ffffff",
    buttonBorderColor: "#6ee7b7",
    buttonBorderWidth: 1.5,
    buttonBorderRadius: 9999,
    buttonShape: "pill",
    buttonShadow: "luxury",
    style: "",
    top: "84%",
    left: "6%",
    width: 48,
    height: 48,
    opacity: 1,
    positionMode: "fixed",
    borderRadius: 9999,
    animation: noAnim,
  },
];

const initialInvitationLayers: EditorLayer[] = [
  // Section 1: Opening
  { id: "inv-bismillah", name: "Bismillah Pembuka", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 0 },
  { id: "inv-wedding-title", name: "The Wedding Of", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 0 },
  { id: "inv-couple-names", name: "Nama Romeo & Juliet", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 0 },
  { id: "inv-date", name: "Tanggal Acara", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 0 },

  // Section 2: Ayat / Quote
  { id: "inv-quote-text", name: "Kutipan Ayat Al-Qur'an", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 1 },
  { id: "inv-quote-ref", name: "Referensi Surat Ayat", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 1 },

  // Section 3: Mempelai
  { id: "inv-sec2-heading", name: "Judul Mempelai", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },
  { id: "inv-groom-name", name: "Nama Mempelai Pria", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },
  { id: "inv-groom-parents", name: "Orang Tua Pria", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },
  { id: "inv-with-symbol", name: "Simbol Dan (&)", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },
  { id: "inv-bride-name", name: "Nama Mempelai Wanita", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },
  { id: "inv-bride-parents", name: "Orang Tua Wanita", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 2 },

  // Section 4: Tempat & Tanggal
  { id: "inv-sec3-heading", name: "Judul Tempat Acara", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 3 },
  { id: "inv-sec3-date", name: "Waktu Akad & Resepsi", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 3 },
  { id: "inv-sec3-venue", name: "Lokasi Ballroom", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 3 },

  // Section 5: Countdown
  { id: "inv-countdown-heading", name: "Judul Countdown", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 4 },
  { id: "inv-countdown-timer", name: "Hitung Mundur Acara", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 4 },

  // Section 6: Love Story
  { id: "inv-story-heading", name: "Judul Cerita Cinta", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 5 },
  { id: "inv-story-text", name: "Kisah Cinta Mempelai", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 5 },

  // Section 7: Gallery
  { id: "inv-gallery-heading", name: "Judul Galeri Foto", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 6 },
  { id: "inv-gallery-sub", name: "Sub-Judul Galeri", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 6 },

  // Section 8: RSVP
  { id: "inv-rsvp-heading", name: "Judul RSVP", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 7 },
  { id: "inv-rsvp-desc", name: "Deskripsi RSVP", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 7 },
  { id: "inv-rsvp-form", name: "Form Konfirmasi Kehadiran", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 7 },

  // Section 9: Guestbook
  { id: "inv-guestbook-heading", name: "Judul Guestbook", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 8 },
  { id: "inv-guestbook-desc", name: "Deskripsi Guestbook", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 8 },
  { id: "inv-guestbook-list", name: "Daftar Ucapan & Doa Tamu", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 8 },

  // Section 10: Closing
  { id: "inv-closing-thanks", name: "Judul Penutup", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 9 },
  { id: "inv-closing-text", name: "Teks Terima Kasih", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 9 },
  { id: "inv-closing-names", name: "Nama Penutup Mempelai", type: "text", visible: true, locked: false, mockupType: "invitation", sectionIndex: 9 },

  // Sticky Buttons
  { id: "inv-sticky-gift-btn", name: "Tombol Gift Melayang (Sticky Lingkaran)", type: "button", visible: true, locked: false, mockupType: "invitation" },
  { id: "inv-sticky-music-btn", name: "Tombol Musik Melayang (Sticky Lingkaran)", type: "button", visible: true, locked: false, mockupType: "invitation" },
];

const initialElements: EditorCanvasElement[] = [
  ...initialInvitationElements,
  ...initialCoverElements,
  ...initialGiftElements,
];
const initialLayers: EditorLayer[] = [
  ...initialInvitationLayers,
  ...initialCoverLayers,
  ...initialGiftLayers,
];

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTab: "templates",
  activeMockup: "invitation",
  selectedElementId: null,
  activeTool: "cursor",
  zoom: 100,
  searchQuery: "",
  elements: initialElements,
  layers: initialLayers,
  sectionsCount: 10,
  activeSection: 0,
  targetScrollSection: null,
  isPreviewMode: false,
  isCoverVisible: true,
  isGiftModalOpen: false,
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
  laptopCoverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  setLaptopCoverImage: (laptopCoverImage) => set({ laptopCoverImage }),
  pendingImageFile: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveMockup: (activeMockup) =>
    set({ activeMockup, selectedElementId: null }),
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
      isCoverVisible: true,
      selectedElementId: isPreviewMode ? null : undefined,
    }),
  togglePreviewMode: () =>
    set((state) => ({
      isPreviewMode: !state.isPreviewMode,
      isCoverVisible: true,
      selectedElementId: !state.isPreviewMode ? null : state.selectedElementId,
    })),
  setIsCoverVisible: (isCoverVisible) => set({ isCoverVisible }),
  playPreview: () =>
    set({
      isPreviewMode: true,
      isCoverVisible: true,
      isGiftModalOpen: false,
      activeMockup: "invitation",
      selectedElementId: null,
    }),
  setIsGiftModalOpen: (isGiftModalOpen) => set({ isGiftModalOpen }),
  openGiftModal: () =>
    set({
      isPreviewMode: true,
      isGiftModalOpen: true,
      activeMockup: "invitation",
      selectedElementId: null,
    }),
  addGiftButton: (sectionIndex) => {
    const activeSec = sectionIndex ?? get().activeSection ?? 0;
    get().addElement("button", {
      name: "Tombol Kirim Gift (Sticky)",
      buttonText: "",
      buttonIcon: "gift",
      buttonVariant: "gold-luxury",
      buttonAction: "gift-modal",
      positionMode: "fixed",
      width: 48,
      height: 48,
      buttonPulse: true,
      buttonBgType: "gradient",
      buttonBgColor: "#e11d48",
      buttonBgGradientEnd: "#f59e0b",
      buttonTextColor: "#ffffff",
      buttonBorderColor: "#fcd34d",
      buttonBorderWidth: 1.5,
      buttonBorderRadius: 9999,
      buttonShape: "pill",
      buttonShadow: "luxury",
      position: { top: "84%", left: "80%" },
      sectionIndex: activeSec,
    });
  },
  isMusicPlaying: false,
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-background-music-113543.mp3",
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
  setIsMusicPlaying: (isMusicPlaying) => set({ isMusicPlaying }),
  setAudioUrl: (audioUrl) => set({ audioUrl }),
  addMusicButton: (sectionIndex) => {
    const activeSec = sectionIndex ?? get().activeSection ?? 0;
    get().addElement("button", {
      name: "Tombol Putar Musik (Sticky)",
      buttonText: "",
      buttonIcon: "music",
      buttonVariant: "gold-luxury",
      buttonAction: "toggle-music",
      positionMode: "fixed",
      width: 48,
      height: 48,
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
      position: { top: "84%", left: "6%" },
      sectionIndex: activeSec,
    });
  },
  addSection: () =>
    set((state) => ({ sectionsCount: Math.min(10, state.sectionsCount + 1) })),
  removeSection: () =>
    set((state) => ({ sectionsCount: Math.max(1, state.sectionsCount - 1) })),
  setSectionsCount: (sectionsCount) =>
    set({ sectionsCount: Math.max(1, Math.min(10, sectionsCount)) }),
  setActiveSection: (activeSection) => set({ activeSection }),
  scrollToSection: (index) =>
    set({
      activeSection: index,
      activeMockup: "invitation",
      targetScrollSection: { index, timestamp: Date.now() },
    }),
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
  addOpenInvitationButton: (sectionIndex) =>
    set((state) => {
      const id = `button-open-invitation-${Date.now()}`;
      const targetSec = sectionIndex !== undefined ? sectionIndex : (state.activeSection ?? 0);
      const targetTop =
        state.activeMockup === "invitation"
          ? `${targetSec * 844 + 480}px`
          : "75%";
      const newButton: EditorCanvasElement = {
        id,
        type: "button",
        mockupType: state.activeMockup,
        sectionIndex: state.activeMockup === "invitation" ? targetSec : undefined,
        content: "Buka Undangan",
        buttonText: "Buka Undangan",
        buttonIcon: "mail",
        buttonVariant: "gold-luxury",
        buttonAction: "scroll-to-section",
        buttonTargetSection: Math.min(targetSec + 1, Math.max(1, state.sectionsCount - 1)),
        buttonPulse: true,
        buttonBgType: "gradient",
        buttonBgColor: "#d97706",
        buttonBgGradientEnd: "#eab308",
        buttonTextColor: "#0a0a0a",
        buttonBorderColor: "#fcd34d",
        buttonBorderWidth: 1,
        buttonBorderRadius: 9999,
        buttonShape: "pill",
        buttonFontSize: 13,
        buttonFontWeight: "bold",
        buttonShadow: "glow",
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
            mockupType: state.activeMockup,
            sectionIndex: state.activeMockup === "invitation" ? targetSec : undefined,
          },
        ],
        selectedElementId: id,
      };
    }),
  addElement: (type, options = {}) =>
    set((state) => {
      const id = `layer-${Date.now() + 1}`;
      const position = options.position;
      const targetSec = options.sectionIndex ?? state.activeSection ?? 0;
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

      const defaultTop = selectedContainer
        ? "0%"
        : state.activeMockup === "invitation"
          ? `${targetSec * 844 + (isBtn ? 480 : 300)}px`
          : (isBtn ? "75%" : "10%");

      const newElement: EditorCanvasElement = {
        id,
        type,
        mockupType: state.activeMockup,
        sectionIndex: state.activeMockup === "invitation" ? targetSec : undefined,
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
        top: position?.top ?? defaultTop,
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
        buttonTargetSection: isBtn ? options.buttonTargetSection ?? 0 : undefined,
        buttonPulse: isBtn ? options.buttonPulse ?? true : undefined,
        buttonUrl: isBtn ? options.buttonUrl : undefined,
        buttonCustomCode: isBtn ? options.buttonCustomCode : undefined,
        buttonBgType: isBtn ? (options.buttonBgType ?? "gradient") : undefined,
        buttonBgColor: isBtn ? (options.buttonBgColor ?? "#d97706") : undefined,
        buttonBgGradientEnd: isBtn ? (options.buttonBgGradientEnd ?? "#eab308") : undefined,
        buttonTextColor: isBtn ? (options.buttonTextColor ?? "#0a0a0a") : undefined,
        buttonBorderColor: isBtn ? (options.buttonBorderColor ?? "#fcd34d") : undefined,
        buttonBorderWidth: isBtn ? (options.buttonBorderWidth ?? 1) : undefined,
        buttonBorderRadius: isBtn ? (options.buttonBorderRadius ?? 9999) : undefined,
        buttonShape: isBtn ? (options.buttonShape ?? "pill") : undefined,
        buttonFontSize: isBtn ? (options.buttonFontSize ?? 13) : undefined,
        buttonFontWeight: isBtn ? (options.buttonFontWeight ?? "bold") : undefined,
        buttonShadow: isBtn ? (options.buttonShadow ?? "glow") : undefined,
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
            mockupType: state.activeMockup,
            sectionIndex: state.activeMockup === "invitation" ? targetSec : undefined,
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
        mockupType: state.activeMockup,
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
      if (index < 0) return state;

      const layers = [...state.layers];
      const [movedLayer] = layers.splice(index, 1);

      const targetIndex = layers.findIndex((layer) => layer.id === targetId);
      if (targetIndex < 0) return state;

      const insertIndex = asChild ? targetIndex + 1 : targetIndex;
      layers.splice(insertIndex, 0, movedLayer);

      const targetElement = state.elements.find(
        (element) => element.id === targetId,
      );
      const movedElement = state.elements.find((element) => element.id === id);
      if (!movedElement) return state;

      let elements = state.elements;
      if (asChild && targetElement?.type === "container") {
        elements = state.elements.map((element) =>
          element.id === id
            ? {
                ...element,
                parentId: targetId,
                positionMode: "relative" as const,
              }
            : element,
        );
      }

      return { layers, elements };
    }),
  bringForward: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx < 0 || idx >= state.layers.length - 1) return state;
      const layers = [...state.layers];
      const [layer] = layers.splice(idx, 1);
      layers.splice(idx + 1, 0, layer);
      return { layers };
    }),
  sendBackward: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const layers = [...state.layers];
      const [layer] = layers.splice(idx, 1);
      layers.splice(idx - 1, 0, layer);
      return { layers };
    }),
  bringToFront: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx < 0 || idx === state.layers.length - 1) return state;
      const layers = [...state.layers];
      const [layer] = layers.splice(idx, 1);
      layers.push(layer);
      return { layers };
    }),
  sendToBack: (id) =>
    set((state) => {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx <= 0) return state;
      const layers = [...state.layers];
      const [layer] = layers.splice(idx, 1);
      layers.unshift(layer);
      return { layers };
    }),
  alignElement: (id, alignment) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const frameWidth = 390;
      const secIdx = getElementSectionIndex(element, state.elements, state.sectionsCount);
      const sectionTopPx = secIdx * 844;
      const elWidth = element.width || 100;
      const elHeight = element.height || 100;

      let newLeft = element.left;
      let newTop = element.top;

      switch (alignment) {
        case "left":
          newLeft = "0px";
          break;
        case "center-x":
          newLeft = `${Math.round((frameWidth - elWidth) / 2)}px`;
          break;
        case "right":
          newLeft = `${Math.round(frameWidth - elWidth)}px`;
          break;
        case "top":
          newTop = `${sectionTopPx}px`;
          break;
        case "center-y":
          newTop = `${Math.round(sectionTopPx + (844 - elHeight) / 2)}px`;
          break;
        case "bottom":
          newTop = `${Math.round(sectionTopPx + 844 - elHeight)}px`;
          break;
      }

      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, left: newLeft, top: newTop } : el,
        ),
      };
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
