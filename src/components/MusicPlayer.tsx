"use client";

import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  autoPlayTrigger: boolean;
}

export default function MusicPlayer({ autoPlayTrigger }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay was blocked by browser policy:", err);
        });
    }
  }, [autoPlayTrigger]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Error playing audio:", err));
    }
  };

  if (!autoPlayTrigger) return null;

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113575.mp3"
      />
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-wedding-gold hover:bg-wedding-gold-dark text-white border-2 border-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg
          className={`w-6 h-6 ${isPlaying ? "animate-spin-slow" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </>
  );
}

