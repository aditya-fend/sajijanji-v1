"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import type { TextEffectType } from "@/store/useEditorStore";

interface AnimatedTextProps {
  content: string;
  effect?: TextEffectType;
  className?: string;
  style?: CSSProperties;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold";
  textAlign?: "left" | "center" | "right";
  fontFamily?: string;
}

export default function AnimatedText({
  content = "",
  effect = "none",
  className = "",
  style = {},
  fontSize = 20,
  color = "#fcd34d",
  fontWeight = "normal",
  textAlign = "center",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState(effect === "typewriter" ? "" : content);
  const [showCursor, setShowCursor] = useState(effect === "typewriter");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset and cleanup previous effects
    gsap.killTweensOf(container);
    const childSpans = container.querySelectorAll<HTMLSpanElement>(".anim-char, .anim-word");
    gsap.killTweensOf(childSpans);

    if (effect === "none") {
      setTypedText(content);
      setShowCursor(false);
      return;
    }

    if (effect === "typewriter") {
      setTypedText("");
      setShowCursor(true);
      let currentIndex = 0;
      const textToType = content || "";
      const speed = Math.max(25, Math.min(80, 1500 / (textToType.length || 1)));

      const timer = setInterval(() => {
        if (currentIndex <= textToType.length) {
          setTypedText(textToType.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
          // Kedipan kursor berhenti perlahan setelah selesai mengetik
          setTimeout(() => setShowCursor(false), 2400);
        }
      }, speed);

      return () => clearInterval(timer);
    }

    if (effect === "stagger-chars") {
      setTypedText(content);
      setShowCursor(false);

      const chars = container.querySelectorAll<HTMLSpanElement>(".anim-char");
      if (chars.length > 0) {
        gsap.set(chars, {
          opacity: 0,
          y: 22,
          filter: "blur(8px)",
          scale: 0.85,
        });

        gsap.to(chars, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.65,
          stagger: 0.035,
          ease: "back.out(2.0)",
        });
      }
    }

    if (effect === "stagger-words") {
      setTypedText(content);
      setShowCursor(false);

      const words = container.querySelectorAll<HTMLSpanElement>(".anim-word");
      if (words.length > 0) {
        gsap.set(words, {
          opacity: 0,
          y: 24,
          filter: "blur(12px)",
        });

        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
        });
      }
    }

    if (effect === "blur-reveal") {
      setTypedText(content);
      setShowCursor(false);

      const chars = container.querySelectorAll<HTMLSpanElement>(".anim-char");
      if (chars.length > 0) {
        gsap.set(chars, {
          opacity: 0,
          filter: "blur(16px)",
          letterSpacing: "0.25em",
        });

        gsap.to(chars, {
          opacity: 1,
          filter: "blur(0px)",
          letterSpacing: "0em",
          duration: 0.85,
          stagger: 0.025,
          ease: "power2.out",
        });
      }
    }

    if (effect === "wave-float") {
      setTypedText(content);
      setShowCursor(false);

      const chars = container.querySelectorAll<HTMLSpanElement>(".anim-char");
      if (chars.length > 0) {
        gsap.set(chars, { opacity: 1, filter: "blur(0px)" });
        chars.forEach((char, index) => {
          gsap.to(char, {
            y: -7,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.08,
          });
        });
      }
    }
  }, [content, effect]);

  // Render Karakter untuk Stagger / Wave / Blur
  const renderFormattedContent = () => {
    if (effect === "typewriter") {
      return (
        <>
          <span>{typedText}</span>
          {showCursor && (
            <span className="inline-block animate-pulse text-amber-400 font-mono font-light ml-0.5">
              |
            </span>
          )}
        </>
      );
    }

    if (effect === "stagger-words") {
      const words = (content || "").split(" ");
      return words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-1.5 anim-word">
          {word}
        </span>
      ));
    }

    if (effect === "stagger-chars" || effect === "wave-float" || effect === "blur-reveal") {
      const characters = Array.from(content || "");
      return characters.map((char, charIndex) => (
        <span
          key={charIndex}
          className="inline-block anim-char"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }

    if (effect === "shimmer-gold") {
      return (
        <span
          className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 animate-shimmer"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #f59e0b 20%, #fef3c7 45%, #ffffff 50%, #fef3c7 55%, #f59e0b 80%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.8s linear infinite",
          }}
        >
          {content}
        </span>
      );
    }

    if (effect === "neon-pulse") {
      return (
        <span
          className="inline-block transition-all duration-700"
          style={{
            textShadow: `0 0 10px rgba(251, 191, 36, 0.6), 0 0 20px rgba(245, 158, 11, 0.4)`,
            animation: "pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          {content}
        </span>
      );
    }

    return content;
  };

  return (
    <div
      ref={containerRef}
      className={`${className} select-none`}
      style={{
        fontSize,
        color,
        fontWeight,
        textAlign,
        ...style,
      }}
    >
      {renderFormattedContent()}
    </div>
  );
}
