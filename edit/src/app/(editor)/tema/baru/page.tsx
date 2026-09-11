"use client";

import PrimarySidebar from "@/components/editor/primary-sidebar";
import SecondarySidebar from "@/components/editor/secondary-sidebar";
import Canvas from "@/components/editor/canvas";
import RightPropertiesSidebar from "@/components/editor/properties-sidebar";
import { useEditorStore } from "@/store/useEditorStore";

export default function BuatTemaBaruPage() {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* 1. Panel Ikon Kiri */}
      {!isPreviewMode && <PrimarySidebar />}

      {/* 2. Panel Detail Kiri (Templates / Layers) */}
      {!isPreviewMode && <SecondarySidebar />}

      {/* 3. Area Canvas Tengah */}
      <Canvas />

      {/* 4. Panel Properti Kanan */}
      {!isPreviewMode && <RightPropertiesSidebar />}
    </div>
  );
}
