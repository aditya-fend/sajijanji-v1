'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { saveClientInvitationAction } from '@/actions/templateActions';
import {
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Heart,
  Globe,
  ImageIcon,
  Share2,
} from 'lucide-react';
import { SECTION_TYPES_LIST } from '@/types/builder';

export const ClientFormPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // SEO State
  const [ogTitle, setOgTitle] = useState('The Wedding of Romeo & Juliet');
  const [ogDescription, setOgDescription] = useState('Kami mengundang Anda untuk merayakan hari kebahagiaan pernikahan kami.');
  const [ogImage, setOgImage] = useState('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1000&auto=format&fit=crop&q=80');

  const {
    sections,
    activeSectionId,
    setActiveSection,
    overrides,
    setOverride,
    invitationTitle,
    templateId,
    invitationId,
  } = useBuilderStore();

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const activeSectionTypeInfo = SECTION_TYPES_LIST.find((s) => s.type === activeSection?.sectionType);

  const textLayers = activeSection?.contentJson.layers.filter((l) => l.type === 'text') || [];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await saveClientInvitationAction({
        id: invitationId || undefined,
        userId: 'client-user-1',
        templateId: templateId || 'demo-template-1',
        title: invitationTitle,
        overrides,
        isPublished: true,
      });

      if (res.success) {
        setSaveMessage({ type: 'success', text: 'Tersimpan dengan sukses!' });
      } else {
        setSaveMessage({ type: 'error', text: res.error || 'Gagal menyimpan' });
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-[420px] bg-white border-r border-slate-200 flex flex-col h-full select-none font-sans shadow-xs">
      {/* Client Header */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Heart className="w-4.5 h-4.5 fill-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Wedding Content Editor</h2>
            <p className="text-[11px] text-slate-500">Personalisasi teks isi & Open Graph WhatsApp</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/80 mt-3">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'content'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Content Fields</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'seo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO & WhatsApp</span>
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <>
          {/* Section Navigator Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Section to Edit (12 Sections)
            </label>
            <select
              value={activeSectionId || ''}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-blue-600 font-bold focus:outline-none focus:border-blue-600"
            >
              {sections.map((sec) => {
                const secInfo = SECTION_TYPES_LIST.find((s) => s.type === sec.sectionType);
                return (
                  <option key={sec.id} value={sec.id}>
                    {sec.sectionOrder}. {secInfo ? secInfo.label.split('. ')[1] : sec.sectionType}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Main Dynamic Text Form Inputs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {activeSectionTypeInfo?.label || 'Form Fields'}
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {textLayers.length} Fields
              </span>
            </div>

            {textLayers.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-2xl">
                No text form fields in this section. Switch section above.
              </div>
            ) : (
              textLayers.map((layer) => {
                const overrideKey = layer.fieldKey || layer.id;
                const currentValue = overrides.textOverrides[overrideKey] ?? layer.content;

                return (
                  <div
                    key={layer.id}
                    className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{layer.fieldLabel || layer.name}</span>
                      </label>
                    </div>

                    {layer.content.length > 40 ? (
                      <textarea
                        rows={3}
                        value={currentValue}
                        onChange={(e) => setOverride(overrideKey, e.target.value, 'text')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-sans"
                        placeholder={layer.placeholder || 'Enter text here...'}
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => setOverride(overrideKey, e.target.value, 'text')}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-sans"
                        placeholder={layer.placeholder || 'Enter text here...'}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* SEO & Open Graph Tab */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900">
            <span className="font-bold block mb-1 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> WhatsApp Link Preview
            </span>
            Atur thumbnail dan judul sosial media ketika link dikirim via WhatsApp.
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Judul Preview (OG Title)
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Deskripsi Preview (OG Description)
            </label>
            <textarea
              rows={3}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Gambar Thumbnail (OG Image URL)</span>
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            />
            {ogImage && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Alert */}
      {saveMessage && (
        <div className="px-4 py-2">
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              saveMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer Save Action */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Simpan Konten Undangan'}</span>
        </button>
      </div>
    </div>
  );
};
