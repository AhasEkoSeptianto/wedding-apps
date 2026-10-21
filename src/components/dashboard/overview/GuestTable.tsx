"use client";

import { useMemo, useState } from "react";

interface GuestItem {
  id: string;
  name: string;
  phone: string;
  category: string;
  pax: number;
  status: "hadir" | "ragu" | "berhalangan";
  table: string;
}

const INITIAL_GUESTS: GuestItem[] = [
  {
    id: "1",
    name: "Bpk. Bambang Suryo & Istri",
    phone: "+62 811-2345-6789",
    category: "VIP",
    pax: 2,
    status: "hadir",
    table: "Table 01 - VIP",
  },
  {
    id: "2",
    name: "dr. Anisa Rahmawati, Sp.A",
    phone: "+62 813-9876-5432",
    category: "Sahabat Sarah",
    pax: 1,
    status: "hadir",
    table: "Table 07",
  },
  {
    id: "3",
    name: "Farhan Pratama & Keluarga",
    phone: "+62 878-4455-6677",
    category: "Rekan Kerja",
    pax: 3,
    status: "ragu",
    table: "Table 12",
  },
  {
    id: "4",
    name: "Keluarga Besar H. Rasyid",
    phone: "+62 812-7788-9900",
    category: "Keluarga Dimas",
    pax: 4,
    status: "hadir",
    table: "Table 02 - Fam",
  },
  {
    id: "5",
    name: "Kevin Sanjaya",
    phone: "+62 821-3322-1100",
    category: "Sahabat Kuliah",
    pax: 0,
    status: "berhalangan",
    table: "-",
  },
];

interface GuestTableProps {
  onShowToast: (msg: string) => void;
}

export default function GuestTable({ onShowToast }: GuestTableProps) {
  const [guests, setGuests] = useState<GuestItem[]>(INITIAL_GUESTS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesCategory =
        filterCategory === "all" ||
        (filterCategory === "vip" && g.category.toLowerCase().includes("vip")) ||
        (filterCategory === "keluarga" && g.category.toLowerCase().includes("keluarga")) ||
        (filterCategory === "sahabat" && g.category.toLowerCase().includes("sahabat"));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        g.name.toLowerCase().includes(query) ||
        g.table.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [guests, filterCategory, searchQuery]);

  return (
    <div id="buku-tamu" className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-4">
      {/* Table Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-on-surface">Daftar Buku Tamu</h2>
          <p className="text-xs text-on-surface-variant">
            Kelola status RSVP, kehadiran, dan penomoran meja resepsi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowToast("File CSV buku tamu berhasil diunduh!")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onShowToast("Modal Tambah Tamu Baru dibuka")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-xs transition-all cursor-pointer"
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu atau nomor meja..."
            className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/40 border border-outline-variant/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "Semua (342)" },
            { id: "vip", label: "VIP (38)" },
            { id: "keluarga", label: "Keluarga (94)" },
            { id: "sahabat", label: "Sahabat (120)" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterCategory(pill.id)}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-surface border border-outline-variant/15">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Nama Tamu</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-center">Pax</th>
              <th className="py-3 px-4">Status RSVP</th>
              <th className="py-3 px-4">Meja</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest/60 text-xs text-on-surface">
            {filteredGuests.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-on-surface">{row.name}</div>
                  <div className="text-[11px] text-on-surface-variant">{row.phone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed text-[11px] font-medium">
                    {row.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-medium">{row.pax}</td>
                <td className="py-3.5 px-4">
                  {row.status === "hadir" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/60 text-secondary text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Hadir
                    </span>
                  )}
                  {row.status === "ragu" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-primary text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Ragu-ragu
                    </span>
                  )}
                  {row.status === "berhalangan" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/40 text-error text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" /> Berhalangan
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-primary font-medium">
                  {row.table}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() =>
                        onShowToast(`Membuka WhatsApp untuk mengirim undangan ke ${row.name}`)
                      }
                      className="p-1.5 rounded-md hover:bg-surface-container text-secondary transition-colors cursor-pointer"
                      title="Kirim Pesan WhatsApp"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                    <button
                      onClick={() => onShowToast(`Edit data tamu: ${row.name}`)}
                      className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      title="Edit Rincian Tamu"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
        <span>Menampilkan 1-5 dari 342 tamu</span>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-semibold text-xs shadow-xs cursor-pointer"
            type="button"
          >
            1
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors text-xs cursor-pointer"
            type="button"
          >
            2
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors text-xs cursor-pointer"
            type="button"
          >
            3
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
