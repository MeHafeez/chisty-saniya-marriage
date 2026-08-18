'use client';

import { useRef } from 'react';
import { useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Scroll-linked parallax for an element.
 * `distance` is how far (in px) the layer drifts across its full pass through
 * the viewport; negative values move it against the scroll.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(distance = 80) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const travel = reducedMotion ? 0 : distance;
  const y: MotionValue<number> = useTransform(smooth, [0, 1], [travel, -travel]);

  return { ref, y, progress: smooth };
}
