interface CreateNewProjectInput {
  brideName: string;
  groomName: string;
  templateId: string;
}

interface CreateNewProjectResult {
  success: true;
  projectId: string;
  slug: string;
  redirectUrl: string;
  error?: never;
}

interface CreateProjectFailure {
  success: false;
  error: string;
}

export type CreateNewProjectActionResult =
  | CreateNewProjectResult
  | CreateProjectFailure;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function createNewProjectAction(
  input: CreateNewProjectInput,
): Promise<CreateNewProjectActionResult> {
  const brideName = input.brideName.trim();
  const groomName = input.groomName.trim();

  if (!brideName || !groomName || !input.templateId) {
    return { success: false, error: "Nama pasangan dan template wajib diisi." };
  }

  const projectId = `project-${Date.now()}`;
  const slug = `${slugify(groomName)}-${slugify(brideName)}`;

  return {
    success: true,
    projectId,
    slug,
    redirectUrl: `/editor/${projectId}`,
  };
}
