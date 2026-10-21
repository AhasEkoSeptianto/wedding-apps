"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-10-24T09:00:00").getTime();

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPad = (num: number) => String(num).padStart(2, "0");

  return (
    <header
      className="relative min-h-screen flex items-center justify-center text-center p-6 bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80')`,
      }}
    >
      <div className="max-w-2xl w-full mx-auto z-10 flex flex-col items-center">
        <span className="text-xs uppercase tracking-[0.35em] text-wedding-gold-light mb-4">
          The Wedding Celebration of
        </span>

        <h1 className="font-heading text-5xl sm:text-7xl font-bold tracking-tight text-white mb-4">
          Alex &amp; Sophie
        </h1>

        <p className="flex items-center gap-2 text-sm sm:text-base tracking-widest text-white/90 mb-10">
          <svg className="w-4 h-4 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
          </svg>
          Saturday, 24 October 2026
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-12 w-full max-w-sm sm:max-w-md">
          {[
            { label: "Days", value: mounted ? formatPad(timeLeft.days) : "00" },
            { label: "Hours", value: mounted ? formatPad(timeLeft.hours) : "00" },
            { label: "Mins", value: mounted ? formatPad(timeLeft.minutes) : "00" },
            { label: "Secs", value: mounted ? formatPad(timeLeft.seconds) : "00" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl py-3 px-2 sm:py-4 sm:px-3 text-center shadow-lg"
            >
              <span className="block font-heading text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                {item.value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/80">
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
