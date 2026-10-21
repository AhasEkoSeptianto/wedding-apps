"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewHero from "@/components/dashboard/overview/OverviewHero";
import MetricCards from "@/components/dashboard/overview/MetricCards";
import GuestLinkGenerator from "@/components/dashboard/overview/GuestLinkGenerator";
import GuestTable from "@/components/dashboard/overview/GuestTable";
import ReceptionQRWidget from "@/components/dashboard/overview/ReceptionQRWidget";
import WishesLiveFeed from "@/components/dashboard/overview/WishesLiveFeed";

export default function DashboardOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  };

  const handleQuickWhatsApp = () => {
    const defaultMsg = encodeURIComponent(
      "Halo! Kami ingin mengundang Anda ke pernikahan kami: Dimas & Sarah pada Sabtu, 24 Agustus 2025. Buka link undangan resmi: https://janjisuci.com/demo"
    );
    window.open(`https://api.whatsapp.com/send?text=${defaultMsg}`, "_blank");
  };

  const handleDownloadQR = () => {
    showToast("Mengunduh paket QR Check-in PDF untuk seluruh 342 tamu terdaftar...");
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
          {/* Top Greeting & Countdown Hero Card */}
          <OverviewHero
            onQuickWhatsApp={handleQuickWhatsApp}
            onDownloadQR={handleDownloadQR}
          />

          {/* Metric & KPI Cards Grid */}
          <MetricCards />

          {/* Interactive Guest Generator Bar */}
          <GuestLinkGenerator onShowToast={showToast} />

          {/* Main Management Layout: Guest Table (8 cols) & Live Feed / QR (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Guest Management Table */}
            <section className="lg:col-span-8">
              <GuestTable onShowToast={showToast} />
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
