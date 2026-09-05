/**
 * Strict TypeScript Definitions for 2-Tier Digital Wedding Invitation Platform
 * Supports Template Builder (Designers) & Client Content Editor (End-Users)
 */

export const CANVAS_WIDTH = 375;
export const CANVAS_HEIGHT = 812;

export type SectionType =
  | 'hero'
  | 'quote'
  | 'couple'
  | 'countdown'
  | 'event'
  | 'location'
  | 'gallery'
  | 'story'
  | 'gift'
  | 'rsvp'
  | 'wishes'
  | 'closing';

export const SECTION_TYPES_LIST: { type: SectionType; label: string; defaultOrder: number }[] = [
  { type: 'hero', label: '1. Hero & Cover', defaultOrder: 1 },
  { type: 'quote', label: '2. Opening Quote / Verses', defaultOrder: 2 },
  { type: 'couple', label: '3. Bride & Groom Profile', defaultOrder: 3 },
  { type: 'countdown', label: '4. Countdown Timer', defaultOrder: 4 },
  { type: 'event', label: '5. Event Schedule (Akad & Reception)', defaultOrder: 5 },
  { type: 'location', label: '6. Location & Map', defaultOrder: 6 },
  { type: 'gallery', label: '7. Photo Gallery', defaultOrder: 7 },
  { type: 'story', label: '8. Love Story Timeline', defaultOrder: 8 },
  { type: 'gift', label: '9. Digital Gift & Bank Accounts', defaultOrder: 9 },
  { type: 'rsvp', label: '10. RSVP Form', defaultOrder: 10 },
  { type: 'wishes', label: '11. Guest Wishes Wall', defaultOrder: 11 },
  { type: 'closing', label: '12. Closing Remarks & Thanks', defaultOrder: 12 },
];

export type LayerType = 'text' | 'image' | 'shape' | 'button' | 'icon';

export type AnimationType =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce'
  | 'rotate'
  | 'falling-leaf'
  | 'floating-sway'
  | 'gravity-drop'
  | 'curved-spiral'
  | 'pulse-heartbeat'
  | 'wind-flower'
  | 'leaf-rustle'
  | 'cloud-drift'
  | 'ocean-wave'
  | 'smoke-convection'
  | 'pendulum-swing'
  | 'loop-wind-leaf'
  | 'loop-wind-flower'
  | 'loop-floating-petal'
  | 'loop-breathe'
  | 'none';

export interface AnimationConfig {
  type: AnimationType;
  duration: number; // in seconds (e.g. 0.8)
  delay: number; // in seconds (e.g. 0.2)
  ease?: string; // e.g. "easeInOut", "backOut", "linear"
}

export interface TimelineConfig {
  startTime: number; // Seconds when element starts appearing in section playback (e.g. 0)
  endTime: number; // Seconds when element exits section playback (e.g. 10)
  entrance: AnimationConfig;
  exit: AnimationConfig;
}

export interface ElementPosition {
  x: number; // Position in px (relative to 375px canvas)
  y: number; // Position in px (relative to 812px section height)
  width: number;
  height: number;
  zIndex: number;
  rotation?: number; // degrees
}

export interface LayerStyle {
  fontSize?: number; // in px
  fontFamily?: string;
  fontWeight?: string | number; // "400", "600", "700", "bold"
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: string;
  color?: string; // Hex, HSL, RGBA
  backgroundColor?: string;
  borderRadius?: number; // in px
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  padding?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number; // in px
  lineHeight?: number;
  opacity?: number; // 0 to 1
  objectFit?: 'cover' | 'contain' | 'fill';
  boxShadow?: string;
  backdropFilter?: string;
}

export interface ElementLayer {
  id: string;
  name: string;
  type: LayerType;
  content: string; // Plain text, image URL, icon key, or button text
  position: ElementPosition;
  style: LayerStyle;
  timeline: TimelineConfig;
  isLocked: boolean;
  isHidden: boolean;
  fieldKey?: string; // e.g., "bride_name", "groom_name", "wedding_date", "event_location", "hero_image"
  fieldLabel?: string; // Human readable form label for Client Editor (e.g. "Nama Mempelai Wanita")
  placeholder?: string;
}

export interface SectionContentJson {
  layers: ElementLayer[];
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  sectionHeight?: number; // default 812
}

export interface TemplateSectionData {
  id: string;
  templateId: string;
  sectionOrder: number; // 1 - 12
  sectionType: SectionType;
  contentJson: SectionContentJson;
}

export interface GlobalSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
  audioUrl?: string;
  audioAutoPlay?: boolean;
  customCss?: string;
}

export interface MasterTemplateData {
  id: string;
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  globalSettings: GlobalSettings;
  sections: TemplateSectionData[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserOverrideMap {
  textOverrides: Record<string, string>; // Maps layerId OR fieldKey -> user input string
  imageOverrides: Record<string, string>; // Maps layerId OR fieldKey -> user image URL / Blob
}

export interface UserInvitationData {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  slug?: string | null;
  brideName?: string | null;
  groomName?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  overrides: UserOverrideMap;
  isPublished: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
