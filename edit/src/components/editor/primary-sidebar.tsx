"use client";

import Link from "next/link";
import { ArrowLeft, LayoutTemplate, Layers } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEditorStore } from "@/store/useEditorStore";

export default function PrimarySidebar() {
  const activeTab = useEditorStore((state) => state.activeTab);
  const onTabChange = useEditorStore((state) => state.setActiveTab);
  return (
    <aside className="w-14 h-screen bg-card/80 backdrop-blur-md border-r border-border/40 flex flex-col items-center py-3 justify-between z-30 shrink-0 select-none">
      <TooltipProvider>
        {/* Top Section: Navigation & Tools */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Back to Dashboard Icon */}
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              }
            />
            <TooltipContent side="right" className="text-xs">
              Kembali ke Dashboard
            </TooltipContent>
          </Tooltip>

          <div className="w-8 h-[1px] bg-border/40 my-1" />

          {/* Select Template Icon */}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => onTabChange("templates")}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    activeTab === "templates"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <LayoutTemplate className="h-5 w-5" />
                </button>
              }
            />
            <TooltipContent side="right" className="text-xs">
              Pilih Template
            </TooltipContent>
          </Tooltip>

          {/* Layer Settings Icon */}
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => onTabChange("layers")}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    activeTab === "layers"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Layers className="h-5 w-5" />
                </button>
              }
            />
            <TooltipContent side="right" className="text-xs">
              Pengaturan Layer
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </TooltipProvider>
    </aside>
  );
}
