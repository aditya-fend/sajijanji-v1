'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { DesktopWebContainer } from '@/components/invitation/DesktopWebContainer';
import { VerticalInvitationScrollEngine } from '@/components/invitation/VerticalInvitationScrollEngine';

export default function PublicInvitationPage() {
  const { sections, getEffectiveLayerContent, templateName } = useBuilderStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const coverBgImage =
    sections[0]?.contentJson.backgroundImage ||
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop&q=80';

  return (
    <DesktopWebContainer
      coverImage={coverBgImage}
      coupleNames={templateName || 'Vidi & Hening'}
      activeSectionIndex={0}
      totalSections={sections.length}
      isPlayingAudio={isPlayingAudio}
      onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
    >
      <VerticalInvitationScrollEngine
        sections={sections}
        getEffectiveLayerContent={getEffectiveLayerContent}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
      />
    </DesktopWebContainer>
  );
}
