import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";

interface FooterProps {
  weddingData?: WeddingData;
}

export default function Footer({ weddingData }: FooterProps) {
  const theme = getTheme(weddingData?.themeId);
  const groomNick =
    weddingData?.groom?.nickName ||
    weddingData?.groom?.fullName?.split(",")[0]?.split(" ")[0] ||
    "Dimas";
  const brideNick =
    weddingData?.bride?.nickName ||
    weddingData?.bride?.fullName?.split(",")[0]?.split(" ")[0] ||
    "Sarah";

  return (
    <footer
      className="py-16 px-6 text-center transition-colors"
      style={{
        backgroundColor: theme.isDark ? "#0A0D12" : "#1A1715",
        color: "#ffffff",
      }}
    >
      <div className="max-w-xl mx-auto">
        <h2
          className="font-heading text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: theme.colors.accent }}
        >
          {groomNick} &amp; {brideNick}
        </h2>
        <div className="text-sm mb-4" style={{ color: theme.colors.accent }}>
          {theme.ornament.symbol}
        </div>
        <p className="font-serif italic text-lg text-white/80 mb-6">
          Thank you for being part of our special beginning!
        </p>
        <p className="text-xs text-stone-400">
          Crafted with &hearts; for our wedding celebration.
        </p>
      </div>
    </footer>
  );
}
