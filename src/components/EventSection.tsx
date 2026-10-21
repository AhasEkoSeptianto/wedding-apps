export default function EventSection() {
  const events = [
    {
      type: "Holy Matrimony",
      date: "Saturday, 24 October 2026",
      time: "09:00 AM – 11:00 AM",
      venue: "Grace Cathedral Hall",
      address: "124 St. Augustine Avenue, Grand Plaza",
      mapsUrl: "https://maps.google.com",
      icon: (
        <svg className="w-6 h-6 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
        </svg>
      ),
    },
    {
      type: "Wedding Reception",
      date: "Saturday, 24 October 2026",
      time: "06:00 PM – 10:00 PM",
      venue: "The Grand Ballroom",
      address: "Starlight Luxury Hotel, 5th Floor, City Center",
      mapsUrl: "https://maps.google.com",
      icon: (
        <svg className="w-6 h-6 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="events" className="bg-[#F4EDE4] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
            When &amp; Where
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-stone-800">
            Wedding Schedule
          </h2>
          <div className="text-wedding-gold text-lg mt-2">❖</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-[#EBD9C8] text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 rounded-full bg-wedding-gold-light flex items-center justify-center mb-6">
                {evt.icon}
              </div>

              <h3 className="font-heading text-2xl font-bold text-stone-800 mb-4">
                {evt.type}
              </h3>

              <div className="text-sm text-stone-600 mb-6 space-y-1">
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                  </svg>
                  {evt.date}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-wedding-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                  </svg>
                  {evt.time}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-stone-800 mb-1">{evt.venue}</h4>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs">{evt.address}</p>
              </div>

              <a
                href={evt.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-wedding-gold text-wedding-gold-dark hover:bg-wedding-gold hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

