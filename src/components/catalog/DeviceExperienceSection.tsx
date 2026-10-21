"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DeviceExperienceSection() {
  const [countdown, setCountdown] = useState({
    days: 148,
    hours: 18,
    minutes: 42,
    seconds: 10,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="fitur" className="w-full max-w-[1360px] mx-auto px-4 md:px-12 py-12">
      <div className="rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-6 md:p-12 shadow-lg flex flex-col lg:flex-row items-center gap-10 border border-outline-variant/30">
        {/* Left Copy & Features */}
        <div className="flex-1 flex flex-col items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs uppercase font-semibold mb-3">
            <span className="material-symbols-outlined text-[16px]">touch_app</span>
            <span>Teknologi Web Responsive</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-on-surface mb-3 leading-tight">
            Tampilan Sempurna di Segala Layar Smartphone Tamu Anda
          </h2>

          <p className="text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed">
            Setiap template JanjiSuci dioptimalkan secara dinamis untuk kecepatan kilat di WhatsApp, Instagram Bio, dan browser seluler. Dilengkapi transisi buka amplop bertekstur, musik latar lembut, dan peta petunjuk arah satu klik.
          </p>

          {/* Feature Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm shadow-xs border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
                lock_clock
              </span>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">
                  Buku Tamu QR Otomatis
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Check-in cepat tanpa antrean panjang di lokasi resepsi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm shadow-xs border border-outline-variant/15">
              <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">
                account_balance_wallet
              </span>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">
                  Amplop &amp; Kado Digital
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Rekening bank aman &amp; integrasi QRIS instan bebas potongan.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Coba Live Editor Gratis</span>
            </Link>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-surface-container-lowest text-on-surface text-sm font-semibold hover:bg-surface-container transition-all shadow-sm border border-outline-variant/20"
            >
              Konsultasi Desain Kustom
            </a>
          </div>
        </div>

        {/* Smartphone Mockup Preview Frame */}
        <div className="relative w-full max-w-[320px] aspect-[9/19] rounded-[42px] p-3 bg-surface-dim shadow-2xl shrink-0 border-4 border-[#2D3138]">
          {/* Phone Speaker & Camera pill */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-inverse-surface rounded-full z-20" />

          {/* Screen Content Container */}
          <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-surface-container-lowest flex flex-col">
            <div className="relative w-full h-full overflow-y-auto">
              {/* Couple Header Image inside phone */}
              <div className="relative h-64 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  alt="Intimate portrait of an Indonesian bride and groom in modern champagne golden attire"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGJmkqnODdRRQnZtG-ij6hpbsJ88WX6fRuZqUdUGGMBjp5H0Mh-Kn_VpfdSPRPOb8PAxzSouxj03aZuffGLiif3kBS37E1jK3VkoqH4RPeZ7dtw7iIAxC00YQMfoLfVr_D0G7kobHUk8XsZcSosWe_dRmeuBdR_ZCCXibFpErVZe5g4A15Cx20C1M9H2S7cvhf0cfyGt3NMHb2qFRWrgbLeNaRvjfdnMaqDf-j9Evyzmza8QMVBJTN-A"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-on-primary">
                  <span className="text-[11px] uppercase tracking-widest text-primary-fixed font-semibold">
                    The Wedding Of
                  </span>
                  <h4 className="font-serif text-xl font-bold">Raden &amp; Kirana</h4>
                  <p className="text-xs text-primary-fixed-dim">Sabtu, 24 Oktober 2026</p>
                </div>
              </div>

              {/* Inside details snippet */}
              <div className="p-4 space-y-3 bg-surface-container-lowest">
                <div className="text-center py-2 px-3 rounded-lg bg-surface-container-low border border-outline-variant/15">
                  <p className="text-xs text-on-surface-variant italic">
                    &ldquo;Kepada Yth. Bapak/Ibu/Sahabat terkasih&rdquo;
                  </p>
                  <p className="text-sm text-primary font-bold mt-1">
                    Ananda Pratama &amp; Rekan
                  </p>
                </div>

                {/* Countdown Simulator */}
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="p-1.5 rounded bg-surface-container">
                    <span className="text-sm font-bold text-on-surface">{countdown.days}</span>
                    <p className="text-[10px] text-outline">Hari</p>
                  </div>
                  <div className="p-1.5 rounded bg-surface-container">
                    <span className="text-sm font-bold text-on-surface">{countdown.hours}</span>
                    <p className="text-[10px] text-outline">Jam</p>
                  </div>
                  <div className="p-1.5 rounded bg-surface-container">
                    <span className="text-sm font-bold text-on-surface">{countdown.minutes}</span>
                    <p className="text-[10px] text-outline">Mnt</p>
                  </div>
                  <div className="p-1.5 rounded bg-surface-container">
                    <span className="text-sm font-bold text-on-surface">{countdown.seconds}</span>
                    <p className="text-[10px] text-outline">Dtk</p>
                  </div>
                </div>

                {/* Open Button Simulation */}
                <Link
                  href="/demo"
                  className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">drafts</span>
                  <span>Buka Undangan Suci</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
