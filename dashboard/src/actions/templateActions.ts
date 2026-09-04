'use me'; // Server Actions file
'use server';

import { prisma } from '@/lib/prisma';
import { MasterTemplateData, UserOverrideMap, UserInvitationData } from '@/types/builder';

/**
 * Server Action: Save Master Template layout & section JSON structures
 */
export async function saveTemplateAction(templateData: MasterTemplateData) {
  try {
    const { id, name, globalSettings, sections } = templateData;

    // 1. Upsert Template Record
    const template = await prisma.template.upsert({
      where: { id: id || 'demo-template-1' },
      update: {
        name,
        globalSettings: globalSettings as any,
      },
      create: {
        id: id || 'demo-template-1',
        name,
        globalSettings: globalSettings as any,
      },
    });

    // 2. Delete existing sections for this template & recreate
    await prisma.templateSection.deleteMany({
      where: { templateId: template.id },
    });

    // 3. Create Template Sections in order 1-12
    if (sections && sections.length > 0) {
      await prisma.templateSection.createMany({
        data: sections.map((sec, idx) => ({
          templateId: template.id,
          sectionOrder: sec.sectionOrder || idx + 1,
          sectionType: sec.sectionType,
          contentJson: sec.contentJson as any,
        })),
      });
    }

    return {
      success: true,
      templateId: template.id,
      message: 'Template successfully saved to database!',
    };
  } catch (error: any) {
    console.error('Error saving template:', error);
    return {
      success: false,
      error: error.message || 'Failed to save template to database',
    };
  }
}

/**
 * Server Action: Get Master Template layout by ID
 */
export async function getTemplateByIdAction(templateId: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        sections: {
          orderBy: { sectionOrder: 'asc' },
        },
      },
    });

    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    const formattedData: MasterTemplateData = {
      id: template.id,
      name: template.name,
      description: template.description,
      thumbnailUrl: template.thumbnailUrl,
      globalSettings: (template.globalSettings as any) || {},
      sections: template.sections.map((sec) => ({
        id: sec.id,
        templateId: sec.templateId,
        sectionOrder: sec.sectionOrder,
        sectionType: sec.sectionType as any,
        contentJson: (sec.contentJson as any) || { layers: [] },
      })),
    };

    return { success: true, template: formattedData };
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return { success: false, error: error.message || 'Failed to fetch template' };
  }
}

/**
 * Server Action: Save Client Invitation overrides (stores ONLY text/image replacements)
 */
export async function saveClientInvitationAction(payload: {
  id?: string;
  userId: string;
  templateId: string;
  title: string;
  overrides: UserOverrideMap;
  isPublished?: boolean;
}) {
  try {
    const { id, userId, templateId, title, overrides, isPublished = false } = payload;

    const invitation = await prisma.userInvitation.upsert({
      where: { id: id || `inv-${Date.now()}` },
      update: {
        title,
        overrides: overrides as any,
        isPublished,
      },
      create: {
        id: id || `inv-${Date.now()}`,
        userId: userId || 'user-demo-1',
        templateId,
        title,
        overrides: overrides as any,
        isPublished,
      },
    });

    return {
      success: true,
      invitationId: invitation.id,
      message: 'Invitation content overrides successfully saved!',
    };
  } catch (error: any) {
    console.error('Error saving user invitation:', error);
    return {
      success: false,
      error: error.message || 'Failed to save client invitation',
    };
  }
}
