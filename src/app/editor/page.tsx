"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EditorStudio from "@/components/dashboard/EditorStudio";
import LiveDeviceCanvas from "@/components/dashboard/LiveDeviceCanvas";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function EditorStudioContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const slug = slugParam || user?.weddingSlug || "dimas-sarah";

  const [data, setData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  const [activeTab, setActiveTab] = useState<"pasangan" | "acara" | "galeri" | "fitur" | "rsvp">("pasangan");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSync, setLastSync] = useState<string>("Baru saja");

  // Load latest wedding data from database on mount or when slug changes
  useEffect(() => {
    let isCurrent = true;
    api
      .getWedding(slug)
      .then((res) => {
        if (isCurrent && res.success && res.data) {
          setData({
            ...DEFAULT_WEDDING_DATA,
            ...res.data,
            gallery: res.data.gallery || [],
            stories: res.data.stories !== undefined ? res.data.stories : (DEFAULT_WEDDING_DATA.stories || []),
          });
          const now = new Date();
          setLastSync(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        }
      })
      .catch((err) => {
        console.warn("Could not load wedding data from server, using defaults:", err);
      });

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  };

  const handleShareLink = () => {
    const demoUrl = `${window.location.origin}/demo?slug=${slug}`;
    navigator.clipboard
      .writeText(demoUrl)
      .then(() => showToast("Link Demo Undangan berhasil disalin!"))
      .catch(() => showToast("Gagal menyalin link"));
  };

  const handleSave = async (isPublish = false) => {
    setIsSaving(true);
    try {
      const res = await api.updateWedding(slug, data);
      if (res.success) {
        const now = new Date();
        setLastSync(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        if (isPublish) {
          showToast("Selamat! Undangan pernikahan berhasil dipublikasikan! 🎉");
        } else {
          showToast("Draf berhasil disimpan ke database!");
        }
      } else {
        showToast(res.message || "Gagal menyimpan data.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      showToast(`Gagal menyimpan: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const groomNick = data.groom.nickName || "Dimas";
  const brideNick = data.bride.nickName || "Sarah";

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Body */}
        <main className="pt-24 px-4 sm:px-6 md:px-8 pb-12 flex-1">
          {/* Top Workspace Sub-Header & Live Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold font-serif text-on-surface truncate">
                    Pernikahan {groomNick} &amp; {brideNick}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold inline-flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSaving ? "bg-amber-500 animate-ping" : "bg-secondary animate-pulse"
                      }`}
                    />
                    {isSaving ? "Menyimpan perubahan..." : "Tersinkron ke Cloud"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    cloud_done
                  </span>
                  <span>
                    Sinkronisasi database: {lastSync} (Slug:{" "}
                    <code className="text-primary font-mono">{slug}</code>)
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Tool Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Undo / Redo */}
              <div className="flex items-center bg-surface-container rounded-full p-1 shadow-xs border border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => showToast("Fitur Undo tersedia")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  title="Undo (Ctrl+Z)"
                >
                  <span className="material-symbols-outlined text-[18px]">undo</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Fitur Redo tersedia")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  title="Redo (Ctrl+Y)"
                >
                  <span className="material-symbols-outlined text-[18px]">redo</span>
                </button>
              </div>

              {/* Buka Live Preview / Demo */}
              <Link
                href={`/demo?slug=${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                <span>Live Demo</span>
              </Link>

              {/* Bagikan Link Demo */}
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">share</span>
                <span>Bagikan Link</span>
              </button>

              {/* Simpan Draf */}
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSaving ? "animate-spin" : ""}`}>
                  {isSaving ? "sync" : "drafts"}
                </span>
                <span>{isSaving ? "Menyimpan..." : "Simpan Draf"}</span>
              </button>

              {/* Publish Undangan */}
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-[0_4px_16px_-2px_rgba(179,135,66,0.3)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>Publish Undangan</span>
              </button>
            </div>
          </div>

          {/* Dual-Pane Workspace Split: Editor Sidebar (5 cols) + Interactive Canvas (7 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Editor Studio */}
            <div className="xl:col-span-5">
              <EditorStudio
                data={data}
                onChange={setData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Right Panel: Live Device Canvas */}
            <div className="xl:col-span-7">
              <LiveDeviceCanvas data={data} />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-stone-700 animate-fade-in">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">
            check_circle
          </span>
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
}

export default function EditorStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EditorStudioContent />
    </Suspense>
  );
}
