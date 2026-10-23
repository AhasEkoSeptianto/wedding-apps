"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewHero from "@/components/dashboard/overview/OverviewHero";
import MetricCards from "@/components/dashboard/overview/MetricCards";
import GuestLinkGenerator from "@/components/dashboard/overview/GuestLinkGenerator";
import GuestTable from "@/components/dashboard/overview/GuestTable";
import ReceptionQRWidget from "@/components/dashboard/overview/ReceptionQRWidget";
import WishesLiveFeed from "@/components/dashboard/overview/WishesLiveFeed";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData } from "@/types";

function DashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const targetSlug = slugParam || user?.weddingSlug || "dimas-sarah";

  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getWedding(targetSlug)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setWeddingData(res.data);
        }
      })
      .catch((err) => {
        console.warn("Using default wedding data on dashboard:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [targetSlug]);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  };

  const groomNick =
    weddingData.groom.nickName ||
    weddingData.groom.fullName.split(",")[0].trim().split(" ")[0] ||
    "Dimas";
  const brideNick =
    weddingData.bride.nickName ||
    weddingData.bride.fullName.split(",")[0].trim().split(" ")[0] ||
    "Sarah";

  const eventDate =
    weddingData.events.resepsi.date ||
    weddingData.events.akad.date ||
    "Sabtu, 24 Agustus 2026";
  const venue =
    weddingData.events.resepsi.venue ||
    weddingData.events.akad.venue ||
    "Grand Ballroom";

  const handleQuickWhatsApp = () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://janjisuci.com";
    const demoUrl = `${origin}/demo?slug=${targetSlug}`;
    const defaultMsg = encodeURIComponent(
      `Halo! Kami ingin mengundang Anda ke pernikahan kami: ${groomNick} & ${brideNick} pada ${eventDate} bertempat di ${venue}.\n\nBuka link undangan resmi: ${demoUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${defaultMsg}`, "_blank");
  };

  const handleDownloadQR = () => {
    showToast("Mengunduh paket QR Check-in PDF untuk seluruh tamu terdaftar...");
  };

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
        <main className="pt-24 px-4 sm:px-6 md:px-8 pb-16 flex-1 space-y-6">
          {/* Top Greeting & Countdown Hero Card with dynamic couple, date & venue */}
          <OverviewHero
            weddingData={weddingData}
            slug={targetSlug}
            onQuickWhatsApp={handleQuickWhatsApp}
            onDownloadQR={handleDownloadQR}
          />

          {/* Metric & KPI Cards Grid with live guest stats */}
          <MetricCards />

          {/* Interactive Guest Generator Bar */}
          <GuestLinkGenerator
            onShowToast={showToast}
            weddingData={weddingData}
            slug={targetSlug}
          />

          {/* Main Management Layout: Guest Table (8 cols) & Live Feed / QR (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Guest Management Table (Buku Tamu & Export CSV) */}
            <section className="lg:col-span-8">
              <GuestTable
                onShowToast={showToast}
                slug={targetSlug}
                weddingData={weddingData}
              />
            </section>

            {/* Right Column: QR Widget & Wishes Feed */}
            <aside className="lg:col-span-4 space-y-6">
              <ReceptionQRWidget onShowToast={showToast} />
              <WishesLiveFeed onShowToast={showToast} />
            </aside>
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

export default function DashboardOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600 text-sm">Memuat Ikhtisar Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
