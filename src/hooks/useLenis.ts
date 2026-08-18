'use client';

import Lenis from 'lenis';
import { useEffect, useState } from 'react';

import { registerGsap, ScrollTrigger } from '@/animations/gsap';
import { usePrefersReducedMotion } from './useMediaQuery';

interface LenisOptions {
  /** Higher = more inertia. 0.085 gives the long, weighted glide luxury sites use. */
  lerp?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

/**
 * Owns the single Lenis instance and keeps GSAP ScrollTrigger in sync with it.
 * Returns the instance so callers can stop/start scroll (loader, cover, lightbox).
 */
export function useLenis({
  lerp = 0.085,
  wheelMultiplier = 1,
  touchMultiplier = 1.6,
}: LenisOptions = {}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const gsap = registerGsap();
    const instance = new Lenis({
      lerp,
      wheelMultiplier,
      touchMultiplier,
      smoothWheel: true,
      autoResize: true,
    });

    // Drive Lenis from GSAP's ticker so both timelines share one clock.
    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    instance.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    setLenis(instance);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, [lerp, wheelMultiplier, touchMultiplier, reducedMotion]);

  return lenis;
}
