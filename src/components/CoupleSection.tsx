import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";

interface CoupleSectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CoupleSection({ weddingData, viewMode }: CoupleSectionProps) {
  const groom = weddingData?.groom || {
    fullName: "Dimas Prasetyo, S.T.",
    nickName: "Dimas",
    parents: "Putra pertama dari Bpk. Bambang Wijaya & Ibu Sri Rahayu",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzUNvfN4JLmIEQ8Rl3ucmVP0-vib8bkuQ3IrTgVw8Qr5sjfCuCXP250Cgz911BcC7k2OJebkbkFG2QdPC2uPmB9JgO20ArGDvpU0gAuSbhYSI7-kXcn2tgNddrrMRwpjYWGzsz64YzuTcetJcaEqJJ6OK2uZbQ6mVajqzRW3u95-6UPI5E7g3WEY75DGTcZ_y5UEu_eA0ZcLAS5JKHy7r9_Lyg0m4Oqoi--PgbPYl8YDo-L0m9KgRLNQ",
    instagram: "@dimasprasetyo",
  };

  const bride = weddingData?.bride || {
    fullName: "Sarah Anindita, M.Ds.",
    nickName: "Sarah",
    parents: "Putri kedua dari Bpk. Ir. Hendra Kusuma & Ibu Ratna Dewi",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBqrJptRouC3sJfNXLjsofBuvakru1TeBprYoHukqDAMi6numwD_tbCIUj8gAmdv2RmqFwBb_l5JMoEvVo44VGvNdl3sKNhmAfevpxliVOYaJJWD_eKIOO0CiuiYkvBWAHCLhcxazK406U-fFG7DULwuD1nG7PYvz4ukXGopUFGbgkuinU9wNO5xAusEewWYWkgBN7NjgntxgHQ2Bn3UJ17VOD7tjWOJ3NnqU0qcG7XHbVUgy4mfmLmQ",
    instagram: "@sarahanindita",
  };

  const isMobile = viewMode === "mobile";
  const isTablet = viewMode === "tablet";
  const theme = getTheme(weddingData?.themeId);

  const groomDisplayName = capitalizeWords(groom.fullName || groom.nickName);
  const brideDisplayName = capitalizeWords(bride.fullName || bride.nickName);

  return (
    <section id="couple" className={`${isMobile ? "py-12 px-4" : "py-24 px-6"} max-w-5xl mx-auto`}>
      <div className={`text-center ${isMobile ? "mb-8" : "mb-16"}`}>
        <span
          style={{ color: theme.colors.primaryDark }}
          className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2"
        >
          Mempelai yang Berbahagia
        </span>
        <h2
          style={{ color: theme.colors.textHeading }}
          className={`font-heading font-bold ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
        >
          Groom &amp; Bride
        </h2>
        <div style={{ color: theme.colors.primary }} className="text-lg mt-2">
          {theme.ornament.symbol}
        </div>
      </div>

      <div
        className={`flex ${
          isMobile
            ? "flex-col items-center gap-6"
            : isTablet
            ? "flex-row items-center justify-center gap-6"
            : "flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
        }`}
      >
        {/* Groom Card */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.surfaceBorder,
          }}
          className={`rounded-2xl shadow-sm border text-center w-full transition-all duration-300 ${
            isMobile ? "max-w-[320px] p-6" : "max-w-sm p-8 hover:shadow-md hover:-translate-y-1"
          }`}
        >
          <div
            style={{ borderColor: theme.colors.primary }}
            className={`mx-auto rounded-full p-1.5 border-2 border-dashed overflow-hidden ${
              isMobile ? "w-32 h-32 mb-4" : "w-44 h-44 mb-6"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                groom.photoUrl ||
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
              }
              alt={groomDisplayName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3
            style={{ color: theme.colors.textHeading }}
            className={`font-heading font-bold mb-1.5 ${isMobile ? "text-xl" : "text-2xl"}`}
          >
            {groomDisplayName}
          </h3>
          <p
            style={{ color: theme.colors.textBody }}
            className="text-xs sm:text-sm leading-relaxed mb-5"
          >
            {groom.parents}
          </p>
          {groom.instagram && (
            <div className="flex justify-center gap-3">
              <a
                href={`https://instagram.com/${groom.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primaryDark,
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors"
                aria-label={`Instagram ${groomDisplayName}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Ampersand */}
        <div
          style={{ color: theme.colors.primary }}
          className={`font-serif font-light ${
            isMobile ? "text-3xl my-1" : "text-5xl my-2 md:my-0"
          }`}
        >
          &amp;
        </div>

        {/* Bride Card */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.surfaceBorder,
          }}
          className={`rounded-2xl shadow-sm border text-center w-full transition-all duration-300 ${
            isMobile ? "max-w-[320px] p-6" : "max-w-sm p-8 hover:shadow-md hover:-translate-y-1"
          }`}
        >
          <div
            style={{ borderColor: theme.colors.primary }}
            className={`mx-auto rounded-full p-1.5 border-2 border-dashed overflow-hidden ${
              isMobile ? "w-32 h-32 mb-4" : "w-44 h-44 mb-6"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                bride.photoUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              }
              alt={brideDisplayName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3
            style={{ color: theme.colors.textHeading }}
            className={`font-heading font-bold mb-1.5 ${isMobile ? "text-xl" : "text-2xl"}`}
          >
            {brideDisplayName}
          </h3>
          <p
            style={{ color: theme.colors.textBody }}
            className="text-xs sm:text-sm leading-relaxed mb-5"
          >
            {bride.parents}
          </p>
          {bride.instagram && (
            <div className="flex justify-center gap-3">
              <a
                href={`https://instagram.com/${bride.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primaryDark,
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors"
                aria-label={`Instagram ${brideDisplayName}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
