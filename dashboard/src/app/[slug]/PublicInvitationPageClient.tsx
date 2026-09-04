'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { DesktopWebContainer } from '@/components/invitation/DesktopWebContainer';
import { VerticalInvitationScrollEngine } from '@/components/invitation/VerticalInvitationScrollEngine';
import { UserCheck } from 'lucide-react';

interface PublicInvitationPageClientProps {
  guestName?: string;
  slug?: string;
}

export default function PublicInvitationPageClient({ guestName, slug }: PublicInvitationPageClientProps) {
  const { sections, getEffectiveLayerContent, templateName } = useBuilderStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const coverBgImage =
    sections[0]?.contentJson.backgroundImage ||
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&auto=format&fit=crop&q=80';

  const audioUrl =
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-piano-112677.mp3';

  // Initialize Audio instance on client mount
  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  // Audio Autoplay Policy Bypass triggered by user gesture
  const handleToggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log('Audio autoplay prevented:', err));
    }
  };

  return (
    <DesktopWebContainer
      coverImage={coverBgImage}
      coupleNames={templateName || 'Romeo & Juliet'}
      activeSectionIndex={0}
      totalSections={sections.length}
      isPlayingAudio={isPlayingAudio}
      onToggleAudio={handleToggleAudio}
    >
      <div className="relative w-full h-full">
        {/* Guest Name Floating Banner Overlay on Cover (Section 1) */}
        {guestName && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/85 border border-amber-400/40 text-amber-200 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 max-w-[90%] text-center animate-fadeIn pointer-events-none select-none">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-300 block text-[10px]">Kepada Yth:</span>
              <strong className="font-bold text-amber-300 text-xs">{guestName}</strong>
            </div>
          </div>
        )}

        <VerticalInvitationScrollEngine
          sections={sections}
          getEffectiveLayerContent={getEffectiveLayerContent}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={handleToggleAudio}
        />
      </div>
    </DesktopWebContainer>
  );
}
