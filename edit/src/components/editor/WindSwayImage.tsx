"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";

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
  direction = -1,
  objectFit = "cover",
  borderRadius = 0,
}: WindSwayImageProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);

  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    const image = imageRef.current;

    if (!svg || !image) return;

    const state = {
      value: 0,
    };

    /*
     * GSAP hanya mengubah angka ini.
     * Tidak ada drawImage.
     * Tidak ada pixel loop.
     */
const render = () => {
  const value = state.value;

  const bend = amplitude * intensity * value * direction;

  const skew = bend * 0.018;

  image.setAttribute(
    "transform",
    `
      matrix(
        1
        0
        ${skew}
        1
        ${-bend}
        0
      )
    `,
  );
};

    gsap.set(state, {
      value: 0,
    });

    render();

    const tween = gsap.to(state, {
      value: 1,

      duration,

      ease: "sine.inOut",

      repeat: -1,

      yoyo: true,

      onUpdate: () => {
        gsap.set(image, {
          attr: {
            transform: getTransform(
              state.value,
              amplitude,
              intensity,
              direction,
            ),
          },
        });
      },
    });

function getTransform(
  progress: number,
  amplitudeValue: number,
  intensityValue: number,
  directionValue: 1 | -1,
) {
  const bend =
    amplitudeValue * intensityValue * progress * directionValue;

  const skew = bend * 0.018;

  return `
    matrix(
      1
      0
      ${skew}
      1
      ${-bend}
      0
    )
  `;
}

    return () => {
      tween.kill();
    };
  }, [amplitude, duration, intensity, direction]);

  const preserveAspectRatio =
    objectFit === "contain"
      ? "xMidYMid meet"
      : objectFit === "fill"
        ? "none"
        : "xMidYMid slice";

  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius,
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={{
          display: "block",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              rx={borderRadius > 0 ? 2 : 0}
            />
          </clipPath>
        </defs>

        <image
          ref={imageRef}
          href={src}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio={preserveAspectRatio}
          clipPath={`url(#${id}-clip)`}
        />
      </svg>
    </span>
  );
}
