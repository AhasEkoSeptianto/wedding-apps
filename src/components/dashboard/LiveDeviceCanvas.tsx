"use client";

import { useState } from "react";
import { WeddingData } from "./EditorStudio";

interface LiveDeviceCanvasProps {
  data: WeddingData;
}

export default function LiveDeviceCanvas({ data }: LiveDeviceCanvasProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const groomFirst = data.groom.nickName || data.groom.fullName.split(",")[0].split(" ")[0] || "Dimas";
  const brideFirst = data.bride.nickName || data.bride.fullName.split(",")[0].split(" ")[0] || "Sarah";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Device Controller & Zoom Switcher */}
      <div className="w-full flex items-center justify-between mb-4 px-4 py-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full">
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span>Mobile</span>
          </button>

          <button
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              deviceMode === "tablet"
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">tablet_mac</span>
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            <span>Desktop</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            type="button"
            title="Zoom out"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_out</span>
          </button>
          <span className="text-xs font-semibold text-on-surface min-w-9 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(120, z + 10))}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            type="button"
            title="Zoom in"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_in</span>
          </button>
          <div className="h-4 w-px bg-surface-variant mx-1" />
          <button
            onClick={() => setZoomLevel(100)}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            title="Reset Zoom"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Smartphone Device Mockup Container */}
      <div
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        className="relative w-full max-w-[390px] h-[780px] bg-inverse-surface rounded-[44px] p-3 shadow-[0_24px_50px_-12px_rgba(30,34,41,0.25)] ring-8 ring-outline-variant/30 transition-all flex flex-col overflow-hidden"
      >
        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-inverse-surface rounded-full z-30 flex items-center justify-between px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
        </div>

        {/* Phone Inner Display Canvas */}
        <div className="relative w-full h-full bg-[#FAF8F5] rounded-[36px] overflow-y-auto scrollbar-none flex flex-col pb-16 text-on-surface selection:bg-primary-fixed">
          {/* Floating Audio Button inside phone */}
          <div className="absolute top-10 right-4 z-20">
            <button
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              className={`w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-md text-primary flex items-center justify-center cursor-pointer transition-opacity ${
                isMusicPlaying ? "animate-spin-slow" : "opacity-60"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">music_note</span>
            </button>
          </div>

          {/* Section 1: Hero Cover */}
          <div className="relative min-h-[440px] flex flex-col items-center justify-center text-center px-6 pt-12 pb-8 bg-gradient-to-b from-[#F3EEEA] via-[#FAF8F5] to-[#FAF8F5]">
            {/* Decorative Rings */}
            <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
              <svg className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
                <circle cx="42" cy="50" r="28" stroke="currentColor" strokeOpacity="0.8" />
                <circle cx="58" cy="50" r="28" stroke="currentColor" strokeOpacity="0.8" />
                <path d="M50 38 L52 44 L58 44 L53 48 L55 54 L50 50 L45 54 L47 48 L42 44 L48 44 Z" fill="currentColor" />
              </svg>
            </div>

            <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">
              The Wedding Celebration
            </span>

            <h2 className="font-serif text-3xl font-bold text-on-surface tracking-tight leading-tight mb-2">
              {groomFirst} &amp; {brideFirst}
            </h2>

            <p className="font-serif italic text-xs text-on-surface-variant mb-6">
              &ldquo;Menyatukan dua hati dalam satu ikatan suci yang abadi&rdquo;
            </p>

            {/* Prewedding Photo Card */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md mb-6 ring-4 ring-surface-container-lowest">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpenjhSG4xOS0iDMHhnvSLafiUggoQJjOqG9JGwpKu-YABnLOfe5S8kNhbpdg1O8vrW023lUXOU_goDn8SEtlvK86XoT9gHNbFhyCZsam8XkqtAH4dRN1sMXq-GzRu6_WBX3hfMGjMCL2RFftJF_jFOZ4YBiTw_jwNzXcdzLzl2abVJY6NOjBqANF57j2AZyUIuVP8g2No84XzQjCuQ3HsJ2hdtgrlD6c1QmJeDPRz6cwB3CdgFLZa6w"
                alt="Bespoke elegant Indonesian bride and groom"
              />
            </div>

            {/* Date Banner */}
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full shadow-sm border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
              <span className="text-xs font-semibold text-on-surface">{data.events.akad.date}</span>
            </div>
          </div>

          {/* Section 2: Realtime Live Countdown */}
          <div className="px-6 py-6 bg-surface-container-low/60 mx-4 rounded-2xl shadow-sm text-center my-2 border border-outline-variant/10">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider block mb-3 font-semibold">
              Menghitung Hari Bahagia
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: "142", lbl: "Hari" },
                { val: "08", lbl: "Jam" },
                { val: "45", lbl: "Menit" },
                { val: "18", lbl: "Detik" },
              ].map((c, i) => (
                <div key={i} className="bg-surface-container-lowest p-2 rounded-xl shadow-xs border border-outline-variant/10">
                  <span className="font-serif text-lg font-bold text-primary block leading-none mb-1">
                    {c.val}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                    {c.lbl}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>Simpan ke Google Calendar</span>
            </button>
          </div>

          {/* Section 3: Mempelai Profiles Preview */}
          <div className="px-6 py-8 flex flex-col gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-primary/20 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={data.groom.photoUrl}
                  alt={data.groom.fullName}
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-on-surface">
                {data.groom.fullName}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                {data.groom.parents}
              </p>
              <span className="text-xs font-semibold text-primary mt-1">
                {data.groom.instagram}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <span className="font-serif italic text-2xl text-primary font-light">&amp;</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-tertiary/20 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={data.bride.photoUrl}
                  alt={data.bride.fullName}
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-on-surface">
                {data.bride.fullName}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                {data.bride.parents}
              </p>
              <span className="text-xs font-semibold text-primary mt-1">
                {data.bride.instagram}
              </span>
            </div>
          </div>

          {/* Section 4: Akad & Resepsi */}
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm text-center border border-outline-variant/15">
              <span className="px-3 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold inline-block mb-2">
                Akad Nikah
              </span>
              <p className="font-serif text-base font-bold text-on-surface">{data.events.akad.time}</p>
              <p className="text-xs font-semibold text-on-surface mt-1">{data.events.akad.venue}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{data.events.akad.address}</p>
            </div>

            <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm text-center border border-outline-variant/15">
              <span className="px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold inline-block mb-2">
                Resepsi Malam
              </span>
              <p className="font-serif text-base font-bold text-on-surface">{data.events.resepsi.time}</p>
              <p className="text-xs font-semibold text-on-surface mt-1">{data.events.resepsi.venue}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{data.events.resepsi.address}</p>
              <button
                className="mt-3 px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-semibold shadow-sm inline-flex items-center gap-1 cursor-pointer hover:bg-primary-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">map</span>
                <span>Buka Petunjuk Google Maps</span>
              </button>
            </div>
          </div>

          {/* Floating Bottom Navigation inside phone */}
          <div className="sticky bottom-3 inset-x-3 mt-auto z-20">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg p-1.5 flex items-center justify-around text-on-surface-variant border border-outline-variant/20">
              {[
                { icon: "home", label: "Home", active: true },
                { icon: "favorite", label: "Mempelai" },
                { icon: "event", label: "Acara" },
                { icon: "photo_library", label: "Galeri" },
                { icon: "card_giftcard", label: "Amplop" },
                { icon: "mark_email_read", label: "RSVP" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`p-1.5 rounded-full flex flex-col items-center cursor-pointer transition-colors ${
                    item.active ? "text-primary" : "hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="text-[9px] font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phone Base Hint */}
      <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
        <span>Tampilan interaktif responsif mendukung semua perangkat smartphone iOS &amp; Android.</span>
      </p>
    </div>
  );
}
