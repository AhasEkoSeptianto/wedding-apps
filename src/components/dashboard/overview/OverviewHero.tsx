"use client";

import { WeddingData } from "@/types";

interface OverviewHeroProps {
  weddingData?: WeddingData;
  slug?: string;
  onQuickWhatsApp: () => void;
  onDownloadQR: () => void;
}

export default function OverviewHero({
  weddingData,
  slug,
  onQuickWhatsApp,
  onDownloadQR,
}: OverviewHeroProps) {
  const groomNick =
    weddingData?.groom.nickName ||
    weddingData?.groom.fullName.split(",")[0].trim().split(" ")[0] ||
    "Dimas";
  const brideNick =
    weddingData?.bride.nickName ||
    weddingData?.bride.fullName.split(",")[0].trim().split(" ")[0] ||
    "Sarah";

  const eventDate =
    weddingData?.events.resepsi.date ||
    weddingData?.events.akad.date ||
    "Sabtu, 24 Agustus 2026";
  const venue =
    weddingData?.events.resepsi.venue ||
    weddingData?.events.akad.venue ||
    "Grand Ballroom";
  const address =
    weddingData?.events.resepsi.address ||
    weddingData?.events.akad.address ||
    "";

  // Calculate readiness percentage based on fields filled
  const calculateReadiness = () => {
    if (!weddingData) return 85;
    let score = 0;
    const total = 8;
    if (weddingData.groom.fullName) score++;
    if (weddingData.bride.fullName) score++;
    if (weddingData.events.akad.date && weddingData.events.akad.venue) score++;
    if (weddingData.events.resepsi.date && weddingData.events.resepsi.venue) score++;
    if (weddingData.quote.text) score++;
    if (weddingData.gift.bca || weddingData.gift.mandiri) score++;
    if (weddingData.gallery && weddingData.gallery.length > 0) score++;
    if (weddingData.stories && weddingData.stories.length > 0) score++;
    return Math.max(30, Math.round((score / total) * 100));
  };

  const readiness = calculateReadiness();

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm border border-outline-variant/20">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-secondary text-xs font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">celebration</span>
            <span>Ikhtisar Undangan Digital {slug ? `• /demo?slug=${slug}` : ""}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-on-surface">
            Selamat Datang, {groomNick} &amp; {brideNick} ✨
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Pernikahan Impian Anda dijadwalkan pada{" "}
            <strong className="text-on-surface font-semibold">{eventDate}</strong> di{" "}
            <strong className="text-on-surface font-semibold">{venue}</strong>
            {address ? `, ${address}` : ""}. Kesiapan undangan Anda saat ini sudah mencapai{" "}
            <strong className="text-primary font-semibold">{readiness}% siap sebar</strong>.
          </p>

          <div className="pt-2 flex items-center gap-4 w-full max-w-md">
            <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-primary whitespace-nowrap">
              {readiness}% Selesai
            </span>
          </div>
        </div>

        {/* Action Buttons Quick CTAs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onQuickWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-secondary text-on-secondary hover:bg-secondary/90 transition-all shadow-sm text-sm font-semibold cursor-pointer hover:scale-105 active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Sebar via WhatsApp</span>
          </button>

          <button
            onClick={onDownloadQR}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm text-sm font-semibold cursor-pointer hover:scale-105 active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <span>Download QR Check-in</span>
          </button>
        </div>
      </div>
    </section>
  );
}

