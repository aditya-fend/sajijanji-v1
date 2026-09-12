"use client";

import React, { useState, useMemo } from "react";
import {
  Mail,
  MailOpen,
  Heart,
  Sparkles,
  Music,
  ChevronDown,
  Gift,
  Disc,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useEditorStore,
  type ButtonIconType,
  type ButtonVariantType,
  type ButtonBgType,
  type ButtonShapeType,
  type ButtonShadowType,
} from "@/store/useEditorStore";
import gsap from "gsap";

export interface OpenInvitationButtonProps {
  text?: string;
  icon?: ButtonIconType;
  variant?: ButtonVariantType;
  pulse?: boolean;
  className?: string;
  customCode?: string;
  onClick?: () => void;
  disabled?: boolean;
  bgType?: ButtonBgType;
  bgColor?: string;
  bgGradientEnd?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shape?: ButtonShapeType;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: string;
  textTransform?: "uppercase" | "capitalize" | "none";
  shadow?: ButtonShadowType;
}

// Convert CSS string "background: red; font-size: 14px" to React CSSProperties
function parseCssString(styleStr: string): React.CSSProperties {
  const styleObj: Record<string, string> = {};
  if (!styleStr || typeof styleStr !== "string") return styleObj;

  const declarations = styleStr.split(";");
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim();
    const val = decl.slice(colonIdx + 1).trim();
    if (!prop || !val) continue;

    const camelProp = prop.replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());
    styleObj[camelProp] = val;
  }
  return styleObj;
}

// Convert JSX style "{{ background: 'red', color: 'white' }}" to React CSSProperties
function parseJsxStyleString(jsxStr: string): React.CSSProperties {
  const styleObj: Record<string, string> = {};
  if (!jsxStr) return styleObj;

  const pairs = jsxStr.split(/,(?![^(]*\))/);
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = pair.slice(0, colonIdx).trim().replace(/['"`]/g, "");
    const val = pair.slice(colonIdx + 1).trim().replace(/['"`]/g, "");
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());
      styleObj[camelProp] = val;
    }
  }
  return styleObj;
}

// Extract standard fallback styles for common Tailwind classes to guarantee rendering
function getTailwindFallbackStyles(className: string): React.CSSProperties {
  const fallback: Record<string, string> = {};
  if (!className) return fallback;

  const tokens = className.split(/\s+/);
  for (const token of tokens) {
    // Border radius
    if (token === "rounded-full") fallback.borderRadius = "9999px";
    else if (token === "rounded-3xl") fallback.borderRadius = "24px";
    else if (token === "rounded-2xl") fallback.borderRadius = "16px";
    else if (token === "rounded-xl") fallback.borderRadius = "12px";
    else if (token === "rounded-lg") fallback.borderRadius = "8px";
    else if (token === "rounded-md") fallback.borderRadius = "6px";
    else if (token === "rounded-sm") fallback.borderRadius = "4px";
    else if (token === "rounded-none") fallback.borderRadius = "0px";

    // Font weight
    if (token === "font-bold") fallback.fontWeight = "700";
    else if (token === "font-semibold") fallback.fontWeight = "600";
    else if (token === "font-medium") fallback.fontWeight = "500";
    else if (token === "font-normal") fallback.fontWeight = "400";

    // Text colors
    if (token === "text-white") fallback.color = "#ffffff";
    else if (token === "text-black" || token === "text-neutral-950") fallback.color = "#0a0a0a";
    else if (token === "text-amber-300" || token === "text-amber-400") fallback.color = "#fcd34d";

    // Width / Height
    if (token === "w-full") fallback.width = "100%";
    if (token === "h-full") fallback.height = "100%";

    // Common gradients
    if (className.includes("from-amber-600") && className.includes("to-yellow-500")) {
      fallback.background = "linear-gradient(to right, #d97706, #fbbf24, #eab308)";
    } else if (className.includes("from-rose-500") && className.includes("to-rose-600")) {
      fallback.background = "linear-gradient(to right, #f43f5e, #fb7185, #e11d48)";
    } else if (className.includes("from-emerald-500") && className.includes("to-teal-600")) {
      fallback.background = "linear-gradient(to right, #10b981, #0d9488)";
    } else if (className.includes("bg-neutral-950")) {
      fallback.backgroundColor = "#0a0a0a";
    } else if (className.includes("bg-neutral-900")) {
      fallback.backgroundColor = "#171717";
    }
  }

  return fallback;
}

interface ParsedButtonResult {
  className: string;
  style: React.CSSProperties;
  innerHtml: string | null;
  hasCustomInner: boolean;
  text: string | null;
  borderRadius?: string;
  scopedCss?: string | null;
}

export function parseButtonCode(code?: string): ParsedButtonResult | null {
  if (!code || !code.trim()) return null;
  const trimmed = code.trim();

  // 1. Extract any <style>...</style> block if present
  let scopedCss: string | null = null;
  const styleTagMatch = trimmed.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (styleTagMatch) {
    scopedCss = styleTagMatch[1].trim();
  }

  // Remove <style> tag from remainder
  const cleanCode = trimmed.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").trim();

  // 2. Case: Raw CSS property declarations (e.g. "background: red; color: white; border-radius: 8px;")
  if (!cleanCode.startsWith("<") && cleanCode.includes(":") && cleanCode.includes(";")) {
    const parsedStyle = parseCssString(cleanCode);
    const radius = (parsedStyle.borderRadius as string) || undefined;
    return {
      className: "",
      style: parsedStyle,
      innerHtml: null,
      hasCustomInner: false,
      text: null,
      borderRadius: radius,
      scopedCss,
    };
  }

  // 3. Case: Raw Tailwind classes only (e.g. "w-full bg-blue-600 text-white font-bold rounded-xl")
  if (!cleanCode.startsWith("<")) {
    const fallbackStyle = getTailwindFallbackStyles(cleanCode);
    const radius = (fallbackStyle.borderRadius as string) || undefined;
    return {
      className: cleanCode,
      style: fallbackStyle,
      innerHtml: null,
      hasCustomInner: false,
      text: null,
      borderRadius: radius,
      scopedCss,
    };
  }

  // 4. Case: HTML or JSX Markup (<button ...>...</button> or <a ...> or <div ...)
  // Extract tag attributes
  let extractedClassName = "";
  const classMatch = cleanCode.match(/(?:className|class)\s*[:=]\s*["'{]([^"'}]+)["'}]/i);
  if (classMatch) {
    extractedClassName = classMatch[1].trim();
  }

  // Extract style: HTML style="..." or JSX style={{...}}
  let extractedStyle: React.CSSProperties = {};
  const jsxStyleMatch = cleanCode.match(/style\s*=\s*\{\{\s*([^}]+)\s*\}\}/);
  if (jsxStyleMatch) {
    extractedStyle = parseJsxStyleString(jsxStyleMatch[1]);
  } else {
    const htmlStyleMatch = cleanCode.match(/style\s*=\s*["']([^"']+)["']/i);
    if (htmlStyleMatch) {
      extractedStyle = parseCssString(htmlStyleMatch[1]);
    }
  }

  // Merge with fallback styles from className
  const twFallback = getTailwindFallbackStyles(extractedClassName);
  const finalStyle = { ...twFallback, ...extractedStyle };

  // Extract inner HTML content inside opening and closing tags
  let innerHtml: string | null = null;
  let text: string | null = null;
  let hasCustomInner = false;

  const tagMatch = cleanCode.match(/^<([a-zA-Z0-9]+)[^>]*>([\s\S]*)<\/\1>$/);
  if (tagMatch) {
    innerHtml = tagMatch[2].trim();
    // Check if innerHtml contains nested HTML tags (like <svg>, <span>, <i>, etc.)
    if (/<[a-zA-Z0-9]+[^>]*>/i.test(innerHtml)) {
      hasCustomInner = true;
      // Strip HTML tags to get pure text fallback
      text = innerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    } else {
      text = innerHtml || null;
    }
  } else {
    // Fallback inner regex
    const innerMatch = cleanCode.match(/>([^<]+)</);
    if (innerMatch && innerMatch[1].trim()) {
      text = innerMatch[1].trim();
    }
  }

  const radius =
    (finalStyle.borderRadius as string) ||
    (extractedClassName.includes("rounded-full") ? "9999px" : undefined);

  return {
    className: extractedClassName,
    style: finalStyle,
    innerHtml,
    hasCustomInner,
    text,
    borderRadius: radius,
    scopedCss,
  };
}

export default function OpenInvitationButton({
  text = "Buka Undangan",
  icon = "mail",
  variant = "gold-luxury",
  pulse = true,
  className = "",
  customCode,
  onClick,
  disabled = false,
  bgType,
  bgColor,
  bgGradientEnd,
  textColor,
  borderColor,
  borderWidth,
  borderRadius,
  shape,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  textTransform,
  shadow,
}: OpenInvitationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Parse legacy code if present
  const parsed = useMemo(() => parseButtonCode(customCode), [customCode]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();

    // Micro-physics click feedback with GSAP
    const target = e.currentTarget;
    gsap.killTweensOf(target);
    gsap
      .timeline()
      .to(target, {
        scale: 0.94,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(target, {
        scale: 1.04,
        duration: 0.18,
        ease: "back.out(2)",
      })
      .to(target, {
        scale: 1,
        duration: 0.15,
        ease: "power2.inOut",
        onComplete: () => {
          onClick?.();
        },
      });
  };

  const isMusicPlaying = useEditorStore((state) => state.isMusicPlaying);
  const isCustomCodeActive = Boolean(parsed && !bgType && !bgColor);
  const displayText = isCustomCodeActive && parsed?.text ? parsed.text : text;
  const isIconOnly = !displayText || displayText.trim() === "";

  const renderIcon = () => {
    const iconSizeClass = isIconOnly ? "h-5 w-5" : "h-4 w-4";
    switch (icon) {
      case "mail":
        return isHovered ? (
          <MailOpen className={`${iconSizeClass} transition-transform duration-300 scale-110 shrink-0`} />
        ) : (
          <Mail className={`${iconSizeClass} transition-transform duration-300 shrink-0`} />
        );
      case "mail-open":
        return <MailOpen className={`${iconSizeClass} shrink-0`} />;
      case "heart":
        return <Heart className={`${iconSizeClass} fill-current text-rose-400 shrink-0`} />;
      case "gift":
        return <Gift className={`${iconSizeClass} text-rose-300 shrink-0`} />;
      case "sparkles":
        return <Sparkles className={`${iconSizeClass} text-amber-300 animate-spin shrink-0`} style={{ animationDuration: "6s" }} />;
      case "music":
        return isMusicPlaying ? (
          <Disc className={`${iconSizeClass} text-emerald-300 animate-spin shrink-0`} style={{ animationDuration: "3s" }} />
        ) : (
          <VolumeX className={`${iconSizeClass} text-neutral-300/60 shrink-0`} />
        );
      case "chevron-down":
        return <ChevronDown className={`${iconSizeClass} animate-pulse shrink-0`} />;
      case "none":
      default:
        return null;
    }
  };

  // 1. Calculate border radius based on props
  let calculatedRadius = "9999px";
  if (typeof borderRadius === "number") {
    calculatedRadius = `${borderRadius}px`;
  } else if (shape === "pill") {
    calculatedRadius = "9999px";
  } else if (shape === "rounded-xl") {
    calculatedRadius = "16px";
  } else if (shape === "rounded-md") {
    calculatedRadius = "8px";
  } else if (shape === "square") {
    calculatedRadius = "0px";
  } else if (variant === "glassmorphism") {
    calculatedRadius = "16px";
  }

  // 2. Calculate background style
  const effectiveBgType =
    bgType ||
    (variant === "glassmorphism"
      ? "glass"
      : variant === "minimal-outline"
        ? "outline"
        : "gradient");

  let backgroundStyle = "";
  if (effectiveBgType === "solid") {
    backgroundStyle = bgColor || (variant === "rose-romantic" ? "#e11d48" : "#d97706");
  } else if (effectiveBgType === "glass") {
    backgroundStyle = bgColor || "rgba(255, 255, 255, 0.16)";
  } else if (effectiveBgType === "outline") {
    backgroundStyle = bgColor || "transparent";
  } else {
    // Default gradient
    const start = bgColor || (variant === "rose-romantic" ? "#f43f5e" : "#d97706");
    const end = bgGradientEnd || (variant === "rose-romantic" ? "#e11d48" : "#eab308");
    backgroundStyle = `linear-gradient(135deg, ${start}, ${end})`;
  }

  // 3. Calculate shadow style
  let shadowStyle = "0 4px 15px rgba(245, 158, 11, 0.35)";
  if (shadow === "none") {
    shadowStyle = "none";
  } else if (shadow === "soft") {
    shadowStyle = "0 4px 14px rgba(0, 0, 0, 0.25)";
  } else if (shadow === "glow") {
    shadowStyle = `0 0 22px ${bgColor ? `${bgColor}80` : "rgba(245, 158, 11, 0.55)"}`;
  } else if (shadow === "luxury") {
    shadowStyle = "0 8px 25px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.35)";
  } else if (effectiveBgType === "outline") {
    shadowStyle = "none";
  }

  const effectiveBorderWidth =
    typeof borderWidth === "number" ? borderWidth : 1;
  const effectiveBorderColor =
    borderColor ||
    (effectiveBgType === "glass"
      ? "rgba(255, 255, 255, 0.3)"
      : effectiveBgType === "outline"
        ? "rgba(252, 211, 77, 0.6)"
        : "#fcd34d");
  const effectiveTextColor =
    textColor ||
    (effectiveBgType === "outline"
      ? "#fcd34d"
      : effectiveBgType === "glass"
        ? "#ffffff"
        : "#0a0a0a");

  const dynamicStyle: React.CSSProperties = {
    background: backgroundStyle,
    color: effectiveTextColor,
    borderRadius: calculatedRadius,
    borderWidth: `${effectiveBorderWidth}px`,
    borderColor: effectiveBorderColor,
    borderStyle: effectiveBorderWidth === 0 ? "none" : "solid",
    boxShadow: shadowStyle,
    fontSize: fontSize ? `${fontSize}px` : "13px",
    fontWeight: fontWeight || "700",
    fontFamily: fontFamily || undefined,
    letterSpacing: letterSpacing || "0.05em",
    textTransform: textTransform || undefined,
    backdropFilter: effectiveBgType === "glass" ? "blur(12px)" : undefined,
    WebkitBackdropFilter: effectiveBgType === "glass" ? "blur(12px)" : undefined,
  };

  const finalStyle = isCustomCodeActive && parsed?.style ? parsed.style : dynamicStyle;
  const pulseRadius = isCustomCodeActive && parsed?.borderRadius ? parsed.borderRadius : calculatedRadius;

  return (
    <div className="relative inline-flex items-center justify-center w-full h-full select-none">
      {/* Optional scoped CSS from legacy customCode */}
      {isCustomCodeActive && parsed?.scopedCss && (
        <style dangerouslySetInnerHTML={{ __html: parsed.scopedCss }} />
      )}

      {/* Animated Glowing Pulse Wave Rings */}
      {pulse && (
        <>
          <span
            className="absolute -inset-1 bg-amber-400/25 blur-sm animate-ping pointer-events-none"
            style={{ borderRadius: pulseRadius, animationDuration: "2.8s" }}
          />
          <span
            className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/30 via-yellow-400/30 to-amber-500/30 blur-xs animate-pulse pointer-events-none"
            style={{ borderRadius: pulseRadius, animationDuration: "2s" }}
          />
        </>
      )}

      {/* Main Interactive Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={finalStyle}
        className={`relative flex items-center justify-center ${
          isIconOnly ? "p-0 gap-0" : "gap-2.5 px-5 py-2.5"
        } w-full h-full text-xs tracking-wide cursor-pointer transition-all duration-200 transform-gpu active:scale-95 ${className}`}
      >
        {isCustomCodeActive && parsed?.hasCustomInner && parsed.innerHtml ? (
          <div
            className="flex items-center justify-center gap-2 w-full h-full pointer-events-none"
            dangerouslySetInnerHTML={{ __html: parsed.innerHtml }}
          />
        ) : (
          <>
            {renderIcon()}
            {!isIconOnly && <span className="truncate">{displayText}</span>}
            {!isIconOnly && icon === "mail" && (
              <Sparkles className="h-3 w-3 text-amber-200/90 opacity-80 shrink-0" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
