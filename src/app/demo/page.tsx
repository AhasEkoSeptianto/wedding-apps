"use client";

import Link from "next/link";
import { useState } from "react";
import CoverOverlay from "@/components/CoverOverlay";
import MusicPlayer from "@/components/MusicPlayer";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import CoupleSection from "@/components/CoupleSection";
import EventSection from "@/components/EventSection";
import GallerySection from "@/components/GallerySection";
import RsvpSection from "@/components/RsvpSection";
import GiftSection from "@/components/GiftSection";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export default function DemoPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2]">
      {/* Top Floating Back Bar */}
      <nav className="fixed top-4 left-4 z-40 bg-stone-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-stone-900 transition-colors flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1.5 hover:text-wedding-gold-light">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Katalog JanjiSuci</span>
        </Link>
        <span className="text-white/40">|</span>
        <span className="text-wedding-gold-light">Live Preview Mode</span>
      </nav>

      {/* Welcome Screen Cover */}
      <CoverOverlay isOpen={isOpened} onOpen={handleOpen} />

      {/* Floating Audio Controller */}
      <MusicPlayer autoPlayTrigger={isOpened} />

      {/* Main Invitation Page */}
      <main className={`transition-opacity duration-700 ${isOpened ? "opacity-100" : "opacity-90"}`}>
        <HeroSection />
        <QuoteSection />
        <CoupleSection />
        <EventSection />
        <GallerySection />
        <RsvpSection onShowToast={showToast} />
        <GiftSection onShowToast={showToast} />
        <Footer />
      </main>

      {/* Toast Feedback */}
      <Toast message={toastMessage} />
    </div>
  );
}
