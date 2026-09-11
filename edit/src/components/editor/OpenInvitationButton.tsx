"use client";

import { useState } from "react";
import {
  Mail,
  MailOpen,
  Heart,
  Sparkles,
  Music,
  ChevronDown,
} from "lucide-react";
import type {
  ButtonIconType,
  ButtonVariantType,
} from "@/store/useEditorStore";
import gsap from "gsap";

interface OpenInvitationButtonProps {
  text?: string;
  icon?: ButtonIconType;
  variant?: ButtonVariantType;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function OpenInvitationButton({
  text = "Buka Undangan",
  icon = "mail",
  variant = "gold-luxury",
  pulse = true,
  className = "",
  onClick,
  disabled = false,
}: OpenInvitationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;

    // Micro-physics click feedback with GSAP
    const target = e.currentTarget;
    gsap.killTweensOf(target);
    gsap
      .timeline()
      .to(target, {
        scale: 0.92,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(target, {
        scale: 1.05,
        duration: 0.2,
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

  const renderIcon = () => {
    switch (icon) {
      case "mail":
        return isHovered ? (
          <MailOpen className="h-4 w-4 transition-transform duration-300 scale-110" />
        ) : (
          <Mail className="h-4 w-4 transition-transform duration-300" />
        );
      case "mail-open":
        return <MailOpen className="h-4 w-4" />;
      case "heart":
        return <Heart className="h-4 w-4 fill-current text-rose-400" />;
      case "sparkles":
        return <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />;
      case "music":
        return <Music className="h-4 w-4 animate-bounce" style={{ animationDuration: "2s" }} />;
      case "chevron-down":
        return <ChevronDown className="h-4 w-4 animate-pulse" />;
      default:
        return null;
    }
  };

  // Variant Visual Theme Styling
  let variantStyles = "";
  switch (variant) {
    case "glassmorphism":
      variantStyles =
        "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";
      break;
    case "pulse-glow":
      variantStyles =
        "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 font-bold border border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.5)]";
      break;
    case "rose-romantic":
      variantStyles =
        "bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 text-white font-semibold border border-rose-300/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]";
      break;
    case "minimal-outline":
      variantStyles =
        "bg-black/30 hover:bg-black/50 text-amber-300 border border-amber-400/80 backdrop-blur-sm shadow-md";
      break;
    case "gold-luxury":
    default:
      variantStyles =
        "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-neutral-950 font-bold border border-amber-300/80 shadow-[0_4px_20px_rgba(245,158,11,0.4)]";
      break;
  }

  return (
    <div className="relative inline-flex items-center justify-center w-full h-full select-none">
      {/* Animated Glowing Pulse Wave Rings */}
      {pulse && (
        <>
          <span className="absolute -inset-1 rounded-full bg-amber-400/25 blur-sm animate-ping pointer-events-none" style={{ animationDuration: "2.8s" }} />
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-400/30 to-amber-500/30 blur-xs animate-pulse pointer-events-none" style={{ animationDuration: "2s" }} />
        </>
      )}

      {/* Main Interactive Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center gap-2.5 w-full h-full px-5 py-2.5 rounded-full text-xs tracking-wide cursor-pointer transition-all duration-200 transform-gpu active:scale-95 ${variantStyles} ${className}`}
      >
        {renderIcon()}
        <span className="font-semibold truncate">{text}</span>
        {icon === "mail" && (
          <Sparkles className="h-3 w-3 text-amber-200/90 opacity-80" />
        )}
      </button>
    </div>
  );
}
