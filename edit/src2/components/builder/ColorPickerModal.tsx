'use client';

import React, { useState } from 'react';
import { Pipette, ChevronDown, Check, X } from 'lucide-react';

interface ColorPickerModalProps {
  color: string;
  onChange: (newColor: string) => void;
  onClose: () => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  color,
  onChange,
  onClose,
}) => {
  const [hexInput, setHexInput] = useState(color || '#2563EB');
  const [opacity, setOpacity] = useState(100);

  const presets = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Yellow
    '#10B981', // Teal/Green
    '#06B6D4', // Cyan
    '#2563EB', // Royal Blue (Active)
    '#7C3AED', // Purple
    '#EC4899', // Pink
    '#1E293B', // Dark Navy
    '#475569', // Slate
    '#94A3B8', // Gray
    '#E2E8F0', // Light Gray
  ];

  const handleSelectPreset = (c: string) => {
    setHexInput(c);
    onChange(c);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-slate-800 z-50 font-sans animate-fadeIn select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          TEXT FILL
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer hover:bg-slate-200">
            <span>Normal</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Color Gradient Picker Area (Matching Screenshot) */}
      <div
        className="w-full h-36 rounded-xl relative mb-3 overflow-hidden cursor-crosshair shadow-inner"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hexInput})`,
        }}
      >
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-md bg-transparent" />
      </div>

      {/* Rainbow Hue Slider */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-pink-500 relative cursor-pointer shadow-xs">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-600 shadow-md absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Opacity Slider */}
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-transparent to-blue-600 relative cursor-pointer shadow-xs border border-slate-200">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-600 shadow-md absolute right-1 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Hex & Eyedropper Input Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
          <Pipette className="w-4 h-4" />
        </button>

        <div className="flex-1 bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            className="w-20 bg-transparent text-slate-900 font-mono font-bold focus:outline-none uppercase"
          />
          <span className="text-[10px] font-semibold text-slate-400">HEX</span>
        </div>

        <div className="w-14 bg-slate-100/80 border border-slate-200 rounded-lg px-2 py-1.5 text-center text-xs font-mono font-bold text-slate-800">
          {opacity}%
        </div>
      </div>

      {/* Preset Swatches Palette */}
      <div>
        <span className="text-[10px] font-semibold text-slate-400 block mb-2">Presets</span>
        <div className="grid grid-cols-6 gap-2">
          {presets.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectPreset(c)}
              className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 flex items-center justify-center ${
                hexInput.toLowerCase() === c.toLowerCase()
                  ? 'border-2 border-blue-600 scale-110 shadow-sm'
                  : 'border-slate-200'
              }`}
              style={{ backgroundColor: c }}
            >
              {hexInput.toLowerCase() === c.toLowerCase() && (
                <Check className="w-3 h-3 text-white drop-shadow-xs" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
