"use client";

import { BankAccount } from "@/types";

interface GiftSectionProps {
  onShowToast: (message: string) => void;
}

export default function GiftSection({ onShowToast }: GiftSectionProps) {
  const accounts: BankAccount[] = [
    {
      bank: "BANK CENTRAL ASIA (BCA)",
      accountNumber: "1234567890",
      holderName: "a.n. Alex Alexander",
    },
    {
      bank: "BANK MANDIRI",
      accountNumber: "0987654321000",
      holderName: "a.n. Sophie Robinson",
    },
  ];

  const handleCopy = (accNumber: string) => {
    navigator.clipboard
      .writeText(accNumber)
      .then(() => {
        onShowToast(`Account number ${accNumber} copied to clipboard!`);
      })
      .catch(() => {
        onShowToast("Failed to copy. Please copy manually.");
      });
  };

  return (
    <section id="gift" className="bg-[#FAF7F2] py-24 px-6 border-t border-[#EDE8E0]">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
          Share Your Blessings
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-stone-800">
          Wedding Gift
        </h2>
        <div className="text-wedding-gold text-lg mt-2">❖</div>
        <p className="text-stone-500 text-sm sm:text-base max-w-lg mx-auto mt-3 mb-12">
          Your presence and prayers are the greatest gift. If you wish to send a wedding gift virtually, you may transfer via:
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-[#EDE8E0] shadow-sm w-full max-w-sm hover:shadow-md transition-all text-center"
            >
              <h4 className="text-xs uppercase tracking-wider font-bold text-wedding-gold-dark mb-4">
                {acc.bank}
              </h4>
              <p className="font-mono text-2xl font-bold tracking-widest text-stone-800 mb-1">
                {acc.accountNumber}
              </p>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                {acc.holderName}
              </p>
              <button
                onClick={() => handleCopy(acc.accountNumber)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-wedding-gold text-wedding-gold-dark hover:bg-wedding-gold hover:text-white text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                Copy Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

