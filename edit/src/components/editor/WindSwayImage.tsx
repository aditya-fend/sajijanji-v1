"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface WindSwayImageProps {
  src: string;
  alt: string;
  className?: string;
  amplitude?: number;
  duration?: number;
  intensity?: number;
  direction?: 1 | -1;
  objectFit?: "cover" | "contain" | "fill";
  borderRadius?: number;
  motionBlur?: boolean;
  delay?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export default function WindSwayImage({
  src,
  alt,
  className = "",
  amplitude = 22,
  duration = 4.2,
  intensity = 1.25,
  direction = 1,
  objectFit = "contain",
  borderRadius = 0,
  motionBlur = true,
  delay = 0.85,
  flipX = false,
  flipY = false,
}: WindSwayImageProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const stemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const stem = stemRef.current;
    if (!container || !stem) return;

    let tl: gsap.core.Timeline | null = null;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    const effectiveDirection = (flipX ? -1 : 1) * direction;
    const origin = flipY ? "50% 0%" : "50% 100%";

    const startAnimation = () => {
      if (tl) tl.kill();
      gsap.killTweensOf(stem);

      gsap.set(stem, {
        x: 0,
        y: 0,
        rotation: 0,
        skewX: 0,
        scaleY: 1,
        filter: "blur(0px)",
        transformOrigin: origin,
        force3D: true,
      });

      const angle = (amplitude / 18) * 5.2 * intensity * effectiveDirection;
      const skew = (amplitude / 18) * 2.2 * intensity * effectiveDirection;
      const shift = (amplitude / 18) * 6.5 * intensity * effectiveDirection;
      const maxBlur = motionBlur ? Math.min(2.2, 0.9 * intensity) : 0;
      const period = Math.max(1.8, duration);

      tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      // 1. Ayunan hembusan angin utama (bergerak cepat di tengah dengan motion blur, berhenti di puncak)
      tl.to(
        stem,
        {
          rotation: angle,
          skewX: skew,
          x: shift,
          scaleY: 0.988,
          duration: period * 0.48,
        },
        0,
      )
        .fromTo(
          stem,
          { filter: `blur(${maxBlur}px)` },
          { filter: "blur(0px)", duration: period * 0.24, ease: "power2.out" },
          period * 0.24,
        )
        // 2. Ayunan balik pegas elastis (inersia melewai titik setimbang dengan motion blur halus)
        .to(stem, {
          rotation: -angle * 0.72,
          skewX: -skew * 0.65,
          x: -shift * 0.68,
          scaleY: 0.994,
          duration: period * 0.52,
        })
        .fromTo(
          stem,
          { filter: "blur(0px)" },
          {
            filter: `blur(${maxBlur * 0.8}px)`,
            duration: period * 0.24,
            ease: "power2.in",
          },
          `-=${period * 0.44}`,
        )
        .to(
          stem,
          {
            filter: "blur(0px)",
            duration: period * 0.24,
            ease: "power2.out",
          },
          `-=${period * 0.2}`,
        );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Berikan jeda/delay agar animasi mount selesai secara mulus terlebih dahulu
          delayTimer = setTimeout(() => {
            startAnimation();
          }, Math.max(0, delay * 1000));
        } else {
          if (delayTimer) clearTimeout(delayTimer);
          if (tl) tl.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(container);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (tl) tl.kill();
      gsap.killTweensOf(stem);
      observer.disconnect();
    };
  }, [amplitude, duration, intensity, direction, motionBlur, delay, flipX, flipY]);

  return (
    <span
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
        borderRadius,
      }}
    >
      <div
        ref={stemRef}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "50% 100%",
          willChange: "transform, filter",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            borderRadius,
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
            transform: [flipX ? "scaleX(-1)" : "", flipY ? "scaleY(-1)" : ""]
              .filter(Boolean)
              .join(" ") || undefined,
          }}
        />
      </div>
    </span>
  );
}