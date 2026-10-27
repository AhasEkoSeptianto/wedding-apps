import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";

interface QuoteSectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function QuoteSection({ weddingData, viewMode }: QuoteSectionProps) {
  const isMobile = viewMode === "mobile";
  const theme = getTheme(weddingData?.themeId);

  const quoteText =
    weddingData?.quote?.text?.trim() ||
    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const quoteSource = weddingData?.quote?.source?.trim() || "QS. Ar-Rum: 21";

  return (
    <section
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.surfaceBorder,
      }}
      className={`border-y text-center transition-colors duration-500 ${isMobile ? "py-10 px-4" : "py-16 px-6"}`}
    >
      <div className="max-w-2xl mx-auto">
        <div
          style={{ color: theme.colors.primary }}
          className="text-2xl mb-2 select-none"
        >
          {theme.ornament.symbol}
        </div>

        <blockquote
          style={{ color: theme.colors.textHeading }}
          className={`font-serif italic leading-relaxed mb-3 sm:mb-4 ${isMobile ? "text-sm sm:text-base" : "text-lg sm:text-2xl"}`}
        >
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        <p
          style={{ color: theme.colors.primaryDark }}
          className="text-[11px] sm:text-sm uppercase tracking-widest font-semibold"
        >
          — {quoteSource}
        </p>
      </div>
    </section>
  );
}
