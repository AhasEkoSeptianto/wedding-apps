"use client";

import { BankAccount, WeddingData } from "@/types";

interface GiftSectionProps {
  onShowToast: (message: string) => void;
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function GiftSection({ onShowToast, weddingData, viewMode }: GiftSectionProps) {
  const isMobile = viewMode === "mobile";

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

  return (
    <section id="gift" className={`bg-[#FAF7F2] border-t border-[#EDE8E0] ${isMobile ? "py-12 px-4" : "py-24 px-6"}`}>
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
          Share Your Blessings
        </span>
        <h2 className={`font-heading font-bold text-stone-800 ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
          Wedding Gift
        </h2>
        <div className="text-wedding-gold text-lg mt-2">❖</div>
        <p className={`text-stone-500 max-w-lg mx-auto mt-2 mb-8 ${isMobile ? "text-xs" : "text-sm sm:text-base mb-12"}`}>
          Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin mengirimkan tanda kasih secara virtual, dapat melalui:
        </p>

        <div className={`flex items-center justify-center gap-5 ${isMobile ? "flex-col" : "flex-col sm:flex-row"}`}>
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border border-[#EDE8E0] shadow-sm w-full text-center hover:shadow-md transition-all ${
                isMobile ? "p-5 max-w-[320px]" : "p-8 max-w-sm"
              }`}
            >
              <h4 className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-wedding-gold-dark mb-3">
                {acc.bank}
              </h4>
              <p className={`font-mono font-bold tracking-wider text-stone-800 mb-1 break-all ${isMobile ? "text-xl" : "text-2xl"}`}>
                {acc.accountNumber}
              </p>
              <p className="text-xs sm:text-sm text-stone-500 mb-5">
                {acc.holderName}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumber)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-wedding-gold text-wedding-gold-dark hover:bg-wedding-gold hover:text-white text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span>Salin Rekening</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

