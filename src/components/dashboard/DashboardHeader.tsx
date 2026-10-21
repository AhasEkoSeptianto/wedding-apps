"use client";

import Link from "next/link";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(179,135,66,0.06)] z-40 flex items-center justify-between px-4 sm:px-6">
      {/* Left Breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Buka Menu"
          className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary font-semibold">Editor Studio</span>
          <span className="text-outline-variant">/</span>
          <Link
            href="/"
            className="text-on-surface-variant hover:text-primary transition-colors hidden sm:inline"
          >
            Template
          </Link>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          type="button"
          aria-label="Notifikasi"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-all shadow-[0_4px_16px_-2px_rgba(179,135,66,0.2)] hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] mr-1">add</span>
          <span>Buat Undangan</span>
        </Link>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0_zMuj1k-ntMZieXKiEdekLPrGyRP7pS39_J5TtGXFDL26_fYrfwfB-YkDP_aC9VTgHF39G0Ao6iEsZrGJEnkWaR4GruqEklLt6gCmgC_IH9X7Jeyy41bIJPJvWJ_T0ItgKaFPR6AZjJ0uGbf-6gbNDObzvjPAF99WX6LLnk80CwVvpjqqhdCjcHzrtk7Hngph8NFiHfxoeC6w7jduXwqReBpQVc-n810mYg2was_wkv8rCPon0XQmQ"
        />
      </div>
    </header>
  );
}
