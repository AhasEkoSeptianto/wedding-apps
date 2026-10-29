"use client";

import { useRef, useState, useEffect } from "react";
import { WeddingData, StoryItem, HtmlTemplate } from "@/types";
import { api } from "@/lib/api";
import {
  PRESET_HTML_TEMPLATES,
} from "@/lib/templateEngine";
import { getWeddingLivePath, getWeddingLiveUrl, formatCoupleSlug } from "@/lib/slug";
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

  // HTML Templates fetched from Admin & MongoDB
  const [htmlTemplates, setHtmlTemplates] = useState<HtmlTemplate[]>([]);
  const [htmlCategoryFilter, setHtmlCategoryFilter] = useState<string>("Semua");
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    setLoadingTemplates(true);
    api.getTemplates()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setHtmlTemplates(res.data);
        } else {
          setHtmlTemplates(
            PRESET_HTML_TEMPLATES.map((p) => ({
              id: p.id,
              slug: p.id,
              name: p.name,
              category: p.category,
              description: p.description,
              previewColor: p.previewColor,
              html: p.html,
              isPreset: true,
              isActive: true,
            }))
          );
        }
      })
      .catch(() => {
        setHtmlTemplates(
          PRESET_HTML_TEMPLATES.map((p) => ({
            id: p.id,
            slug: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            previewColor: p.previewColor,
            html: p.html,
            isPreset: true,
            isActive: true,
          }))
        );
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  const activeHtmlTemplate =
    htmlTemplates.find((t) => t.slug === data.themeId || t.id === data.themeId) ||
    htmlTemplates[0] ||
    PRESET_HTML_TEMPLATES[0];

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
    const updatedGroom = { ...data.groom, [field]: val };
    const shouldUpdateSlug = field === "nickName" && val.trim().length > 0;
    const newSlug = shouldUpdateSlug
      ? formatCoupleSlug(val, data.bride.nickName || data.bride.fullName)
      : (data.slug || "dimas&sarah");

    onChange({
      ...data,
      slug: newSlug,
      groom: updatedGroom,
    });
  };

  const updateBride = (field: string, val: string) => {
    const updatedBride = { ...data.bride, [field]: val };
    const shouldUpdateSlug = field === "nickName" && val.trim().length > 0;
    const newSlug = shouldUpdateSlug
      ? formatCoupleSlug(data.groom.nickName || data.groom.fullName, val)
      : (data.slug || "dimas&sarah");

    onChange({
      ...data,
      slug: newSlug,
      bride: updatedBride,
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
          { id: "tema", label: "Desain Undangan", icon: "style" },
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

      {/* Tab 0: Desain Undangan (Hanya Template HTML Pilihan Desainer dari Katalog) */}
      {activeTab === "tema" && (
        <div className="flex flex-col gap-5">
          {/* Active Template Showcase Card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-primary/40 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Desain Aktif Anda (Dipilih dari Katalog)</span>
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Kategori: <strong className="text-on-surface">{activeHtmlTemplate?.category || "Luxury"}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/30 relative shadow-sm"
                style={{
                  backgroundColor: `${activeHtmlTemplate?.previewColor || "#c5a059"}20`,
                }}
              >
                {activeHtmlTemplate?.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeHtmlTemplate.thumbnailUrl}
                    alt={activeHtmlTemplate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[32px]">style</span>
                  </div>
                )}
                <span
                  className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: activeHtmlTemplate?.previewColor || "#c5a059" }}
                  title="Warna Aksen Desain"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-on-surface">
                    {activeHtmlTemplate?.name || "Template Desainer"}
                  </h3>
                  {activeHtmlTemplate?.tierBadge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-900 border border-amber-300">
                      {activeHtmlTemplate.tierBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {activeHtmlTemplate?.description || "Template undangan HTML eksklusif dengan tata letak anggun dan tipografi mewah."}
                </p>
                <div className="pt-1 flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">brush</span>
                    <span>Desainer: <strong className="text-on-surface">{activeHtmlTemplate?.designer || "Atelier JanjiSuci"}</strong></span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                    <span>Format HTML Murni</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-center">
                <a
                  href={getWeddingLivePath(data.slug || "dimas&sarah")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Buka Preview Full (/{data.slug || "dimas&sarah"})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Catalog Explanation & Switcher */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome_motion</span>
                  <span>Ganti Desain dari Katalog Tim Desainer</span>
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Pilihan desain yang tersedia dikurasi oleh staf desainer JanjiSuci. Pilih template yang Anda inginkan dari katalog di bawah ini:
                </p>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:text-primary-container inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                <span>Lihat Album Lengkap di Beranda</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </a>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {["Semua", "Luxury", "Floral", "Modern", "Tradisional", "Rustic"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setHtmlCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      htmlCategoryFilter === cat
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Grid List */}
              {loadingTemplates ? (
                <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-on-surface-variant">Memuat katalog template dari tim desainer...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {htmlTemplates
                    .filter((t) => htmlCategoryFilter === "Semua" || (t.category && t.category.toLowerCase().includes(htmlCategoryFilter.toLowerCase())))
                    .map((template) => {
                      const isSelected =
                        data.designMode === "custom_html" &&
                        (data.themeId === template.slug || data.themeId === template.id);

                      return (
                        <div
                          key={template.id || template.slug}
                          className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all ${
                            isSelected
                              ? "bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-md"
                              : "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/50 shadow-xs"
                          }`}
                        >
                          <div>
                            {/* Color Header Bar */}
                            <div
                              className="h-20 rounded-xl mb-3 p-3 flex items-start justify-between relative overflow-hidden"
                              style={{
                                backgroundColor: `${template.previewColor || "#b38742"}20`,
                                backgroundImage: template.thumbnailUrl
                                  ? `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url('${template.thumbnailUrl}')`
                                  : `radial-gradient(circle at top right, ${template.previewColor || "#b38742"}40, transparent 80%)`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: `1px solid ${template.previewColor || "#b38742"}40`,
                              }}
                            >
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs relative z-10"
                                style={{ backgroundColor: template.previewColor || "#b38742" }}
                              >
                                {template.category}
                              </span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm relative z-10">
                                  <span className="material-symbols-outlined text-[12px]">check</span>
                                  <span>Sedang Aktif</span>
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-on-surface mb-1">
                              {template.name}
                            </h4>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                              {template.description || "Desain tata letak HTML modern dengan ornamen tipografi eksklusif."}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
                              <span>Desain Terverifikasi</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                onChange({
                                  ...data,
                                  designMode: "custom_html",
                                  customHtml: template.html,
                                  themeId: template.slug || template.id,
                                });
                              }}
                              disabled={isSelected}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                  : "bg-primary text-on-primary hover:bg-primary-container shadow-xs active:scale-95"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {isSelected ? "done" : "check_circle"}
                              </span>
                              <span>{isSelected ? "Template Aktif" : "Gunakan Template"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
      )}

      {/* Tab 1: Mempelai */}
      {activeTab === "pasangan" && (
        <div className="flex flex-col gap-4">
          {/* Subdomain & Link Live Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">link</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Link Undangan / Subdomain Live
                </span>
                <span className="text-xs sm:text-sm font-bold text-on-surface font-mono flex items-center gap-1 mt-0.5">
                  <span className="text-on-surface-variant font-normal">janjisuci.com/</span>
                  <input
                    type="text"
                    value={data.slug || "dimas&sarah"}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9&]/g, "");
                      onChange({ ...data, slug: clean });
                    }}
                    placeholder="namapria&namawanita"
                    className="bg-surface-container-lowest px-2 py-0.5 rounded border border-amber-300/60 text-xs font-mono font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-primary w-36"
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getWeddingLivePath(data.slug || "dimas&sarah")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                <span>Buka Live</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getWeddingLiveUrl(data.slug || "dimas&sarah"));
                  alert(`Link live undangan (janjisuci.com/${data.slug || "dimas&sarah"}) berhasil disalin!`);
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Salin Link</span>
              </button>
            </div>
          </div>

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

