"use client";

import { useEffect, useState } from "react";
import { Wish } from "@/types";

interface RsvpSectionProps {
  onShowToast: (message: string) => void;
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

export default function RsvpSection({ onShowToast }: RsvpSectionProps) {
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "not-attending">("attending");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wedding_wishes_next");
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          setWishes(parsed);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      onShowToast("Please fill in your name and message.");
      return;
    }

    setIsSubmitting(true);
    const newWish: Wish = {
      id: Date.now().toString(),
      name: name.trim(),
      attendance,
      guests,
      message: message.trim(),
      createdAt: "Just now",
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem("wedding_wishes_next", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setName("");
    setMessage("");
    setIsSubmitting(false);
    onShowToast("Thank you! Your RSVP and wishes have been sent.");
  };

  return (
    <section id="rsvp" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-wedding-gold-dark font-semibold block mb-2">
          Celebrate With Us
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-stone-800">
          RSVP &amp; Best Wishes
        </h2>
        <div className="text-wedding-gold text-lg mt-2">❖</div>
        <p className="text-stone-500 text-sm sm:text-base max-w-md mx-auto mt-3">
          Please confirm your attendance and leave warm wishes for the bride and groom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* RSVP Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EDE8E0] shadow-sm">
          <h3 className="font-heading text-xl font-bold text-stone-800 mb-6 pb-3 border-b border-stone-100">
            Attendance Confirmation
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-wedding-gold bg-stone-50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="attendance" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Will You Attend?
              </label>
              <select
                id="attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value as "attending" | "not-attending")}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-wedding-gold bg-stone-50 focus:bg-white transition-all"
              >
                <option value="attending">Yes, Joyfully Attending</option>
                <option value="not-attending">Sorry, Unable to Attend</option>
              </select>
            </div>

            {attendance === "attending" && (
              <div>
                <label htmlFor="guests" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-wedding-gold bg-stone-50 focus:bg-white transition-all"
                >
                  <option value={1}>1 Person</option>
                  <option value={2}>2 Persons</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Wishes &amp; Prayers
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your blessings and prayers here..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-wedding-gold bg-stone-50 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-wedding-gold hover:bg-wedding-gold-dark text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send RSVP &amp; Wishes
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EDE8E0] shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-100">
            <h3 className="font-heading text-xl font-bold text-stone-800">
              Warm Wishes
            </h3>
            <span className="text-xs bg-wedding-gold-light text-wedding-gold-dark px-3 py-1 rounded-full font-semibold">
              {wishes.length} Messages
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-stone-50 border-l-4 border-wedding-gold"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-stone-800 text-sm">
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
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2">
                  {item.message}
                </p>
                <span className="text-[10px] text-stone-400">
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

