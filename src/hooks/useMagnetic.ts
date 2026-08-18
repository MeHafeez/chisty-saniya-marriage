'use client';

import { useCallback, useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

import { useHasFinePointer, usePrefersReducedMotion } from './useMediaQuery';

interface MagneticResult {
  ref: React.RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseMove: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  isEnabled: boolean;
}

/**
 * Pulls an element toward the cursor while it is hovered.
 * `strength` is the fraction of the cursor's offset the element travels.
 */
export function useMagnetic(strength = 0.35): MagneticResult {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  const finePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const isEnabled = finePointer && !reducedMotion;

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!isEnabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [isEnabled, rawX, rawY, strength],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, onMouseMove, onMouseLeave, isEnabled };
}
