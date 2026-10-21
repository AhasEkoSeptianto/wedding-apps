"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isEditor = pathname === "/editor" || pathname === "/live-demo-editor";
  const isDashboard = pathname.startsWith("/dashboard");
  const isPricing = pathname === "/paket-harga";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F9FF]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(179,135,66,0.06)] border-b border-outline-variant/30">
      <div className="h-20 w-full max-w-[1360px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4">
        {/* Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Logo JanjiSuci"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wyr4h6Z3syVwA57Z6k-06bWVsXyZ9qSt30t4VY57-2tyIjyWF_HPQort7Pdl4UTAzhzAs8L0WDnnbjCkZ85VFrKEnMSOcPWQVN3LX_1195RCgup8xnL0-buDtS5ySW2hTdD3Uc9GUgf-VLR-DfeNozaEmWjfIobFpw6xOfVxtfLBfouCglBDV5jDqumNYWNtM1UQ0mZa7l1GFUZZ9IZleLBt4CUlKHbMXgq051cymoFh8qjnpLNaeMh4ye"
            />
            <span className="text-2xl text-primary font-bold tracking-tight font-serif">
              JanjiSuci
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`transition-colors py-1 text-sm ${
                isHome
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "font-medium text-on-surface-variant hover:text-primary"
              }`}
            >
              Katalog Template
            </Link>
            <Link
              href="/editor"
              className={`transition-colors py-1 text-sm ${
                isEditor
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "font-medium text-on-surface-variant hover:text-primary"
              }`}
            >
              Live Demo &amp; Editor
            </Link>
            <Link
              href="/dashboard"
              className={`transition-colors py-1 text-sm ${
                isDashboard
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "font-medium text-on-surface-variant hover:text-primary"
              }`}
            >
              Dashboard Pengantin
            </Link>
            <Link
              href="/paket-harga"
              className={`transition-colors py-1 text-sm ${
                isPricing
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "font-medium text-on-surface-variant hover:text-primary"
              }`}
            >
              Paket &amp; Harga
            </Link>
          </nav>
        </div>

        {/* Right CTA & Profile */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            type="button"
            aria-label="Notifikasi"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
          </button>

          <Link
            href="/demo"
            className="hidden sm:inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm px-6 py-2.5 rounded-full transition-all shadow-[0_4px_20px_-2px_rgba(179,135,66,0.25)] hover:scale-105 active:scale-95"
          >
            Buat Undangan Gratis
          </Link>

          <div className="flex items-center gap-2 pl-1 border-l border-outline-variant/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0_zMuj1k-ntMZieXKiEdekLPrGyRP7pS39_J5TtGXFDL26_fYrfwfB-YkDP_aC9VTgHF39G0Ao6iEsZrGJEnkWaR4GruqEklLt6gCmgC_IH9X7Jeyy41bIJPJvWJ_T0ItgKaFPR6AZjJ0uGbf-6gbNDObzvjPAF99WX6LLnk80CwVvpjqqhdCjcHzrtk7Hngph8NFiHfxoeC6w7jduXwqReBpQVc-n810mYg2was_wkv8rCPon0XQmQ"
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
              type="button"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant/30 px-6 py-4 flex flex-col gap-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-1.5 font-medium ${isHome ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
          >
            Katalog Template
          </Link>
          <Link
            href="/editor"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-1.5 font-medium ${isEditor ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
          >
            Live Demo &amp; Editor
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-1.5 font-medium ${isDashboard ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
          >
            Dashboard Pengantin
          </Link>
          <Link
            href="/paket-harga"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-1.5 font-medium ${isPricing ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
          >
            Paket &amp; Harga
          </Link>
          <Link
            href="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center bg-primary text-on-primary font-semibold text-sm px-6 py-2.5 rounded-full mt-2"
          >
            Buat Undangan Gratis
          </Link>
        </div>
      )}
    </header>
  );
}

