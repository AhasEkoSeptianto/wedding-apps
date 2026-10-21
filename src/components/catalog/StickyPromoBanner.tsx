"use client";

import { useState } from "react";

export default function StickyPromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 rounded-full bg-inverse-surface/95 text-inverse-on-surface shadow-2xl backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-4 transition-all duration-500 border border-white/10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">loyalty</span>
        </div>
        <div className="truncate">
          <p className="text-xs sm:text-sm font-semibold truncate text-surface">
            Diskon Spesial 30% Paket Bundle Undangan + Buku Tamu Digital
          </p>
          <p className="text-[11px] text-inverse-on-surface/80 truncate hidden sm:block">
            Gunakan kupon{" "}
            <span className="text-primary-fixed font-bold tracking-wider">
              JANJIBAHAGIA
            </span>{" "}
            saat checkout. Berlaku minggu ini!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href="#katalog"
          className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
        >
          Klaim Diskon
        </a>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Tutup Banner"
          className="p-1 rounded-full text-inverse-on-surface/70 hover:text-inverse-on-surface hover:bg-white/10 transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </aside>
  );
}

