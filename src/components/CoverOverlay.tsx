"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { WeddingData } from "@/types";

interface CoverOverlayProps {
  isOpen: boolean;
  onOpen: () => void;
  weddingData?: WeddingData;
  isAbsolute?: boolean;
  viewMode?: "mobile" | "tablet" | "desktop";
}

function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function GuestNameDisplay() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || searchParams.get("guest") || "You & Family";

  return (
    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white my-2">
      {guestName}
    </h3>
  );
}

export default function CoverOverlay({
  isOpen,
  onOpen,
  weddingData,
  isAbsolute = false,
  viewMode,
}: CoverOverlayProps) {
  const rawGroom =
    weddingData?.groom.nickName ||
    weddingData?.groom.fullName.split(",")[0].split(" ")[0] ||
    "Dimas";
  const rawBride =
    weddingData?.bride.nickName ||
    weddingData?.bride.fullName.split(",")[0].split(" ")[0] ||
    "Sarah";

  const groomName = capitalizeWords(rawGroom);
  const brideName = capitalizeWords(rawBride);

  const isMobile = viewMode === "mobile";

  return (
    <section
      className={`${
        isAbsolute ? "absolute z-30" : "fixed z-50"
      } inset-0 flex items-center justify-center p-5 text-center transition-all duration-700 ease-in-out bg-cover bg-center ${
        isOpen
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.72), rgba(18, 18, 18, 0.85)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')`,
      }}
    >
      <div className={`w-full mx-auto text-white ${isMobile ? "max-w-xs" : "max-w-md"}`}>
        <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.3em] font-medium text-wedding-gold-light border-b border-wedding-gold pb-1 mb-3">
          Wedding Invitation
        </span>

        <h1
          className={`font-heading font-bold tracking-tight text-white mb-2 ${
            isMobile ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {groomName} &amp; {brideName}
        </h1>

        <p className="font-serif italic text-base sm:text-xl text-wedding-gold-light mb-6 sm:mb-8">
          Are getting married
        </p>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-white/80">
            Dear Special Guest,
          </p>
          <Suspense fallback={<h3 className="font-serif text-2xl text-white my-2">You &amp; Family</h3>}>
            <GuestNameDisplay />
          </Suspense>
          <p className="text-xs sm:text-sm text-white/90">
            You are cordially invited to celebrate our wedding ceremony and reception.
          </p>
        </div>

        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-wedding-gold text-white font-medium text-sm tracking-wide shadow-lg hover:bg-wedding-gold-dark hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5" />
          </svg>
          Open Invitation
        </button>
      </div>
    </section>
  );
}

