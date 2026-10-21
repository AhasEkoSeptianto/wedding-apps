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
  }, [autoPlayTrigger, isPlaying]);

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
        <span className={`block transition-transform duration-500 ${isPlaying ? "animate-spin-slow" : ""}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
        </span>
      </button>
    </>
  );
}
