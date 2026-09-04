'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { DesktopWebContainer, ContainerViewMode } from '@/components/invitation/DesktopWebContainer';
import { VerticalInvitationScrollEngine } from '@/components/invitation/VerticalInvitationScrollEngine';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { sections, getEffectiveLayerContent, templateName } = useBuilderStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [viewMode, setViewMode] = useState<ContainerViewMode>('desktop-web');

  if (!isOpen) return null;

  const coverBgImage =
    sections[0]?.contentJson.backgroundImage ||
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn overflow-hidden">
      <DesktopWebContainer
        coverImage={coverBgImage}
        coupleNames={templateName || 'Romeo & Juliet'}
        activeSectionIndex={0}
        totalSections={sections.length}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        isModalPreview={true}
        onCloseModal={onClose}
      >
        <VerticalInvitationScrollEngine
          sections={sections}
          getEffectiveLayerContent={getEffectiveLayerContent}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        />
      </DesktopWebContainer>
    </div>
  );
};
