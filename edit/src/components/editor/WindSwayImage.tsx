"use client";

import type { CSSProperties } from "react";

interface WindSwayImageProps {
  src: string;
  alt: string;
  className?: string;
  amplitude?: number;
  duration?: number;
  intensity?: number;
  direction?: 1 | -1;
  segments?: number;
  objectFit?: "cover" | "contain" | "fill";
  borderRadius?: number;
}

export default function WindSwayImage({
  src,
  alt,
  className = "",
  amplitude = 18,
  duration = 4.8,
  intensity = 1,
  direction = 1,
  segments = 8,
  objectFit = "cover",
  borderRadius = 0,
}: WindSwayImageProps) {
  const safeSegments = Math.max(4, Math.min(12, segments));
  const strips = Array.from({ length: safeSegments }, (_, index) => {
    const normalized = index / (safeSegments - 1);
    const influence = normalized ** 1.35;
    const shift = amplitude * intensity * influence * direction;
    const topShift = shift * 1.08;
    const middleShift = shift * 0.62;
    const returnShift = shift * -0.78;
    const recoveryShift = shift * -0.28;
    const top = `${index * (100 / safeSegments)}%`;
    const height = `${100 / safeSegments + 0.35}%`;

    return (
      <span
        key={index}
        aria-hidden="true"
        className="wind-sway-strip"
        style={
          {
            top,
            height,
            backgroundImage: `url("${src}")`,
            backgroundSize: `100% ${safeSegments * 100}%`,
            backgroundPosition: `center ${index * (100 / (safeSegments - 1))}%`,
            objectFit,
            animationDuration: `${duration}s`,
            "--wind-a": `${middleShift}px`,
            "--wind-b": `${topShift}px`,
            "--wind-c": `${returnShift}px`,
            "--wind-d": `${recoveryShift}px`,
          } as CSSProperties
        }
      />
    );
  });

  return (
    <span
      role="img"
      aria-label={alt}
      className={`wind-sway-image ${className}`}
      style={{ borderRadius }}
    >
      {strips}
      <style jsx>{`
        .wind-sway-image {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          isolation: isolate;
        }

        .wind-sway-strip {
          position: absolute;
          left: -24px;
          width: calc(100% + 48px);
          display: block;
          background-repeat: no-repeat;
          transform: translate3d(0, 0, 0);
          transform-origin: center bottom;
          will-change: transform;
          animation-name: wind-sway;
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        @keyframes wind-sway {
          0% {
            transform: translate3d(0, 0, 0);
          }
          16% {
            transform: translate3d(var(--wind-a), 0, 0);
          }
          34% {
            transform: translate3d(var(--wind-b), 0, 0);
          }
          50% {
            transform: translate3d(calc(var(--wind-b) * 0.58), 0, 0);
          }
          68% {
            transform: translate3d(var(--wind-c), 0, 0);
          }
          84% {
            transform: translate3d(var(--wind-d), 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (max-width: 640px) {
          .wind-sway-strip {
            left: -14px;
            width: calc(100% + 28px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wind-sway-strip {
            animation: none;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </span>
  );
}
