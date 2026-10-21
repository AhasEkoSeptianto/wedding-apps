"use client";

import { useState } from "react";

interface GuestLinkGeneratorProps {
  onShowToast: (message: string) => void;
}

export default function GuestLinkGenerator({ onShowToast }: GuestLinkGeneratorProps) {
  const [guestName, setGuestName] = useState("Bpk. Bambang Suryo & Partner");
  const [category, setCategory] = useState("VIP");

  const getFormattedUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://janjisuci.com";
    const nameParam = encodeURIComponent(guestName.trim() || "Tamu Undangan");
    return `${origin}/demo?to=${nameParam}`;
  };

  const getWhatsAppMessage = () => {
    const name = guestName.trim() || "Bapak/Ibu/Saudara/i";
    const url = getFormattedUrl();
    return `Yth. ${name},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri resepsi pernikahan kami:\n\nDimas & Sarah\nSabtu, 24 Agustus 2025\n\nUntuk informasi acara lengkap, denah lokasi, dan konfirmasi kehadiran, silakan klik tautan resmi berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nTerima kasih kami ucapkan,\nDimas & Sarah`;
  };

  const handleCopyLink = () => {
    const url = getFormattedUrl();
    navigator.clipboard
      .writeText(url)
      .then(() => onShowToast("Tautan undangan personal berhasil disalin!"))
      .catch(() => onShowToast("Gagal menyalin tautan"));
  };

  const handleCopyWaMsg = () => {
    const msg = getWhatsAppMessage();
    navigator.clipboard
      .writeText(msg)
      .then(() => onShowToast("Pesan WhatsApp resmi berhasil disalin!"))
      .catch(() => onShowToast("Gagal menyalin pesan"));
  };

  return (
    <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-1 border-b border-outline-variant/15">
        <div>
          <h2 className="text-base font-bold text-on-surface">
            Generator Undangan Khusus
          </h2>
          <p className="text-xs text-on-surface-variant">
            Buat tautan personal dengan nama dan sapaan tamu resmi secara instan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant">Format URL:</span>
          <code className="px-2.5 py-1 rounded-md bg-surface-container font-mono text-[12px] text-primary">
            janjisuci.com/demo?to=...
          </code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Name input */}
        <div className="md:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase mb-1">
            Nama Tamu &amp; Gelar
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3">
              person
            </span>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/40 border border-outline-variant/20 transition-all"
            />
          </div>
        </div>

        {/* Category select */}
        <div className="md:col-span-3">
          <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
            Kategori / Hubungan
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-surface rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/40 border border-outline-variant/20"
          >
            <option value="VIP">Tamu VIP</option>
            <option value="Keluarga Inti">Keluarga Inti</option>
            <option value="Sahabat">Sahabat Dimas &amp; Sarah</option>
            <option value="Rekan Kerja">Rekan Kerja Kantor</option>
            <option value="Undangan Orang Tua">Undangan Orang Tua</option>
          </select>
        </div>

        {/* Actions */}
        <div className="md:col-span-4 flex flex-wrap sm:flex-nowrap items-end gap-2 pt-2 md:pt-4">
          <button
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Salin Tautan</span>
          </button>

          <button
            onClick={handleCopyWaMsg}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Salin Pesan WA</span>
          </button>
        </div>
      </div>
    </section>
  );
}
