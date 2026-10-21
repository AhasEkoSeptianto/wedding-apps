"use client";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-full shadow-2xl transition-all duration-300 animate-fade-in flex items-center gap-2 border border-stone-700">
      <svg className="w-4 h-4 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}
