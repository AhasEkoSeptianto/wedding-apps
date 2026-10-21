export default function QuoteSection() {
  return (
    <section className="bg-white py-16 px-6 border-y border-[#EDE8E0] text-center">
      <div className="max-w-2xl mx-auto">
        <svg
          className="w-8 h-8 mx-auto text-wedding-gold/70 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-700 leading-relaxed mb-4">
          &ldquo;Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.&rdquo;
        </blockquote>

        <p className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-medium">
          — 1 Corinthians 13:4-7
        </p>
      </div>
    </section>
  );
}
