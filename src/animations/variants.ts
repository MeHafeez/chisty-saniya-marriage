import type { Variants } from 'framer-motion';

import { DURATION, EASE, STAGGER } from '@/constants/motion';

/**
 * Shared Framer Motion variants.
 * House rule: nothing appears instantly, nothing appears without a filter change.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.slow, ease: EASE.luxe },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.cinematic, ease: EASE.soft },
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 1.12, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.epic, ease: EASE.luxe },
  },
};

/** Curtain-style mask: the child slides up out of an overflow-hidden line. */
export const maskLine: Variants = {
  hidden: { y: '115%', rotate: 3, opacity: 0 },
  visible: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { duration: DURATION.cinematic, ease: EASE.luxe },
  },
};

export const drawLine: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DURATION.cinematic, ease: EASE.drama },
  },
};

export const drawStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2.4, ease: EASE.soft },
      opacity: { duration: 0.4 },
    },
  },
};

export const bloom: Variants = {
  hidden: { scale: 0.4, opacity: 0, rotate: -14 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: DURATION.epic, ease: EASE.overshoot },
  },
};

/** Parent orchestrators — pair with any child variant above. */
export const stagger = (delayChildren: number = 0, staggerChildren: number = STAGGER.base): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

export const staggerFast = stagger(0, STAGGER.tight);
export const staggerSlow = stagger(0.2, STAGGER.loose);
export const staggerLines = stagger(0.1, STAGGER.line);

/** Direction-aware slide, for alternating timeline rows. */
export const slideFrom = (
  direction: 'left' | 'right' | 'up' | 'down',
  distance = 64,
): Variants => {
  const isHorizontal = direction === 'left' || direction === 'right';
  const offset = (direction === 'left' || direction === 'up' ? -1 : 1) * distance;
  const transition = { duration: DURATION.slow, ease: EASE.luxe };

  return isHorizontal
    ? {
        hidden: { opacity: 0, x: offset, filter: 'blur(8px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition },
      }
    : {
        hidden: { opacity: 0, y: offset, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition },
      };
};

/** Letter-by-letter reveal for display type. */
export const letterReveal: Variants = {
  hidden: { opacity: 0, y: '0.4em', rotateX: -55, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.slow, ease: EASE.luxe },
  },
};

/** Full-screen overlays (loader, cover, lightbox). */
export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: DURATION.slow, ease: EASE.drama } },
};
