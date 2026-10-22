import { WeddingData } from "@/types";

interface QuoteSectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function QuoteSection({ weddingData, viewMode }: QuoteSectionProps) {
  const isMobile = viewMode === "mobile";

  const quoteText =
    weddingData?.quote?.text?.trim() ||
    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const quoteSource = weddingData?.quote?.source?.trim() || "QS. Ar-Rum: 21";

  return (
    <section className={`bg-white border-y border-[#EDE8E0] text-center ${isMobile ? "py-10 px-4" : "py-16 px-6"}`}>
      <div className="max-w-2xl mx-auto">
        <svg
          className={`mx-auto text-wedding-gold/70 mb-3 sm:mb-4 ${isMobile ? "w-6 h-6" : "w-8 h-8"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <blockquote className={`font-serif italic text-stone-700 leading-relaxed mb-3 sm:mb-4 ${isMobile ? "text-sm sm:text-base" : "text-lg sm:text-2xl"}`}>
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        <p className="text-[11px] sm:text-sm uppercase tracking-widest text-wedding-gold-dark font-semibold">
          — {quoteSource}
        </p>
      </div>
    </section>
  );
}
