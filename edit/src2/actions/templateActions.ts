import type {
  GlobalSettings,
  TemplateSectionData,
  UserOverrideMap,
} from "@/types/builder";

const TEMPLATE_STORAGE_PREFIX = "sajijanji_template_";
const INVITATION_STORAGE_PREFIX = "sajijanji_invitation_";

interface SaveTemplateInput {
  id: string;
  name: string;
  globalSettings: GlobalSettings;
  sections: TemplateSectionData[];
}

interface SaveClientInvitationInput {
  id?: string;
  userId: string;
  templateId: string;
  title: string;
  overrides: UserOverrideMap;
  isPublished: boolean;
}

interface ActionSuccess<T> {
  success: true;
  data: T;
}

interface ActionFailure {
  success: false;
  error: string;
}

export type SaveTemplateResult =
  | ActionSuccess<SaveTemplateInput>
  | ActionFailure;
export type SaveClientInvitationResult =
  | ActionSuccess<SaveClientInvitationInput & { id: string; updatedAt: string }>
  | ActionFailure;

const isBrowser = () => typeof window !== "undefined";

const getStorageError = () =>
  "Penyimpanan lokal tidak tersedia. Pastikan action dijalankan di browser.";

export async function saveTemplateAction(
  input: SaveTemplateInput,
): Promise<SaveTemplateResult> {
  if (!input.id || !input.name.trim()) {
    return { success: false, error: "ID dan nama template wajib diisi." };
  }

  if (!isBrowser()) {
    return { success: false, error: getStorageError() };
  }

  const template = {
    ...input,
    name: input.name.trim(),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      `${TEMPLATE_STORAGE_PREFIX}${input.id}`,
      JSON.stringify(template),
    );
    return { success: true, data: template };
  } catch {
    return {
      success: false,
      error: "Template gagal disimpan di penyimpanan lokal.",
    };
  }
}

export async function saveClientInvitationAction(
  input: SaveClientInvitationInput,
): Promise<SaveClientInvitationResult> {
  if (!input.userId || !input.templateId || !input.title.trim()) {
    return { success: false, error: "Data undangan belum lengkap." };
  }

  if (!isBrowser()) {
    return { success: false, error: getStorageError() };
  }

  const invitation = {
    ...input,
    id: input.id || `invitation-${Date.now()}`,
    title: input.title.trim(),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      `${INVITATION_STORAGE_PREFIX}${invitation.id}`,
      JSON.stringify(invitation),
    );
    return { success: true, data: invitation };
  } catch {
    return {
      success: false,
      error: "Undangan gagal disimpan di penyimpanan lokal.",
    };
  }
}
