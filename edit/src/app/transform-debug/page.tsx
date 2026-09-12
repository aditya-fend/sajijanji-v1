"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Vector2 } from "@/engine/geometry/Vector2";
import { Matrix2D } from "@/engine/geometry/Matrix2D";
import { CoordinateSystem } from "@/engine/geometry/CoordinateSystem";
import { HitTest, HandleType, ObjectTransformState } from "@/engine/interaction/HitTest";
import { ResizeController, ResizeSession } from "@/engine/interaction/ResizeController";
import { InteractionStateMachine, InteractionState } from "@/engine/interaction/InteractionStateMachine";

export default function TransformDebugPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactionMachineRef = useRef(new InteractionStateMachine());
  const [interactionState, setInteractionState] = useState<InteractionState>(InteractionState.IDLE);

  // Editable test object state
  const [objectState, setObjectState] = useState<ObjectTransformState>({
    x: 200,
    y: 150,
    width: 240,
    height: 140,
    rotation: 30,
    scaleX: 1,
    scaleY: 1,
    flipX: false,
    flipY: false,
  });

  const [lockAspect, setLockAspect] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Drag interaction state
  const [activeSession, setActiveSession] = useState<ResizeSession | null>(null);
  const [currentPointerWorld, setCurrentPointerWorld] = useState<Vector2 | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<HandleType | null>(null);

  // Live HUD metrics
  const [hudMetrics, setHudMetrics] = useState({
    activeHandle: "SE",
    rotation: "30°",
    zoom: "1.0x",
    initialDimensions: "240px × 140px",
    currentDimensions: "240px × 140px",
    derivedScale: "1.0000 × 1.0000",
    flipState: "X: false | Y: false",
    pointerScreen: "(0, 0)",
    pointerWorld: "(0, 0)",
    pointerLocal: "(0, 0)",
    effectivePointer: "(0, 0)",
    projectedHandle: "(0, 0)",
    actualRenderedHandle: "(0, 0)",
    pointerToHandleDistPx: "0.000000",
    orthogonalProjectionErrPx: "0.000000",
    renderedHandleErrPx: "0.000000",
    anchorErr12DecPx: "0.000000000000",
    aspectRatioErr: "0.000000e+0",
    cursorString: "default",
  });

  // Convert MouseEvent to Canvas World coordinates
  const getCanvasWorldPointer = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Vector2 => {
    const canvas = canvasRef.current;
    if (!canvas) return new Vector2(0, 0);
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    // World = Screen / Zoom
    return new Vector2(screenX / zoom, screenY / zoom);
  }, [zoom]);

  // Pointer Down -> Start Session
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldP = getCanvasWorldPointer(e);
    const camera = { x: 0, y: 0, zoom };
    const rect = canvasRef.current?.getBoundingClientRect();
    const screenP = rect ? new Vector2(e.clientX - rect.left, e.clientY - rect.top) : worldP;

    const hit = HitTest.hitTestHandles(screenP, objectState, camera, 12);
    if (hit && hit !== "ROT") {
      interactionMachineRef.current.transitionTo(InteractionState.RESIZING, "debug-object", hit);
      setInteractionState(InteractionState.RESIZING);
      const session = ResizeController.startSession(objectState, worldP, hit);
      setActiveSession(session);
      setCurrentPointerWorld(worldP);
    } else if (HitTest.hitTestObject(worldP, objectState)) {
      interactionMachineRef.current.transitionTo(InteractionState.SELECTED, "debug-object");
      setInteractionState(InteractionState.SELECTED);
    } else {
      interactionMachineRef.current.transitionTo(InteractionState.IDLE);
      setInteractionState(InteractionState.IDLE);
    }
  };

  // Pointer Move -> Update Session & Calculate Metrics
  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const worldP = getCanvasWorldPointer(e);
    const rect = canvasRef.current?.getBoundingClientRect();
    const screenP = rect ? new Vector2(e.clientX - rect.left, e.clientY - rect.top) : worldP;
    const camera = { x: 0, y: 0, zoom };

    const matrix = HitTest.getObjectMatrix(objectState);
    const localP = CoordinateSystem.worldToLocal(worldP, matrix);

    const hit = HitTest.hitTestHandles(screenP, objectState, camera, 12);
    setHoveredHandle(hit);

    if (!activeSession) {
      if (hit) {
        setInteractionState(InteractionState.HOVER_HANDLE);
      } else if (HitTest.hitTestObject(worldP, objectState)) {
        setInteractionState(InteractionState.HOVER_OBJECT);
      }
    }

    if (activeSession) {
      setCurrentPointerWorld(worldP);
      const updatedState = ResizeController.updateResize(activeSession, worldP, {
        lockAspectRatio: lockAspect,
      });
      setObjectState(updatedState);

      // Effective pointer
      const effPWorld = worldP.subtract(activeSession.pointerOffsetWorld);
      const isCorner = ["NW", "NE", "SW", "SE"].includes(activeSession.activeHandle);

      // Projected handle target
      let projectedHandleWorld = effPWorld;
      if (lockAspect && isCorner) {
        const Dworld = activeSession.initialHandleWorld.subtract(activeSession.oppositeAnchorWorld);
        const lenD = Dworld.length();
        const Dhat = Dworld.divide(lenD);
        const Vworld = effPWorld.subtract(activeSession.oppositeAnchorWorld);
        const q = Vworld.dot(Dhat);
        projectedHandleWorld = activeSession.oppositeAnchorWorld.add(Dhat.multiply(q));
      }

      // Actual rendered handle & anchor via canonical matrix
      const newMatrix = HitTest.getObjectMatrix(updatedState);
      const newHandles = HitTest.getHandles(updatedState.width, updatedState.height);
      const activeDesc = newHandles.find((h) => h.type === activeSession.activeHandle);
      const actualRenderedHandleWorld = activeDesc ? newMatrix.transformPoint(activeDesc.localPos) : new Vector2(0, 0);
      const actualRenderedAnchorWorld = activeDesc ? newMatrix.transformPoint(activeDesc.oppositeAnchorLocal) : new Vector2(0, 0);

      const pointerToHandleDist = effPWorld.distance(projectedHandleWorld);

      // Orthogonal Projection Error = |(P_eff - P_proj) . D|
      const Dworld = activeSession.initialHandleWorld.subtract(activeSession.oppositeAnchorWorld);
      const diffVec = effPWorld.subtract(projectedHandleWorld);
      const orthogonalProjErr = lockAspect && isCorner ? Math.abs(diffVec.dot(Dworld)) : 0;

      const renderedHandleErr = projectedHandleWorld.distance(actualRenderedHandleWorld);
      const anchorErr = activeSession.oppositeAnchorWorld.distance(actualRenderedAnchorWorld);

      const initAspect = activeSession.initialState.width / activeSession.initialState.height;
      const currentAspect = updatedState.width / updatedState.height;
      const aspectErr = lockAspect ? Math.abs(currentAspect - initAspect) : 0;

      const cursorStr = hit ? HitTest.getCursorForHandle(hit, updatedState.rotation) : "default";

      setHudMetrics({
        activeHandle: activeSession.activeHandle,
        rotation: `${updatedState.rotation}°`,
        zoom: `${zoom}x`,
        initialDimensions: `${activeSession.initialState.width}px × ${activeSession.initialState.height}px`,
        currentDimensions: `${Math.round(updatedState.width * 100) / 100}px × ${Math.round(updatedState.height * 100) / 100}px`,
        derivedScale: `${((updatedState.scaleX ?? 1)).toFixed(4)} × ${((updatedState.scaleY ?? 1)).toFixed(4)}`,
        flipState: `X: ${updatedState.flipX ?? false} | Y: ${updatedState.flipY ?? false}`,
        pointerScreen: `(${screenP.x.toFixed(1)}, ${screenP.y.toFixed(1)})`,
        pointerWorld: `(${worldP.x.toFixed(2)}, ${worldP.y.toFixed(2)})`,
        pointerLocal: `(${localP.x.toFixed(2)}, ${localP.y.toFixed(2)})`,
        effectivePointer: `(${effPWorld.x.toFixed(2)}, ${effPWorld.y.toFixed(2)})`,
        projectedHandle: `(${projectedHandleWorld.x.toFixed(2)}, ${projectedHandleWorld.y.toFixed(2)})`,
        actualRenderedHandle: `(${actualRenderedHandleWorld.x.toFixed(2)}, ${actualRenderedHandleWorld.y.toFixed(2)})`,
        pointerToHandleDistPx: pointerToHandleDist.toFixed(6),
        orthogonalProjectionErrPx: orthogonalProjErr.toFixed(6),
        renderedHandleErrPx: renderedHandleErr.toFixed(6),
        anchorErr12DecPx: anchorErr.toFixed(12),
        aspectRatioErr: aspectErr.toExponential(6),
        cursorString: cursorStr,
      });
    }
  };

  // Pointer Up -> End Session
  const handlePointerUp = () => {
    setActiveSession(null);
    setCurrentPointerWorld(null);
    interactionMachineRef.current.transitionTo(InteractionState.SELECTED, "debug-object");
    setInteractionState(InteractionState.SELECTED);
  };

  // Render Canvas Debug Visual Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(zoom, zoom);

    const matrix = HitTest.getObjectMatrix(objectState);
    const centerLocal = new Vector2(objectState.width / 2, objectState.height / 2);
    const centerWorld = matrix.transformPoint(centerLocal);

    // 1. Draw Object Fill
    ctx.save();
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.fillRect(0, 0, objectState.width, objectState.height);
    ctx.restore();

    // 2. PURPLE: Canonical Bounding Box
    ctx.save();
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    ctx.strokeStyle = "#a855f7"; // PURPLE
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(0, 0, objectState.width, objectState.height);
    ctx.restore();

    // 3. YELLOW: Local Axes (ux, uy) from Center
    const rad = (objectState.rotation * Math.PI) / 180;
    const ux = new Vector2(Math.cos(rad), Math.sin(rad));
    const uy = new Vector2(-Math.sin(rad), Math.cos(rad));

    ctx.lineWidth = 2 / zoom;
    // Local X Axis (YELLOW)
    ctx.strokeStyle = "#eab308";
    ctx.beginPath();
    ctx.moveTo(centerWorld.x, centerWorld.y);
    ctx.lineTo(centerWorld.x + ux.x * 80, centerWorld.y + ux.y * 80);
    ctx.stroke();
    // Local Y Axis (ORANGE-YELLOW)
    ctx.strokeStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(centerWorld.x, centerWorld.y);
    ctx.lineTo(centerWorld.x + uy.x * 80, centerWorld.y + uy.y * 80);
    ctx.stroke();

    // 4. WHITE: Actual Rendered Handles
    const handles = HitTest.getHandles(objectState.width, objectState.height);
    handles.forEach((h) => {
      if (h.type === "ROT") return;
      const hWorld = matrix.transformPoint(h.localPos);

      // Handle square (WHITE)
      ctx.fillStyle = h.type === hoveredHandle ? "#3b82f6" : "#ffffff"; // WHITE / BLUE HOVER
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2 / zoom;
      ctx.beginPath();
      ctx.rect(hWorld.x - 5 / zoom, hWorld.y - 5 / zoom, 10 / zoom, 10 / zoom);
      ctx.fill();
      ctx.stroke();
    });

    // Active Session Special Overlay
    if (activeSession) {
      // GREEN: Fixed Opposite Anchor Point
      const anchorWorld = activeSession.oppositeAnchorWorld;
      ctx.fillStyle = "#22c55e"; // GREEN
      ctx.beginPath();
      ctx.arc(anchorWorld.x, anchorWorld.y, 8 / zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();

      // CYAN: Constraint Line (Anchor -> Initial Handle)
      ctx.strokeStyle = "#06b6d4"; // CYAN
      ctx.setLineDash([4 / zoom, 4 / zoom]);
      ctx.beginPath();
      ctx.moveTo(anchorWorld.x, anchorWorld.y);
      ctx.lineTo(activeSession.initialHandleWorld.x, activeSession.initialHandleWorld.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // RED: Raw Pointer
      if (currentPointerWorld) {
        ctx.fillStyle = "#ef4444"; // RED
        ctx.beginPath();
        ctx.arc(currentPointerWorld.x, currentPointerWorld.y, 7 / zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // BLUE: Effective Pointer (Pointer Offset Corrected)
      const effectivePointerWorld = currentPointerWorld?.subtract(activeSession.pointerOffsetWorld);
      if (effectivePointerWorld) {
        ctx.fillStyle = "#3b82f6"; // BLUE
        ctx.beginPath();
        ctx.arc(effectivePointerWorld.x, effectivePointerWorld.y, 5 / zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // ORANGE: Expected Projected Handle
      if (effectivePointerWorld) {
        const isCorner = ["NW", "NE", "SW", "SE"].includes(activeSession.activeHandle);
        let projectedHandleWorld = effectivePointerWorld;
        if (lockAspect && isCorner) {
          const Dworld = activeSession.initialHandleWorld.subtract(activeSession.oppositeAnchorWorld);
          const lenD = Dworld.length();
          const Dhat = Dworld.divide(lenD);
          const Vworld = effectivePointerWorld.subtract(activeSession.oppositeAnchorWorld);
          const q = Vworld.dot(Dhat);
          projectedHandleWorld = activeSession.oppositeAnchorWorld.add(Dhat.multiply(q));
        }

        ctx.fillStyle = "#f97316"; // ORANGE
        ctx.beginPath();
        ctx.arc(projectedHandleWorld.x, projectedHandleWorld.y, 6 / zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5 / zoom;
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [objectState, activeSession, currentPointerWorld, hoveredHandle, zoom, lockAspect]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Canonical Transform Engine Forensic Debugger</h1>
          <p className="text-sm text-slate-400">
            Real-time visual debugger for Canva/Figma-like 2D affine geometry & matrix consistency.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            <span className="font-medium text-slate-200">Lock Aspect Ratio</span>
          </label>

          <div className="flex items-center gap-2 text-sm border-l border-slate-700 pl-4">
            <span className="text-slate-400">Rotation:</span>
            <input
              type="number"
              value={objectState.rotation}
              onChange={(e) => setObjectState({ ...objectState, rotation: parseFloat(e.target.value) || 0 })}
              className="w-16 bg-slate-800 border border-slate-700 text-center rounded py-1 font-mono text-xs text-indigo-300"
            />
            <span className="text-slate-400">°</span>
          </div>

          <div className="flex items-center gap-2 text-sm border-l border-slate-700 pl-4">
            <span className="text-slate-400">Zoom:</span>
            {[0.5, 1, 1.5, 2, 4].map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-2 py-1 text-xs font-mono rounded ${
                  zoom === z ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas & HUD Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6 flex-1">
        {/* Interactive Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center p-4 min-h-[580px]">
          <canvas
            ref={canvasRef}
            width={850}
            height={580}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            className="border border-slate-850 bg-slate-950 rounded-lg shadow-2xl cursor-crosshair"
          />

          {/* Color Legend */}
          <div className="absolute top-6 left-6 bg-slate-950/90 border border-slate-800 backdrop-blur-md px-3 py-2 rounded-md text-xs space-y-1.5 shadow-lg">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> PURPLE: Bounding Box</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> RED: Raw Pointer</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> BLUE: Effective Pointer</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span> CYAN: Constraint Line</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> GREEN: Fixed Opposite Anchor</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> YELLOW: Local Axes (ux, uy)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> ORANGE: Expected Handle</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block"></span> WHITE: Actual Rendered Handle</div>
          </div>
        </div>

        {/* Real-time Mathematical HUD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Real-time Forensic HUD
            </h2>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-500">Interaction State:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {interactionState}
                </span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-500">Active Handle / Cursor:</span>
                <span className="text-indigo-400 font-semibold">{hudMetrics.activeHandle} ({hudMetrics.cursorString})</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-500">Rotation / Zoom:</span>
                <span className="text-slate-300">{hudMetrics.rotation} | {hudMetrics.zoom}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-500">Init W/H → Current W/H:</span>
                <span className="text-slate-200">{hudMetrics.currentDimensions}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-500">Derived Scale Ratio:</span>
                <span className="text-indigo-300">{hudMetrics.derivedScale}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-500">Flip Reflection State:</span>
                <span className="text-slate-300">{hudMetrics.flipState}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 grid grid-cols-2 gap-1 text-[10px]">
                <div><span className="text-slate-500 block">SCREEN POINTER:</span><span className="text-slate-300 font-semibold">{hudMetrics.pointerScreen}</span></div>
                <div><span className="text-slate-500 block">LOCAL POINTER:</span><span className="text-slate-300 font-semibold">{hudMetrics.pointerLocal}</span></div>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">RAW WORLD POINTER (RED)</span>
                <span className="text-red-400 font-semibold">{hudMetrics.pointerWorld}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">EFFECTIVE POINTER (BLUE)</span>
                <span className="text-blue-400 font-semibold">{hudMetrics.effectivePointer}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PROJECTED HANDLE (ORANGE)</span>
                <span className="text-orange-400 font-semibold">{hudMetrics.projectedHandle}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ACTUAL RENDERED HANDLE (WHITE)</span>
                <span className="text-emerald-400 font-semibold">{hudMetrics.actualRenderedHandle}</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">POINTER-TO-HANDLE DISTANCE</span>
                <span className="text-slate-300">{hudMetrics.pointerToHandleDistPx} px</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ORTHOGONAL PROJECTION ERROR</span>
                <span className="text-emerald-400 font-semibold">{hudMetrics.orthogonalProjectionErrPx} px</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">RENDERED HANDLE ERROR</span>
                <span className="text-cyan-400 font-semibold">{hudMetrics.renderedHandleErrPx} px</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ANCHOR ERROR (12 DECIMALS)</span>
                <span className="text-amber-400 font-semibold">{hudMetrics.anchorErr12DecPx} px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
