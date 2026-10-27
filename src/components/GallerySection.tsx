import { WeddingData } from "@/types";
import { getTheme } from "@/lib/themes";

interface GallerySectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function GallerySection({ weddingData, viewMode }: GallerySectionProps) {
  const isMobile = viewMode === "mobile";
  const theme = getTheme(weddingData?.themeId);

  const galleryList = (weddingData?.gallery || []).filter((url) => Boolean(url && url.trim()));
  const hasPhotos = galleryList.length > 0;

  return (
    <section id="gallery" className={`max-w-5xl mx-auto ${isMobile ? "py-12 px-4" : "py-24 px-6"}`}>
      <div className={`text-center ${isMobile ? "mb-8" : "mb-16"}`}>
        <span
          className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2"
          style={{ color: theme.colors.primary }}
        >
          Captured Memories
        </span>
        <h2
          className={`font-heading font-bold ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
          style={{ color: theme.colors.text }}
        >
          Our Gallery
        </h2>
        <div className="text-lg mt-2" style={{ color: theme.colors.accent }}>
          {theme.ornament.symbol}
        </div>
        <p className="text-xs sm:text-sm mt-2 max-w-md mx-auto" style={{ color: theme.colors.muted }}>
          Momen-momen indah perjalanan cinta kami yang terabadikan dalam lensa.
        </p>
      </div>

      {hasPhotos ? (
        <div
          className={`grid gap-3 sm:gap-5 ${
            isMobile
              ? "grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {galleryList.map((url, idx) => (
            <div
              key={idx}
              className={`overflow-hidden shadow-sm group ${
                isMobile ? "rounded-xl h-44" : "rounded-2xl h-64 sm:h-72"
              }`}
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Foto Galeri ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State when no photos uploaded yet */
        <div
          className="rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center max-w-lg mx-auto"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: `${theme.colors.accent}25`,
              color: theme.colors.primary,
            }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4
            className="font-heading text-lg font-bold mb-1"
            style={{ color: theme.colors.text }}
          >
            Galeri Foto Belum Diunggah
          </h4>
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: theme.colors.muted }}
          >
            Silakan unggah foto prewedding Anda melalui menu <strong>Galeri</strong> di Editor Studio agar tampil secara otomatis di sini.
          </p>
        </div>
      )}
    </section>
  );
}
