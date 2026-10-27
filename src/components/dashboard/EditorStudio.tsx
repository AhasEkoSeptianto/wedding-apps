"use client";

import { useRef, useState } from "react";
import { WeddingData, StoryItem } from "@/types";
import { api } from "@/lib/api";
import { getAllThemes, getTheme, THEME_CATEGORIES } from "@/lib/themes";
import {
  AVAILABLE_PLACEHOLDERS,
  PRESET_HTML_TEMPLATES,
} from "@/lib/templateEngine";
export type { WeddingData };

interface EditorStudioProps {
  data: WeddingData;
  onChange: (newData: WeddingData) => void;
  activeTab: "tema" | "pasangan" | "acara" | "galeri" | "fitur" | "rsvp";
  onTabChange: (tab: "tema" | "pasangan" | "acara" | "galeri" | "fitur" | "rsvp") => void;
}

export default function EditorStudio({
  data,
  onChange,
  activeTab,
  onTabChange,
}: EditorStudioProps) {
  const groomInputRef = useRef<HTMLInputElement>(null);
  const brideInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [themeCategoryFilter, setThemeCategoryFilter] = useState<string>("Semua");
  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);
  const [tagCategoryFilter, setTagCategoryFilter] = useState<string>("Semua");
  const [showTagCheatSheet, setShowTagCheatSheet] = useState<boolean>(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleInsertTag = (tag: string) => {
    const textarea = htmlEditorRef.current;
    if (!textarea) {
      const current = data.customHtml || "";
      onChange({ ...data, customHtml: current + " " + tag });
      return;
    }
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const current = data.customHtml || "";
    const before = current.substring(0, start);
    const after = current.substring(end);
    const nextVal = before + tag + after;
    onChange({ ...data, customHtml: nextVal });

    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + tag.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const currentTheme = getTheme(data.themeId);
  const allThemes = getAllThemes();
  const filteredThemes =
    themeCategoryFilter === "Semua"
      ? allThemes
      : allThemes.filter((t) => t.category === themeCategoryFilter);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "groom" | "bride" | "gallery"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    try {
      if (target === "groom") setUploadingGroom(true);
      if (target === "bride") setUploadingBride(true);
      if (target === "gallery") setUploadingGallery(true);

      if (target === "gallery") {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const res = await api.uploadImage(files[i], "gallery");
          uploadedUrls.push(res.url);
        }
        const currentGallery = data.gallery || [];
        onChange({
          ...data,
          gallery: [...currentGallery, ...uploadedUrls],
        });
      } else {
        const file = files[0];
        const res = await api.uploadImage(file, target);
        if (target === "groom") {
          onChange({
            ...data,
            groom: { ...data.groom, photoUrl: res.url },
          });
        } else {
          onChange({
            ...data,
            bride: { ...data.bride, photoUrl: res.url },
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto ke Cloudinary";
      setUploadError(msg);
    } finally {
      if (target === "groom") setUploadingGroom(false);
      if (target === "bride") setUploadingBride(false);
      if (target === "gallery") setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const updateGroom = (field: string, val: string) => {
    onChange({
      ...data,
      groom: { ...data.groom, [field]: val },
    });
  };

  const updateBride = (field: string, val: string) => {
    onChange({
      ...data,
      bride: { ...data.bride, [field]: val },
    });
  };

  const updateQuote = (field: string, val: string) => {
    onChange({
      ...data,
      quote: { ...data.quote, [field]: val },
    });
  };

  const updateAkad = (field: string, val: string) => {
    onChange({
      ...data,
      events: {
        ...data.events,
        akad: { ...data.events.akad, [field]: val },
      },
    });
  };

  const updateResepsi = (field: string, val: string) => {
    onChange({
      ...data,
      events: {
        ...data.events,
        resepsi: { ...data.events.resepsi, [field]: val },
      },
    });
  };

  const updateStory = (index: number, field: keyof StoryItem, val: string) => {
    const currentStories = [...(data.stories || [])];
    if (currentStories[index]) {
      currentStories[index] = {
        ...currentStories[index],
        [field]: val,
      };
      onChange({
        ...data,
        stories: currentStories,
      });
    }
  };

  const addStory = () => {
    const currentStories = [...(data.stories || [])];
    currentStories.push({
      year: new Date().getFullYear().toString(),
      title: "Momen Baru",
      description: "Tuliskan cerita momen berharga Anda di sini...",
    });
    onChange({
      ...data,
      stories: currentStories,
    });
  };

  const removeStory = (index: number) => {
    const currentStories = (data.stories || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      stories: currentStories,
    });
  };

  const loadSampleStories = () => {
    onChange({
      ...data,
      stories: [
        {
          year: "2019",
          title: "Pertama Bertemu",
          description:
            "Bertemu tanpa sengaja di studio kreatif saat mengerjakan proyek kolaborasi bersama.",
        },
        {
          year: "2024",
          title: "Lamaran Romantis",
          description:
            "Di bawah gemerlap senja, mengucap janji suci untuk melangkah bersama ke jenjang pernikahan.",
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="bg-surface-container-lowest rounded-xl p-1.5 shadow-sm overflow-x-auto flex gap-1 border border-outline-variant/20 scrollbar-none">
        {[
          { id: "tema", label: "Desain Tema", icon: "palette" },
          { id: "pasangan", label: "Mempelai", icon: "favorite" },
          { id: "acara", label: "Acara", icon: "event" },
          { id: "galeri", label: "Galeri", icon: "photo_library" },
          { id: "fitur", label: "Fitur", icon: "stars" },
          { id: "rsvp", label: "RSVP", icon: "how_to_reg" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as typeof activeTab)}
            className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Cloudinary Upload Error Alert */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Tab 0: Desain Tema */}
      {activeTab === "tema" && (
        <div className="flex flex-col gap-4">
          {/* Mode Switcher: Tema Visual Bawaan vs Full Custom HTML */}
          <div className="bg-surface-container p-1 rounded-xl flex items-center gap-1 border border-outline-variant/20">
            <button
              type="button"
              onClick={() => onChange({ ...data, designMode: "standard" })}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                (data.designMode || "standard") === "standard"
                  ? "bg-surface-container-lowest text-on-surface shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">palette</span>
              <span>Katalog Tema Visual (Bawaan)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...data,
                  designMode: "custom_html",
                  customHtml: data.customHtml || PRESET_HTML_TEMPLATES[0].html,
                });
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                data.designMode === "custom_html"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">html</span>
              <span>Kustom Template HTML (Full Custom)</span>
            </button>
          </div>

          {/* Mode 1: Tema Visual Standar */}
          {(data.designMode || "standard") === "standard" ? (
            <>
              {/* Active Theme Highlight Banner */}
              <div
                className="p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.primary,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}18`,
                      color: currentTheme.colors.primary,
                      border: `1px solid ${currentTheme.colors.primary}40`,
                    }}
                  >
                    {currentTheme.ornament.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Tema Aktif
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {currentTheme.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-on-surface">
                      {currentTheme.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1 max-w-md">
                      {currentTheme.description}
                    </p>
                  </div>
                </div>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-surface-container border border-outline-variant/20">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: currentTheme.colors.bg }}
                      title="Warna Latar"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: currentTheme.colors.surface }}
                      title="Warna Kartu"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                      title="Warna Utama"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: currentTheme.colors.accent }}
                      title="Warna Aksen"
                    />
                  </div>
                  <a
                    href={`/demo?theme=${currentTheme.id}&slug=${data.slug || "dimas-sarah"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Full Preview</span>
                  </a>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {THEME_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setThemeCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      themeCategoryFilter === cat
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredThemes.map((themeItem) => {
                  const isSelected = (data.themeId || "royal-bloom") === themeItem.id;

                  return (
                    <div
                      key={themeItem.id}
                      className={`rounded-2xl overflow-hidden border transition-all flex flex-col bg-surface-container-lowest shadow-sm hover:shadow-md ${
                        isSelected
                          ? "ring-2 ring-primary border-primary"
                          : "border-outline-variant/25 hover:border-outline-variant/60"
                      }`}
                    >
                      {/* Thumbnail Banner */}
                      <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={themeItem.previewImage}
                          alt={themeItem.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Badge */}
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                          {themeItem.badge}
                        </span>

                        {/* Category */}
                        <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 flex items-center gap-1">
                          <span>{themeItem.ornament.symbol}</span>
                          <span>{themeItem.category}</span>
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-heading font-bold text-sm text-on-surface truncate">
                              {themeItem.name}
                            </h4>
                            {/* Swatches */}
                            <div className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: themeItem.colors.bg }}
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: themeItem.colors.primary }}
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: themeItem.colors.accent }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                            {themeItem.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                          <a
                            href={`/demo?theme=${themeItem.id}&slug=${data.slug || "dimas-sarah"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Preview</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => onChange({ ...data, themeId: themeItem.id })}
                            disabled={isSelected}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                : "bg-primary text-on-primary hover:bg-primary-container shadow-xs active:scale-95"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                <span>Sedang Digunakan</span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[14px]">palette</span>
                                <span>Terapkan Desain</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Mode 2: Full Custom HTML Template Studio */
            <div className="flex flex-col gap-4">
              {/* Custom HTML Info Banner */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">code</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">
                      Full Custom HTML Template Engine
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Ketik atau tempel kode HTML/CSS kustom Anda. Data user (nama, tanggal, galeri, kisah cinta, dll) akan otomatis terisi melalui tag <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded text-[11px]">{"{{placeholder}}"}</code>.
                    </p>
                  </div>
                </div>

                <a
                  href={`/demo?slug=${data.slug || "dimas-sarah"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Buka Preview HTML</span>
                </a>
              </div>

              {/* Preset Template Chooser */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                      Muat Template Bawaan (Preset)
                    </h4>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Klik untuk menerapkan struktur dasar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESET_HTML_TEMPLATES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Terapkan template "${preset.name}"? Kode HTML yang ada saat ini akan diganti dengan preset ini.`
                          )
                        ) {
                          onChange({ ...data, customHtml: preset.html });
                        }
                      }}
                      className="p-3 rounded-xl border border-outline-variant/20 hover:border-primary bg-surface hover:bg-surface-container transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                            {preset.name}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: preset.previewColor }}
                          />
                        </div>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">download</span>
                        <span>Pakai Template Ini</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Placeholders Toolbar */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">data_object</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                      Sisipkan Tag Data Dinamis (Klik untuk Memasukkan)
                    </h4>
                  </div>

                  {copiedTag && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-fade-in flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>{copiedTag} disisipkan!</span>
                    </span>
                  )}
                </div>

                {/* Category Pills for Tags */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    "Semua",
                    "Mempelai",
                    "Acara & Lokasi",
                    "Kutipan",
                    "Komponen Dinamis",
                    "Tamu & Hadiah",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTagCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        tagCategoryFilter === cat
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-surface-container-low rounded-lg border border-outline-variant/15">
                  {AVAILABLE_PLACEHOLDERS.filter((p) =>
                    tagCategoryFilter === "Semua" ? true : p.category === tagCategoryFilter
                  ).map((placeholder) => (
                    <button
                      key={placeholder.tag}
                      type="button"
                      onClick={() => handleInsertTag(placeholder.tag)}
                      title={`${placeholder.description} (Cth: ${placeholder.example})`}
                      className="px-2 py-1 rounded bg-surface hover:bg-primary hover:text-on-primary text-on-surface text-[11px] font-mono border border-outline-variant/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>{placeholder.tag}</span>
                      <span className="material-symbols-outlined text-[12px] opacity-60">add</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor Container */}
              <div className="bg-[#181a20] rounded-2xl border border-stone-800 shadow-md overflow-hidden flex flex-col">
                {/* Editor Header Bar */}
                <div className="bg-[#121316] px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-400">html</span>
                    <span className="font-mono font-bold text-stone-200">template.html</span>
                    <span className="text-[11px] text-stone-500">• HTML5 + CSS + Placeholders</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400 font-mono">
                      {(data.customHtml || "").length} Karakter
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.customHtml || "");
                        alert("Kode HTML berhasil disalin ke clipboard!");
                      }}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                      <span>Salin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Kembalikan kode HTML ke template bawaan Royal Gold?")) {
                          onChange({ ...data, customHtml: PRESET_HTML_TEMPLATES[0].html });
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">restart_alt</span>
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Textarea Editor */}
                <textarea
                  ref={htmlEditorRef}
                  value={data.customHtml || ""}
                  onChange={(e) => onChange({ ...data, customHtml: e.target.value })}
                  placeholder="<!DOCTYPE html>&#10;<html>&#10;...&#10;<h1>The Wedding of {{couple_names}}</h1>"
                  rows={20}
                  spellCheck={false}
                  className="w-full bg-[#181a20] text-stone-200 font-mono text-xs p-4 leading-relaxed outline-none resize-y border-0 focus:ring-0 selection:bg-primary/30"
                  style={{ minHeight: "420px" }}
                />

                {/* Editor Footer Bar */}
                <div className="bg-[#121316] px-4 py-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time Live Sync aktif ke Canvas Preview</span>
                  </div>
                  <span className="font-mono">UTF-8 • Sandbox Isolated</span>
                </div>
              </div>

              {/* Collapsible Live Tag Values Inspector */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowTagCheatSheet(!showTagCheatSheet)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                      Tabel Data Pengantin Saat Ini (Live Values)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform">
                    {showTagCheatSheet ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {showTagCheatSheet && (
                  <div className="p-4 border-t border-outline-variant/15 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-outline-variant/20 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                          <th className="pb-2 pr-3">Tag Placeholder</th>
                          <th className="pb-2 pr-3">Keterangan</th>
                          <th className="pb-2">Nilai Saat Ini (Diambil dari Form Anda)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10 font-sans">
                        {[
                          { tag: "{{couple_names}}", label: "Nama Panggilan", val: `${data.groom.nickName || "Dimas"} & ${data.bride.nickName || "Sarah"}` },
                          { tag: "{{groom_name}}", label: "Mempelai Pria", val: data.groom.fullName || "Dimas Prasetyo, S.T." },
                          { tag: "{{bride_name}}", label: "Mempelai Wanita", val: data.bride.fullName || "Sarah Anindita, M.Ds." },
                          { tag: "{{akad_date}}", label: "Tanggal Akad", val: data.events.akad.date || "Sabtu, 24 Agustus 2026" },
                          { tag: "{{akad_venue}}", label: "Lokasi Akad", val: data.events.akad.venue || "Masjid Agung Sunda Kelapa" },
                          { tag: "{{resepsi_date}}", label: "Tanggal Resepsi", val: data.events.resepsi.date || "Sabtu, 24 Agustus 2026" },
                          { tag: "{{resepsi_venue}}", label: "Lokasi Resepsi", val: data.events.resepsi.venue || "The Dharmawangsa Ballroom" },
                          { tag: "{{quote_source}}", label: "Sumber Kutipan", val: data.quote.source || "QS. Ar-Rum: 21" },
                          { tag: "{{gift_bca}}", label: "Rekening BCA", val: data.gift.bca || "8830-1928-11" },
                          { tag: "{{guest_name}}", label: "Nama Tamu", val: "[Dinamis dari URL ?to= atau ?guest=]" },
                          { tag: "{{gallery_grid}}", label: "Galeri Foto", val: `[${(data.gallery || []).length} Foto Terunggah]` },
                          { tag: "{{stories_timeline}}", label: "Kisah Cinta", val: `[${(data.stories || []).length} Kisah Cinta]` },
                        ].map((row) => (
                          <tr key={row.tag} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2 pr-3 font-mono text-[11px] text-primary font-bold">{row.tag}</td>
                            <td className="py-2 pr-3 text-on-surface-variant">{row.label}</td>
                            <td className="py-2 font-medium text-on-surface truncate max-w-xs">{row.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Mempelai */}
      {activeTab === "pasangan" && (
        <div className="flex flex-col gap-4">
          {/* Groom Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <h2 className="text-base font-bold text-on-surface">Data Mempelai Pria</h2>
              </div>
              <span className="text-[11px] font-semibold text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full">
                Groom
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                ref={groomInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "groom")}
              />
              <div
                onClick={() => !uploadingGroom && groomInputRef.current?.click()}
                className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 shadow-inner group ring-2 ring-primary/20 cursor-pointer"
                title="Klik untuk upload foto ke Cloudinary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={`w-full h-full object-cover transition-opacity ${uploadingGroom ? "opacity-30" : ""}`}
                  src={data.groom.photoUrl}
                  alt="Groom avatar"
                />
                <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  {uploadingGroom ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  )}
                </div>
                {uploadingGroom && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[22px] animate-spin text-primary">sync</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">Foto Utama Pria</p>
                <p className="text-xs text-on-surface-variant">
                  {uploadingGroom ? "Sedang mengunggah ke Cloudinary..." : "Tersimpan di Cloudinary • maks 10MB"}
                </p>
                <button
                  type="button"
                  disabled={uploadingGroom}
                  onClick={() => groomInputRef.current?.click()}
                  className="mt-1.5 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[14px] ${uploadingGroom ? "animate-spin" : ""}`}>
                    {uploadingGroom ? "sync" : "cloud_upload"}
                  </span>
                  <span>{uploadingGroom ? "Mengunggah..." : "Upload ke Cloudinary"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={data.groom.fullName}
                  onChange={(e) => updateGroom("fullName", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.groom.nickName}
                    onChange={(e) => updateGroom("nickName", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Instagram (@)
                  </label>
                  <input
                    type="text"
                    value={data.groom.instagram}
                    onChange={(e) => updateGroom("instagram", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  value={data.groom.parents}
                  onChange={(e) => updateGroom("parents", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Bride Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <h2 className="text-base font-bold text-on-surface">Data Mempelai Wanita</h2>
              </div>
              <span className="text-[11px] font-semibold text-tertiary bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
                Bride
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                ref={brideInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "bride")}
              />
              <div
                onClick={() => !uploadingBride && brideInputRef.current?.click()}
                className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 shadow-inner group ring-2 ring-tertiary/20 cursor-pointer"
                title="Klik untuk upload foto ke Cloudinary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={`w-full h-full object-cover transition-opacity ${uploadingBride ? "opacity-30" : ""}`}
                  src={data.bride.photoUrl}
                  alt="Bride avatar"
                />
                <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  {uploadingBride ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  )}
                </div>
                {uploadingBride && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[22px] animate-spin text-tertiary">sync</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">Foto Utama Wanita</p>
                <p className="text-xs text-on-surface-variant">
                  {uploadingBride ? "Sedang mengunggah ke Cloudinary..." : "Tersimpan di Cloudinary • maks 10MB"}
                </p>
                <button
                  type="button"
                  disabled={uploadingBride}
                  onClick={() => brideInputRef.current?.click()}
                  className="mt-1.5 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[14px] ${uploadingBride ? "animate-spin" : ""}`}>
                    {uploadingBride ? "sync" : "cloud_upload"}
                  </span>
                  <span>{uploadingBride ? "Mengunggah..." : "Upload ke Cloudinary"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={data.bride.fullName}
                  onChange={(e) => updateBride("fullName", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.bride.nickName}
                    onChange={(e) => updateBride("nickName", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Instagram (@)
                  </label>
                  <input
                    type="text"
                    value={data.bride.instagram}
                    onChange={(e) => updateBride("instagram", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  value={data.bride.parents}
                  onChange={(e) => updateBride("parents", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Quotes Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  format_quote
                </span>
                <span>Kutipan &amp; Quotes Romantis</span>
              </h3>
              <span className="text-xs text-on-surface-variant">Pilihan Religi / Universal</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Sumber Kutipan
              </label>
              <input
                type="text"
                value={data.quote.source}
                onChange={(e) => updateQuote("source", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Isi Kutipan Ayat / Makna Cinta
              </label>
              <textarea
                rows={3}
                value={data.quote.text}
                onChange={(e) => updateQuote("text", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest transition-all resize-none border border-transparent focus:border-primary/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Acara */}
      {activeTab === "acara" && (
        <div className="flex flex-col gap-4">
          {/* Akad Nikah */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">church</span>
                <span>Sesi 1: Akad Nikah</span>
              </h3>
              <span className="text-[11px] font-semibold bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full">
                Intimate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={data.events.akad.date}
                  onChange={(e) => updateAkad("date", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Waktu
                </label>
                <input
                  type="text"
                  value={data.events.akad.time}
                  onChange={(e) => updateAkad("time", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Nama Gedung / Tempat
              </label>
              <input
                type="text"
                value={data.events.akad.venue}
                onChange={(e) => updateAkad("venue", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={data.events.akad.address}
                onChange={(e) => updateAkad("address", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none resize-none border border-transparent focus:border-primary/40"
              />
            </div>
          </div>

          {/* Resepsi Pernikahan */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  celebration
                </span>
                <span>Sesi 2: Resepsi Mewah</span>
              </h3>
              <span className="text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                Grand Celebration
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={data.events.resepsi.date}
                  onChange={(e) => updateResepsi("date", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Waktu
                </label>
                <input
                  type="text"
                  value={data.events.resepsi.time}
                  onChange={(e) => updateResepsi("time", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Nama Ballroom / Hotel
              </label>
              <input
                type="text"
                value={data.events.resepsi.venue}
                onChange={(e) => updateResepsi("venue", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-2 uppercase">
                Pratinjau Peta Lokasi
              </label>
              <div
                className="w-full h-36 bg-cover bg-center rounded-lg shadow-inner relative flex items-end p-3"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhuwZmJqkm9BTwSR7dyWOOpXRRUB94OWmtdDkBkpsUGVe2-U6qORawD0sS6CZ1a8YUyvuCyO1rJAVnlMZjXGDCs1o-9AVuJFC6VmiW41O6j6wB7PJKJ_x031PuFlM8CzvQDeWQrVVp7bh-w4QEgVM44OeZS6HZZSfcBtJSEXpt2A8rcbqsNJvLje4R6upU124UbmkbL_dQvxbE5ls1WaW34Q7uVyCcG1DioTv2J68MSjqYfgrk4mnH4A')",
                }}
              >
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-on-surface flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    location_on
                  </span>
                  <span className="truncate">
                    {data.events.resepsi.venue || data.events.akad.venue || "Lokasi Acara"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Galeri & Cerita Cinta */}
      {activeTab === "galeri" && (
        <div className="flex flex-col gap-4">
          {/* Galeri Foto Prewedding */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">photo_library</span>
                  <span>Galeri Foto Prewedding</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {uploadingGallery
                    ? "Sedang mengunggah ke Cloudinary..."
                    : "Penyimpanan cloud Cloudinary aktif • Maks 10MB/foto"}
                </p>
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e, "gallery")}
              />
              <button
                type="button"
                disabled={uploadingGallery}
                onClick={() => galleryInputRef.current?.click()}
                className="text-xs font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${uploadingGallery ? "animate-spin" : ""}`}>
                  {uploadingGallery ? "sync" : "add_photo_alternate"}
                </span>
                <span>{uploadingGallery ? "Mengunggah..." : "Tambah Foto"}</span>
              </button>
            </div>

            {(!data.gallery || data.gallery.length === 0) ? (
              <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center bg-surface-container-low/40">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Belum Ada Foto Galeri</h4>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto mb-4">
                  Foto galeri tidak memiliki default stock. Unggah foto prewedding Anda ke cloud untuk langsung ditampilkan pada live preview dan website undangan.
                </p>
                <button
                  type="button"
                  disabled={uploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[18px] ${uploadingGallery ? "animate-spin" : ""}`}>
                    {uploadingGallery ? "sync" : "cloud_upload"}
                  </span>
                  <span>{uploadingGallery ? "Mengunggah ke Cloud..." : "Unggah Foto Prewedding"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group shadow-xs border border-outline-variant/20 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      src={imgUrl}
                      alt={`Prewedding ${idx + 1}`}
                    />
                    <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          const currentGallery = data.gallery || [];
                          onChange({
                            ...data,
                            gallery: currentGallery.filter((_, i) => i !== idx),
                          });
                        }}
                        title="Hapus foto dari galeri"
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110 border-none"
                      >
                        <span className="material-symbols-outlined text-[18px] block">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  disabled={uploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer transition-colors disabled:opacity-50"
                >
                  {uploadingGallery ? (
                    <span className="material-symbols-outlined text-[24px] animate-spin text-primary">sync</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                      <span className="text-xs font-medium mt-1">Upload Foto</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Cerita Cinta (Love Journey) */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">auto_stories</span>
                  <span>Cerita Cinta (Love Journey)</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Kustomisasi linimasa perjalanan cinta Anda yang tampil di preview &amp; undangan live.
                </p>
              </div>
              <button
                type="button"
                onClick={addStory}
                className="text-xs font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Tambah Momen</span>
              </button>
            </div>

            {(!data.stories || data.stories.length === 0) ? (
              <div className="border border-dashed border-outline-variant/40 rounded-xl p-6 text-center bg-surface-container-low/40">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant mb-2 block">history_edu</span>
                <p className="text-xs text-on-surface-variant mb-4">
                  Belum ada momen cerita cinta. Anda bisa menambahkan kisah sendiri atau memuat contoh bawaan.
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={addStory}
                    className="px-3.5 py-1.5 bg-primary text-on-primary hover:opacity-95 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Tambah Kisah Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleStories}
                    className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    <span>Gunakan Contoh Cerita</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {data.stories.map((story, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-3 relative transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-on-surface">
                          Momen #{idx + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStory(idx)}
                        className="text-on-surface-variant hover:text-red-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-red-50"
                        title="Hapus momen ini"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Tahun / Waktu
                        </label>
                        <input
                          type="text"
                          value={story.year || ""}
                          onChange={(e) => updateStory(idx, "year", e.target.value)}
                          placeholder="Contoh: 2019"
                          className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-outline-variant/30 focus:border-primary transition-all font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Judul Momen
                        </label>
                        <input
                          type="text"
                          value={story.title || ""}
                          onChange={(e) => updateStory(idx, "title", e.target.value)}
                          placeholder="Contoh: Pertama Bertemu"
                          className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-outline-variant/30 focus:border-primary transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Deskripsi Cerita
                      </label>
                      <textarea
                        rows={2}
                        value={story.description || ""}
                        onChange={(e) => updateStory(idx, "description", e.target.value)}
                        placeholder="Ceritakan momen indah perjalanan cinta Anda bersama pasangan..."
                        className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-xs sm:text-sm text-on-surface outline-none border border-outline-variant/30 focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Fitur Spesial */}
      {activeTab === "fitur" && (
        <div className="flex flex-col gap-4">
          {/* Background Music */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  music_note
                </span>
                <span>Musik Latar (Auto-play saat dibuka)</span>
              </h3>
              <div
                onClick={() =>
                  onChange({
                    ...data,
                    music: { ...data.music, enabled: !data.music.enabled },
                  })
                }
                className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                  data.music.enabled ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                    data.music.enabled ? "right-0.5" : "left-0.5"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/15">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">
                  {data.music.title}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Format MP3 • {data.music.duration}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Judul Lagu Latar &amp; Penyanyi
              </label>
              <input
                type="text"
                value={data.music.title}
                onChange={(e) =>
                  onChange({
                    ...data,
                    music: { ...data.music, title: e.target.value },
                  })
                }
                placeholder="Contoh: Kahitna - Soulmate (Instrumental Acoustic)"
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
              />
            </div>
          </div>

          {/* Amplop Digital */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">wallet</span>
              <span>Amplop Digital &amp; Kado Online</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Nomor Rekening BCA &amp; Atas Nama
                </label>
                <input
                  type="text"
                  value={data.gift.bca}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      gift: { ...data.gift, bca: e.target.value },
                    })
                  }
                  placeholder="Contoh: 8830-1928-11 a.n Sarah Anindita"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Nomor Rekening Mandiri &amp; Atas Nama
                </label>
                <input
                  type="text"
                  value={data.gift.mandiri}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      gift: { ...data.gift, mandiri: e.target.value },
                    })
                  }
                  placeholder="Contoh: 1370-0012-9901 a.n Dimas Prasetyo"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Dresscode */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                checkroom
              </span>
              <span>Panduan Dresscode Tamu</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              Sentuhan warna busana yang disarankan untuk keharmonisan foto:
            </p>
            <div className="flex items-center gap-4">
              {[
                { color: "#EAD8C0", label: "Champagne" },
                { color: "#466554", label: "Sage" },
                { color: "#EFE9DF", label: "Ivory" },
                { color: "#C2A382", label: "Terracotta" },
              ].map((swatch, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full shadow-sm ring-2 ring-primary/10"
                    style={{ backgroundColor: swatch.color }}
                  />
                  <span className="text-[11px] text-on-surface-variant">{swatch.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: RSVP Settings */}
      {activeTab === "rsvp" && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
              <span>Aturan Konfirmasi Tamu</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Batas Akhir RSVP
                </label>
                <input
                  type="date"
                  value={data.rsvp.deadline}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      rsvp: { ...data.rsvp, deadline: e.target.value },
                    })
                  }
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Maksimal Pendamping Per Tamu
                </label>
                <select
                  value={data.rsvp.maxGuests}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      rsvp: { ...data.rsvp, maxGuests: e.target.value },
                    })
                  }
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                >
                  <option value="1">1 Orang (+1 Tamu)</option>
                  <option value="2">2 Orang (+2 Keluarga)</option>
                  <option value="0">Khusus Nama Tertera Saja</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/15">
                <div>
                  <p className="text-xs font-semibold text-on-surface">Notifikasi WhatsApp</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Kirim alert instan saat tamu mengisi RSVP
                  </p>
                </div>
                <div
                  onClick={() =>
                    onChange({
                      ...data,
                      rsvp: {
                        ...data.rsvp,
                        waNotification: !data.rsvp.waNotification,
                      },
                    })
                  }
                  className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                    data.rsvp.waNotification ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                      data.rsvp.waNotification ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

