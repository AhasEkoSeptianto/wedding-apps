"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, HtmlTemplatePayload } from "@/lib/api";
import { HtmlTemplate, WeddingData } from "@/types";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import {
  AVAILABLE_PLACEHOLDERS,
  renderHtmlTemplate,
  PRESET_HTML_TEMPLATES,
} from "@/lib/templateEngine";
import CoverOverlay from "@/components/CoverOverlay";

const SAMPLE_WEDDING_DATA: WeddingData = {
  ...DEFAULT_WEDDING_DATA,
  title: "Pernikahan Dimas & Sarah",
  slug: "dimas-sarah",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();

  const [templates, setTemplates] = useState<HtmlTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Create / Edit Template
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Upload Refs & State for Cover, Banner, Thumbnail & Album (Pure file upload, no link input)
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const albumFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingAlbum, setUploadingAlbum] = useState(false);

  // Template Form State
  const [formData, setFormData] = useState<HtmlTemplatePayload>({
    name: "",
    slug: "",
    category: "Luxury",
    description: "",
    previewColor: "#c5a059",
    thumbnailUrl: "",
    coverPhotoUrl: "",
    bannerPhotoUrl: "",
    previewAlbum: [],
    price: "Rp 149.000",
    designer: "Atelier JanjiSuci",
    tier: "gold",
    tierBadge: "Desain Pilihan",
    html: "",
    isActive: true,
    isPreset: false,
  });

  // Editor Sub-tab: Code Editor vs Mockup Album vs Instant Live Preview
  const [editorTab, setEditorTab] = useState<"code" | "album" | "preview">("code");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [editorCoverOpen, setEditorCoverOpen] = useState(false);

  // Separate Fullscreen Preview & Album Modal
  const [previewTemplate, setPreviewTemplate] = useState<HtmlTemplate | null>(null);
  const [previewModalTab, setPreviewModalTab] = useState<"album" | "interactive">("album");
  const [previewSelectedAlbumIndex, setPreviewSelectedAlbumIndex] = useState(0);
  const [previewCoverOpen, setPreviewCoverOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch templates from MongoDB backend (all=true to include drafts)
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTemplates({ all: true });
      if (res.data && res.data.length > 0) {
        setTemplates(res.data);
      } else {
        const fallback = PRESET_HTML_TEMPLATES.map((p) => ({
          id: p.id,
          slug: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          previewColor: p.previewColor,
          thumbnailUrl: p.thumbnailUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          coverPhotoUrl: p.coverPhotoUrl || DEFAULT_WEDDING_DATA.coverPhotoUrl || "",
          bannerPhotoUrl: p.bannerPhotoUrl || DEFAULT_WEDDING_DATA.bannerPhotoUrl || "",
          previewAlbum: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
          ],
          price: "Rp 149.000",
          designer: "Atelier JanjiSuci",
          tier: "gold" as const,
          tierBadge: "Desain Pilihan",
          html: p.html,
          isPreset: true,
          isActive: true,
        }));
        setTemplates(fallback);
      }
    } catch (err) {
      console.warn("Using preset fallback templates:", err);
      const fallback = PRESET_HTML_TEMPLATES.map((p) => ({
        id: p.id,
        slug: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        previewColor: p.previewColor,
        thumbnailUrl: p.thumbnailUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        coverPhotoUrl: p.coverPhotoUrl || DEFAULT_WEDDING_DATA.coverPhotoUrl || "",
        bannerPhotoUrl: p.bannerPhotoUrl || DEFAULT_WEDDING_DATA.bannerPhotoUrl || "",
        previewAlbum: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        ],
        price: "Rp 149.000",
        designer: "Atelier JanjiSuci",
        tier: "gold" as const,
        tierBadge: "Desain Pilihan",
        html: p.html,
        isPreset: true,
        isActive: true,
      }));
      setTemplates(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (user?.role === "admin") {
      fetchTemplates();
    }
  }, [user, authLoading, router]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ["Semua", ...Array.from(set)];
  }, [templates]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchCat = selectedCategory === "Semua" || t.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.designer && t.designer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTemplateId(null);
    setFormData({
      name: "",
      slug: "",
      category: "Luxury",
      description: "",
      previewColor: "#c5a059",
      thumbnailUrl: "",
      coverPhotoUrl: PRESET_HTML_TEMPLATES[0].coverPhotoUrl || DEFAULT_WEDDING_DATA.coverPhotoUrl || "",
      bannerPhotoUrl: PRESET_HTML_TEMPLATES[0].bannerPhotoUrl || DEFAULT_WEDDING_DATA.bannerPhotoUrl || "",
      previewAlbum: [],
      price: "Rp 149.000",
      designer: "Atelier JanjiSuci",
      tier: "gold",
      tierBadge: "Desain Pilihan",
      html: PRESET_HTML_TEMPLATES[0].html,
      isActive: true,
      isPreset: false,
    });
    setEditorTab("code");
    setIsEditorModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (template: HtmlTemplate) => {
    setEditingTemplateId(template.id);
    setFormData({
      name: template.name,
      slug: template.slug,
      category: template.category,
      description: template.description || "",
      previewColor: template.previewColor || "#b38742",
      thumbnailUrl: template.thumbnailUrl || "",
      coverPhotoUrl: template.coverPhotoUrl || "",
      bannerPhotoUrl: template.bannerPhotoUrl || "",
      previewAlbum: Array.isArray(template.previewAlbum) ? template.previewAlbum : [],
      price: template.price || "Rp 149.000",
      designer: template.designer || "Atelier JanjiSuci",
      tier: template.tier || "gold",
      tierBadge: template.tierBadge || "Desain Pilihan",
      html: template.html,
      isActive: template.isActive !== undefined ? template.isActive : true,
      isPreset: Boolean(template.isPreset),
    });
    setEditorTab("code");
    setIsEditorModalOpen(true);
  };

  // Fast 1-Click Toggle Publish / Unpublish
  const handleTogglePublish = async (template: HtmlTemplate) => {
    try {
      const nextActive = !template.isActive;
      await api.updateTemplate(template.id, { isActive: nextActive }, token || undefined);
      showToast(
        nextActive
          ? `Template "${template.name}" berhasil dipublish ke beranda!`
          : `Template "${template.name}" ditarik ke draf (disembunyikan dari beranda).`
      );
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Gagal mengubah status publikasi");
    }
  };

  // Upload Single Cover Thumbnail File to Cloudinary
  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const res = await api.uploadImage(file, "templates");
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: res.url,
        }));
        showToast("Thumbnail sampul berhasil diunggah!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah thumbnail";
      alert(msg);
    } finally {
      setUploadingThumbnail(false);
      if (e.target) e.target.value = "";
    }
  };

  // Upload Foto Sampul Pembuka (Cover Gate Photo) to Cloudinary
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const res = await api.uploadImage(file, "templates/covers");
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          coverPhotoUrl: res.url,
          thumbnailUrl: prev.thumbnailUrl || res.url,
        }));
        showToast("Foto sampul pembuka template berhasil diunggah!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto sampul";
      alert(msg);
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = "";
    }
  };

  // Upload Foto Banner Hero Pasangan (Banner Header Photo) to Cloudinary
  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const res = await api.uploadImage(file, "templates/banners");
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          bannerPhotoUrl: res.url,
        }));
        showToast("Foto banner hero pasangan berhasil diunggah!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto banner";
      alert(msg);
    } finally {
      setUploadingBanner(false);
      if (e.target) e.target.value = "";
    }
  };

  // Upload Multiple Mockup Album Files to Cloudinary
  const handleUploadAlbumFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingAlbum(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await api.uploadImage(files[i], "templates");
        if (res && res.url) {
          uploadedUrls.push(res.url);
        }
      }
      setFormData((prev) => {
        const current = prev.previewAlbum || [];
        return {
          ...prev,
          previewAlbum: [...current, ...uploadedUrls],
          thumbnailUrl: prev.thumbnailUrl || uploadedUrls[0] || "",
        };
      });
      showToast(`Berhasil mengunggah ${uploadedUrls.length} foto mockup ke album!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto mockup";
      alert(msg);
    } finally {
      setUploadingAlbum(false);
      if (e.target) e.target.value = "";
    }
  };

  // Remove photo from album
  const handleRemoveAlbumPhoto = (index: number) => {
    const current = formData.previewAlbum || [];
    setFormData({
      ...formData,
      previewAlbum: current.filter((_, i) => i !== index),
    });
  };

  // Duplicate Template
  const handleDuplicate = (template: HtmlTemplate) => {
    setEditingTemplateId(null);
    setFormData({
      name: `${template.name} (Salinan)`,
      slug: `${template.slug}-copy-${Date.now().toString().slice(-4)}`,
      category: template.category,
      description: template.description || "",
      previewColor: template.previewColor || "#b38742",
      thumbnailUrl: template.thumbnailUrl || "",
      coverPhotoUrl: template.coverPhotoUrl || "",
      bannerPhotoUrl: template.bannerPhotoUrl || "",
      previewAlbum: template.previewAlbum || [],
      price: template.price || "Rp 149.000",
      designer: template.designer || "Atelier JanjiSuci",
      tier: template.tier || "gold",
      tierBadge: template.tierBadge || "Desain Pilihan",
      html: template.html,
      isActive: true,
      isPreset: false,
    });
    setEditorTab("code");
    setIsEditorModalOpen(true);
    showToast(`Menduplikasi template "${template.name}". Sesuaikan lalu simpan.`);
  };

  // Delete Template
  const handleDeleteTemplate = async (template: HtmlTemplate) => {
    if (!confirm(`Hapus template "${template.name}" secara permanen dari sistem?`)) {
      return;
    }

    try {
      await api.deleteTemplate(template.id, token || undefined);
      showToast(`Template "${template.name}" berhasil dihapus.`);
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal menghapus template");
      }
    }
  };

  // Insert Placeholder tag into HTML textarea
  const insertTag = (tag: string) => {
    const textarea = document.getElementById("template-html-editor") as HTMLTextAreaElement | null;
    if (!textarea) {
      setFormData((prev) => ({ ...prev, html: (prev.html || "") + " " + tag }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.html || "";
    const before = text.substring(0, start);
    const after = text.substring(end);

    const updated = before + tag + after;
    setFormData((prev) => ({ ...prev, html: updated }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 50);
  };

  // Save / Update Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.html) {
      alert("Nama template dan kode HTML wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingTemplateId) {
        await api.updateTemplate(editingTemplateId, formData, token || undefined);
        showToast(`Template "${formData.name}" berhasil diperbarui.`);
      } else {
        await api.createTemplate(formData, token || undefined);
        showToast(`Template baru "${formData.name}" berhasil dibuat & dipublish.`);
      }
      setIsEditorModalOpen(false);
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal menyimpan template");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Preview compiled HTML for editor
  const compiledEditorHtml = useMemo(() => {
    const sampleDataWithTemplateAssets: WeddingData = {
      ...SAMPLE_WEDDING_DATA,
      coverPhotoUrl: formData.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
      bannerPhotoUrl: formData.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
    };
    return renderHtmlTemplate(formData.html || "", sampleDataWithTemplateAssets, {
      guestName: "Bapak / Ibu Tamu Terhormat",
    });
  }, [formData.html, formData.coverPhotoUrl, formData.bannerPhotoUrl]);

  // Preview compiled HTML for preview modal
  const compiledModalPreviewHtml = useMemo(() => {
    if (!previewTemplate) return "";
    const sampleDataWithTemplateAssets: WeddingData = {
      ...SAMPLE_WEDDING_DATA,
      coverPhotoUrl: previewTemplate.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
      bannerPhotoUrl: previewTemplate.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
    };
    return renderHtmlTemplate(previewTemplate.html || "", sampleDataWithTemplateAssets, {
      guestName: "Bapak / Ibu Tamu Terhormat",
    });
  }, [previewTemplate]);

  // Preview modal album photos
  const previewModalAlbumPhotos = useMemo(() => {
    if (!previewTemplate) return [];
    const list = (previewTemplate.previewAlbum || []).filter(Boolean);
    if (list.length === 0 && previewTemplate.thumbnailUrl) {
      list.push(previewTemplate.thumbnailUrl);
    }
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80");
    }
    return list;
  }, [previewTemplate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Akses Terbatas</h1>
        <p className="text-stone-400 text-sm max-w-md mb-6">
          Halaman ini hanya dapat diakses oleh staf pekerja dan administrator JanjiSuci.
        </p>
        <Link
          href="/admin/login"
          className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
        >
          Menuju Login Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-black flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                JanjiSuci Admin Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-bold">
                Worker Portal
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Pengaturan Eksklusif Desain Template HTML &bull; MongoDB Synced
            </p>
          </div>
        </div>

        {/* Right Admin Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300 font-medium">Staf:</span>
            <span className="text-white font-bold">{user.name}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Katalog Beranda</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-bold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Banner Alert: Client Restriction & Homepage Catalog Rule */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div className="leading-relaxed">
            <strong className="block text-amber-300 font-semibold mb-0.5">
              Kontrol Publikasi Template ke Beranda
            </strong>
            Daftar template pada halaman beranda publik JanjiSuci hanya menampilkan desain yang berstatus <strong>Terpublikasi</strong> dari panel ini. 
            Setiap desain kini memiliki form preview mockup dan album foto untuk memudahkan calon pengantin melihat keindahan desain sebelum memilihnya.
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Total Template HTML</span>
              <span className="material-symbols-outlined text-amber-400 text-[20px]">html</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{templates.length}</div>
            <p className="text-[11px] text-stone-400 mt-1">
              {templates.filter((t) => t.isActive).length} Terpublikasi di Beranda
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Kategori Desain</span>
              <span className="material-symbols-outlined text-emerald-400 text-[20px]">category</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{categories.length - 1}</div>
            <p className="text-[11px] text-stone-400 mt-1">Luxury, Floral, Modern, dll.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Placeholder Tags</span>
              <span className="material-symbols-outlined text-sky-400 text-[20px]">code_blocks</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{AVAILABLE_PLACEHOLDERS.length}</div>
            <p className="text-[11px] text-stone-400 mt-1">Variabel data dinamis pengantin</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">Akses Klien</span>
              <span className="material-symbols-outlined text-purple-400 text-[20px]">lock_person</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">Pilih dari Katalog</div>
            <p className="text-[11px] text-stone-400 mt-1">Tanpa hak edit kode HTML mentah</p>
          </div>
        </div>

        {/* Section Header & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Katalog Master Template Undangan HTML</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                {filteredTemplates.length} Template
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Tambah, edit kode HTML, atur album foto preview, dan publikasikan ke katalog beranda.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Buat Desain Template Baru</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-stone-950 shadow-sm"
                    : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-stone-500">
              search
            </span>
            <input
              type="text"
              placeholder="Cari template, slug, atau desainer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Templates Grid List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Memuat katalog master template dari MongoDB...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-16 text-center bg-stone-900/40 rounded-3xl border border-dashed border-stone-800 p-8">
            <span className="material-symbols-outlined text-stone-600 text-[48px] mb-2 block">
              folder_off
            </span>
            <h3 className="text-sm font-semibold text-stone-300">Tidak ada template yang cocok</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Ubah kata kunci pencarian atau buat template HTML baru untuk menambah koleksi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id || template.slug}
                className="group rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-0.5"
              >
                {/* Header Banner Color & Thumbnail */}
                <div
                  className="h-32 relative flex items-end p-4 border-b border-stone-800/80"
                  style={{
                    backgroundColor: `${template.previewColor}20`,
                    backgroundImage: template.thumbnailUrl
                      ? `linear-gradient(to top, rgba(28,25,23,0.95), rgba(28,25,23,0.3)), url('${template.thumbnailUrl}')`
                      : `radial-gradient(circle at top right, ${template.previewColor}40, transparent 70%)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex items-center justify-between w-full relative z-10">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border border-stone-800"
                      style={{
                        backgroundColor: template.previewColor,
                        color: "#ffffff",
                      }}
                    >
                      {template.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Publish / Draft Quick Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(template)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                          template.isActive
                            ? "bg-emerald-500 text-stone-950 border-emerald-400"
                            : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
                        }`}
                        title={
                          template.isActive
                            ? "Klik untuk menarik ke Draf (sembunyikan dari beranda)"
                            : "Klik untuk mempublish ke katalog beranda"
                        }
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {template.isActive ? "check_circle" : "pause_circle"}
                        </span>
                        <span>{template.isActive ? "Terpublikasi" : "Draf"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Asset Indicator Pills */}
                  <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(template.previewAlbum || []).length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-sm text-stone-300 text-[10px] font-medium flex items-center gap-1 border border-stone-800">
                          <span className="material-symbols-outlined text-[12px]">collections</span>
                          <span>{(template.previewAlbum || []).length} Album</span>
                        </span>
                      )}
                      {template.coverPhotoUrl && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-medium flex items-center gap-1 border border-stone-800" title="Foto Sampul Pembuka Bawaan Terpasang">
                          <span className="material-symbols-outlined text-[12px]">mail_lock</span>
                          <span>Sampul</span>
                        </span>
                      )}
                      {template.bannerPhotoUrl && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-sm text-emerald-300 text-[10px] font-medium flex items-center gap-1 border border-stone-800" title="Foto Banner Hero Pasangan Bawaan Terpasang">
                          <span className="material-symbols-outlined text-[12px]">panorama</span>
                          <span>Banner</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors truncate">
                        {template.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                        {template.price || "Rp 149.000"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                      <span>Desainer: <strong className="text-stone-300">{template.designer || "JanjiSuci"}</strong></span>
                      <span className="font-mono text-stone-500">{template.slug}</span>
                    </div>

                    <p className="text-xs text-stone-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {template.description || "Template HTML undangan modern dengan ornamen elegan dan tata letak responsif."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">code</span>
                      <span>{(template.html || "").length.toLocaleString()} karakter</span>
                    </span>
                    <span className={template.isActive ? "text-emerald-400 font-semibold" : "text-stone-500"}>
                      {template.isActive ? "Tampil di Beranda" : "Disembunyikan"}
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-5 py-3 bg-stone-950/60 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Preview & Album Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTemplate(template);
                        setPreviewModalTab("album");
                        setPreviewSelectedAlbumIndex(0);
                        setPreviewCoverOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Lihat Album Mockup & Demo"
                    >
                      <span className="material-symbols-outlined text-[15px] text-amber-400">collections</span>
                      <span>Album &amp; Preview</span>
                    </button>

                    {/* Edit HTML Code Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(template)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit Kode HTML & Metadata"
                    >
                      <span className="material-symbols-outlined text-[15px] text-sky-400">edit_square</span>
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(template)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                      title="Duplikasi Template"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(template)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Template"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL 1: Fullscreen / Drawer Template Maker & HTML Code Editor */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">code</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingTemplateId ? `Edit Desain: ${formData.name}` : "Buat Desain Template HTML Baru"}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Atur kode HTML, album mockup, metadata harga &amp; status publish ke beranda
                  </p>
                </div>
              </div>

              {/* Sub-tab Switcher: Code Editor vs Album Mockup vs Instant Preview */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setEditorTab("code")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === "code"
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">code</span>
                    <span>Editor HTML</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorTab("album")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === "album"
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">photo_library</span>
                    <span>Sampul, Banner &amp; Mockup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === "preview"
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">play_circle</span>
                    <span>Live Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveTemplate} className="flex-1 flex flex-col overflow-hidden">
              {/* Metadata Inputs Row */}
              <div className="px-6 py-3.5 bg-stone-950/60 border-b border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Nama Template <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Royal Gold Majesty"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]/g, "-")
                        .replace(/-+/g, "-");
                      setFormData({
                        ...formData,
                        name,
                        slug: editingTemplateId ? formData.slug : slug,
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Slug ID Unik <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="royal-gold-majesty"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Kategori Desain
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Luxury">Luxury / Aristokrat</option>
                    <option value="Floral">Floral / Botanical</option>
                    <option value="Modern">Modern &amp; Minimalis</option>
                    <option value="Tradisional">Adat &amp; Tradisional</option>
                    <option value="Rustic">Rustic &amp; Vintage</option>
                    <option value="Islami">Islami / Timur Tengah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Harga / Tier
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 149.000 atau Gratis"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Warna Aksen
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.previewColor}
                        onChange={(e) => setFormData({ ...formData, previewColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.previewColor}
                        onChange={(e) => setFormData({ ...formData, previewColor: e.target.value })}
                        className="w-full px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Publikasi
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        formData.isActive
                          ? "bg-emerald-500 text-stone-950"
                          : "bg-stone-800 text-stone-400"
                      }`}
                      title={formData.isActive ? "Akan tampil di katalog beranda" : "Draf (disembunyikan dari beranda)"}
                    >
                      {formData.isActive ? "Publish" : "Draf"}
                    </button>
                  </div>
                </div>
              </div>

              {/* View 1: HTML Source Code Editor & Placeholder Palette */}
              {editorTab === "code" && (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  {/* Left: Code Textarea */}
                  <div className="flex-1 flex flex-col bg-stone-950 relative border-r border-stone-800">
                    <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                      <span className="font-mono">template.html &bull; Full HTML &amp; CSS Document</span>
                      <span>{(formData.html || "").length} Karakter</span>
                    </div>

                    <textarea
                      id="template-html-editor"
                      required
                      value={formData.html}
                      onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                      placeholder="<!DOCTYPE html><html>...</html>"
                      className="w-full flex-1 p-4 bg-stone-950 text-stone-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-amber-500/30 selection:text-white"
                      spellCheck={false}
                    />
                  </div>

                  {/* Right: Variable Cheatsheet & Insertion Palette */}
                  <div className="w-full lg:w-80 bg-stone-900/90 overflow-y-auto p-4 flex flex-col gap-4 border-t lg:border-t-0 border-stone-800">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-[16px] text-amber-400">touch_app</span>
                        <span>Klik Tag untuk Menyisipkan</span>
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Nilai tag berikut otomatis diganti dengan data pengantin saat undangan dimuat.
                      </p>
                    </div>

                    {/* Grouped Tag Badges */}
                    <div className="space-y-4">
                      {["Mempelai", "Acara & Lokasi", "Komponen Dinamis", "Tamu & Hadiah", "Kutipan"].map(
                        (cat) => (
                          <div key={cat} className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                              {cat}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {AVAILABLE_PLACEHOLDERS.filter((p) => p.category === cat).map((item) => (
                                <button
                                  key={item.tag}
                                  type="button"
                                  onClick={() => insertTag(item.tag)}
                                  className="px-2 py-1 rounded-md bg-stone-950 hover:bg-amber-400 hover:text-stone-950 border border-stone-800 text-[11px] font-mono text-stone-300 transition-all cursor-pointer text-left"
                                  title={`${item.label} (${item.description})`}
                                >
                                  {item.tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Album Mockup & Foto Preview Desain */}
              {editorTab === "album" && (
                <div className="flex-1 bg-stone-950 p-6 overflow-y-auto space-y-6">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {/* 1. Foto Sampul Depan Undangan (Cover Gate Card) */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-amber-400">mail_lock</span>
                              <span>Foto Sampul Depan Undangan (Cover Gate Card)</span>
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold">
                              {"{{cover_photo}}"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Foto utama pada kartu amplop/gerbang pembuka sebelum tamu mengklik tombol &ldquo;Buka Undangan&rdquo;.
                          </p>
                        </div>
                        {formData.coverPhotoUrl && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Sampul Terpasang</span>
                          </span>
                        )}
                      </div>

                      {/* Hidden File Input for Cover Gate */}
                      <input
                        ref={coverFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadCover}
                      />

                      {!formData.coverPhotoUrl ? (
                        <div
                          onClick={() => coverFileInputRef.current?.click()}
                          className="border-2 border-dashed border-stone-800 hover:border-amber-400/70 hover:bg-stone-950/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className={`material-symbols-outlined text-[26px] ${uploadingCover ? "animate-spin" : ""}`}>
                              {uploadingCover ? "sync" : "cloud_upload"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {uploadingCover ? "Mengunggah Foto Sampul ke Cloudinary..." : "Klik untuk Upload Foto Sampul Pembuka"}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Format: JPG, PNG, WebP (Maks 10MB) &bull; Otomatis menggantikan tag {"{{cover_photo}}"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-950 rounded-xl border border-stone-800">
                          <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-stone-700 bg-stone-900 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.coverPhotoUrl}
                              alt="Cover Gate Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="text-xs text-stone-300 font-medium">
                              Foto sampul pembuka aktif berhasil diunggah ke Cloudinary.
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={uploadingCover}
                                onClick={() => coverFileInputRef.current?.click()}
                                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <span className={`material-symbols-outlined text-[15px] ${uploadingCover ? "animate-spin" : ""}`}>
                                  {uploadingCover ? "sync" : "upload"}
                                </span>
                                <span>{uploadingCover ? "Mengunggah..." : "Ganti Foto Sampul"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, coverPhotoUrl: "" })}
                                className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                                <span>Reset</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Foto Banner Hero Pasangan (Hero Header) */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-emerald-400">panorama</span>
                              <span>Foto Banner Hero Pasangan (Header Utama)</span>
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[10px] font-mono font-bold">
                              {"{{banner_photo}}"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Foto lanskap kedua mempelai yang menjadi latar belakang hero section setelah undangan dibuka.
                          </p>
                        </div>
                        {formData.bannerPhotoUrl && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Banner Terpasang</span>
                          </span>
                        )}
                      </div>

                      {/* Hidden File Input for Banner Hero */}
                      <input
                        ref={bannerFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadBanner}
                      />

                      {!formData.bannerPhotoUrl ? (
                        <div
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="border-2 border-dashed border-stone-800 hover:border-emerald-400/70 hover:bg-stone-950/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-12 h-12 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className={`material-symbols-outlined text-[26px] ${uploadingBanner ? "animate-spin" : ""}`}>
                              {uploadingBanner ? "sync" : "cloud_upload"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {uploadingBanner ? "Mengunggah Banner ke Cloudinary..." : "Klik untuk Upload Foto Banner Pasangan"}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Format lanskap rekomendasi: 1600x900px &bull; Otomatis menggantikan tag {"{{banner_photo}}"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-950 rounded-xl border border-stone-800">
                          <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-stone-700 bg-stone-900 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.bannerPhotoUrl}
                              alt="Banner Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="text-xs text-stone-300 font-medium">
                              Foto banner hero pasangan berhasil diunggah ke Cloudinary.
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={uploadingBanner}
                                onClick={() => bannerFileInputRef.current?.click()}
                                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <span className={`material-symbols-outlined text-[15px] ${uploadingBanner ? "animate-spin" : ""}`}>
                                  {uploadingBanner ? "sync" : "upload"}
                                </span>
                                <span>{uploadingBanner ? "Mengunggah..." : "Ganti Foto Banner"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, bannerPhotoUrl: "" })}
                                className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                                <span>Reset</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Utama (Upload File Saja) */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-amber-400">image</span>
                            <span>Thumbnail Sampul Depan (Card Cover)</span>
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Foto utama yang tampil pada kartu desain di katalog beranda publik.
                          </p>
                        </div>
                        {formData.thumbnailUrl && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Sampul Terpasang</span>
                          </span>
                        )}
                      </div>

                      {/* Hidden File Input for Thumbnail */}
                      <input
                        ref={thumbnailFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadThumbnail}
                      />

                      {/* Upload Box or Image Card */}
                      {!formData.thumbnailUrl ? (
                        <div
                          onClick={() => thumbnailFileInputRef.current?.click()}
                          className="border-2 border-dashed border-stone-800 hover:border-amber-400/70 hover:bg-stone-950/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className={`material-symbols-outlined text-[26px] ${uploadingThumbnail ? "animate-spin" : ""}`}>
                              {uploadingThumbnail ? "sync" : "cloud_upload"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {uploadingThumbnail ? "Mengunggah Thumbnail ke Cloudinary..." : "Klik untuk Upload Foto Sampul"}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Format: JPG, PNG, WebP (Maks 10MB) &bull; Otomatis disimpan di Cloudinary Storage
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-950 rounded-xl border border-stone-800">
                          <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-stone-700 bg-stone-900 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formData.thumbnailUrl}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="text-xs text-stone-300 font-medium">
                              Foto sampul aktif berhasil diunggah ke Cloudinary.
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={uploadingThumbnail}
                                onClick={() => thumbnailFileInputRef.current?.click()}
                                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <span className={`material-symbols-outlined text-[15px] ${uploadingThumbnail ? "animate-spin" : ""}`}>
                                  {uploadingThumbnail ? "sync" : "upload"}
                                </span>
                                <span>{uploadingThumbnail ? "Mengunggah..." : "Ganti Foto Sampul"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, thumbnailUrl: "" })}
                                className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Album Foto Mockup Tambahan (Upload File Saja) */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-amber-400">collections</span>
                            <span>Album Foto Mockup &amp; Showcase Desain</span>
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Unggah foto-foto mockup untuk ditampilkan di modal preview album pada beranda publik.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-400 font-bold font-mono">
                            {formData.previewAlbum?.length || 0} Foto di Album
                          </span>
                        </div>
                      </div>

                      {/* Hidden File Input for Mockup Album (Multiple Upload) */}
                      <input
                        ref={albumFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleUploadAlbumFiles}
                      />

                      {/* Upload Dropzone Box */}
                      <div
                        onClick={() => albumFileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-800 hover:border-amber-400/70 hover:bg-stone-950/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className={`material-symbols-outlined text-[26px] ${uploadingAlbum ? "animate-spin" : ""}`}>
                            {uploadingAlbum ? "sync" : "add_photo_alternate"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {uploadingAlbum ? "Mengunggah foto-foto mockup ke Cloudinary..." : "Klik untuk Upload Foto Mockup (Bisa Pilih Banyak Foto Sekaligus)"}
                          </span>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            Mendukung multi-select file &bull; Format: JPG, PNG, WebP &bull; Otomatis masuk ke album template
                          </span>
                        </div>
                      </div>

                      {/* Album Grid Chips */}
                      {(formData.previewAlbum || []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          {formData.previewAlbum?.map((url, idx) => (
                            <div
                              key={idx}
                              className="group relative h-28 rounded-xl overflow-hidden border border-stone-800 bg-stone-950 shadow-sm"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={`Album Mockup ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAlbumPhoto(idx)}
                                  className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow"
                                  title="Hapus foto dari album"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, thumbnailUrl: url });
                                    showToast(`Foto #${idx + 1} dijadikan sebagai Thumbnail Sampul!`);
                                  }}
                                  className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 bg-stone-900/90 px-2 py-0.5 rounded border border-amber-400/40 cursor-pointer"
                                  title="Jadikan sebagai thumbnail sampul utama"
                                >
                                  Jadikan Sampul
                                </button>
                              </div>
                              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-stone-950/80 text-[10px] text-stone-300 font-mono">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}

                          {/* Extra Quick Upload Tile */}
                          <div
                            onClick={() => albumFileInputRef.current?.click()}
                            className="h-28 rounded-xl border-2 border-dashed border-stone-800 hover:border-amber-400/50 hover:bg-stone-950/60 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-white cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="text-[11px] font-semibold">Upload Lagi</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Designer & Badge Details */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                          Nama Studio / Desainer
                        </label>
                        <input
                          type="text"
                          placeholder="Atelier JanjiSuci"
                          value={formData.designer}
                          onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          placeholder="Terlaris / Paket VIP / Desain Pilihan"
                          value={formData.tierBadge}
                          onChange={(e) => setFormData({ ...formData, tierBadge: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Real-time Live Sandbox Preview */}
              {editorTab === "preview" && (
                <div className="flex-1 bg-stone-950 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <div className="mb-3 flex items-center justify-between w-full max-w-4xl px-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
                      <span className="text-[11px] text-stone-400">Device Canvas:</span>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          previewDevice === "mobile"
                            ? "bg-amber-400 text-stone-950"
                            : "text-stone-300 hover:text-white"
                        }`}
                      >
                        Mobile (390px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          previewDevice === "desktop"
                            ? "bg-amber-400 text-stone-950"
                            : "text-stone-300 hover:text-white"
                        }`}
                      >
                        Desktop
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditorCoverOpen((prev) => !prev)}
                      className="px-3.5 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-stone-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {editorCoverOpen ? "mail_lock" : "drafts"}
                      </span>
                      <span>{editorCoverOpen ? "Tutup Sampul" : "Sampul Aktif"}</span>
                    </button>
                  </div>

                  <div
                    className={`relative h-[68vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-800 transition-all ${
                      previewDevice === "mobile" ? "w-[390px]" : "w-full max-w-4xl"
                    }`}
                  >
                    <CoverOverlay
                      isOpen={editorCoverOpen}
                      onOpen={() => setEditorCoverOpen(true)}
                      weddingData={{
                        ...SAMPLE_WEDDING_DATA,
                        coverPhotoUrl: formData.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
                        bannerPhotoUrl: formData.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
                      }}
                      isAbsolute={true}
                      viewMode={previewDevice}
                    />

                    <div className={`w-full h-full transition-opacity duration-700 ${editorCoverOpen ? "opacity-100" : "opacity-0"}`}>
                      <iframe
                        srcDoc={compiledEditorHtml}
                        title="Test Live Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {formData.isActive ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>Desain ini akan langsung tampil di katalog beranda publik</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">pause_circle</span>
                      <span>Desain berstatus Draf (tidak tampil di beranda)</span>
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSaving ? "animate-spin" : ""}`}>
                      {isSaving ? "sync" : "save"}
                    </span>
                    <span>{isSaving ? "Menyimpan ke MongoDB..." : "Simpan & Terapkan"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Form Preview & Album Modal di Sisi Admin */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: previewTemplate.previewColor }}
                />
                <div>
                  <h3 className="font-bold text-white text-base">
                    Pratinjau Desain: {previewTemplate.name}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Kategori: {previewTemplate.category} &bull; {previewTemplate.price || "Rp 149.000"} &bull;{" "}
                    {previewTemplate.isActive ? (
                      <span className="text-emerald-400 font-semibold">Aktif di Beranda</span>
                    ) : (
                      <span className="text-stone-500">Draf</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Sub-tab Switcher: Album Foto vs Interactive Preview */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setPreviewModalTab("album")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewModalTab === "album"
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">collections</span>
                    <span>Album Mockup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewModalTab("interactive")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewModalTab === "interactive"
                        ? "bg-amber-400 text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">devices</span>
                    <span>Live Iframe</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-stone-950 overflow-y-auto">
              {previewModalTab === "album" ? (
                <div className="p-6 space-y-6 max-w-4xl mx-auto">
                  {/* Large Showcase Mockup */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewModalAlbumPhotos[previewSelectedAlbumIndex]}
                      alt="Album Showcase"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-stone-950/80 text-white text-xs font-mono border border-stone-700">
                      Foto {previewSelectedAlbumIndex + 1} / {previewModalAlbumPhotos.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {previewModalAlbumPhotos.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPreviewSelectedAlbumIndex(idx)}
                        className={`w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          previewSelectedAlbumIndex === idx
                            ? "border-amber-400 scale-105"
                            : "border-stone-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Description Box */}
                  <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Konsep Desain</h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {previewTemplate.description || "Desain tata letak HTML modern dengan tipografi indah."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 h-full p-4 flex flex-col items-center justify-center">
                  <div className="mb-3 flex items-center justify-between w-[390px] px-1">
                    <span className="text-xs text-stone-400">Pratinjau Mobile (390px)</span>
                    <button
                      type="button"
                      onClick={() => setPreviewCoverOpen((prev) => !prev)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-stone-800"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {previewCoverOpen ? "mail_lock" : "drafts"}
                      </span>
                      <span>{previewCoverOpen ? "Tutup Sampul" : "Sampul Aktif"}</span>
                    </button>
                  </div>

                  <div className="relative w-[390px] h-[640px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-800 ring-8 ring-stone-900">
                    <CoverOverlay
                      isOpen={previewCoverOpen}
                      onOpen={() => setPreviewCoverOpen(true)}
                      weddingData={{
                        ...SAMPLE_WEDDING_DATA,
                        coverPhotoUrl: previewTemplate.coverPhotoUrl || SAMPLE_WEDDING_DATA.coverPhotoUrl,
                        bannerPhotoUrl: previewTemplate.bannerPhotoUrl || SAMPLE_WEDDING_DATA.bannerPhotoUrl,
                      }}
                      isAbsolute={true}
                      viewMode="mobile"
                    />

                    <div className={`w-full h-full transition-opacity duration-700 ${previewCoverOpen ? "opacity-100" : "opacity-0"}`}>
                      <iframe
                        srcDoc={compiledModalPreviewHtml}
                        title={previewTemplate.name}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-800 bg-stone-900 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Slug: <strong className="font-mono text-stone-200">{previewTemplate.slug}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(previewTemplate)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    previewTemplate.isActive
                      ? "bg-stone-800 text-stone-300 hover:text-white"
                      : "bg-emerald-500 text-stone-950"
                  }`}
                >
                  {previewTemplate.isActive ? "Tarik ke Draf" : "Publish ke Beranda"}
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-stone-950 text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-amber-300 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
