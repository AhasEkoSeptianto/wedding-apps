"use client";

interface HeroCatalogProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function HeroCatalog({
  searchQuery,
  onSearchChange,
}: HeroCatalogProps) {
  return (
    <div className="relative w-full overflow-hidden pt-8">
      {/* Subtle ambient decorative glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-primary-fixed/40 via-surface-container-high/30 to-transparent blur-3xl pointer-events-none rounded-full" />

      <section className="relative w-full max-w-[1360px] mx-auto px-4 md:px-12 pt-6 pb-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Brand Monogram Micro Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-low shadow-sm mb-4 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[18px]">
              auto_awesome
            </span>
            <span className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Koleksi Eksklusif 2025
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-on-surface mb-3 leading-tight">
            Temukan Desain Impian untuk{" "}
            <span className="italic text-primary font-serif">Hari Bahagia Anda</span>
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed mb-8">
            Eksplorasi undangan digital bertaraf couture yang memadukan kehangatan estetika kertas bertekstur, sentuhan foil emas, dan kecanggihan teknologi interaktif modern.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl p-1.5 rounded-full bg-surface-container-lowest shadow-xl flex items-center gap-2 border border-outline-variant/20">
            <div className="pl-4 text-outline flex items-center">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tema, misal: Botanical Sage, Royal Gold, Adat Jawa, Minimalist..."
              className="w-full bg-transparent border-none py-3 px-2 text-on-surface text-sm placeholder:text-outline focus:outline-none"
            />
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-semibold text-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <span>Temukan</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Quick metadata stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-on-surface-variant text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                verified
              </span>
              <span>120+ Pilihan Desain Masterpiece</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[16px]">
                qr_code_2
              </span>
              <span>QR Check-in &amp; Buku Tamu Terintegrasi</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline-block" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                music_note
              </span>
              <span>Dukungan Musik &amp; Animasi Real-time</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

