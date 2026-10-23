"use client";

import { useEffect, useMemo, useState } from "react";
import { api, GuestPayload } from "@/lib/api";
import { GuestItem, WeddingData } from "@/types";

interface GuestTableProps {
  onShowToast: (msg: string) => void;
  slug?: string;
  weddingData?: WeddingData;
  onGuestsUpdated?: () => void;
}

const DEFAULT_FORM: GuestPayload = {
  name: "",
  phone: "",
  category: "Reguler",
  status: "Belum Respon",
  pax: 1,
  table: "Meja Reguler",
};

export default function GuestTable({
  onShowToast,
  slug = "dimas-sarah",
  weddingData,
  onGuestsUpdated,
}: GuestTableProps) {
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<GuestItem | null>(null);
  const [formData, setFormData] = useState<GuestPayload>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchGuests = async () => {
    try {
      const res = await api.getGuests();
      if (res.success && Array.isArray(res.data)) {
        setGuests(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar tamu:", err);
      onShowToast("Gagal memuat daftar tamu dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .getGuests()
      .then((res) => {
        if (active && res.success && Array.isArray(res.data)) {
          setGuests(res.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat daftar tamu:", err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Filtered & Searched Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesCategory =
        filterCategory === "all" ||
        g.category.toLowerCase() === filterCategory.toLowerCase();

      const matchesStatus =
        filterStatus === "all" ||
        g.status.toLowerCase() === filterStatus.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        g.name.toLowerCase().includes(query) ||
        (g.table && g.table.toLowerCase().includes(query)) ||
        (g.phone && g.phone.toLowerCase().includes(query)) ||
        (g.qrCode && g.qrCode.toLowerCase().includes(query));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [guests, filterCategory, filterStatus, searchQuery]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: guests.length,
      vip: guests.filter((g) => g.category.toLowerCase() === "vip").length,
      keluarga: guests.filter((g) => g.category.toLowerCase() === "keluarga").length,
      sahabat: guests.filter((g) => g.category.toLowerCase() === "sahabat").length,
      reguler: guests.filter((g) => g.category.toLowerCase() === "reguler").length,
    };
  }, [guests]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / itemsPerPage));
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGuests.slice(start, start + itemsPerPage);
  }, [filteredGuests, currentPage, itemsPerPage]);

  // Export CSV
  const handleExportCSV = () => {
    if (guests.length === 0) {
      onShowToast("Belum ada data tamu untuk diekspor.");
      return;
    }

    const headers = [
      "No",
      "Nama Tamu",
      "Nomor WhatsApp / Telepon",
      "Kategori",
      "Jumlah Pax",
      "Status RSVP",
      "Nomor Meja",
      "Kode QR Check-In",
      "Sudah Check-In",
      "Waktu Check-In",
    ];

    const rows = guests.map((g, idx) => [
      idx + 1,
      `"${(g.name || "").replace(/"/g, '""')}"`,
      `"${(g.phone || "").replace(/"/g, '""')}"`,
      `"${g.category || "Reguler"}"`,
      g.pax || 1,
      `"${g.status || "Belum Respon"}"`,
      `"${(g.table || "").replace(/"/g, '""')}"`,
      `"${g.qrCode || ""}"`,
      g.checkedIn ? "Ya" : "Belum",
      g.checkedInAt ? new Date(g.checkedInAt).toLocaleString("id-ID") : "-",
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `buku-tamu-janjisuci-${slug}-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast(`File CSV berhasil diunduh (${guests.length} tamu terdata)!`);
  };

  // Submit Add Guest
  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast("Nama tamu wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createGuest(formData);
      if (res.success && res.data) {
        setGuests((prev) => [res.data, ...prev]);
        setIsAddModalOpen(false);
        setFormData(DEFAULT_FORM);
        onShowToast(`Tamu "${res.data.name}" berhasil ditambahkan! 🎉`);
        if (onGuestsUpdated) onGuestsUpdated();
      } else {
        onShowToast(res.message || "Gagal menambahkan tamu.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      onShowToast(`Gagal menambahkan tamu: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (guest: GuestItem) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      phone: guest.phone || "",
      category: guest.category,
      status: guest.status,
      pax: guest.pax,
      table: guest.table || "Meja Reguler",
    });
  };

  // Submit Update Guest
  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    if (!formData.name.trim()) {
      onShowToast("Nama tamu wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.updateGuest(editingGuest.id, formData);
      if (res.success && res.data) {
        setGuests((prev) =>
          prev.map((g) => (g.id === editingGuest.id ? res.data : g))
        );
        setEditingGuest(null);
        setFormData(DEFAULT_FORM);
        onShowToast(`Data tamu "${res.data.name}" berhasil diperbarui!`);
        if (onGuestsUpdated) onGuestsUpdated();
      } else {
        onShowToast(res.message || "Gagal memperbarui tamu.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      onShowToast(`Gagal memperbarui: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete Guest
  const handleDeleteGuest = async () => {
    if (!deletingGuest) return;
    try {
      setIsSubmitting(true);
      const res = await api.deleteGuest(deletingGuest.id);
      if (res.success) {
        setGuests((prev) => prev.filter((g) => g.id !== deletingGuest.id));
        onShowToast(`Tamu "${deletingGuest.name}" telah dihapus.`);
        setDeletingGuest(null);
        if (onGuestsUpdated) onGuestsUpdated();
      } else {
        onShowToast(res.message || "Gagal menghapus tamu.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      onShowToast(`Gagal menghapus tamu: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send WhatsApp invite to specific guest
  const handleSendWhatsApp = (guest: GuestItem) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://janjisuci.com";
    const guestParam = encodeURIComponent(guest.name);
    const guestUrl = `${origin}/demo?slug=${slug}&to=${guestParam}`;

    const groom = weddingData?.groom.nickName || "Dimas";
    const bride = weddingData?.bride.nickName || "Sarah";
    const date =
      weddingData?.events.resepsi.date ||
      weddingData?.events.akad.date ||
      "Sabtu, 24 Agustus 2026";
    const venue =
      weddingData?.events.resepsi.venue ||
      weddingData?.events.akad.venue ||
      "Grand Ballroom";

    const msg = `Yth. ${guest.name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di momen bahagia pernikahan kami:\n\n*${groom} & ${bride}*\n🗓️ ${date}\n📍 ${venue}\nMeja Reservasi: ${guest.table || "Sesuai Panduan Resepsi"}\n\nSilakan klik tautan resmi berikut untuk informasi lengkap & QR Check-in Anda:\n${guestUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran dan doa restu Anda.\n\nTerima kasih,\n${groom} & ${bride}`;

    const cleanPhone = (guest.phone || "").replace(/[^0-9]/g, "");
    let waPhone = cleanPhone;
    if (waPhone.startsWith("0")) {
      waPhone = "62" + waPhone.slice(1);
    }

    const waUrl = waPhone
      ? `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");
    onShowToast(`Membuka WhatsApp untuk mengirim undangan ke ${guest.name}`);
  };

  // Toggle quick checkin
  const handleToggleCheckIn = async (guest: GuestItem) => {
    try {
      const nextChecked = !guest.checkedIn;
      const res = await api.updateGuest(guest.id, {
        checkedIn: nextChecked,
        checkedInAt: nextChecked ? new Date() : null,
        status: nextChecked ? "Hadir" : guest.status,
      } as unknown as Partial<GuestPayload>);

      if (res.success && res.data) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? res.data : g))
        );
        onShowToast(
          nextChecked
            ? `Check-in berhasil untuk ${guest.name}! ✨`
            : `Batal check-in untuk ${guest.name}`
        );
        if (onGuestsUpdated) onGuestsUpdated();
      }
    } catch {
      onShowToast("Gagal memperbarui status check-in");
    }
  };

  return (
    <div
      id="buku-tamu"
      className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-4"
    >
      {/* Table Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">Daftar Buku Tamu</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              {guests.length} Terdata
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Atur undangan, status kehadiran RSVP, nomor meja, dan ekspor data buku tamu.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchGuests}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            type="button"
            title="Muat ulang data buku tamu dari database"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            type="button"
            title="Download seluruh daftar tamu ke format CSV"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setFormData(DEFAULT_FORM);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:opacity-95 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Tambah Tamu</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama tamu, meja, atau nomor telepon..."
            className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/40 border border-outline-variant/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: `Semua (${counts.all})` },
            { id: "VIP", label: `VIP (${counts.vip})` },
            { id: "Keluarga", label: `Keluarga (${counts.keluarga})` },
            { id: "Sahabat", label: `Sahabat (${counts.sahabat})` },
            { id: "Reguler", label: `Reguler (${counts.reguler})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setFilterCategory(pill.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                filterCategory === pill.id
                  ? "bg-secondary text-on-secondary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
              type="button"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filter: Status */}
      <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-on-surface-variant pb-1">
        <span className="font-semibold shrink-0">Filter Status:</span>
        {[
          { id: "all", label: "Semua Status" },
          { id: "Hadir", label: "Hadir" },
          { id: "Ragu", label: "Ragu-ragu" },
          { id: "Belum Respon", label: "Belum Respon" },
          { id: "Tidak Hadir", label: "Tidak Hadir" },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setFilterStatus(st.id);
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterStatus === st.id
                ? "bg-primary-fixed text-on-primary-fixed font-bold"
                : "bg-surface-container/60 hover:bg-surface-container text-on-surface-variant"
            }`}
            type="button"
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-surface border border-outline-variant/15 min-h-[220px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 text-xs">
            <span className="material-symbols-outlined text-[24px] animate-spin text-primary mr-2">
              sync
            </span>
            <span>Memuat data buku tamu dari database...</span>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2">
              group_off
            </span>
            <p className="text-sm font-bold text-on-surface">Tidak ada tamu yang sesuai</p>
            <p className="text-xs text-on-surface-variant max-w-sm mt-1 mb-4">
              Coba ubah kata kunci pencarian atau tambahkan tamu baru ke daftar buku tamu.
            </p>
            <button
              onClick={() => {
                setFormData(DEFAULT_FORM);
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg cursor-pointer"
            >
              + Tambah Tamu Sekarang
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Pax</th>
                <th className="py-3 px-4">Status RSVP</th>
                <th className="py-3 px-4">Meja</th>
                <th className="py-3 px-4 text-center">Check-In</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/60 text-xs text-on-surface">
              {paginatedGuests.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{row.name}</div>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                      <span>{row.phone || "Tanpa No. HP"}</span>
                      {row.qrCode && (
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                          {row.qrCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed text-[11px] font-medium">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium">{row.pax}</td>
                  <td className="py-3.5 px-4">
                    {row.status === "Hadir" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/60 text-secondary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Hadir
                      </span>
                    )}
                    {row.status === "Ragu" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-primary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Ragu-ragu
                      </span>
                    )}
                    {row.status === "Belum Respon" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" /> Belum Respon
                      </span>
                    )}
                    {row.status === "Tidak Hadir" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/40 text-error text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" /> Berhalangan
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-primary font-medium">
                    {row.table}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleCheckIn(row)}
                      title={row.checkedIn ? "Klik untuk membatalkan check-in" : "Klik untuk check-in"}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        row.checkedIn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {row.checkedIn ? "verified" : "radio_button_unchecked"}
                      </span>
                      <span>{row.checkedIn ? "Checked" : "Check-in"}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleSendWhatsApp(row)}
                        className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
                        title="Kirim Undangan WhatsApp Khusus"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(row)}
                        className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Edit Data Tamu"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingGuest(row)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Hapus Tamu"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredGuests.length > 0 && (
        <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant flex-wrap gap-2">
          <span>
            Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredGuests.length)}-
            {Math.min(currentPage * itemsPerPage, filteredGuests.length)} dari{" "}
            {filteredGuests.length} tamu
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-40"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors cursor-pointer ${
                  currentPage === idx + 1
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
                type="button"
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-40"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Tambah Tamu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  person_add
                </span>
                <span>Tambah Tamu Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                  Nama Tamu &amp; Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Suryo & Istri"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GuestPayload["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Reguler">Reguler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Jumlah Pax (Kursi)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.pax}
                    onChange={(e) =>
                      setFormData({ ...formData, pax: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Nomor Meja / Sesi
                  </label>
                  <input
                    type="text"
                    placeholder="Table 01 - VIP"
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                  Status Konfirmasi RSVP
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as GuestPayload["status"],
                    })
                  }
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                >
                  <option value="Belum Respon">Belum Respon</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Ragu">Ragu-ragu</option>
                  <option value="Tidak Hadir">Tidak Hadir / Berhalangan</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-95 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Tamu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Tamu */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  edit
                </span>
                <span>Edit Rincian Tamu</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                  Nama Tamu &amp; Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as GuestPayload["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Reguler">Reguler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Jumlah Pax (Kursi)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.pax}
                    onChange={(e) =>
                      setFormData({ ...formData, pax: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                    Nomor Meja / Sesi
                  </label>
                  <input
                    type="text"
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
                  Status Konfirmasi RSVP
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as GuestPayload["status"],
                    })
                  }
                  className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
                >
                  <option value="Belum Respon">Belum Respon</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Ragu">Ragu-ragu</option>
                  <option value="Tidak Hadir">Tidak Hadir / Berhalangan</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-95 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Tamu */}
      {deletingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-outline-variant/30 space-y-4 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[26px]">delete</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Hapus Tamu?</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Apakah Anda yakin ingin menghapus <strong>{deletingGuest.name}</strong> dari
                buku tamu? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGuest(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteGuest}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
