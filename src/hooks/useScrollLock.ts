'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

/**
 * Freezes the page while an overlay is open.
 * Stops Lenis (so wheel events are swallowed) *and* sets a body flag that the
 * stylesheet uses — covering the reduced-motion case where Lenis never runs.
 */
export function useScrollLock(locked: boolean, lenis?: Lenis | null): void {
  useEffect(() => {
    const { body } = document;

    if (locked) {
      body.dataset.locked = 'true';
      lenis?.stop();
    } else {
      delete body.dataset.locked;
      lenis?.start();
    }

    return () => {
      delete body.dataset.locked;
      lenis?.start();
    };
  }, [locked, lenis]);
}
