"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate?: string;
  color?: string;
  fontSize?: number;
  className?: string;
}

export default function CountdownTimer({
  targetDate = "2026-09-20T08:00",
  color = "#fcd34d",
  fontSize = 28,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className={`w-full flex flex-col items-center justify-center select-none bg-transparent ${className}`}>
      <div
        className="flex items-center justify-center gap-3 sm:gap-5 font-mono font-bold tracking-widest drop-shadow-sm"
        style={{ color: color || "#fcd34d", fontSize: `${fontSize || 28}px` }}
      >
        <div className="flex flex-col items-center">
          <span>{pad(timeLeft.days)}</span>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-zinc-400 uppercase mt-1">
            HARI
          </span>
        </div>
        <span className="opacity-40 -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span>{pad(timeLeft.hours)}</span>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-zinc-400 uppercase mt-1">
            JAM
          </span>
        </div>
        <span className="opacity-40 -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span>{pad(timeLeft.minutes)}</span>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-zinc-400 uppercase mt-1">
            MENIT
          </span>
        </div>
        <span className="opacity-40 -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span>{pad(timeLeft.seconds)}</span>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-zinc-400 uppercase mt-1">
            DETIK
          </span>
        </div>
      </div>
    </div>
  );
}
