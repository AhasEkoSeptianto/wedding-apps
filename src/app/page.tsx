"use client";

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

export default function Home() {
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
    <div className="relative min-h-screen">
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
