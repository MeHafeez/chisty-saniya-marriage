'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type Lenis from 'lenis';

import { AUDIO_TRACK } from '@/constants/site';
import { SEQUENCE } from '@/constants/motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useLenis } from '@/hooks/useLenis';
import { useScrollLock } from '@/hooks/useScrollLock';
import { clamp } from '@/utils/math';

/** The invitation opens in three acts. */
export type Phase = 'loading' | 'cover' | 'revealed';

interface ExperienceValue {
  phase: Phase;
  /** 0–1 loader progress, driven by real font/asset readiness plus a floor duration. */
  progress: number;
  isRevealed: boolean;
  /**
   * Called synchronously from the "Open Invitation" click, before the portal
   * sequence runs. Autoplay policies only honour `play()` inside the gesture
   * itself, so the music cannot wait for the doors to finish.
   */
  beginOpening: () => void;
  /** Called once the camera has passed through the archway. */
  openInvitation: () => void;
  scrollTo: (target: string) => void;
  lenis: Lenis | null;
  audio: {
    isPlaying: boolean;
    isAvailable: boolean;
    toggle: () => void;
  };
}

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState(0);

  const lenis = useLenis();
  const audio = useAudioPlayer({ src: AUDIO_TRACK.src, volume: AUDIO_TRACK.volume });

  // Scroll stays frozen until the guest actually opens the invitation.
  useScrollLock(phase !== 'revealed', lenis);

  /* — Act I: the loader ————————————————————————————— */
  useEffect(() => {
    // `?preview=1` jumps straight to the invitation — handy for reviewing copy
    // without sitting through the entrance every time.
    if (new URLSearchParams(window.location.search).get('preview') === '1') {
      setProgress(1);
      setPhase('revealed');
      return;
    }

    let frame = 0;
    let assetsReady = false;
    const start = performance.now();
    const floor = SEQUENCE.loaderMinimum * 1000;

    const markReady = () => {
      assetsReady = true;
    };

    // Real readiness signals, with a timeout so a slow font never traps a guest.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, floor))]).then(markReady);

    const tick = (now: number) => {
      const elapsed = now - start;
      // Ease toward 92% on time alone; the last 8% waits for assets.
      const timed = clamp(elapsed / floor, 0, 1);
      const eased = 1 - Math.pow(1 - timed, 3);
      const target = assetsReady ? eased : Math.min(eased, 0.92);

      setProgress(target);

      if (target >= 1 && elapsed >= floor) {
        setPhase('cover');
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* — Act II → III: the portal ———————————————————————— */
  const beginOpening = useCallback(() => {
    void audio.play();
  }, [audio]);

  const openInvitation = useCallback(() => {
    setPhase('revealed');
    // `force` because Lenis is still stopped at this instant; the unlock effect
    // only runs after this render commits.
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [lenis]);

  const scrollTo = useCallback(
    (target: string) => {
      const element = document.querySelector(target);
      if (!element) return;

      if (lenis) lenis.scrollTo(element as HTMLElement, { offset: 0, duration: 1.8 });
      else element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [lenis],
  );

  const value = useMemo<ExperienceValue>(
    () => ({
      phase,
      progress,
      isRevealed: phase === 'revealed',
      beginOpening,
      openInvitation,
      scrollTo,
      lenis,
      audio: { isPlaying: audio.isPlaying, isAvailable: audio.isAvailable, toggle: audio.toggle },
    }),
    [
      phase,
      progress,
      beginOpening,
      openInvitation,
      scrollTo,
      lenis,
      audio.isPlaying,
      audio.isAvailable,
      audio.toggle,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience(): ExperienceValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within <ExperienceProvider>.');
  }
  return context;
}
