"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewProjectAction } from "@/actions/projectActions";
import { Heart, Sparkles, ArrowRight, Wand2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("demo-template-1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await createNewProjectAction({
        brideName: brideName.trim(),
        groomName: groomName.trim(),
        templateId: selectedTemplate,
      });

      if (res.success && res.redirectUrl) {
        const newProject = {
          id: res.projectId,
          brideName: brideName.trim(),
          groomName: groomName.trim(),
          slug: res.slug,
          templateId: selectedTemplate,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `project_${res.projectId}`,
          JSON.stringify(newProject),
        );

        router.push(res.redirectUrl);
      } else {
        setErrorMsg(res.error || "Failed to create project");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "An error occurred during project scaffolding",
      );
      setIsSubmitting(false);
    }
  };

  const previewSlug = `${groomName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${brideName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6 select-none font-sans">
      {/* Top Navbar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-bold text-base tracking-wide text-slate-900">
            Sajijanji Studio
          </span>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Kembali ke Dashboard
        </Link>
      </header>

      {/* Main Creation Form Card */}
      <main className="max-w-xl w-full mx-auto my-auto bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Project Initialization</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Inisialisasi Proyek Undangan Baru
          </h1>
          <p className="text-xs text-slate-500">
            Masukkan nama kedua mempelai untuk membuat URL slug khusus &
            metadata Open Graph.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Groom Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Mempelai Pria (Groom Name) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Romeo"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Bride Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Mempelai Wanita (Bride Name) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Juliet"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Select Master Template */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Pilih Master Template Theme
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            >
              <option value="demo-template-1">
                Tema 1: Soft Pastel Floral (12 Sections)
              </option>
              <option value="demo-template-2">
                Tema 2: Minimalist Studio Luxury
              </option>
              <option value="demo-template-3">
                Tema 3: Vintage Botanical Garden
              </option>
              <option value="demo-template-4">
                Tema 4: Royal Blue Gold Romance
              </option>
            </select>
          </div>

          {/* Dynamic Slug Preview */}
          {groomName && brideName && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-1">
              <span className="text-blue-900 font-bold block">
                Generated Public Link URL:
              </span>
              <code className="text-blue-600 font-mono font-bold">
                sajijanji.co/{previewSlug}
              </code>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !brideName || !groomName}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <span>Menyiapkan Proyek Undangan...</span>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Buat Proyek & Buka Editor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        Sajijanji Digital Wedding Invitation Platform Architecture © 2026
      </footer>
    </div>
  );
}
