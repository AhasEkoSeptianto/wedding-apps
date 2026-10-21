export default function GallerySection() {
  const images = [
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80", alt: "Moments 1" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80", alt: "Moments 2" },
    { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=700&q=80", alt: "Moments 3" },
    { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=700&q=80", alt: "Moments 4" },
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80", alt: "Moments 5" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80", alt: "Moments 6" },
  ];

  return (
    <section id="gallery" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
          Captured Memories
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-stone-800">
          Our Gallery
        </h2>
        <div className="text-wedding-gold text-lg mt-2">❖</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((item, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl h-64 sm:h-72 shadow-sm border border-[#EDE8E0] group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
