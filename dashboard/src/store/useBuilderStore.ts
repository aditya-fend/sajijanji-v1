import { create } from 'zustand';
import {
  MasterTemplateData,
  TemplateSectionData,
  ElementLayer,
  ElementPosition,
  LayerStyle,
  TimelineConfig,
  GlobalSettings,
  UserOverrideMap,
  UserInvitationData,
  SectionType,
  LayerType,
  SECTION_TYPES_LIST,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '@/types/builder';
import { mockTemplate1, mockMasterTemplate } from '@/data/mockTemplate';

interface BuilderState {
  // Mode & Context
  mode: 'builder' | 'client-editor' | 'preview';
  setMode: (mode: 'builder' | 'client-editor' | 'preview') => void;

  // Master Template Data
  templateId: string | null;
  templateName: string;
  globalSettings: GlobalSettings;
  sections: TemplateSectionData[];
  
  // Selection & Navigation
  activeSectionId: string | null;
  selectedLayerId: string | null;

  // Animation Timeline Control (Playback Engine)
  currentTime: number; // in seconds
  timelineDuration: number; // max playback length in seconds (default 10s)
  isPlaying: boolean;

  // Client Editor Overrides
  invitationId: string | null;
  invitationTitle: string;
  overrides: UserOverrideMap;
  isPublished: boolean;

  // Flags
  isDirty: boolean;

  // Actions: Template Initialization
  loadTemplate: (template: MasterTemplateData) => void;
  loadUserInvitation: (invitation: UserInvitationData, template: MasterTemplateData) => void;
  setTemplateName: (name: string) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;

  // Actions: Navigation & Selection
  setActiveSection: (sectionId: string | null) => void;
  setSelectedLayer: (layerId: string | null) => void;

  // Actions: Section Management
  addSection: (sectionType: SectionType) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  updateSectionBackground: (
    sectionId: string,
    bg: { backgroundColor?: string; backgroundImage?: string; backgroundOverlay?: string }
  ) => void;
  applyBackgroundToAllSections: (
    bg: { backgroundColor?: string; backgroundImage?: string; backgroundOverlay?: string }
  ) => void;

  // Actions: Layer Manipulation (Builder Mode)
  addLayer: (sectionId: string, layerType: LayerType, initialData?: Partial<ElementLayer>) => void;
  updateLayer: (sectionId: string, layerId: string, updates: Partial<ElementLayer>) => void;
  updateLayerPosition: (sectionId: string, layerId: string, position: Partial<ElementPosition>) => void;
  updateLayerStyle: (sectionId: string, layerId: string, style: Partial<LayerStyle>) => void;
  updateLayerTimeline: (sectionId: string, layerId: string, timelineUpdates: Partial<TimelineConfig>) => void;
  removeLayer: (sectionId: string, layerId: string) => void;
  duplicateLayer: (sectionId: string, layerId: string) => void;
  toggleLayerLock: (sectionId: string, layerId: string) => void;
  toggleLayerHide: (sectionId: string, layerId: string) => void;
  reorderLayerZIndex: (
    sectionId: string,
    layerId: string,
    action: 'bringToFront' | 'sendToBack' | 'moveUp' | 'moveDown'
  ) => void;

  // Actions: Timeline Control
  setCurrentTime: (time: number) => void;
  setTimelineDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;

  // Actions: Client Overrides (Client Editor Mode)
  setOverride: (key: string, value: string, type: 'text' | 'image') => void;
  clearOverrides: () => void;
  setInvitationTitle: (title: string) => void;
  setIsPublished: (published: boolean) => void;

  // Helper getters
  getActiveSection: () => TemplateSectionData | undefined;
  getSelectedLayer: () => ElementLayer | undefined;
  getEffectiveLayerContent: (layer: ElementLayer) => string;
}

// Initial Default Global Settings
const defaultGlobalSettings: GlobalSettings = {
  primaryColor: '#8B5CF6',
  secondaryColor: '#EC4899',
  accentColor: '#F59E0B',
  fontHeading: 'Playfair Display, serif',
  fontBody: 'Inter, sans-serif',
  audioAutoPlay: false,
};

// Initial Default Template Structure (Standard 12 Wedding Sections Setup - Elegant Floral)
const createInitialSections = (): TemplateSectionData[] => {
  return mockTemplate1;
};

const initialSections = createInitialSections();

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Mode & Context
  mode: 'builder',
  setMode: (mode) => set({ mode }),

  // Master Template Data
  templateId: 'demo-template-1',
  templateName: 'Royal Elegance Wedding Template',
  globalSettings: defaultGlobalSettings,
  sections: initialSections,

  // Selection & Navigation
  activeSectionId: initialSections[0]?.id || null,
  selectedLayerId: initialSections[0]?.contentJson.layers[0]?.id || null,

  // Timeline Control
  currentTime: 0,
  timelineDuration: 10,
  isPlaying: false,

  // Client Overrides State
  invitationId: null,
  invitationTitle: 'The Wedding of Romeo & Juliet',
  overrides: {
    textOverrides: {},
    imageOverrides: {},
  },
  isPublished: false,
  isDirty: false,

  // --- Actions: Initialization ---
  loadTemplate: (template) => {
    set({
      templateId: template.id,
      templateName: template.name,
      globalSettings: template.globalSettings || defaultGlobalSettings,
      sections: template.sections.length > 0 ? template.sections : createInitialSections(),
      activeSectionId: template.sections[0]?.id || null,
      selectedLayerId: template.sections[0]?.contentJson.layers[0]?.id || null,
      isDirty: false,
    });
  },

  loadUserInvitation: (invitation, template) => {
    set({
      mode: 'client-editor',
      invitationId: invitation.id,
      invitationTitle: invitation.title,
      overrides: invitation.overrides || { textOverrides: {}, imageOverrides: {} },
      isPublished: invitation.isPublished,
      templateId: template.id,
      templateName: template.name,
      globalSettings: template.globalSettings || defaultGlobalSettings,
      sections: template.sections,
      activeSectionId: template.sections[0]?.id || null,
      selectedLayerId: null,
      isDirty: false,
    });
  },

  setTemplateName: (name) => set({ templateName: name, isDirty: true }),

  updateGlobalSettings: (settings) =>
    set((state) => ({
      globalSettings: { ...state.globalSettings, ...settings },
      isDirty: true,
    })),

  // --- Actions: Navigation & Selection ---
  setActiveSection: (sectionId) =>
    set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      const firstLayerId = section?.contentJson.layers[0]?.id || null;
      return {
        activeSectionId: sectionId,
        selectedLayerId: firstLayerId,
        currentTime: 0, // Reset timeline animation playback to start when switching section
      };
    }),

  setSelectedLayer: (layerId) => set({ selectedLayerId: layerId }),

  // --- Actions: Section Management ---
  addSection: (sectionType) =>
    set((state) => {
      const newOrder = state.sections.length + 1;
      const typeInfo = SECTION_TYPES_LIST.find((s) => s.type === sectionType);
      const label = typeInfo ? typeInfo.label : sectionType;

      const newSection: TemplateSectionData = {
        id: `sec-${sectionType}-${Date.now()}`,
        templateId: state.templateId || 'temp-1',
        sectionOrder: newOrder,
        sectionType,
        contentJson: {
          sectionHeight: CANVAS_HEIGHT,
          backgroundColor: '#ffffff',
          layers: [],
        },
      };

      const updatedSections = [...state.sections, newSection];
      return {
        sections: updatedSections,
        activeSectionId: newSection.id,
        selectedLayerId: null,
        isDirty: true,
      };
    }),

  removeSection: (sectionId) =>
    set((state) => {
      const filtered = state.sections.filter((s) => s.id !== sectionId);
      // Re-index section orders
      const reindexed = filtered.map((sec, idx) => ({ ...sec, sectionOrder: idx + 1 }));
      const nextActiveId = reindexed[0]?.id || null;
      return {
        sections: reindexed,
        activeSectionId: state.activeSectionId === sectionId ? nextActiveId : state.activeSectionId,
        selectedLayerId: null,
        isDirty: true,
      };
    }),

  reorderSections: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      const reindexed = result.map((sec, idx) => ({ ...sec, sectionOrder: idx + 1 }));
      return { sections: reindexed, isDirty: true };
    }),

  updateSectionBackground: (sectionId, bg) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                ...bg,
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  applyBackgroundToAllSections: (bg) =>
    set((state) => ({
      sections: state.sections.map((sec) => ({
        ...sec,
        contentJson: {
          ...sec.contentJson,
          ...bg,
        },
      })),
      isDirty: true,
    })),

  // --- Actions: Layer Manipulation (Builder) ---
  addLayer: (sectionId, layerType, initialData) =>
    set((state) => {
      const targetSection = state.sections.find((s) => s.id === sectionId);
      if (!targetSection) return state;

      const layerCount = targetSection.contentJson.layers.length;
      const maxZIndex = targetSection.contentJson.layers.reduce((max, l) => Math.max(max, l.position.zIndex), 0);

      const defaultContentMap: Record<LayerType, string> = {
        text: 'New Text Element',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        shape: '#8B5CF6',
        button: 'RSVP Now',
        icon: 'heart',
      };

      const baseLayer: ElementLayer = {
        id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${layerType.toUpperCase()} Layer ${layerCount + 1}`,
        type: layerType,
        content: defaultContentMap[layerType],
        fieldKey: `${layerType}_${Date.now()}`,
        fieldLabel: `${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Input`,
        position: {
          x: 40,
          y: 100 + (layerCount * 25) % 400,
          width: layerType === 'text' ? 295 : layerType === 'image' ? 200 : 150,
          height: layerType === 'text' ? 40 : layerType === 'image' ? 200 : 50,
          zIndex: maxZIndex + 1,
        },
        style: {
          fontSize: 16,
          color: '#1E293B',
          textAlign: 'center',
          opacity: 1,
        },
        timeline: {
          startTime: 0,
          endTime: 10,
          entrance: { type: 'fade', duration: 0.8, delay: 0 },
          exit: { type: 'none', duration: 0.5, delay: 0 },
        },
        isLocked: false,
        isHidden: false,
      };

      const newLayer: ElementLayer = {
        ...baseLayer,
        ...initialData,
        position: {
          ...baseLayer.position,
          ...(initialData?.position || {}),
        },
        style: {
          ...baseLayer.style,
          ...(initialData?.style || {}),
        },
      };

      return {
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                contentJson: {
                  ...sec.contentJson,
                  layers: [...sec.contentJson.layers, newLayer],
                },
              }
            : sec
        ),
        selectedLayerId: newLayer.id,
        isDirty: true,
      };
    }),

  updateLayer: (sectionId, layerId, updates) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) => (l.id === layerId ? { ...l, ...updates } : l)),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  updateLayerPosition: (sectionId, layerId, positionUpdates) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) =>
                  l.id === layerId
                    ? {
                        ...l,
                        position: { ...l.position, ...positionUpdates },
                      }
                    : l
                ),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  updateLayerStyle: (sectionId, layerId, styleUpdates) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) =>
                  l.id === layerId
                    ? {
                        ...l,
                        style: { ...l.style, ...styleUpdates },
                      }
                    : l
                ),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  updateLayerTimeline: (sectionId, layerId, timelineUpdates) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) =>
                  l.id === layerId
                    ? {
                        ...l,
                        timeline: {
                          ...l.timeline,
                          ...timelineUpdates,
                          entrance: timelineUpdates.entrance
                            ? { ...l.timeline.entrance, ...timelineUpdates.entrance }
                            : l.timeline.entrance,
                          exit: timelineUpdates.exit
                            ? { ...l.timeline.exit, ...timelineUpdates.exit }
                            : l.timeline.exit,
                        },
                      }
                    : l
                ),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  removeLayer: (sectionId, layerId) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.filter((l) => l.id !== layerId),
              },
            }
          : sec
      ),
      selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId,
      isDirty: true,
    })),

  duplicateLayer: (sectionId, layerId) =>
    set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      const layerToCopy = section?.contentJson.layers.find((l) => l.id === layerId);
      if (!layerToCopy || !section) return state;

      const duplicatedLayer: ElementLayer = {
        ...layerToCopy,
        id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${layerToCopy.name} (Copy)`,
        position: {
          ...layerToCopy.position,
          x: Math.min(CANVAS_WIDTH - layerToCopy.position.width, layerToCopy.position.x + 15),
          y: Math.min(CANVAS_HEIGHT - layerToCopy.position.height, layerToCopy.position.y + 15),
          zIndex: layerToCopy.position.zIndex + 1,
        },
      };

      return {
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                contentJson: {
                  ...sec.contentJson,
                  layers: [...sec.contentJson.layers, duplicatedLayer],
                },
              }
            : sec
        ),
        selectedLayerId: duplicatedLayer.id,
        isDirty: true,
      };
    }),

  toggleLayerLock: (sectionId, layerId) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) => (l.id === layerId ? { ...l, isLocked: !l.isLocked } : l)),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  toggleLayerHide: (sectionId, layerId) =>
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              contentJson: {
                ...sec.contentJson,
                layers: sec.contentJson.layers.map((l) => (l.id === layerId ? { ...l, isHidden: !l.isHidden } : l)),
              },
            }
          : sec
      ),
      isDirty: true,
    })),

  reorderLayerZIndex: (sectionId, layerId, action) =>
    set((state) => {
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return state;

      const layers = [...section.contentJson.layers].sort((a, b) => a.position.zIndex - b.position.zIndex);
      const currentIndex = layers.findIndex((l) => l.id === layerId);
      if (currentIndex === -1) return state;

      if (action === 'bringToFront') {
        const item = layers.splice(currentIndex, 1)[0];
        layers.push(item);
      } else if (action === 'sendToBack') {
        const item = layers.splice(currentIndex, 1)[0];
        layers.unshift(item);
      } else if (action === 'moveUp' && currentIndex < layers.length - 1) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex + 1];
        layers[currentIndex + 1] = temp;
      } else if (action === 'moveDown' && currentIndex > 0) {
        const temp = layers[currentIndex];
        layers[currentIndex] = layers[currentIndex - 1];
        layers[currentIndex - 1] = temp;
      }

      // Re-assign explicit sequential zIndex
      const updatedLayers = layers.map((l, idx) => ({
        ...l,
        position: { ...l.position, zIndex: idx + 1 },
      }));

      return {
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                contentJson: {
                  ...sec.contentJson,
                  layers: updatedLayers,
                },
              }
            : sec
        ),
        isDirty: true,
      };
    }),

  // --- Actions: Timeline Playback Engine ---
  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setTimelineDuration: (duration) => set({ timelineDuration: Math.max(1, duration) }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // --- Actions: Client Editor Overrides ---
  setOverride: (key, value, type) =>
    set((state) => {
      const targetMap = type === 'image' ? 'imageOverrides' : 'textOverrides';
      return {
        overrides: {
          ...state.overrides,
          [targetMap]: {
            ...state.overrides[targetMap],
            [key]: value,
          },
        },
        isDirty: true,
      };
    }),

  clearOverrides: () =>
    set({
      overrides: { textOverrides: {}, imageOverrides: {} },
      isDirty: true,
    }),

  setInvitationTitle: (title) => set({ invitationTitle: title, isDirty: true }),
  setIsPublished: (published) => set({ isPublished: published, isDirty: true }),

  // --- Helper Getters ---
  getActiveSection: () => {
    const state = get();
    return state.sections.find((s) => s.id === state.activeSectionId);
  },

  getSelectedLayer: () => {
    const state = get();
    const activeSection = state.sections.find((s) => s.id === state.activeSectionId);
    return activeSection?.contentJson.layers.find((l) => l.id === state.selectedLayerId);
  },

  getEffectiveLayerContent: (layer) => {
    const state = get();
    const { overrides } = state;

    if (layer.type === 'image') {
      if (layer.fieldKey && overrides.imageOverrides[layer.fieldKey]) {
        return overrides.imageOverrides[layer.fieldKey];
      }
      if (overrides.imageOverrides[layer.id]) {
        return overrides.imageOverrides[layer.id];
      }
    } else {
      if (layer.fieldKey && overrides.textOverrides[layer.fieldKey]) {
        return overrides.textOverrides[layer.fieldKey];
      }
      if (overrides.textOverrides[layer.id]) {
        return overrides.textOverrides[layer.id];
      }
    }

    return layer.content;
  },
}));
