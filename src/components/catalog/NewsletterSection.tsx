"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 md:px-12 py-10">
      <div className="rounded-2xl bg-surface-container-lowest shadow-md p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/20">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Panduan Calon Pengantin</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface mb-2">
            Dapatkan Inspirasi Tren Pernikahan &amp; Format Undangan Sopan
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Kiat menyusun kata-kata undangan akad, tata krama membagikan link WhatsApp secara elegan, serta checklist persiapan resepsi eksklusif langsung ke inbox Anda.
          </p>
        </div>

        {subscribed ? (
          <div className="bg-secondary-fixed/40 border border-secondary text-secondary font-semibold p-4 rounded-2xl text-center text-sm">
            🎉 Terima kasih! Panduan pernikahan eksklusif telah kami kirimkan ke email Anda.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 shrink-0"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email aktif Anda..."
              className="w-full sm:w-80 px-5 py-3 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:bg-surface-container border border-outline-variant/30"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-secondary text-on-secondary text-sm font-semibold hover:bg-on-secondary-container transition-all shadow-sm shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Langganan Gratis
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

