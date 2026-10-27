"use client";

import { WeddingData, StoryItem } from "@/types";
import { getTheme } from "@/lib/themes";

interface StorySectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

const DEFAULT_STORIES: StoryItem[] = [
  {
    year: "2019",
    title: "Pertama Bertemu",
    description:
      "Bertemu tanpa sengaja di studio desain kreatif Jakarta saat mengerjakan proyek kolaborasi bersama.",
  },
  {
    year: "2024",
    title: "Lamaran Romantis",
    description:
      "Di bawah gemerlap senja Labuan Bajo, mengucap janji suci untuk melangkah ke jenjang pernikahan.",
  },
];

export default function StorySection({ weddingData, viewMode }: StorySectionProps) {
  const isMobile = viewMode === "mobile";
  const theme = getTheme(weddingData?.themeId);

  const stories =
    weddingData?.stories !== undefined
      ? weddingData.stories
      : DEFAULT_STORIES;

  const hasStories = stories && stories.length > 0;

  return (
    <section
      id="story"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.surfaceBorder,
      }}
      className={`border-y transition-colors duration-500 ${isMobile ? "py-14 px-4" : "py-24 px-6"}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`text-center ${isMobile ? "mb-10" : "mb-16"}`}>
          <span
            style={{ color: theme.colors.primaryDark }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2"
          >
            How It Began
          </span>
          <h2
            style={{ color: theme.colors.textHeading }}
            className={`font-heading font-bold ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
          >
            Cerita Cinta Kami
          </h2>
          <div style={{ color: theme.colors.primary }} className="text-lg mt-2">
            {theme.ornament.symbol}
          </div>
          <p
            style={{ color: theme.colors.textBody }}
            className="text-xs sm:text-sm mt-2 max-w-md mx-auto"
          >
            Perjalanan indah yang membawa dua insan melangkah menuju ikatan suci pernikahan.
          </p>
        </div>

        {hasStories ? (
          /* Timeline Container */
          <div className="relative">
            {/* Central Vertical Line (hidden on very small mobile, visible on desktop/tablet) */}
            {!isMobile && (
              <div
                style={{ backgroundColor: `${theme.colors.primary}4D` }}
                className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 hidden md:block"
              />
            )}

            <div className="space-y-8 md:space-y-12">
              {stories.map((story, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className={`relative flex items-center ${
                      isMobile
                        ? "flex-col items-start"
                        : "md:flex-row " + (isEven ? "md:flex-row-reverse" : "")
                    }`}
                  >
                    {/* Timeline Node Dot (Desktop) */}
                    {!isMobile && (
                      <div
                        style={{
                          backgroundColor: theme.colors.surface,
                          borderColor: theme.colors.primary,
                        }}
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 items-center justify-center shadow-md z-10"
                      >
                        <span
                          style={{ backgroundColor: theme.colors.primary }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                      </div>
                    )}

                    {/* Spacer for 50/50 Desktop Layout */}
                    {!isMobile && <div className="hidden md:block w-1/2" />}

                    {/* Story Card */}
                    <div
                      className={`w-full ${
                        isMobile ? "max-w-md mx-auto" : "md:w-1/2 " + (isEven ? "md:pr-10" : "md:pl-10")
                      }`}
                    >
                      <div
                        style={{
                          backgroundColor: theme.colors.bg,
                          borderColor: theme.colors.surfaceBorder,
                        }}
                        className="rounded-2xl p-6 sm:p-7 border shadow-xs hover:shadow-md transition-all relative group"
                      >
                        {/* Mobile Node indicator */}
                        {isMobile && (
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              style={{ backgroundColor: theme.colors.primary }}
                              className="w-2 h-2 rounded-full"
                            />
                            <span
                              style={{ color: theme.colors.primaryDark }}
                              className="text-[11px] font-semibold uppercase tracking-wider"
                            >
                              Momen #{idx + 1}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <h3
                            style={{ color: theme.colors.textHeading }}
                            className="font-heading text-lg sm:text-xl font-bold"
                          >
                            {story.title}
                          </h3>
                          {story.year && (
                            <span
                              style={{
                                backgroundColor: theme.colors.primaryLight,
                                color: theme.colors.primaryDark,
                                borderColor: `${theme.colors.primary}33`,
                              }}
                              className="px-3 py-1 text-xs font-bold rounded-full border font-mono"
                            >
                              {story.year}
                            </span>
                          )}
                        </div>

                        <p
                          style={{ color: theme.colors.textBody }}
                          className="text-xs sm:text-sm leading-relaxed"
                        >
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State when no stories added yet */
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.surfaceBorder,
            }}
            className="rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center max-w-lg mx-auto"
          >
            <div
              style={{
                backgroundColor: theme.colors.primaryLight,
                color: theme.colors.primaryDark,
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-[28px]">history_edu</span>
            </div>
            <h4
              style={{ color: theme.colors.textHeading }}
              className="font-heading text-lg font-bold mb-1"
            >
              Cerita Cinta Belum Diisi
            </h4>
            <p
              style={{ color: theme.colors.textBody }}
              className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto"
            >
              Silakan tambahkan momen cerita perjalanan cinta Anda melalui menu <strong>Galeri &amp; Cerita Cinta</strong> di Editor Studio agar tampil secara otomatis di sini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
