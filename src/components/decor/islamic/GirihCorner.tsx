'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { polygonPath, starPath } from './geometry';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface GirihCornerProps {
  corner: Corner;
  className?: string;
  size?: number;
  delay?: number;
  opacity?: number;
}

const PLACEMENT: Record<Corner, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0 -scale-x-100',
  'bottom-left': 'bottom-0 left-0 -scale-y-100',
  'bottom-right': 'bottom-0 right-0 -scale-100',
};

const trace = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      opacity: { duration: 0.7, delay: i * 0.1 },
    },
  }),
};

const pop = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.5 + i * 0.09, ease: [0.34, 1.26, 0.64, 1] as [number, number, number, number] },
  }),
};

/**
 * A girih corner ornament: an interlaced band running along both edges, with
 * khatam stars set into it. Replaces the earlier freehand botanical sprig,
 * which read as a smudge at low opacity and had nothing to do with the
 * architecture the rest of the invitation is built from.
 */
export function GirihCorner({
  corner,
  className,
  size = 260,
  delay = 0,
  opacity = 0.5,
}: GirihCornerProps) {
  const stars: ReadonlyArray<readonly [number, number, number]> = [
    [34, 34, 21],
    [92, 30, 13],
    [30, 92, 13],
    [136, 26, 8],
    [26, 136, 8],
  ];

  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute select-none', PLACEMENT[corner], className)}
      style={{ width: size, height: size, opacity }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.4, delay }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        className="h-full w-full text-gold"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Double band tracing the corner */}
        <motion.path
          d="M0 66 L66 66 L66 0"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
          variants={trace}
          custom={0}
        />
        <motion.path
          d="M0 78 L78 78 L78 0"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.42"
          variants={trace}
          custom={0.6}
        />
        {/* Diagonal tie */}
        <motion.path
          d="M66 66 L118 14 M66 66 L14 118"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.34"
          variants={trace}
          custom={1.2}
        />
        {/* Long tapering rails */}
        <motion.path
          d="M0 174 L174 0"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          variants={trace}
          custom={1.8}
        />

        {/* Khatam stars set into the band */}
        {stars.map(([cx, cy, r], index) => (
          <motion.g key={`${cx}-${cy}`} variants={pop} custom={index}>
            <path
              d={polygonPath(cx, cy, r * 1.3, 8, 22.5)}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            <path
              d={starPath(cx, cy, r, r * 0.5)}
              fill="currentColor"
              fillOpacity="0.16"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeOpacity="0.75"
              strokeLinejoin="round"
            />
            <path
              d={starPath(cx, cy, r * 0.42, r * 0.2, 8, 22.5)}
              fill="currentColor"
              fillOpacity="0.5"
            />
          </motion.g>
        ))}
      </motion.svg>
    </motion.div>
  );
}
