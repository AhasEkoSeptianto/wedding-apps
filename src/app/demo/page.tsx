"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";
import { renderHtmlTemplate } from "@/lib/templateEngine";
import CoverOverlay from "@/components/CoverOverlay";
import MusicPlayer from "@/components/MusicPlayer";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import CoupleSection from "@/components/CoupleSection";
import StorySection from "@/components/StorySection";
import EventSection from "@/components/EventSection";
import GallerySection from "@/components/GallerySection";
import RsvpSection from "@/components/RsvpSection";
import GiftSection from "@/components/GiftSection";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

function DemoContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const slugParam = searchParams.get("slug");
  const themeParam = searchParams.get("theme");
  const guestParam = searchParams.get("to") || searchParams.get("guest") || "Bapak / Ibu Tamu Terhormat";
  const targetSlug = slugParam || user?.weddingSlug || "dimas-sarah";

  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  // Default preview starts with cover/sampul active as requested
  const [isOpened, setIsOpened] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getWedding(targetSlug)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setWeddingData({
            ...DEFAULT_WEDDING_DATA,
            ...res.data,
            themeId: themeParam || res.data.themeId || "royal-bloom",
            designMode: res.data.designMode || DEFAULT_WEDDING_DATA.designMode || "standard",
            customHtml: res.data.customHtml || DEFAULT_WEDDING_DATA.customHtml,
            gallery: res.data.gallery || [],
            stories: res.data.stories !== undefined ? res.data.stories : (DEFAULT_WEDDING_DATA.stories || []),
          });
        } else if (themeParam) {
          setWeddingData((prev) => ({ ...prev, themeId: themeParam }));
        }
      })
      .catch((err) => {
        console.warn("Using default wedding data due to fetch error:", err);
        if (themeParam) {
          setWeddingData((prev) => ({ ...prev, themeId: themeParam }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetSlug, themeParam]);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const currentTheme = getTheme(weddingData.themeId);
  const isCustomHtmlMode = weddingData.designMode === "custom_html";

  const groomNick = weddingData.groom.nickName || weddingData.groom.fullName.split(" ")[0] || "Dimas";
  const brideNick = weddingData.bride.nickName || weddingData.bride.fullName.split(" ")[0] || "Sarah";

  // Precompile Custom HTML
  const compiledHtml = useMemo(() => {
    if (!isCustomHtmlMode) return "";
    return renderHtmlTemplate(weddingData.customHtml || "", weddingData, {
      guestName: guestParam,
    });
  }, [isCustomHtmlMode, weddingData, guestParam]);

  // Mode 1: Custom HTML Template Full Screen
  if (isCustomHtmlMode) {
    return (
      <div className="relative min-h-screen bg-stone-900 overflow-hidden">
        {/* Top Floating Back Bar */}
        <nav className="fixed top-4 left-4 z-40 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl hover:bg-stone-900 transition-colors flex items-center gap-2 border border-white/15">
          <Link href={`/editor?slug=${targetSlug}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Buka Editor Studio</span>
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Katalog</span>
          </Link>
          <span className="text-white/30">|</span>
          <span className="text-amber-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Template HTML: {groomNick} &amp; {brideNick}</span>
          </span>
        </nav>

        {/* Welcome Screen Cover (Active by Default) */}
        <CoverOverlay isOpen={isOpened} onOpen={handleOpen} weddingData={weddingData} />

        {/* Floating Audio Controller */}
        <MusicPlayer autoPlayTrigger={isOpened} />

        {/* Fullscreen Sandboxed Custom HTML */}
        <div className={`transition-opacity duration-700 ${isOpened ? "opacity-100" : "opacity-0"}`}>
          <iframe
            srcDoc={compiledHtml}
            title={`Undangan ${groomNick} & ${brideNick}`}
            className="w-full min-h-screen border-0 block"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    );
  }

  // Mode 2: Standard Visual React Components
  return (
    <div
      className="relative min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.colors.bg,
        color: currentTheme.colors.text,
      }}
    >
      {/* Top Floating Back Bar */}
      <nav className="fixed top-4 left-4 z-40 bg-stone-900/85 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-stone-900 transition-colors flex items-center gap-2 border border-white/10">
        <Link href={`/editor?slug=${targetSlug}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>Buka Editor Studio</span>
        </Link>
        <span className="text-white/30">|</span>
        <Link href="/" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Katalog</span>
        </Link>
        <span className="text-white/30">|</span>
        <span className="text-amber-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live: {groomNick} &amp; {brideNick} ({currentTheme.name})
        </span>
      </nav>

      {/* Welcome Screen Cover (Active by Default) */}
      <CoverOverlay isOpen={isOpened} onOpen={handleOpen} weddingData={weddingData} />

      {/* Floating Audio Controller */}
      <MusicPlayer autoPlayTrigger={isOpened} />

      {/* Main Invitation Page */}
      <main className={`transition-opacity duration-700 ${isOpened ? "opacity-100" : "opacity-90"}`}>
        <HeroSection weddingData={weddingData} />
        <QuoteSection weddingData={weddingData} />
        <CoupleSection weddingData={weddingData} />
        <StorySection weddingData={weddingData} />
        <EventSection weddingData={weddingData} />
        <GallerySection weddingData={weddingData} />
        <RsvpSection onShowToast={setToastMessage} weddingData={weddingData} />
        <GiftSection onShowToast={setToastMessage} weddingData={weddingData} />
        <Footer weddingData={weddingData} />
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
