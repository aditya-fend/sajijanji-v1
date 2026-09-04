'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimationType } from '@/types/builder';

interface MotionPreviewBoxProps {
  type: AnimationType;
  label: string;
  desc: string;
  physicsTheory: string;
  isSelected?: boolean;
  onSelect: () => void;
}

// Custom Geometric Vector Shapes (No Lucide Icons)
const FlowerShape = () => (
  <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-xs">
    <g transform="translate(20,20)">
      {/* 5 Floral Petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={i}
          d="M 0 0 C -8 -16 0 -22 0 -22 C 0 -22 8 -16 0 0 Z"
          fill="#EC4899"
          transform={`rotate(${angle})`}
          className="opacity-90"
        />
      ))}
      {/* Flower Center Core */}
      <circle r="5" fill="#F59E0B" />
      <circle r="2.5" fill="#FDE047" />
    </g>
  </svg>
);

const LeafShape = () => (
  <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-xs">
    <path
      d="M 6 34 C 6 34 8 18 22 8 C 34 0 36 4 36 4 C 36 4 34 22 18 30 C 8 35 6 34 6 34 Z"
      fill="#10B981"
    />
    <path d="M 6 34 Q 18 22 36 4" stroke="#047857" strokeWidth="1.5" fill="none" />
    <path d="M 16 22 L 22 24" stroke="#047857" strokeWidth="1" />
    <path d="M 22 16 L 28 18" stroke="#047857" strokeWidth="1" />
  </svg>
);

const CloudShape = () => (
  <svg viewBox="0 0 50 30" className="w-11 h-7 drop-shadow-xs">
    <path
      d="M 8 22 A 7 7 0 0 1 12 9 A 10 10 0 0 1 30 7 A 9 9 0 0 1 42 16 A 6 6 0 0 1 42 22 Z"
      fill="#38BDF8"
      className="opacity-90"
    />
    <path
      d="M 12 24 A 5 5 0 0 1 15 14 A 8 8 0 0 1 30 12 A 7 7 0 0 1 40 19 A 4 4 0 0 1 40 24 Z"
      fill="#FFFFFF"
    />
  </svg>
);

const WaveShape = () => (
  <svg viewBox="0 0 50 25" className="w-11 h-6">
    <path
      d="M 0 12 Q 12.5 4 25 12 T 50 12 L 50 25 L 0 25 Z"
      fill="#2563EB"
      className="opacity-80"
    />
    <path
      d="M 0 16 Q 12.5 8 25 16 T 50 16"
      stroke="#60A5FA"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const SmokeShape = () => (
  <div className="relative w-8 h-8 flex items-center justify-center">
    <div className="absolute w-6 h-6 rounded-full bg-slate-300/80 blur-[2px]" />
    <div className="absolute w-4 h-4 rounded-full bg-slate-400/60 blur-[1px] -top-1 left-1" />
    <div className="absolute w-3 h-3 rounded-full bg-slate-200/90 blur-[1px] top-2 -right-1" />
  </div>
);

const HeartShape = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 drop-shadow-xs">
    <path
      d="M 16 28 C 16 28 3 19 3 10 A 7 7 0 0 1 16 6 A 7 7 0 0 1 29 10 C 29 19 16 28 16 28 Z"
      fill="#EF4444"
    />
  </svg>
);

const PendulumShape = () => (
  <div className="flex flex-col items-center">
    <div className="w-0.5 h-7 bg-amber-600" />
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-700 shadow-xs" />
  </div>
);

const CardShape = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/60 shadow-xs flex items-center justify-center">
    <div className="w-4 h-4 border-2 border-white/80 rounded-md" />
  </div>
);

export const MotionPreviewBox: React.FC<MotionPreviewBoxProps> = ({
  type,
  label,
  desc,
  physicsTheory,
  isSelected,
  onSelect,
}) => {
  // Motion Keyframe Logic for Preview Box
  const getMiniAnimation = () => {
    switch (type) {
      case 'loop-wind-leaf':
        return {
          animate: {
            rotate: [-10, 16, -8, 14, -10],
            x: [0, 8, -4, 6, 0],
            y: [0, -3, 2, -2, 0],
          },
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        };
      case 'loop-wind-flower':
        return {
          animate: {
            rotate: [0, 22, 6, 26, 0],
            skewX: [0, -10, -2, -12, 0],
            x: [0, 10, 3, 12, 0],
          },
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
        };
      case 'loop-floating-petal':
        return {
          animate: {
            y: [-8, 8, -8],
            rotate: [-5, 5, -5],
            x: [-4, 4, -4],
          },
          transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        };
      case 'loop-breathe':
        return {
          animate: {
            scale: [1, 1.08, 1],
          },
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        };
      case 'wind-flower':
        return {
          animate: {
            rotate: [0, 24, 6, 28, 0],
            x: [0, 12, 3, 14, 0],
            skewX: [0, -10, -2, -12, 0],
          },
          transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
        };
      case 'leaf-rustle':
        return {
          animate: {
            rotate: [-12, 12, -8, 10, -12],
            scale: [1, 1.08, 0.96, 1.05, 1],
          },
          transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
        };
      case 'cloud-drift':
        return {
          animate: {
            x: [-32, 32, -32],
            y: [0, -2, 0, 2, 0],
          },
          transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
        };
      case 'ocean-wave':
        return {
          animate: {
            y: [-5, 5, -5],
            skewY: [-4, 4, -4],
            scaleY: [1, 1.15, 1],
          },
          transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
        };
      case 'smoke-convection':
        return {
          animate: {
            y: [12, -16, -28],
            scale: [0.5, 1.2, 1.6],
            opacity: [0, 0.9, 0],
          },
          transition: { repeat: Infinity, duration: 3, ease: 'easeOut' },
        };
      case 'pendulum-swing':
        return {
          animate: {
            rotate: [-28, 28, -28],
          },
          transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
          style: { transformOrigin: 'top center' },
        };
      case 'falling-leaf':
        return {
          animate: {
            y: [-16, 8, 20, 8, -16],
            x: [-14, 14, -10, 10, -14],
            rotate: [-20, 20, -15, 15, -20],
          },
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
        };
      case 'floating-sway':
        return {
          animate: {
            y: [-8, 8, -8],
            rotate: [-4, 4, -4],
          },
          transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
        };
      case 'gravity-drop':
        return {
          animate: {
            y: [-24, 6, -6, 2, 0, -24],
          },
          transition: { repeat: Infinity, duration: 2.5, times: [0, 0.4, 0.6, 0.75, 0.85, 1] },
        };
      case 'bounce':
        return {
          animate: {
            scale: [0.5, 1.2, 0.9, 1.05, 1, 0.5],
            opacity: [0.3, 1, 1, 1, 1, 0.3],
          },
          transition: { repeat: Infinity, duration: 2.2, times: [0, 0.3, 0.5, 0.7, 0.85, 1] },
        };
      case 'curved-spiral':
        return {
          animate: {
            rotate: [0, 360],
            scale: [0.3, 1.1, 1, 0.3],
            opacity: [0, 1, 1, 0],
          },
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        };
      case 'pulse-heartbeat':
        return {
          animate: {
            scale: [1, 1.25, 1, 1.15, 1, 1],
          },
          transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
        };
      case 'slide-up':
        return {
          animate: {
            y: [20, 0, 0, 20],
            opacity: [0, 1, 1, 0],
          },
          transition: { repeat: Infinity, duration: 2.2, times: [0, 0.3, 0.8, 1] },
        };
      case 'zoom-in':
        return {
          animate: {
            scale: [0.2, 1, 1, 0.2],
            opacity: [0, 1, 1, 0],
          },
          transition: { repeat: Infinity, duration: 2.2, times: [0, 0.3, 0.8, 1] },
        };
      case 'rotate':
        return {
          animate: {
            rotate: [0, 360],
          },
          transition: { repeat: Infinity, duration: 4, ease: 'linear' },
        };
      case 'fade':
      default:
        return {
          animate: { opacity: [0.2, 1, 1, 0.2] },
          transition: { repeat: Infinity, duration: 2.5 },
        };
    }
  };

  const miniMotion = getMiniAnimation();

  // Render Geometric Shape (No Icons)
  const renderGeometricShape = () => {
    switch (type) {
      case 'loop-wind-flower':
      case 'wind-flower':
      case 'floating-sway':
      case 'loop-floating-petal':
        return <FlowerShape />;
      case 'loop-wind-leaf':
      case 'leaf-rustle':
      case 'falling-leaf':
        return <LeafShape />;
      case 'cloud-drift':
        return <CloudShape />;
      case 'ocean-wave':
        return <WaveShape />;
      case 'smoke-convection':
        return <SmokeShape />;
      case 'pendulum-swing':
        return <PendulumShape />;
      case 'pulse-heartbeat':
        return <HeartShape />;
      case 'floating-sway':
        return <FlowerShape />;
      case 'gravity-drop':
      case 'bounce':
      default:
        return <CardShape />;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`group p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden ${
        isSelected
          ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-100 shadow-sm'
          : 'bg-slate-50/80 border-slate-200/90 hover:border-blue-400 hover:bg-white'
      }`}
    >
      {/* Mini Display Box (Geometric Shape Live Canvas) */}
      <div className="w-full h-20 bg-white rounded-xl border border-slate-200/80 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-blue-300 transition-colors shadow-xs">
        {/* Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

        {/* Live Animating Geometric Shape */}
        <motion.div
          animate={miniMotion.animate}
          transition={miniMotion.transition as any}
          style={miniMotion.style as any}
          className="z-10 flex items-center justify-center"
        >
          {renderGeometricShape()}
        </motion.div>

        <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400 bg-white/90 px-1 rounded border border-slate-100">
          SHAPE PREVIEW
        </span>
      </div>

      {/* Motion Info & Physics Theory Badge */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {label}
          </span>
          {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
        </div>
        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{desc}</p>
        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 text-[9px] font-mono font-bold">
          ⚛ {physicsTheory}
        </span>
      </div>
    </button>
  );
};
