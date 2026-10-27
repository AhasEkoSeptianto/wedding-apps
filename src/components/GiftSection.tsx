"use client";

import { useState } from "react";
import { BankAccount, WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";
import { api } from "@/lib/api";

interface GiftSectionProps {
  onShowToast: (message: string) => void;
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function GiftSection({ onShowToast, weddingData, viewMode }: GiftSectionProps) {
  const isMobile = viewMode === "mobile";
  const theme = getTheme(weddingData?.themeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    bankTarget: "",
    bankSender: "BCA",
    accountNumber: "",
    amount: "",
    message: "",
    proofUrl: "",
  });

  const parseAccount = (raw: string, bankDefault: string, holderDefault: string): BankAccount => {
    if (!raw) return { bank: bankDefault, accountNumber: "-", holderName: holderDefault };
    if (raw.includes("a.n")) {
      const parts = raw.split("a.n");
      return {
        bank: bankDefault,
        accountNumber: parts[0].trim(),
        holderName: "a.n. " + parts.slice(1).join("a.n").trim().replace(/^[:.-]\s*/, ""),
      };
    }
    return {
      bank: bankDefault,
      accountNumber: raw.trim(),
      holderName: holderDefault,
    };
  };

  const groomName = weddingData?.groom?.fullName || "Dimas Prasetyo";
  const brideName = weddingData?.bride?.fullName || "Sarah Anindita";

  const accounts: BankAccount[] = [];
  const rawBca = weddingData ? weddingData.gift?.bca?.trim() : "8830-1928-11";
  const rawMandiri = weddingData ? weddingData.gift?.mandiri?.trim() : "1370-0012-9901";

  if (rawBca) {
    accounts.push(parseAccount(rawBca, "BANK CENTRAL ASIA (BCA)", `a.n. ${brideName}`));
  }
  if (rawMandiri) {
    accounts.push(parseAccount(rawMandiri, "BANK MANDIRI", `a.n. ${groomName}`));
  }
  if (accounts.length === 0) {
    accounts.push(parseAccount("8830-1928-11", "BANK CENTRAL ASIA (BCA)", `a.n. ${brideName}`));
  }

  const handleCopy = (accNumber: string) => {
    navigator.clipboard
      .writeText(accNumber)
      .then(() => {
        onShowToast(`Nomor rekening ${accNumber} berhasil disalin!`);
      })
      .catch(() => {
        onShowToast("Gagal menyalin. Silakan salin manual.");
      });
  };

  const handleSubmitGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.amount) {
      onShowToast("Mohon isi nama pengirim dan nominal transfer.");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetSlug = weddingData?.slug || "dimas-sarah";
      const targetBank = formData.bankTarget || (accounts[0] ? accounts[0].bank : "BCA");

      await api.createGift({
        slug: targetSlug,
        senderName: formData.senderName.trim(),
        bankTarget: targetBank,
        bankSender: formData.bankSender,
        accountNumber: formData.accountNumber.trim(),
        amount: Number(formData.amount.replace(/\D/g, "")) || 0,
        message: formData.message.trim(),
        proofUrl: formData.proofUrl.trim(),
        status: "pending",
      });

      onShowToast("Konfirmasi tanda kasih berhasil dikirim! Terima kasih banyak.");
      setIsModalOpen(false);
      setFormData({
        senderName: "",
        bankTarget: "",
        bankSender: "BCA",
        accountNumber: "",
        amount: "",
        message: "",
        proofUrl: "",
      });
    } catch (err) {
      console.error(err);
      onShowToast("Konfirmasi tersimpan di memori lokal. Terima kasih atas tanda kasih Anda!");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="gift"
      className={`border-t ${isMobile ? "py-12 px-4" : "py-24 px-6"}`}
      style={{
        backgroundColor: `${theme.colors.bg}`,
        borderColor: theme.colors.border,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <span
          className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2"
          style={{ color: theme.colors.primary }}
        >
          Share Your Blessings
        </span>
        <h2
          className={`font-heading font-bold ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
          style={{ color: theme.colors.text }}
        >
          Wedding Gift &amp; Amplop Digital
        </h2>
        <div className="text-lg mt-2" style={{ color: theme.colors.accent }}>
          {theme.ornament.symbol}
        </div>
        <p
          className={`max-w-lg mx-auto mt-2 mb-8 ${isMobile ? "text-xs" : "text-sm sm:text-base mb-12"}`}
          style={{ color: theme.colors.muted }}
        >
          Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin mengirimkan tanda kasih secara virtual, dapat melalui rekening berikut:
        </p>

        <div className={`flex items-center justify-center gap-5 ${isMobile ? "flex-col" : "flex-col sm:flex-row"}`}>
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-sm w-full text-center hover:shadow-md transition-all ${
                isMobile ? "p-5 max-w-[320px]" : "p-8 max-w-sm"
              }`}
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <h4
                className="text-[11px] sm:text-xs uppercase tracking-wider font-bold mb-3"
                style={{ color: theme.colors.primary }}
              >
                {acc.bank}
              </h4>
              <p
                className={`font-mono font-bold tracking-wider mb-1 break-all ${isMobile ? "text-xl" : "text-2xl"}`}
                style={{ color: theme.colors.text }}
              >
                {acc.accountNumber}
              </p>
              <p
                className="text-xs sm:text-sm mb-5"
                style={{ color: theme.colors.muted }}
              >
                {acc.holderName}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumber)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-wider transition-all cursor-pointer hover:opacity-90"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                  backgroundColor: `${theme.colors.primary}10`,
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span>Salin Rekening</span>
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                bankTarget: accounts[0]?.bank || "BANK CENTRAL ASIA (BCA)",
              }));
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide text-white shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Konfirmasi Kirim Tanda Kasih</span>
          </button>
          <p className="text-[11px] mt-2 text-stone-400">
            Kirimkan konfirmasi agar kedua mempelai dapat mengetahui tanda kasih dari Anda.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-100 overflow-hidden text-left animate-scale-in">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}
                >
                  <span className="material-symbols-outlined text-[22px]">redeem</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Konfirmasi Tanda Kasih</h3>
                  <p className="text-xs text-stone-500">Beritahu pengantin atas amplop yang Anda kirimkan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitGift} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nama Pengirim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang & Keluarga"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Ditujukan Ke Rekening
                </label>
                <select
                  value={formData.bankTarget}
                  onChange={(e) => setFormData({ ...formData, bankTarget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  {accounts.map((acc, i) => (
                    <option key={i} value={acc.bank}>
                      {acc.bank} ({acc.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Bank / Metode Anda
                  </label>
                  <select
                    value={formData.bankSender}
                    onChange={(e) => setFormData({ ...formData, bankSender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="BSI">BSI</option>
                    <option value="QRIS / E-Wallet">QRIS / E-Wallet (GoPay, OVO, Dana)</option>
                    <option value="Lainnya">Bank Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nominal Transfer (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="Contoh: 500000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Doa &amp; Pesan untuk Pengantin (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Semoga senantiasa bahagia dan berkah dalam membina rumah tangga..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Link Bukti Transfer / Resi (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.proofUrl}
                  onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
