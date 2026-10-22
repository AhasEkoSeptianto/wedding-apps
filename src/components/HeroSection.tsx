"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WeddingData } from "@/types";

interface HeroSectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function HeroSection({ weddingData, viewMode }: HeroSectionProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDateStr = weddingData?.events?.akad?.date;

  useEffect(() => {
    const parseTargetDate = (): number => {
      if (!targetDateStr) return new Date("2026-10-24T09:00:00").getTime();
      const direct = new Date(targetDateStr).getTime();
      if (!isNaN(direct) && direct > 0) return direct;

      const match = targetDateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
      if (match) {
        const months: Record<string, number> = {
          januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
          juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
          january: 0, february: 1, march: 2, may: 4, june: 5,
          july: 6, august: 7, october: 9, december: 11,
        };
        const day = parseInt(match[1], 10);
        const month = months[match[2].toLowerCase()] ?? 9;
        const year = parseInt(match[3], 10);
        return new Date(year, month, day, 9, 0, 0).getTime();
      }
      return new Date("2026-10-24T09:00:00").getTime();
    };

    const targetTime = parseTargetDate();

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const formatPad = (num: number) => String(num).padStart(2, "0");

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
    <header
      className="relative min-h-screen flex items-center justify-center text-center p-6 bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80')`,
      }}
    >
      <div className={`w-full mx-auto z-10 flex flex-col items-center ${isMobile ? "max-w-xs" : "max-w-2xl"}`}>
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-wedding-gold-light mb-3 sm:mb-4">
          The Wedding Celebration of
        </span>

        <h1
          className={`font-heading font-bold tracking-tight text-white mb-3 sm:mb-4 ${
            isMobile ? "text-3xl sm:text-4xl" : "text-5xl sm:text-7xl"
          }`}
        >
          {groomName} &amp; {brideName}
        </h1>

        <p className="flex items-center gap-2 text-xs sm:text-base tracking-widest text-white/90 mb-8 sm:mb-10">
          <svg className="w-4 h-4 text-wedding-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
          </svg>
          <span>{weddingData?.events.akad.date || "Sabtu, 24 Agustus 2026"}</span>
        </p>

        {/* Countdown Timer */}
        <div
          className={`grid grid-cols-4 mb-10 w-full ${
            isMobile ? "gap-2 max-w-[320px]" : "gap-2 sm:gap-4 max-w-sm sm:max-w-md"
          }`}
        >
          {[
            { label: "Days", value: mounted ? formatPad(timeLeft.days) : "00" },
            { label: "Hours", value: mounted ? formatPad(timeLeft.hours) : "00" },
            { label: "Mins", value: mounted ? formatPad(timeLeft.minutes) : "00" },
            { label: "Secs", value: mounted ? formatPad(timeLeft.seconds) : "00" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white/15 backdrop-blur-md border border-white/25 rounded-xl text-center shadow-lg ${
                isMobile ? "py-2.5 px-1.5" : "py-3 px-2 sm:py-4 sm:px-3"
              }`}
            >
              <span
                className={`block font-heading font-bold text-white leading-none mb-1 ${
                  isMobile ? "text-xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {item.value}
              </span>
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-white/80">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#couple"
          aria-label="Scroll to couple section"
          className="animate-bounce-slow text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </header>
  );
}
