'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { TemplateSectionData, ElementLayer, AnimationType } from '@/types/builder';

interface VerticalInvitationScrollEngineProps {
  sections: TemplateSectionData[];
  getEffectiveLayerContent: (layer: ElementLayer) => string;
  isPlayingAudio?: boolean;
  onToggleAudio?: () => void;
}

export const VerticalInvitationScrollEngine: React.FC<VerticalInvitationScrollEngineProps> = ({
  sections,
  getEffectiveLayerContent,
  isPlayingAudio = false,
  onToggleAudio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getEntranceVariants = (type: AnimationType) => {
    switch (type) {
      case 'slide-up':
        return { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'slide-down':
        return { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'slide-left':
        return { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'slide-right':
        return { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'zoom-in':
        return { initial: { scale: 0.4, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      case 'zoom-out':
        return { initial: { scale: 1.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } };
      case 'rotate':
        return { initial: { rotate: -180, scale: 0.8, opacity: 0 }, animate: { rotate: 0, scale: 1, opacity: 1 } };
      case 'bounce':
        return { initial: { y: -60, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'fade':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case 'none':
      default:
        return { initial: { opacity: 1 }, animate: { opacity: 1 } };
    }
  };

  const handleOpenInvitation = () => {
    if (onToggleAudio && !isPlayingAudio) {
      onToggleAudio();
    }
    const sec1Element = document.getElementById('invitation-section-1');
    if (sec1Element) {
      sec1Element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto scroll-smooth relative bg-white"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Stacked Vertical Sections (Section 1 to Section 12) */}
      {sections.map((section, sectionIndex) => {
        const isCover = sectionIndex === 0;

        return (
          <section
            key={section.id}
            id={`invitation-section-${sectionIndex}`}
            className="relative w-full h-full min-h-full overflow-hidden shrink-0 flex flex-col justify-center items-center"
            style={{
              backgroundColor: section.contentJson.backgroundColor || '#FFFDF9',
              backgroundImage: section.contentJson.backgroundImage
                ? `url(${section.contentJson.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '100%',
            }}
          >
            {/* Background Overlay */}
            {section.contentJson.backgroundOverlay && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ backgroundColor: section.contentJson.backgroundOverlay }}
              />
            )}

            {/* Canvas Layers Wrapper (375px Canvas Center Fit) */}
            <div className="relative w-[375px] h-[812px] max-w-full max-h-full shrink-0 my-auto flex flex-col justify-center items-center">
              {/* Render Section Layers */}
              {section.contentJson.layers.map((layer: ElementLayer) => {
                if (layer.isHidden) return null;

                const content = getEffectiveLayerContent(layer);
                const entranceType = layer.timeline.entrance.type || 'fade';
                const motionVariants = getEntranceVariants(entranceType);

                return (
                  <div
                    key={layer.id}
                    className="absolute"
                    style={{
                      left: `${layer.position.x}px`,
                      top: `${layer.position.y}px`,
                      width: `${layer.position.width}px`,
                      height: `${layer.position.height}px`,
                      zIndex: layer.position.zIndex,
                    }}
                  >
                    <motion.div
                      initial={motionVariants.initial}
                      whileInView={motionVariants.animate}
                      viewport={{ once: false, margin: '-20px' }}
                      transition={{
                        duration: layer.timeline.entrance.duration ?? 0.8,
                        delay: layer.timeline.entrance.delay ?? 0.1,
                        ease: 'easeOut',
                      }}
                      className="w-full h-full relative"
                      style={{
                        transform: layer.position.rotation
                          ? `rotate(${layer.position.rotation}deg)`
                          : undefined,
                        opacity: layer.style.opacity ?? 1,
                      }}
                    >
                      {layer.type === 'text' && (
                        <div
                          className="w-full h-full flex items-center justify-center leading-tight whitespace-pre-wrap select-none p-1 pointer-events-none"
                          style={{
                            fontSize: `${layer.style.fontSize || 16}px`,
                            fontFamily: layer.style.fontFamily || 'Inter, sans-serif',
                            fontWeight: layer.style.fontWeight || 'normal',
                            fontStyle: layer.style.fontStyle || 'normal',
                            textDecoration: layer.style.textDecoration || 'none',
                            textTransform: layer.style.textTransform || 'none',
                            textShadow: layer.style.textShadow || undefined,
                            color: layer.style.color || '#1E293B',
                            textAlign: layer.style.textAlign || 'center',
                            letterSpacing: layer.style.letterSpacing
                              ? `${layer.style.letterSpacing}px`
                              : undefined,
                            lineHeight: layer.style.lineHeight || 1.3,
                          }}
                        >
                          {content}
                        </div>
                      )}

                      {layer.type === 'image' && (
                        <img
                          src={content}
                          alt={layer.name}
                          className="w-full h-full object-cover select-none pointer-events-none rounded-sm"
                          style={{
                            borderRadius: layer.style.borderRadius
                              ? `${layer.style.borderRadius}px`
                              : undefined,
                            borderWidth: layer.style.borderWidth
                              ? `${layer.style.borderWidth}px`
                              : undefined,
                            borderColor: layer.style.borderColor || undefined,
                            borderStyle: layer.style.borderWidth ? 'solid' : undefined,
                            objectFit: layer.style.objectFit || 'cover',
                          }}
                        />
                      )}

                      {layer.type === 'shape' && (
                        <div
                          className="w-full h-full pointer-events-none"
                          style={{
                            backgroundColor: layer.style.backgroundColor || '#8B5CF6',
                            borderRadius: layer.style.borderRadius
                              ? `${layer.style.borderRadius}px`
                              : '4px',
                            borderWidth: layer.style.borderWidth
                              ? `${layer.style.borderWidth}px`
                              : undefined,
                            borderColor: layer.style.borderColor || undefined,
                          }}
                        />
                      )}

                      {layer.type === 'button' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCover) {
                              handleOpenInvitation();
                            } else {
                              const nextSec = document.getElementById(`invitation-section-${sectionIndex + 1}`);
                              if (nextSec) nextSec.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="w-full h-full flex items-center justify-center font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                          style={{
                            backgroundColor: layer.style.backgroundColor || '#6B5446',
                            color: layer.style.color || '#FFFFFF',
                            borderRadius: layer.style.borderRadius
                              ? `${layer.style.borderRadius}px`
                              : '24px',
                            fontSize: `${layer.style.fontSize || 14}px`,
                            fontFamily: layer.style.fontFamily || 'Inter, sans-serif',
                            boxShadow: '0 8px 20px rgba(107, 84, 70, 0.35)',
                          }}
                        >
                          {content}
                        </button>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
