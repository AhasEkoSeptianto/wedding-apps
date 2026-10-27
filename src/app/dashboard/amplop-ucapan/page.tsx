"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DEFAULT_WEDDING_DATA } from "@/lib/defaultWedding";
import { WeddingData, Wish, GiftItem } from "@/types";

export default function AmplopDanUcapanPage() {
  const { user } = useAuth();
  const slug = user?.weddingSlug || "dimas-sarah";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING_DATA);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"amplop" | "ucapan" | "rekening">("amplop");

  // Live Data from Backend & MongoDB
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [giftSummary, setGiftSummary] = useState({
    totalAmount: 0,
    confirmedAmount: 0,
    pendingCount: 0,
    totalCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "attending" | "not-attending">("all");

  // Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  // Form State for Manual Gift Input
  const [manualForm, setManualForm] = useState({
    senderName: "",
    amount: "",
    bankTarget: "BCA",
    bankSender: "BCA",
    message: "",
    status: "confirmed" as "confirmed" | "pending",
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText(null);
    }, 3200);
  };

  const fetchAllData = () => {
    setIsLoading(true);
    Promise.all([
      api.getGifts({ slug }).catch((err) => {
        console.warn("Gagal mengambil data amplop:", err);
        return { success: false, data: [], summary: { totalAmount: 0, confirmedAmount: 0, pendingCount: 0, totalCount: 0 } };
      }),
      api.getWishes(slug).catch((err) => {
        console.warn("Gagal mengambil data ucapan:", err);
        return { success: false, data: [] };
      }),
      api.getWedding(slug).catch((err) => {
        console.warn("Gagal mengambil profil pernikahan:", err);
        return { success: false, data: DEFAULT_WEDDING_DATA };
      }),
    ])
      .then(([giftsRes, wishesRes, weddingRes]) => {
        startTransition(() => {
          if (giftsRes.data) {
            setGifts(giftsRes.data);
            if (giftsRes.summary) setGiftSummary(giftsRes.summary);
          }
          if (wishesRes.data) {
            setWishes(wishesRes.data);
          }
          if (weddingRes.data) {
            setWeddingData(weddingRes.data);
          }
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const groomNick =
    weddingData.groom.nickName ||
    weddingData.groom.fullName.split(",")[0].trim().split(" ")[0] ||
    "Dimas";
  const brideNick =
    weddingData.bride.nickName ||
    weddingData.bride.fullName.split(",")[0].trim().split(" ")[0] ||
    "Sarah";

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle Gift Status
  const handleToggleGiftStatus = async (gift: GiftItem) => {
    const nextStatus = gift.status === "confirmed" ? "pending" : "confirmed";
    try {
      const res = await api.updateGiftStatus(gift.id, nextStatus);
      if (res.success) {
        setGifts((prev) =>
          prev.map((item) => (item.id === gift.id ? { ...item, status: nextStatus } : item))
        );
        // recalculate summary locally
        const diff = gift.amount;
        setGiftSummary((prev) => ({
          ...prev,
          confirmedAmount:
            nextStatus === "confirmed"
              ? prev.confirmedAmount + diff
              : prev.confirmedAmount - diff,
          pendingCount:
            nextStatus === "pending" ? prev.pendingCount + 1 : Math.max(0, prev.pendingCount - 1),
        }));
        showToast(
          nextStatus === "confirmed"
            ? "Amplop berhasil diverifikasi terkonfirmasi!"
            : "Status diubah menjadi menunggu verifikasi."
        );
      }
    } catch {
      showToast("Gagal memperbarui status amplop.");
    }
  };

  // Delete Gift
  const handleDeleteGift = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan amplop ini?")) return;
    try {
      const res = await api.deleteGift(id);
      if (res.success) {
        setGifts((prev) => prev.filter((item) => item.id !== id));
        showToast("Catatan amplop berhasil dihapus.");
        fetchAllData();
      }
    } catch {
      showToast("Gagal menghapus amplop.");
    }
  };

  // Toggle Like Wish
  const handleToggleLikeWish = async (id: string) => {
    try {
      const res = await api.toggleLikeWish(id);
      if (res.success && res.data) {
        setWishes((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isLiked: res.data.isLiked } : item))
        );
        showToast(res.data.isLiked ? "Menyukai ucapan doa ❤️" : "Batal menyukai ucapan");
      }
    } catch {
      showToast("Gagal mengubah status suka.");
    }
  };

  // Delete Wish
  const handleDeleteWish = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;
    try {
      const res = await api.deleteWish(id);
      if (res.success) {
        setWishes((prev) => prev.filter((item) => item.id !== id));
        showToast("Ucapan berhasil dihapus.");
      }
    } catch {
      showToast("Gagal menghapus ucapan.");
    }
  };

  // Submit Manual Gift Form
  const handleSaveManualGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.senderName.trim() || !manualForm.amount) {
      showToast("Nama pengirim dan nominal wajib diisi.");
      return;
    }

    const rawNum = parseInt(manualForm.amount.replace(/\D/g, ""), 10);
    if (isNaN(rawNum) || rawNum < 1000) {
      showToast("Nominal tidak valid (minimal Rp 1.000).");
      return;
    }

    setIsSubmittingManual(true);
    try {
      const res = await api.createGift({
        slug,
        senderName: manualForm.senderName.trim(),
        amount: rawNum,
        bankTarget: manualForm.bankTarget,
        bankSender: manualForm.bankSender,
        message: manualForm.message.trim(),
        status: manualForm.status,
      });

      if (res.success && res.data) {
        showToast("Amplop berhasil dicatat ke database!");
        setIsManualModalOpen(false);
        setManualForm({
          senderName: "",
          amount: "",
          bankTarget: "BCA",
          bankSender: "BCA",
          message: "",
          status: "confirmed",
        });
        fetchAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mencatat amplop.";
      showToast(msg);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Filtered Gifts
  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      const matchStatus = statusFilter === "all" ? true : g.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        g.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.bankTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.message && g.message.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [gifts, statusFilter, searchQuery]);

  // Filtered Wishes
  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      const matchAtt =
        attendanceFilter === "all" ? true : w.attendance === attendanceFilter;
      const matchSearch =
        !searchQuery.trim() ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAtt && matchSearch;
    });
  }, [wishes, attendanceFilter, searchQuery]);

  // Export CSV Gifts
  const handleExportGiftsCSV = () => {
    if (gifts.length === 0) {
      showToast("Belum ada data amplop untuk diekspor.");
      return;
    }

    const headers = [
      "No",
      "Nama Pengirim",
      "Nominal (Rp)",
      "Bank Penerima",
      "Bank/E-Wallet Pengirim",
      "Pesan Ucapan",
      "Status",
      "Tanggal & Waktu",
    ];

    const rows = gifts.map((g, idx) => [
      idx + 1,
      `"${g.senderName.replace(/"/g, '""')}"`,
      g.amount,
      `"${g.bankTarget}"`,
      `"${g.bankSender || "-"}"`,
      `"${(g.message || "-").replace(/"/g, '""')}"`,
      g.status === "confirmed" ? "Terkonfirmasi" : "Menunggu Verifikasi",
      `"${formatDate(g.createdAt)}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-amplop-digital-${slug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Rekap CSV Amplop Digital berhasil diunduh! 📄");
  };

  // Export CSV Wishes
  const handleExportWishesCSV = () => {
    if (wishes.length === 0) {
      showToast("Belum ada data ucapan untuk diekspor.");
      return;
    }

    const headers = ["No", "Nama Tamu", "Kehadiran", "Jumlah Tamu", "Pesan Doa Restu", "Amplop (Rp)", "Tanggal"];
    const rows = wishes.map((w, idx) => [
      idx + 1,
      `"${w.name.replace(/"/g, '""')}"`,
      w.attendance === "attending" ? "Hadir" : "Berhalangan",
      w.guests,
      `"${w.message.replace(/"/g, '""')}"`,
      w.amount || 0,
      `"${formatDate(w.createdAt)}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-ucapan-doa-${slug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Rekap CSV Ucapan Doa berhasil diunduh! 📄");
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
        <main className="pt-24 px-4 sm:px-6 md:px-8 pb-16 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-300/40 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px] text-amber-600">card_giftcard</span>
                <span>Tanda Kasih &amp; Doa Restu • {groomNick} &amp; {brideNick}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                Manajemen Amplop Digital &amp; Ucapan
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
                Pantau seluruh hadiah uang cashless (transfer bank &amp; QRIS) serta doa restu yang dikirimkan oleh para tamu undangan secara terintegrasi dengan database MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
              <button
                type="button"
                onClick={fetchAllData}
                title="Muat Ulang Data"
                className="p-2.5 rounded-xl border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <span className={`material-symbols-outlined text-[18px] ${isLoading ? "animate-spin" : ""}`}>
                  refresh
                </span>
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_card</span>
                <span>Catat Amplop Manual</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Dana Masuk */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Total Dana Masuk
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface font-mono truncate">
                  {formatRupiah(giftSummary.totalAmount)}
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>{formatRupiah(giftSummary.confirmedAmount)} Terverifikasi</span>
                </span>
              </div>
            </div>

            {/* Total Amplop Digital */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Jumlah Amplop
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface font-mono">
                  {gifts.length} Amplop
                </h3>
                <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">pending</span>
                  <span>{giftSummary.pendingCount} Menunggu Verifikasi</span>
                </span>
              </div>
            </div>

            {/* Total Doa & Ucapan */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">mark_chat_read</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Total Pesan Doa
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface font-mono">
                  {wishes.length} Ucapan
                </h3>
                <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">favorite</span>
                  <span>{wishes.filter((w) => w.isLiked).length} Disukai pengantin</span>
                </span>
              </div>
            </div>

            {/* Rekening Tujuan */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Rekening Penerima
                </span>
                <h3 className="text-sm font-bold text-on-surface truncate">
                  BCA &amp; Mandiri
                </h3>
                <span className="text-[10px] text-on-surface-variant mt-0.5 block truncate font-mono">
                  {weddingData.gift?.bca?.split("a.n")[0]?.trim() || "8830-1928-11"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-2 shadow-xs flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("amplop");
                setSearchQuery("");
              }}
              className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "amplop"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Amplop Digital ({gifts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("ucapan");
                setSearchQuery("");
              }}
              className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "ucapan"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Ucapan &amp; Doa Restu ({wishes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rekening")}
              className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "rekening"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span>Rekening &amp; QRIS</span>
            </button>
          </div>

          {/* TAB 1: AMPLOP DIGITAL */}
          {activeTab === "amplop" && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama pengirim atau bank..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        statusFilter === "all"
                          ? "bg-surface-container-lowest text-on-surface shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("confirmed")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        statusFilter === "confirmed"
                          ? "bg-surface-container-lowest text-emerald-800 shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Terkonfirmasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("pending")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        statusFilter === "pending"
                          ? "bg-surface-container-lowest text-amber-900 shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Menunggu
                    </button>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    onClick={handleExportGiftsCSV}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/25"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                    <span>Ekspor CSV</span>
                  </button>
                </div>
              </div>

              {/* Gifts Table */}
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-on-surface">
                    <thead className="bg-surface-container-low border-b border-outline-variant/20 text-on-surface-variant uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Pengirim</th>
                        <th className="py-3 px-4">Bank Tujuan</th>
                        <th className="py-3 px-4">Nominal</th>
                        <th className="py-3 px-4">Bukti Transfer</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {filteredGifts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-4xl opacity-30 mb-2 block">
                              payments
                            </span>
                            <p className="font-semibold">Tidak ada data amplop yang cocok.</p>
                            <p className="text-[11px] mt-0.5 opacity-70">
                              Gunakan tombol &quot;Catat Amplop Manual&quot; untuk menambahkan data baru.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredGifts.map((gift, index) => (
                          <tr key={gift.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-on-surface-variant">{index + 1}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                  {gift.senderName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-on-surface leading-tight">
                                    {gift.senderName}
                                  </p>
                                  {gift.message && (
                                    <p className="text-[11px] text-on-surface-variant italic truncate max-w-xs mt-0.5">
                                      &ldquo;{gift.message}&rdquo;
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-semibold text-on-surface">
                                {gift.bankTarget}
                              </span>
                              {gift.bankSender && (
                                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                  dari {gift.bankSender}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-primary text-sm whitespace-nowrap">
                              {formatRupiah(gift.amount)}
                            </td>
                            <td className="py-3.5 px-4">
                              {gift.proofUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewProofUrl(gift.proofUrl || null)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[11px] transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">image</span>
                                  <span>Lihat Bukti</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-on-surface-variant/60 italic">
                                  Tidak ada bukti
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleGiftStatus(gift)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  gift.status === "confirmed"
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                                }`}
                                title="Klik untuk mengubah status"
                              >
                                <span className="material-symbols-outlined text-[12px]">
                                  {gift.status === "confirmed" ? "check_circle" : "schedule"}
                                </span>
                                <span>{gift.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}</span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-on-surface-variant text-[11px] whitespace-nowrap">
                              {formatDate(gift.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteGift(gift.id)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Hapus catatan amplop"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UCAPAN & DOA RESTU */}
          {activeTab === "ucapan" && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama tamu atau kata doa..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Attendance Pills */}
                  <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => setAttendanceFilter("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        attendanceFilter === "all"
                          ? "bg-surface-container-lowest text-on-surface shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Semua ({wishes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceFilter("attending")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        attendanceFilter === "attending"
                          ? "bg-surface-container-lowest text-emerald-800 shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Hadir ({wishes.filter((w) => w.attendance === "attending").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceFilter("not-attending")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        attendanceFilter === "not-attending"
                          ? "bg-surface-container-lowest text-orange-800 shadow-xs"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Berhalangan ({wishes.filter((w) => w.attendance === "not-attending").length})
                    </button>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    onClick={handleExportWishesCSV}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/25"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                    <span>Ekspor CSV</span>
                  </button>
                </div>
              </div>

              {/* Wishes Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWishes.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                    <span className="material-symbols-outlined text-4xl opacity-30 mb-2 block">chat</span>
                    <p className="font-semibold">Belum ada ucapan doa yang cocok.</p>
                  </div>
                ) : (
                  filteredWishes.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-on-surface leading-tight">
                                {item.name}
                              </h4>
                              <span className="text-[10px] text-on-surface-variant">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              item.attendance === "attending"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {item.attendance === "attending" ? `Hadir (${item.guests} Orang)` : "Berhalangan"}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed italic bg-surface p-3.5 rounded-xl border border-outline-variant/15">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
                        {Boolean(item.amount && item.amount > 0) ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-900 border border-amber-300 font-mono font-bold text-[11px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">payments</span>
                            <span>{formatRupiah(item.amount || 0)}</span>
                          </span>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleLikeWish(item.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              item.isLiked
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-surface-container text-on-surface-variant hover:text-red-500"
                            }`}
                          >
                            <span className={`material-symbols-outlined text-[16px] ${item.isLiked ? "filled" : ""}`}>
                              favorite
                            </span>
                            <span>{item.isLiked ? "Disukai" : "Sukai"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteWish(item.id)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus ucapan"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REKENING & QRIS PENGANTIN */}
          {activeTab === "rekening" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Rekening Aktif Card */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">credit_card</span>
                    <h3 className="font-heading font-bold text-base text-on-surface">
                      Rekening Penerima Amplop Digital
                    </h3>
                  </div>
                  <Link
                    href={`/editor?slug=${slug}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Ubah di Editor</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* BCA */}
                  <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      BANK CENTRAL ASIA (BCA)
                    </span>
                    <p className="font-mono font-bold text-lg text-on-surface">
                      {weddingData.gift?.bca?.split("a.n")[0]?.trim() || "8830-1928-11"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {weddingData.gift?.bca?.includes("a.n")
                        ? "a.n " + weddingData.gift.bca.split("a.n")[1].trim()
                        : `a.n ${weddingData.bride.fullName || "Sarah Anindita"}`}
                    </p>
                  </div>

                  {/* Mandiri */}
                  <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      BANK MANDIRI
                    </span>
                    <p className="font-mono font-bold text-lg text-on-surface">
                      {weddingData.gift?.mandiri?.split("a.n")[0]?.trim() || "1370-0012-9901"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {weddingData.gift?.mandiri?.includes("a.n")
                        ? "a.n " + weddingData.gift.mandiri.split("a.n")[1].trim()
                        : `a.n ${weddingData.groom.fullName || "Dimas Prasetyo"}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Panduan QRIS & Tips */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/15 pb-4">
                  <span className="material-symbols-outlined text-primary text-[22px]">qr_code_2</span>
                  <h3 className="font-heading font-bold text-base text-on-surface">
                    Petunjuk Pembayaran Tamu
                  </h3>
                </div>

                <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>Tamu undangan dapat menyalin nomor rekening dengan 1 klik pada section <strong>Wedding Gift</strong> di halaman undangan Anda.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>Semua transfer otomatis tercatat dan dapat dikonfirmasi oleh tamu melalui tombol konfirmasi transfer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>Amplop fisik yang diterima saat resepsi juga dapat Anda catat secara rapi melalui tombol <strong>&quot;Catat Amplop Manual&quot;</strong>.</span>
                  </li>
                </ul>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950">
                  <strong className="block mb-1 font-semibold">Keamanan Privasi:</strong>
                  Nomor rekening hanya ditampilkan kepada tamu yang memiliki tautan resmi undangan pernikahan Anda.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Catat Amplop Manual */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_card</span>
                <h3 className="font-bold text-base text-on-surface">Catat Amplop Manual</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveManualGift} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                  Nama Tamu Pengirim *
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.senderName}
                  onChange={(e) => setManualForm({ ...manualForm, senderName: e.target.value })}
                  placeholder="Cth: Bpk. Bambang Wijaya &amp; Istri"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                  Nominal Amplop (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={10000}
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                  placeholder="Cth: 500000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface bg-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    Bank Penerima
                  </label>
                  <select
                    value={manualForm.bankTarget}
                    onChange={(e) => setManualForm({ ...manualForm, bankTarget: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface bg-surface focus:outline-none focus:border-primary"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Tunai">Amplop Tunai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    Bank Pengirim
                  </label>
                  <select
                    value={manualForm.bankSender}
                    onChange={(e) => setManualForm({ ...manualForm, bankSender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface bg-surface focus:outline-none focus:border-primary"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="GoPay">GoPay</option>
                    <option value="OVO">OVO</option>
                    <option value="DANA">DANA</option>
                    <option value="Tunai">Tunai / Fisik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                  Pesan / Catatan Ucapan
                </label>
                <textarea
                  rows={3}
                  value={manualForm.message}
                  onChange={(e) => setManualForm({ ...manualForm, message: e.target.value })}
                  placeholder="Tuliskan ucapan atau catatan amplop..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmittingManual ? "Menyimpan..." : "Simpan Amplop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Preview Bukti Transfer */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-outline-variant/30 animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface">Bukti Transfer Amplop Digital</h3>
              <button
                type="button"
                onClick={() => setPreviewProofUrl(null)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black/5 border border-outline-variant/20 max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewProofUrl}
                alt="Bukti Transfer Amplop"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setPreviewProofUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-surface-container text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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

