"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EditorStudio, { WeddingData } from "@/components/dashboard/EditorStudio";
import LiveDeviceCanvas from "@/components/dashboard/LiveDeviceCanvas";

const INITIAL_DATA: WeddingData = {
  title: "Pernikahan Dimas & Sarah",
  groom: {
    fullName: "Dimas Prasetyo, S.T.",
    nickName: "Dimas",
    instagram: "@dimasprasetyo",
    parents: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzUNvfN4JLmIEQ8Rl3ucmVP0-vib8bkuQ3IrTgVw8Qr5sjfCuCXP250Cgz911BcC7k2OJebkbkFG2QdPC2uPmB9JgO20ArGDvpU0gAuSbhYSI7-kXcn2tgNddrrMRwpjYWGzsz64YzuTcetJcaEqJJ6OK2uZbQ6mVajqzRW3u95-6UPI5E7g3WEY75DGTcZ_y5UEu_eA0ZcLAS5JKHy7r9_Lyg0m4Oqoi--PgbPYl8YDo-L0m9KgRLNQ",
  },
  bride: {
    fullName: "Sarah Anindita, M.Ds.",
    nickName: "Sarah",
    instagram: "@sarahanindita",
    parents: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBqrJptRouC3sJfNXLjsofBuvakru1TeBprYoHukqDAMi6numwD_tbCIUj8gAmdv2RmqFwBb_l5JMoEvVo44VGvNdl3sKNhmAfevpxliVOYaJJWD_eKIOO0CiuiYkvBWAHCLhcxazK406U-fFG7DULwuD1nG7PYvz4ukXGopUFGbgkuinU9wNO5xAusEewWYWkgBN7NjgntxgHQ2Bn3UJ17VOD7tjWOJ3NnqU0qcG7XHbVUgy4mfmLmQ",
  },
  quote: {
    source: "QS. Ar-Rum: 21",
    text: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
  },
  events: {
    akad: {
      date: "Sabtu, 24 Agustus 2025",
      time: "08.00 - 10.00 WIB",
      venue: "Masjid Agung Sunda Kelapa, Menteng",
      address:
        "Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta",
    },
    resepsi: {
      date: "Sabtu, 24 Agustus 2025",
      time: "18.30 - 21.30 WIB",
      venue: "The Dharmawangsa Grand Ballroom",
      address: "Kebayoran Baru, Jakarta Selatan",
    },
  },
  music: {
    title: "Kahitna - Soulmate (Instrumental Acoustic)",
    duration: "03:42",
    enabled: true,
  },
  gift: {
    bca: "8830-1928-11 a.n Sarah Anindita",
    mandiri: "1370-0012-9901 a.n Dimas Prasetyo",
  },
  rsvp: {
    deadline: "2025-08-15",
    maxGuests: "2",
    waNotification: true,
  },
};

export default function EditorStudioPage() {
  const [data, setData] = useState<WeddingData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<"pasangan" | "acara" | "galeri" | "fitur" | "rsvp">("pasangan");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3000);
  };

  const handleShareLink = () => {
    const demoUrl = `${window.location.origin}/demo`;
    navigator.clipboard
      .writeText(demoUrl)
      .then(() => showToast("Link Demo Undangan berhasil disalin!"))
      .catch(() => showToast("Gagal menyalin link"));
  };

  const groomNick = data.groom.nickName || "Dimas";
  const brideNick = data.bride.nickName || "Sarah";

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Body */}
        <main className="pt-24 px-4 sm:px-6 md:px-8 pb-12 flex-1">
          {/* Top Workspace Sub-Header & Live Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold font-serif text-on-surface truncate">
                    Pernikahan {groomNick} &amp; {brideNick}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    Tersimpan Otomatis
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    cloud_done
                  </span>
                  <span>Sinkronisasi cloud terakhir: Baru saja</span>
                </p>
              </div>
            </div>

            {/* Quick Tool Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Undo / Redo */}
              <div className="flex items-center bg-surface-container rounded-full p-1 shadow-xs border border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => showToast("Fitur Undo tersedia")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  title="Undo (Ctrl+Z)"
                >
                  <span className="material-symbols-outlined text-[18px]">undo</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Fitur Redo tersedia")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  title="Redo (Ctrl+Y)"
                >
                  <span className="material-symbols-outlined text-[18px]">redo</span>
                </button>
              </div>

              {/* Ganti Tema */}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">palette</span>
                <span>Ganti Tema</span>
              </Link>

              {/* Bagikan Link Demo */}
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">share</span>
                <span>Bagikan Link Demo</span>
              </button>

              {/* Simpan Draf */}
              <button
                type="button"
                onClick={() => showToast("Draf berhasil disimpan ke penyimpanan lokal!")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">drafts</span>
                <span>Simpan Draf</span>
              </button>

              {/* Publish Undangan */}
              <button
                type="button"
                onClick={() =>
                  showToast("Selamat! Undangan pernikahan Anda telah berhasil dipublikasikan! 🎉")
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-[0_4px_16px_-2px_rgba(179,135,66,0.3)] transition-all transform active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>Publish Undangan</span>
              </button>
            </div>
          </div>

          {/* Dual-Pane Workspace Split: Editor Sidebar (5 cols) + Interactive Canvas (7 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Editor Studio */}
            <div className="xl:col-span-5">
              <EditorStudio
                data={data}
                onChange={setData}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Right Panel: Live Device Canvas */}
            <div className="xl:col-span-7">
              <LiveDeviceCanvas data={data} />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-stone-700 animate-fade-in">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">
            check_circle
          </span>
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
}

