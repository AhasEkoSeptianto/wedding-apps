"use client";

import { useMemo, useState } from "react";
import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";
import { renderHtmlTemplate } from "@/lib/templateEngine";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import CoupleSection from "@/components/CoupleSection";
import StorySection from "@/components/StorySection";
import EventSection from "@/components/EventSection";
import GallerySection from "@/components/GallerySection";
import RsvpSection from "@/components/RsvpSection";
import GiftSection from "@/components/GiftSection";
import Footer from "@/components/Footer";
import CoverOverlay from "@/components/CoverOverlay";
import MusicPlayer from "@/components/MusicPlayer";

interface LiveDeviceCanvasProps {
  data: WeddingData;
}

export default function LiveDeviceCanvas({ data }: LiveDeviceCanvasProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [zoomLevel, setZoomLevel] = useState(100);
  // Default preview starts with cover/sampul active as requested
  const [isOpened, setIsOpened] = useState(false);
  const [canvasToast, setCanvasToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setCanvasToast(msg);
    setTimeout(() => {
      setCanvasToast(null);
    }, 2800);
  };

  const getContainerStyle = () => {
    switch (deviceMode) {
      case "mobile":
        return "w-full max-w-[400px] h-[790px] rounded-[48px] p-3.5 ring-8 ring-stone-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]";
      case "tablet":
        return "w-full max-w-[700px] h-[820px] rounded-[36px] p-4 ring-8 ring-stone-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]";
      case "desktop":
        return "w-full max-w-[940px] h-[760px] rounded-2xl ring-1 ring-outline-variant/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)]";
    }
  };

  const theme = getTheme(data.themeId);
  const currentSlug = data.slug || "dimas&sarah";
  const isCustomHtmlMode = true;

  const compiledHtml = useMemo(() => {
    return renderHtmlTemplate(data.customHtml || "", data, {
      guestName: "Bapak / Ibu Tamu Terhormat",
    });
  }, [data]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Device Controller & Live Toolbar */}
      <div className="w-full flex items-center justify-between mb-4 px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex-wrap gap-2">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full">
          <button
            onClick={() => {
              setDeviceMode("mobile");
              if (zoomLevel < 100) setZoomLevel(100);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-surface-container-lowest text-on-surface shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span>Mobile (390px)</span>
          </button>

          <button
            onClick={() => {
              setDeviceMode("tablet");
              if (zoomLevel > 90) setZoomLevel(90);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "tablet"
                ? "bg-surface-container-lowest text-on-surface shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">tablet_mac</span>
            <span>Tablet (700px)</span>
          </button>

          <button
            onClick={() => {
              setDeviceMode("desktop");
              if (zoomLevel > 85) setZoomLevel(85);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-surface-container-lowest text-on-surface shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            <span>Desktop</span>
          </button>
        </div>

        {/* Cover Screen Toggle & Zoom Controller */}
        <div className="flex items-center gap-2">
          {/* Cover Screen Switch */}
          <button
            type="button"
            onClick={() => setIsOpened(!isOpened)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isOpened
                ? "bg-primary text-on-primary border-primary shadow-xs"
                : "bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high"
            }`}
            title="Klik untuk melihat sampul depan / cover overlay"
          >
            <span className="material-symbols-outlined text-[16px]">
              {!isOpened ? "drafts" : "mail"}
            </span>
            <span>{!isOpened ? "Sampul Aktif" : "Buka Sampul"}</span>
          </button>

          {/* Mode Indicator Badge */}
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border shadow-xs bg-amber-50 text-amber-900 border-amber-300"
            title="Sedang menggunakan Template HTML Pilihan Desainer dari Katalog"
          >
            <span className="material-symbols-outlined text-[14px]">
              style
            </span>
            <span className="hidden sm:inline">
              Template Desainer
            </span>
          </span>

          <div className="h-4 w-px bg-surface-variant mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-full">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
              className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              title="Perkecil Canvas"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_out</span>
            </button>
            <span className="text-[11px] font-mono font-medium px-1.5 text-on-surface min-w-[36px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
              className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              title="Perbesar Canvas"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mockup Container */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease, width 0.3s ease, max-width 0.3s ease",
        }}
        className={`relative bg-stone-900 transition-all flex flex-col overflow-hidden ${getContainerStyle()}`}
      >
        {/* Device Header Chrome: Mobile Dynamic Island */}
        {deviceMode === "mobile" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-950 rounded-full z-40 flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
          </div>
        )}

        {/* Device Header Chrome: Tablet Camera Dot */}
        {deviceMode === "tablet" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-800 z-40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
          </div>
        )}

        {/* Device Header Chrome: Desktop Browser Window Frame */}
        {deviceMode === "desktop" && (
          <div className="bg-stone-900 px-4 py-2 flex items-center justify-between border-b border-stone-800 shrink-0">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-4 bg-stone-800/80 rounded-md px-3 py-1 flex items-center gap-2 text-stone-300 text-[11px] font-mono border border-stone-700/50">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
              <span className="truncate">https://janjisuci.com/{currentSlug}</span>
            </div>

            {/* Browser actions */}
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span className="material-symbols-outlined text-[16px]">more_vert</span>
            </div>
          </div>
        )}

        {/* Device Viewport Canvas */}
        <div
          className={`relative w-full h-full overflow-y-auto scroll-smooth flex flex-col ${
            deviceMode === "mobile"
              ? "rounded-[38px]"
              : deviceMode === "tablet"
              ? "rounded-[24px]"
              : "rounded-b-xl"
          }`}
          style={{
            backgroundColor: isCustomHtmlMode ? "#ffffff" : theme.colors.bg,
            color: isCustomHtmlMode ? "inherit" : theme.colors.text,
          }}
        >
          {/* Universal Cover Screen Overlay (active by default for both Custom HTML & Standard Theme) */}
          <CoverOverlay
            isOpen={isOpened}
            onOpen={() => setIsOpened(true)}
            weddingData={data}
            isAbsolute={true}
            viewMode={deviceMode}
          />

          {/* Floating Audio Controller */}
          <MusicPlayer autoPlayTrigger={isOpened} isAbsolute={true} />

          {isCustomHtmlMode ? (
            /* Render Full Custom HTML in Sandboxed Responsive iframe */
            <div className={`w-full h-full transition-opacity duration-700 ${isOpened ? "opacity-100" : "opacity-0"}`}>
              <iframe
                srcDoc={compiledHtml}
                title="Preview Undangan Template HTML"
                className="w-full h-full border-0 bg-transparent"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          ) : (
            /* Render Standard React Components with Visual Theme */
            <main className={`transition-opacity duration-700 ${isOpened ? "opacity-100" : "opacity-90"}`}>
              <HeroSection weddingData={data} viewMode={deviceMode} />
              <QuoteSection weddingData={data} viewMode={deviceMode} />
              <CoupleSection weddingData={data} viewMode={deviceMode} />
              <StorySection weddingData={data} viewMode={deviceMode} />
              <EventSection weddingData={data} viewMode={deviceMode} />
              <GallerySection weddingData={data} viewMode={deviceMode} />
              <RsvpSection onShowToast={showToast} weddingData={data} viewMode={deviceMode} />
              <GiftSection onShowToast={showToast} weddingData={data} viewMode={deviceMode} />
              <Footer weddingData={data} />
            </main>
          )}
        </div>

        {/* Device Bottom Indicator: Mobile Home Bar */}
        {deviceMode === "mobile" && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40 pointer-events-none" />
        )}
      </div>

      {/* Floating Canvas Toast */}
      {canvasToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-stone-700 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
          <span>{canvasToast}</span>
        </div>
      )}

      {/* Responsive Hint */}
      <div className="text-xs text-on-surface-variant mt-4 flex items-center gap-2 text-center">
        <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
        <span>
          Canvas preview live default dengan <strong>Sampul Aktif</strong>. Klik tombol <strong>Buka Undangan</strong> untuk melihat isi undangan.
        </span>
      </div>
    </div>
  );
}
