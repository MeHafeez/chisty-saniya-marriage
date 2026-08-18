'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring, type SpringOptions } from 'framer-motion';

/**
 * Tracks the pointer as spring-smoothed motion values.
 * Values are viewport pixels; pass `normalize` to get -1…1 instead, which is
 * what the parallax layers want.
 */
export function useMousePosition(options?: {
  spring?: SpringOptions;
  normalize?: boolean;
  enabled?: boolean;
}) {
  const { spring = { stiffness: 120, damping: 22, mass: 0.7 }, normalize = false, enabled = true } =
    options ?? {};

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent) => {
      if (normalize) {
        rawX.set((event.clientX / window.innerWidth) * 2 - 1);
        rawY.set((event.clientY / window.innerHeight) * 2 - 1);
      } else {
        rawX.set(event.clientX);
        rawY.set(event.clientY);
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [enabled, normalize, rawX, rawY]);

  return { x, y, rawX, rawY };
}
