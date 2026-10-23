"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import GuestTable from "@/components/dashboard/overview/GuestTable";
import GuestLinkGenerator from "@/components/dashboard/overview/GuestLinkGenerator";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData } from "@/types";

interface GuestStats {
  total: number;
  hadir: number;
  totalHadirPax: number;
  ragu: number;
  belumRespon: number;
  tidakHadir: number;
  checkedIn: number;
  attendanceRatePercent: number;
}

export default function GuestManagementPage() {
  const { user } = useAuth();
  const slug = user?.weddingSlug || "dimas-sarah";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);
  const [stats, setStats] = useState<GuestStats>({
    total: 0,
    hadir: 0,
    totalHadirPax: 0,
    ragu: 0,
    belumRespon: 0,
    tidakHadir: 0,
    checkedIn: 0,
    attendanceRatePercent: 0,
  });

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  };

  const fetchStats = async () => {
    try {
      const res = await api.getGuestStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn("Gagal mengambil statistik tamu:", err);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .getGuestStats()
      .then((res) => {
        if (active && res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => console.warn(err));

    api
      .getWedding(slug)
      .then((res) => {
        if (active && res.success && res.data) {
          setWeddingData(res.data);
        }
      })
      .catch((err) => console.warn(err));

    return () => {
      active = false;
    };
  }, [slug]);

  const groomNick =
    weddingData.groom.nickName ||
    weddingData.groom.fullName.split(",")[0].trim().split(" ")[0] ||
    "Dimas";
  const brideNick =
    weddingData.bride.nickName ||
    weddingData.bride.fullName.split(",")[0].trim().split(" ")[0] ||
    "Sarah";

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
        <main className="pt-24 px-4 sm:px-6 md:px-8 pb-16 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                <span>Buku Tamu Resmi • {groomNick} &amp; {brideNick}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                Manajemen Daftar Tamu &amp; RSVP
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
                Kelola daftar penerima undangan, alokasi nomor meja, status konfirmasi kehadiran, hingga scan QR check-in pada hari acara resepsi.
              </p>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Tamu Terdata
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-on-surface font-serif">
                {stats.total}
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1">Buku tamu aktif</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Konfirmasi Hadir
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-secondary font-serif">
                {stats.hadir}
              </div>
              <span className="text-[11px] text-secondary/80 mt-1">
                {stats.totalHadirPax} Total Kursi (Pax)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Ragu-ragu
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary font-serif">
                {stats.ragu}
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1">Menunggu kepastian</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Belum Respon
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-stone-600 font-serif">
                {stats.belumRespon}
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1">Perlu di-follow up</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                Sudah Check-In
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-700 font-serif">
                {stats.checkedIn}
              </div>
              <span className="text-[11px] text-emerald-600 mt-1">Hadir di meja resepsi</span>
            </div>
          </div>

          {/* Generator Link Khusus */}
          <GuestLinkGenerator onShowToast={showToast} weddingData={weddingData} slug={slug} />

          {/* Main Guest Table with CRUD and CSV Export */}
          <GuestTable
            onShowToast={showToast}
            slug={slug}
            weddingData={weddingData}
            onGuestsUpdated={fetchStats}
          />
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