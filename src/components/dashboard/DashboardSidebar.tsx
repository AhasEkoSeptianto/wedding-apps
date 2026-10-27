"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isOverview = pathname === "/dashboard";
  const isEditor = pathname === "/editor" || pathname === "/live-demo-editor";
  const isGuests = pathname === "/dashboard/guests";
  const isGifts = pathname === "/dashboard/amplop-ucapan";

  const navItems = [
    { label: "Ikhtisar & RSVP", icon: "grid_view", href: "/dashboard", active: isOverview },
    { label: "Live Demo & Editor", icon: "edit_note", href: "/editor", active: isEditor },
    { label: "Katalog Template", icon: "auto_awesome_motion", href: "/" },
    { label: "Daftar Tamu", icon: "groups", href: "/dashboard/guests", active: isGuests },
    { label: "Amplop & Ucapan", icon: "card_giftcard", href: "/dashboard/amplop-ucapan", active: isGifts },
    { label: "Paket Langganan", icon: "loyalty", href: "/paket-harga" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-outline-variant/30">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Logo JanjiSuci"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wyr4h6Z3syVwA57Z6k-06bWVsXyZ9qSt30t4VY57-2tyIjyWF_HPQort7Pdl4UTAzhzAs8L0WDnnbjCkZ85VFrKEnMSOcPWQVN3LX_1195RCgup8xnL0-buDtS5ySW2hTdD3Uc9GUgf-VLR-DfeNozaEmWjfIobFpw6xOfVxtfLBfouCglBDV5jDqumNYWNtM1UQ0mZa7l1GFUZZ9IZleLBt4CUlKHbMXgq051cymoFh8qjnpLNaeMh4ye"
            />
            <span className="text-xl text-primary tracking-tight font-serif font-bold">
              JanjiSuci
            </span>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
            Manajemen Undangan
          </div>

          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
            {user?.role === "admin" && (
              <div className="pt-4 mt-4 border-t border-outline-variant/30">
                <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                  Panel Khusus Staf
                </div>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm bg-amber-500/10 text-amber-900 border border-amber-400/30 font-semibold hover:bg-amber-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-amber-600">
                    terminal
                  </span>
                  <span>Panel Administrasi</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-outline-variant/30">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0_zMuj1k-ntMZieXKiEdekLPrGyRP7pS39_J5TtGXFDL26_fYrfwfB-YkDP_aC9VTgHF39G0Ao6iEsZrGJEnkWaR4GruqEklLt6gCmgC_IH9X7Jeyy41bIJPJvWJ_T0ItgKaFPR6AZjJ0uGbf-6gbNDObzvjPAF99WX6LLnk80CwVvpjqqhdCjcHzrtk7Hngph8NFiHfxoeC6w7jduXwqReBpQVc-n810mYg2was_wkv8rCPon0XQmQ"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">
                {user?.name || "Dimas & Sarah"}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                Paket Premium VIP
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
