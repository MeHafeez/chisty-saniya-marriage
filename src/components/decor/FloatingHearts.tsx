'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { randomBetween } from '@/utils/math';
import { cn } from '@/utils/cn';

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

/**
 * Hearts drifting slowly upward behind the blessings.
 * Positions are generated once per mount and never re-randomised on re-render.
 */
export function FloatingHearts({ count = 14, className }: FloatingHeartsProps) {
  const reducedMotion = usePrefersReducedMotion();

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: randomBetween(2, 96),
        size: randomBetween(9, 22),
        duration: randomBetween(16, 30),
        delay: randomBetween(0, 14),
        sway: randomBetween(18, 54),
        opacity: randomBetween(0.12, 0.34),
      })),
    [count],
  );

  if (reducedMotion) return null;

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {hearts.map((heart) => (
        <motion.svg
          key={heart.id}
          width={heart.size}
          height={heart.size}
          viewBox="0 0 24 24"
          fill="none"
          className="absolute text-gold"
          style={{ left: `${heart.left}%`, bottom: -40, opacity: heart.opacity }}
          // Viewport units keep this SSR-safe — no `window` read during render.
          animate={{
            y: ['0vh', '-105vh'],
            x: [0, heart.sway, -heart.sway * 0.6, 0],
            rotate: [0, 12, -8, 0],
            opacity: [0, heart.opacity, heart.opacity, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <path
            d="M12 20.5s-7.5-4.7-7.5-9.7A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.6c0 5-7.5 9.7-7.5 9.7Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeWidth="0.7"
          />
        </motion.svg>
      ))}
    </div>
  );
}
