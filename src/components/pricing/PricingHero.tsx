"use client";

interface PricingHeroProps {
  billingPeriod: "event" | "lifetime";
  onBillingChange: (period: "event" | "lifetime") => void;
}

export default function PricingHero({
  billingPeriod,
  onBillingChange,
}: PricingHeroProps) {
  return (
    <section className="max-w-[1360px] mx-auto px-4 md:px-12 pt-10 pb-6 text-center">
      {/* Micro Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-primary shadow-xs mb-4 border border-outline-variant/30">
        <span
          className="material-symbols-outlined text-[16px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          workspace_premium
        </span>
        <span className="text-xs tracking-wider uppercase font-semibold">
          Investasi Transparan &amp; Tanpa Biaya Tersembunyi
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl font-normal text-on-surface max-w-4xl mx-auto leading-tight mb-3">
        Pilih Paket Terbaik untuk Momen Terindah Seumur Hidup
      </h1>

      <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
        Hadirkan impresi anggun nan berkesan bagi para tamu undangan. Pilih paket pernikahan digital Anda dengan sistem aktivasi instan dan akses penuh tanpa komplikasi.
      </p>

      {/* Billing Switcher */}
      <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-surface-container-high shadow-inner gap-1 mx-auto border border-outline-variant/20">
        <button
          onClick={() => onBillingChange("event")}
          className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            billingPeriod === "event"
              ? "bg-primary text-on-primary shadow-md"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          type="button"
        >
          Per Acara
        </button>

        <button
          onClick={() => onBillingChange("lifetime")}
          className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            billingPeriod === "lifetime"
              ? "bg-primary text-on-primary shadow-md"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          type="button"
        >
          <span>Akses Seumur Hidup</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
            Hemat 30%
          </span>
        </button>
      </div>
    </section>
  );
}

