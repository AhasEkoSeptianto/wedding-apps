"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";
import { renderHtmlTemplate, PRESET_HTML_TEMPLATES } from "@/lib/templateEngine";
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

interface WeddingInvitationViewProps {
  initialSlug?: string;
}

export default function WeddingInvitationView({ initialSlug }: WeddingInvitationViewProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Extract slug from route params (e.g. /[slug] -> /dimas&sarah) or search query / auth
  const routeSlug = typeof params?.slug === "string" ? decodeURIComponent(params.slug) : undefined;
  const querySlug = searchParams.get("slug") || undefined;
  const themeParam = searchParams.get("theme");
  const guestParam = searchParams.get("to") || searchParams.get("guest") || "Bapak / Ibu Tamu Terhormat";

  const targetSlug = initialSlug || routeSlug || querySlug || user?.weddingSlug || "dimas&sarah";

  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  const [isLoading, setIsLoading] = useState(true);
  // Default preview starts with cover/sampul active as requested
  const [isOpened, setIsOpened] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Apply specific theme if requested via URL query ?theme=...
    const applyThemeParam = async (currentData: WeddingData) => {
      if (!themeParam) return currentData;
      try {
        const res = await api.getTemplates();
        const found = (res.data || []).find((t) => t.slug === themeParam || t.id === themeParam);
        if (found && found.html) {
          return {
            ...currentData,
            themeId: found.slug || found.id,
            designMode: "custom_html" as const,
            customHtml: found.html,
            coverPhotoUrl: found.coverPhotoUrl || currentData.coverPhotoUrl,
            bannerPhotoUrl: found.bannerPhotoUrl || currentData.bannerPhotoUrl,
          };
        }
      } catch (e) {
        console.warn("Could not fetch template for themeParam:", e);
      }
      const matched = PRESET_HTML_TEMPLATES.find((p) => p.id === themeParam);
      if (matched) {
        return {
          ...currentData,
          themeId: matched.id,
          designMode: "custom_html" as const,
          customHtml: matched.html,
          coverPhotoUrl: matched.coverPhotoUrl || currentData.coverPhotoUrl,
          bannerPhotoUrl: matched.bannerPhotoUrl || currentData.bannerPhotoUrl,
        };
      }
      return currentData;
    };

    api
      .getWedding(targetSlug)
      .then(async (res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          let merged: WeddingData = {
            ...DEFAULT_WEDDING_DATA,
            ...res.data,
            themeId: themeParam || res.data.themeId || "royal-gold-majesty",
            designMode: "custom_html",
            customHtml: res.data.customHtml || DEFAULT_WEDDING_DATA.customHtml,
            gallery: res.data.gallery || [],
            stories: res.data.stories !== undefined ? res.data.stories : (DEFAULT_WEDDING_DATA.stories || []),
          };
          if (themeParam) {
            merged = await applyThemeParam(merged);
          }
          if (isMounted) setWeddingData(merged);
        } else if (themeParam) {
          const updated = await applyThemeParam(DEFAULT_WEDDING_DATA);
          if (isMounted) setWeddingData(updated);
        }
      })
      .catch(async (err) => {
        console.warn("Using default wedding data due to fetch error:", err);
        if (themeParam) {
          const updated = await applyThemeParam(DEFAULT_WEDDING_DATA);
          if (isMounted) setWeddingData(updated);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetSlug, themeParam]);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const currentTheme = getTheme(weddingData.themeId);
  const isCustomHtmlMode = true;

  const groomNick = weddingData.groom.nickName || weddingData.groom.fullName.split(" ")[0] || "Dimas";
  const brideNick = weddingData.bride.nickName || weddingData.bride.fullName.split(" ")[0] || "Sarah";

  // Precompile Custom HTML with placeholders
  const compiledHtml = useMemo(() => {
    if (!isCustomHtmlMode) return "";
    return renderHtmlTemplate(weddingData.customHtml || "", weddingData, {
      guestName: guestParam,
    });
  }, [isCustomHtmlMode, weddingData, guestParam]);

  // Ignore static assets if mistakenly routed
  if (targetSlug === "favicon.ico" || targetSlug.startsWith("_")) {
    return null;
  }

  // Pre-load Screen: Wait until actual couple data is fetched to prevent default flash
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#111913] flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-[#d7bc89]/30 border-t-[#d7bc89] animate-spin" />
          <div className="text-center space-y-1">
            <span className="font-serif tracking-widest text-xs uppercase text-[#d7bc89] block">
              JanjiSuci Atelier
            </span>
            <p className="text-xs text-stone-400 font-light">
              Menyiapkan undangan pernikahan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mode 1: Custom HTML Template Full Screen
  if (isCustomHtmlMode) {
    return (
      <div className="relative min-h-screen bg-stone-900 overflow-hidden">
        {/* Top Floating Back Bar */}
        <nav className="fixed top-4 left-4 z-40 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl hover:bg-stone-900 transition-colors flex items-center gap-2 border border-white/15">
          <Link href={`/editor?slug=${encodeURIComponent(targetSlug)}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
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
            <span className="font-mono">/{targetSlug}</span>
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
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          />
        </div>
      </div>
    );
  }

  // Mode 2: Standard Visual React Components Fallback
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
        <Link href={`/editor?slug=${encodeURIComponent(targetSlug)}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>Buka Editor Studio</span>
        </Link>
        <span className="text-white/30">|</span>
        <Link href="/" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Katalog</span>
        </Link>
        <span className="text-white/30">|</span>
        <span className="text-amber-300 flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          /{targetSlug}
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
