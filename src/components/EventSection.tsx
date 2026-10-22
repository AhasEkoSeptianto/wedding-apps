import { WeddingData } from "@/types";

interface EventSectionProps {
  weddingData?: WeddingData;
  viewMode?: "mobile" | "tablet" | "desktop";
}

export default function EventSection({ weddingData, viewMode }: EventSectionProps) {
  const isMobile = viewMode === "mobile";

  const akadDate = weddingData?.events?.akad?.date?.trim() || "Sabtu, 24 Agustus 2026";
  const akadTime = weddingData?.events?.akad?.time?.trim() || "08.00 - 10.00 WIB";
  const akadVenue = weddingData?.events?.akad?.venue?.trim() || "Masjid Agung Sunda Kelapa, Menteng";
  const akadAddress =
    weddingData?.events?.akad?.address?.trim() ||
    "Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta";

  const hasResepsi = weddingData
    ? Boolean(
        weddingData.events?.resepsi?.venue?.trim() ||
        weddingData.events?.resepsi?.date?.trim() ||
        weddingData.events?.resepsi?.time?.trim()
      )
    : true; // Default fallback shows both if no custom weddingData provided

  const resepsiDate = weddingData?.events?.resepsi?.date?.trim() || "Sabtu, 24 Agustus 2026";
  const resepsiTime = weddingData?.events?.resepsi?.time?.trim() || "18.30 - 21.30 WIB";
  const resepsiVenue = weddingData?.events?.resepsi?.venue?.trim() || "The Dharmawangsa Grand Ballroom";
  const resepsiAddress =
    weddingData?.events?.resepsi?.address?.trim() || "Kebayoran Baru, Jakarta Selatan";

  const events = [
    {
      type: "Akad Nikah",
      date: akadDate,
      time: akadTime,
      venue: akadVenue,
      address: akadAddress,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${akadVenue} ${akadAddress}`
      )}`,
      icon: (
        <svg className="w-6 h-6 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
        </svg>
      ),
    },
  ];

  if (hasResepsi) {
    events.push({
      type: "Resepsi Pernikahan",
      date: resepsiDate,
      time: resepsiTime,
      venue: resepsiVenue,
      address: resepsiAddress,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${resepsiVenue} ${resepsiAddress}`
      )}`,
      icon: (
        <svg className="w-6 h-6 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    });
  }

  return (
    <section id="events" className={`bg-[#F4EDE4] ${isMobile ? "py-12 px-4" : "py-24 px-6"}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center ${isMobile ? "mb-8" : "mb-16"}`}>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
            When &amp; Where
          </span>
          <h2 className={`font-heading font-bold text-stone-800 ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
            Wedding Schedule
          </h2>
          <div className="text-wedding-gold text-lg mt-2">❖</div>
        </div>

        <div
          className={`grid gap-6 ${
            isMobile || events.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {events.map((evt, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border border-[#EBD9C8] text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between ${
                isMobile ? "p-6" : "p-8"
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-wedding-gold-light flex items-center justify-center mb-4 sm:mb-6">
                {evt.icon}
              </div>

              <h3 className={`font-heading font-bold text-stone-800 mb-3 sm:mb-4 ${isMobile ? "text-xl" : "text-2xl"}`}>
                {evt.type}
              </h3>

              <div className="text-xs sm:text-sm text-stone-600 mb-5 sm:mb-6 space-y-1.5">
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-wedding-gold-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                  </svg>
                  <span>{evt.date}</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-wedding-gold-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                  </svg>
                  <span>{evt.time}</span>
                </p>
              </div>

              <div className="mb-6 sm:mb-8">
                <h4 className="font-semibold text-stone-800 text-sm sm:text-base mb-1">{evt.venue}</h4>
                <p className="text-xs text-stone-500 max-w-xs">{evt.address}</p>
              </div>

              <a
                href={evt.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-wedding-gold text-wedding-gold-dark hover:bg-wedding-gold hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Google Maps</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

