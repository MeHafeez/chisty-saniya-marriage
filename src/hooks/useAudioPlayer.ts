'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioOptions {
  src: string;
  volume?: number;
  /** Seconds spent easing the volume in and out — an abrupt cut feels cheap. */
  fadeDuration?: number;
}

/**
 * Ambient background audio with a manual volume fade.
 * Silently no-ops when the file is missing or autoplay is refused, so a guest
 * never sees an error over their invitation.
 */
export function useAudioPlayer({ src, volume = 0.35, fadeDuration = 2 }: AudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
    audioRef.current = audio;

    const handleError = () => setIsAvailable(false);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, [src]);

  const fadeTo = useCallback(
    (target: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

      const from = audio.volume;
      const start = performance.now();
      const duration = fadeDuration * 1000;

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * progress));

        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
          onDone?.();
        }
      };

      fadeRef.current = requestAnimationFrame(step);
    },
    [fadeDuration],
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    try {
      await audio.play();
      setIsPlaying(true);
      fadeTo(volume);
    } catch {
      // Autoplay policy blocked it — the toggle stays available for a real click.
      setIsPlaying(false);
    }
  }, [fadeTo, isAvailable, volume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    fadeTo(0, () => audio.pause());
    setIsPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else void play();
  }, [isPlaying, pause, play]);

  // Pause while the tab is hidden; resume only if the guest had it on.
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !isPlaying) return;
      if (document.hidden) audio.pause();
      else void audio.play().catch(() => undefined);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isPlaying]);

  return { isPlaying, isAvailable, play, pause, toggle };
}
