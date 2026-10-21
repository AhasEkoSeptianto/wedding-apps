"use client";

import { useState } from "react";

interface WishItem {
  id: string;
  name: string;
  time: string;
  message: string;
  avatar: string;
  liked: boolean;
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: "1",
    name: "Clara & Jonathan",
    time: "5 menit yang lalu",
    message:
      '"Barakallahu lakum Dimas & Sarah! Semoga rumah tangganya senantiasa dipenuhi sakinah, mawaddah, dan warahmah sampai ke anak cucu!"',
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPHFUCy4IsJkVpOUU7VkUh82FqsiwAYtnqvcKTkYf4d65YZkFhGsnin15fawQwuJ73N4Zze6fUd6SHr-PPPMIaeGlfFx-s9eRX4L2B-ZRBl7hnaws9d-x8wLeRCQ3tYk3vYv0bKu_wTkAvPk24N0c5mZ0rj_n60am8WhQNV7_wu2uwo5RSsHxc29hPXT1On7h2ulx7XzcxE18Hq1cUK7IVwojv5dBJjgSJl_7dD2PP7YLWZkGqKx0mlA",
    liked: false,
  },
  {
    id: "2",
    name: "Hendra Gunawan",
    time: "28 menit yang lalu",
    message:
      '"Selamat menempuh hidup baru sahabatku Dimas! Semoga dilancarkan acaranya nanti. Sampai jumpa di pelaminan ya bro!"',
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuk7m-AFJmEYttxBseR7iw5AC6btjGOCdAiUhKjKUcig97j9AaVf34LZl1KZREeErFYPlzVbQgC1FF114_LBGjTM8bFS_JmpJYm5EMNup2jGcMTFS5Y46VJ1YSH-hB8QdlBYksZzncqCut71AkNSO6scWq0I3OWP8geOi5j6ZBpxihN7AXRSLE4WMffuVs9c0Eu7KPxQpOA09lEL6K5wd7cTICNX9OeeUqzSdn68NME9PDyQTRAJiP1A",
    liked: true,
  },
  {
    id: "3",
    name: "Tante Dewi Suryani",
    time: "1 jam yang lalu",
    message:
      '"Cantiknya Sarah dan gantengnya Dimas. Doa terbaik dari Tante dan Om sekeluarga dari Surabaya. Amin YRA."',
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlSMUvVP_1GWnyWnrqWH6K4TURdU_tm-qfia5z8QqPHytDU4L5rv1ns9iySKgdo8KhHfIEpiHnf5qtdZ-1ZHUKVlO0r_j89hX-fghKO3uguateO0R2jpGw56C-9fu4LsZy8DoiNG-1A6WmxA-i8NB_n92PpGu1QGDANtLGShX_Pkwi9lq9n-oQhNnKa0gTQe_A7agB7HfqTv8yst9Y4w-wqg6NebnNrdlyqqk3tpKkeiLorGxyh8xCUA",
    liked: false,
  },
];

interface WishesLiveFeedProps {
  onShowToast: (msg: string) => void;
}

export default function WishesLiveFeed({ onShowToast }: WishesLiveFeedProps) {
  const [wishes, setWishes] = useState<WishItem[]>(INITIAL_WISHES);

  const toggleLike = (id: string) => {
    setWishes((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.liked;
          onShowToast(nextState ? "Menyukai ucapan" : "Batal menyukai ucapan");
          return { ...item, liked: nextState };
        }
        return item;
      })
    );
  };

  return (
    <div id="amplop-ucapan" className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            mark_chat_read
          </span>
          <h3 className="text-base font-bold text-on-surface">Ucapan &amp; Doa Restu</h3>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
        </span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {wishes.map((item) => (
          <div key={item.id} className="p-3.5 rounded-lg bg-surface space-y-2 border border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/20"
                  src={item.avatar}
                  alt={item.name}
                />
                <div>
                  <h4 className="text-xs font-semibold text-on-surface leading-none">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => toggleLike(item.id)}
                className={`transition-colors cursor-pointer ${
                  item.liked ? "text-error" : "text-on-surface-variant hover:text-error"
                }`}
                type="button"
                title="Sukai Ucapan"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    item.liked ? "filled" : ""
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant italic leading-relaxed">
              {item.message}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onShowToast("Membuka seluruh 198 ucapan tamu...")}
        className="w-full py-2 text-center text-primary hover:text-primary-container text-xs font-semibold transition-colors cursor-pointer"
        type="button"
      >
        Lihat Semua 198 Pesan Doa &rarr;
      </button>
    </div>
  );
}

