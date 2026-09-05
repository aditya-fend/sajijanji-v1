"use client";

import React, { useState } from "react";
import {
  Home,
  Save,
  Eye,
  ExternalLink,
  ChevronRight,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { useBuilderStore } from "@/store/useBuilderStore";
import { saveTemplateAction } from "@/actions/templateActions";
import { PreviewModal } from "@/components/builder/PreviewModal";
import Link from "next/link";

export const TopNavbar: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const {
    templateId,
    templateName,
    globalSettings,
    sections,
    setTemplateName,
  } = useBuilderStore();

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await saveTemplateAction({
        id: templateId || "demo-template-1",
        name: templateName,
        globalSettings,
        sections,
      });

      if (res.success) {
        setSaveStatus("Published!");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("Error saving");
      }
    } catch {
      setSaveStatus("Error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Top Navbar Header (Clean White / Royal Blue Reference Theme) */}
      <header className="h-14 bg-white border-b border-slate-200 text-slate-800 px-6 flex items-center justify-between select-none z-30 font-sans shadow-xs">
        {/* Left: Breadcrumbs Path */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link
            href="/"
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title="Kembali ke Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            Customization
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            Themes
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-bold">Master Builder</span>
        </div>

        {/* Center: Template Title Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl px-4 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all w-56 sm:w-72"
            placeholder="Template Name..."
          />
        </div>

        {/* Right Actions: Draft icons & Royal Blue Publish Button (Matching Screenshot) */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-semibold text-emerald-600 animate-pulse hidden sm:inline">
              {saveStatus}
            </span>
          )}

          {/* Bookmark / Draft Save Icon Button */}
          <button
            onClick={handleSaveTemplate}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="Save Draft"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Interactive Preview Button */}
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="Preview Mobile Invitation"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Live Web View Link */}
          <Link
            href="/invitation/demo-template-1"
            target="_blank"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="View Published Web Page"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Royal Blue "Publish Changes" Primary Button (Exact Reference Design Match) */}
          <button
            onClick={handleSaveTemplate}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSaving ? "Publishing..." : "Publish Changes"}</span>
          </button>
        </div>
      </header>

      {/* Interactive Fullscreen Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </>
  );
};
