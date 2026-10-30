"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { HtmlTemplate, WeddingData } from "@/types";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { renderHtmlTemplate, PRESET_HTML_TEMPLATES } from "@/lib/templateEngine";
import CoverOverlay from "@/components/CoverOverlay";

interface TemplateCatalogProps {
  searchQuery: string;
}

const SAMPLE_WEDDING_DATA: WeddingData = {
  ...DEFAULT_WEDDING_DATA,
  title: "Pernikahan Dimas & Sarah",
  slug: "dimas-sarah",
};

export default function TemplateCatalog({ searchQuery }: TemplateCatalogProps) {
  const [templates, setTemplates] = useState<HtmlTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyFree, setOnlyFree] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  // Modal State for Preview & Album
  const [activeModalTemplate, setActiveModalTemplate] = useState<HtmlTemplate | null>(null);
  const [modalTab, setModalTab] = useState<"album" | "interactive">("album");
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [interactiveDevice, setInteractiveDevice] = useState<"mobile" | "desktop">("mobile");
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  // Fetch only published templates from MongoDB backend
  useEffect(() => {
    setIsLoading(true);
    // api.getTemplates() without all=true returns only active (published) templates
    api.getTemplates()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setTemplates(res.data);
        } else {
          // Fallback presets if database is freshly starting
          setTemplates(
            PRESET_HTML_TEMPLATES.map((p) => ({
              id: p.id,
              slug: p.id,
              name: p.name,
              category: p.category,
              description: p.description,
              previewColor: p.previewColor,
              coverPhotoUrl: p.coverPhotoUrl || DEFAULT_WEDDING_DATA.coverPhotoUrl,
              bannerPhotoUrl: p.bannerPhotoUrl || DEFAULT_WEDDING_DATA.bannerPhotoUrl,
              thumbnailUrl:
                p.id === "royal-gold-majesty"
                  ? "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  : p.id === "botanical-sage-romance"
                  ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                  : "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
              previewAlbum: [
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
              ],
              price: p.id === "vogue-noir-editorial" ? "Gratis" : "Rp 149.000",
              designer: "Atelier JanjiSuci",
              tier: p.id === "royal-gold-majesty" ? "vip" : p.id === "vogue-noir-editorial" ? "free" : "gold",
              tierBadge: p.id === "royal-gold-majesty" ? "Paket VIP" : p.id === "vogue-noir-editorial" ? "Gratis" : "Terlaris",
              html: p.html,
              isPreset: true,
              isActive: true,
            }))
          );
        }
      })
      .catch((err) => {
        console.warn("Could not fetch published templates from server, using fallback:", err);
        setTemplates(
          PRESET_HTML_TEMPLATES.map((p) => ({
            id: p.id,
            slug: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            previewColor: p.previewColor,
            thumbnailUrl: p.thumbnailUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            coverPhotoUrl: p.coverPhotoUrl || DEFAULT_WEDDING_DATA.coverPhotoUrl,
            bannerPhotoUrl: p.bannerPhotoUrl || DEFAULT_WEDDING_DATA.bannerPhotoUrl,
            previewAlbum: [
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            ],
            price: "Rp 149.000",
            designer: "Atelier JanjiSuci",
            tier: "gold",
            tierBadge: "Terlaris",
            html: p.html,
            isPreset: true,
            isActive: true,
          }))
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Compute dynamic categories based on published templates from MongoDB
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return [
      { id: "all", label: "Semua Tema" },
      ...Array.from(set).map((cat) => ({ id: cat.toLowerCase(), label: cat })),
    ];
  }, [templates]);

  // Filtered Templates according to search, category, and free filter
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((item) => {
        // Category match
        const matchesCategory =
          selectedCategory === "all" ||
          (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

        // Free toggle match
        const matchesFree = !onlyFree || item.tier === "free" || item.price === "Gratis";

        // Search match
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.designer && item.designer.toLowerCase().includes(query));

        return matchesCategory && matchesFree && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return (b.isPreset ? 1 : 0) - (a.isPreset ? 1 : 0);
        if (sortBy === "affordable") {
          const aFree = a.tier === "free" || a.price === "Gratis" ? 0 : 1;
          const bFree = b.tier === "free" || b.price === "Gratis" ? 0 : 1;
          return aFree - bFree;
        }
        return 0;
      });
  }, [templates, selectedCategory, onlyFree, searchQuery, sortBy]);

  // Compiled HTML for interactive preview in modal
  const compiledModalHtml = useMemo(() => {
    if (!activeModalTemplate) return "";
    const sampleDataWithTemplateAssets: WeddingData = {
      ...SAMPLE_WEDDING_DATA,
      coverPhotoUrl: activeModalTemplate.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
      bannerPhotoUrl: activeModalTemplate.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
    };
    return renderHtmlTemplate(activeModalTemplate.html || "", sampleDataWithTemplateAssets, {
      guestName: "Bapak / Ibu Tamu Terhormat",
    });
  }, [activeModalTemplate]);

  // All album photos for active modal template (fallback to thumbnail if album empty)
  const currentAlbumPhotos = useMemo(() => {
    if (!activeModalTemplate) return [];
    const list = (activeModalTemplate.previewAlbum || []).filter(Boolean);
    if (list.length === 0 && activeModalTemplate.thumbnailUrl) {
      list.push(activeModalTemplate.thumbnailUrl);
    }
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80");
    }
    return list;
  }, [activeModalTemplate]);

  const openPreviewModal = (template: HtmlTemplate, initialTab: "album" | "interactive" = "album") => {
    setActiveModalTemplate(template);
    setModalTab(initialTab);
    setSelectedAlbumIndex(0);
    setIsCoverOpen(false);
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 md:px-12 pb-16">
      {/* Category Pills (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-4 border-t border-outline-variant/30">
        {/* Left Toggle & Status Notice */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setOnlyFree(!onlyFree)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              onlyFree
                ? "bg-secondary-container text-on-secondary-container border-secondary"
                : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {onlyFree ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span>Hanya Gratis</span>
          </button>

          <span className="text-xs text-on-surface-variant flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Koleksi Terverifikasi dari Panel Admin</span>
          </span>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <span className="text-xs sm:text-sm text-on-surface-variant">
            Menampilkan <strong className="text-on-surface">{filteredTemplates.length} Desain</strong> Masterpiece
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sortBySelect" className="text-xs sm:text-sm text-on-surface-variant hidden sm:inline">
              Urutkan:
            </label>
            <div className="relative">
              <select
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-surface-container-lowest shadow-xs text-on-surface text-xs sm:text-sm font-medium cursor-pointer focus:outline-none border border-outline-variant/20"
              >
                <option value="popular">Terpopuler</option>
                <option value="affordable">Harga Terjangkau</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Template Cards (Published Only) */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-on-surface">Memuat desain resmi terpublikasi...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-20 text-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 p-8 my-8">
          <span className="material-symbols-outlined text-outline text-[48px] mb-2 block">
            palette
          </span>
          <h3 className="text-base font-bold text-on-surface">Belum ada template pada kategori ini</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Hanya desain yang telah dipublish oleh staf admin yang tampil di sini. Silakan periksa kembali beberapa saat lagi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id || template.slug}
              className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5 border border-outline-variant/20"
            >
              {/* Card Thumbnail & Album Overlay */}
              <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-stone-900 cursor-pointer"
                onClick={() => openPreviewModal(template, "album")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    template.thumbnailUrl ||
                    (template.previewAlbum && template.previewAlbum[0]) ||
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreviewModal(template, "album");
                      }}
                      className="flex-1 py-2 px-2.5 rounded-full bg-white/90 hover:bg-white text-stone-900 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">photo_library</span>
                      <span>Lihat Album</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreviewModal(template, "interactive");
                      }}
                      className="flex-1 py-2 px-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Demo Live</span>
                    </button>
                  </div>

                  <Link
                    href={`/editor?theme=${template.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 px-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold text-center shadow-lg transition-all flex items-center justify-center gap-1"
                  >
                    <span>Gunakan Desain Ini</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {/* Category Pill */}
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md uppercase tracking-wider backdrop-blur-md"
                    style={{ backgroundColor: template.previewColor || "#b38742" }}
                  >
                    {template.category}
                  </span>

                  {/* Tier / Status Ribbon */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-900 shadow-sm border border-stone-200">
                    {template.tierBadge || "Eksklusif"}
                  </span>
                </div>

                {/* Album Photo Count Pill */}
                {(template.previewAlbum || []).length > 1 && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1 border border-white/20">
                    <span className="material-symbols-outlined text-[13px]">collections</span>
                    <span>{(template.previewAlbum || []).length} Foto Album</span>
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3
                      onClick={() => openPreviewModal(template, "album")}
                      className="font-serif text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">
                    Desainer: <span className="text-on-surface font-medium">{template.designer || "Atelier JanjiSuci"}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">
                    {template.description || "Desain tata letak HTML elegan dengan nuansa modern dan ornamen khas Indonesia."}
                  </p>
                </div>

                <div className="pt-3 mt-3 flex items-center justify-between border-t border-outline-variant/15">
                  <button
                    type="button"
                    onClick={() => openPreviewModal(template, "album")}
                    className="text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">collections</span>
                    <span>Lihat Preview</span>
                  </button>

                  <span className="text-sm font-bold text-primary font-mono">
                    {template.price || "Rp 149.000"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM PREVIEW & ALBUM MODAL */}
      {activeModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-outline-variant/30">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeModalTemplate.previewColor || "#b38742" }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface truncate">
                      {activeModalTemplate.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {activeModalTemplate.category}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Karya Eksklusif {activeModalTemplate.designer || "JanjiSuci Studio"} &bull; Terverifikasi Panel Staf
                  </p>
                </div>
              </div>

              {/* View Mode Switcher: Album Foto vs Live Interactive */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-surface-container p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModalTab("album")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      modalTab === "album"
                        ? "bg-surface-container-lowest text-primary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    <span>Album Mockup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab("interactive")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      modalTab === "interactive"
                        ? "bg-surface-container-lowest text-primary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">devices</span>
                    <span>Interactive Demo</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalTemplate(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              {/* TAB 1: ALBUM FOTO PREVIEW */}
              {modalTab === "album" && (
                <div className="p-6 space-y-6">
                  {/* Hero Showcase Large Preview */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-900 border border-outline-variant/30 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentAlbumPhotos[selectedAlbumIndex]}
                      alt={`${activeModalTemplate.name} Preview ${selectedAlbumIndex + 1}`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                      Foto {selectedAlbumIndex + 1} dari {currentAlbumPhotos.length}
                    </div>
                  </div>

                  {/* Thumbnail Carousel Strip */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {currentAlbumPhotos.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAlbumIndex(idx)}
                        className={`relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          selectedAlbumIndex === idx
                            ? "border-primary ring-2 ring-primary/30 scale-105"
                            : "border-outline-variant/30 opacity-75 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Template Details & Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="font-bold text-sm text-on-surface">Deskripsi &amp; Konsep Desain</h4>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        {activeModalTemplate.description ||
                          "Template HTML modern berkelas tinggi dengan tata letak visual elegan, ramah layar smartphone, dan ornamen mewah untuk menyempurnakan hari bahagia Anda."}
                      </p>

                      <div className="pt-3 flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-on-surface-variant">Fitur Bawaan:</span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs text-on-surface">
                          Sampul Buka Undangan
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs text-on-surface">
                          Countdown Timer
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs text-on-surface">
                          Galeri Foto Cloudinary
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs text-on-surface">
                          Amplop Digital 1-Klik
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                          Warna Aksen Desain
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-5 h-5 rounded-full border border-outline-variant/40"
                            style={{ backgroundColor: activeModalTemplate.previewColor || "#b38742" }}
                          />
                          <span className="text-xs font-mono font-bold text-on-surface">
                            {activeModalTemplate.previewColor || "#b38742"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20">
                        <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                          Investasi Desain
                        </span>
                        <div className="text-lg font-bold text-primary font-mono mt-0.5">
                          {activeModalTemplate.price || "Rp 149.000"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE INTERACTIVE PREVIEW */}
              {modalTab === "interactive" && (
                <div className="p-4 sm:p-6 bg-stone-900 flex flex-col items-center justify-center min-h-[500px]">
                  {/* Device Controller & Cover State Toggle */}
                  <div className="mb-4 flex items-center justify-between w-full max-w-4xl px-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-full border border-stone-800">
                      <span className="text-xs text-stone-400">Pilih Tampilan:</span>
                      <button
                        type="button"
                        onClick={() => setInteractiveDevice("mobile")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          interactiveDevice === "mobile"
                            ? "bg-primary text-on-primary"
                            : "text-stone-300 hover:text-white"
                        }`}
                      >
                        Mobile (390px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInteractiveDevice("desktop")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          interactiveDevice === "desktop"
                            ? "bg-primary text-on-primary"
                            : "text-stone-300 hover:text-white"
                        }`}
                      >
                        Desktop
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCoverOpen((prev) => !prev)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-950 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-stone-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCoverOpen ? "mail_lock" : "drafts"}
                      </span>
                      <span>{isCoverOpen ? "Tutup Sampul Kembali" : "Posisi Sampul Aktif"}</span>
                    </button>
                  </div>

                  {/* Device Canvas Frame with Cover Overlay Active by Default */}
                  <div
                    className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-800 transition-all ${
                      interactiveDevice === "mobile"
                        ? "w-[390px] h-[640px] ring-8 ring-stone-950"
                        : "w-full max-w-4xl h-[640px] rounded-xl"
                    }`}
                  >
                    <CoverOverlay
                      isOpen={isCoverOpen}
                      onOpen={() => setIsCoverOpen(true)}
                      weddingData={{
                        ...SAMPLE_WEDDING_DATA,
                        coverPhotoUrl: activeModalTemplate?.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
                        bannerPhotoUrl: activeModalTemplate?.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
                      }}
                      isAbsolute={true}
                      viewMode={interactiveDevice}
                    />

                    <div className={`w-full h-full transition-opacity duration-700 ${isCoverOpen ? "opacity-100" : "opacity-0"}`}>
                      <iframe
                        srcDoc={compiledModalHtml}
                        title={activeModalTemplate.name}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="px-6 py-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest">
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant">
                  Harga: <strong className="text-on-surface font-mono">{activeModalTemplate.price || "Rp 149.000"}</strong>
                </span>
                <span className="text-outline-variant">&bull;</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Siap Dipakai Langsung</span>
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalTemplate(null)}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex-1 sm:flex-initial"
                >
                  Tutup
                </button>

                <Link
                  href={`/editor?theme=${activeModalTemplate.slug}`}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <span>Pilih &amp; Buat Undangan Ini</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
