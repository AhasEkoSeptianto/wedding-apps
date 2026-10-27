"use client";

import { useEffect, useState } from "react";
import { Wish, WeddingData } from "@/types";
import { api } from "@/lib/api";
import { getTheme } from "@/lib/themes";

interface RsvpSectionProps {
  onShowToast: (message: string) => void;
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

const INITIAL_WISHES: Wish[] = [
  {
    id: "1",
    name: "Michael & Claire",
    attendance: "attending",
    guests: 2,
    message: "Warmest congratulations to the wonderful couple! Wishing you a lifetime of love and joy.",
    createdAt: "Just now",
  },
  {
    id: "2",
    name: "David Wijaya",
    attendance: "attending",
    guests: 1,
    message: "So happy for both of you! May your love grow stronger each passing year.",
    createdAt: "1 hour ago",
  },
];

export default function RsvpSection({ onShowToast, weddingData, viewMode }: RsvpSectionProps) {
  const isMobile = viewMode === "mobile";
  const theme = getTheme(weddingData?.themeId);
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "not-attending">("attending");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetSlug = weddingData?.slug || "dimas-sarah";

  useEffect(() => {
    // Attempt fetching from Express backend with MongoDB
    api.getWishes(targetSlug)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setWishes(res.data);
        }
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem(`wedding_wishes_${targetSlug}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            queueMicrotask(() => {
              setWishes(parsed);
            });
          }
        } catch (e) {
          console.error(e);
        }
      });
  }, [targetSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      onShowToast("Mohon lengkapi nama dan pesan ucapan Anda.");
      return;
    }

    setIsSubmitting(true);
    const newWish: Wish = {
      id: Date.now().toString(),
      slug: targetSlug,
      name: name.trim(),
      attendance,
      guests,
      message: message.trim(),
      createdAt: "Baru saja",
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem(`wedding_wishes_${targetSlug}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Persist to Express / MongoDB backend
    api.createWish({
      slug: targetSlug,
      name: name.trim(),
      attendance,
      guests,
      message: message.trim(),
    }).catch((err) => {
      console.warn("Backend belum aktif, ucapan tersimpan di lokal:", err);
    });

    setName("");
    setMessage("");
    setIsSubmitting(false);
    onShowToast("Terima kasih! Konfirmasi kehadiran dan doa restu Anda berhasil dikirim.");
  };

  return (
    <section id="rsvp" className={`max-w-5xl mx-auto ${isMobile ? "py-12 px-4" : "py-24 px-6"}`}>
      <div className={`text-center ${isMobile ? "mb-8" : "mb-16"}`}>
        <span
          className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block mb-2"
          style={{ color: theme.colors.primary }}
        >
          Celebrate With Us
        </span>
        <h2
          className={`font-heading font-bold ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
          style={{ color: theme.colors.text }}
        >
          RSVP &amp; Best Wishes
        </h2>
        <div className="text-lg mt-2" style={{ color: theme.colors.accent }}>
          {theme.ornament.symbol}
        </div>
        <p
          className={`max-w-md mx-auto mt-2 ${isMobile ? "text-xs" : "text-sm sm:text-base"}`}
          style={{ color: theme.colors.muted }}
        >
          Please confirm your attendance and leave warm wishes for the bride and groom.
        </p>
        {weddingData?.rsvp?.deadline && (
          <div className="mt-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${theme.colors.accent}20`,
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <span className="material-symbols-outlined text-[14px]">event_available</span>
              <span>Batas Konfirmasi: {weddingData.rsvp.deadline}</span>
            </span>
          </div>
        )}
      </div>

      <div className={`grid gap-6 sm:gap-8 items-start ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {/* RSVP Form */}
        <div
          className={`rounded-2xl shadow-sm ${isMobile ? "p-5" : "p-6 sm:p-8"}`}
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3
            className="font-heading text-lg sm:xl font-bold mb-4 sm:mb-6 pb-3 border-b"
            style={{ color: theme.colors.text, borderColor: theme.colors.border }}
          >
            Attendance Confirmation
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.colors.text }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              />
            </div>

            <div>
              <label htmlFor="attendance" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.colors.text }}>
                Will You Attend?
              </label>
              <select
                id="attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as "attending" | "not-attending")}
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              >
                <option value="attending">Yes, Joyfully Attending</option>
                <option value="not-attending">Sorry, Unable to Attend</option>
              </select>
            </div>

            {attendance === "attending" && (
              <div>
                <label htmlFor="guests" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.colors.text }}>
                  Number of Guests
                </label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <option value={1}>1 Orang (Tamu Utama)</option>
                  {weddingData?.rsvp?.maxGuests !== "0" && (
                    <option value={2}>2 Orang (+1 Pendamping)</option>
                  )}
                  {weddingData?.rsvp?.maxGuests === "2" && (
                    <option value={3}>3 Orang (+2 Keluarga)</option>
                  )}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.colors.text }}>
                Wishes &amp; Prayers
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your blessings and prayers here..."
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: theme.colors.primary,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send RSVP &amp; Wishes
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-sm"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div className="flex items-center justify-between pb-3 mb-6 border-b" style={{ borderColor: theme.colors.border }}>
            <h3 className="font-heading text-xl font-bold" style={{ color: theme.colors.text }}>
              Warm Wishes
            </h3>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                backgroundColor: `${theme.colors.accent}25`,
                color: theme.colors.primary,
              }}
            >
              {wishes.length} Messages
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border-l-4"
                style={{
                  backgroundColor: `${theme.colors.bg}80`,
                  borderLeftColor: theme.colors.primary,
                  borderTop: `1px solid ${theme.colors.border}`,
                  borderRight: `1px solid ${theme.colors.border}`,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm" style={{ color: theme.colors.text }}>
                    {item.name}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.attendance === "attending"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.attendance === "attending" ? "Attending" : "Absent"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-2" style={{ color: theme.colors.muted }}>
                  {item.message}
                </p>
                <span className="text-[10px] opacity-75" style={{ color: theme.colors.muted }}>
                  {item.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
