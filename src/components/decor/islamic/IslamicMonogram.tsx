'use client';

import { motion } from 'framer-motion';

import { COUPLE_ORDER } from '@/constants/wedding';
import { EASE } from '@/constants/motion';
import { cn } from '@/utils/cn';
import { polygonPath, starPath } from './geometry';

export interface IslamicMonogramProps {
  size?: number;
  className?: string;
  /** Traces every stroke on mount. */
  animate?: boolean;
  delay?: number;
  /** Adds a very slow counter-rotation to the outer rings. */
  rotating?: boolean;
}

const trace = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2.3, delay, ease: EASE.luxe },
      opacity: { duration: 0.5, delay },
    },
  }),
};

/**
 * The couple's initials set inside a khatam (eight-pointed star) within nested
 * octagons — the geometry that recurs across the whole invitation, drawn
 * stroke by stroke.
 */
export function IslamicMonogram({
  size = 130,
  className,
  animate = true,
  delay = 0,
  rotating = true,
}: IslamicMonogramProps) {
  const state = animate ? { initial: 'hidden' as const, animate: 'visible' as const } : {};

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      className={cn('text-gold', className)}
      role="img"
      aria-label={`Monogram of ${COUPLE_ORDER[0].name} and ${COUPLE_ORDER[1].name}`}
      {...state}
    >
      {/* Outer rings — counter-rotating at glacial speed */}
      <motion.g
        animate={rotating ? { rotate: 360 } : undefined}
        transition={rotating ? { duration: 190, repeat: Infinity, ease: 'linear' } : undefined}
        style={{ transformOrigin: '70px 70px' }}
      >
        <motion.path
          d={polygonPath(70, 70, 66, 8, 22.5)}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinejoin="round"
          variants={trace}
          custom={delay}
        />
        <motion.path
          d={polygonPath(70, 70, 60, 8, 0)}
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.55"
          strokeLinejoin="round"
          variants={trace}
          custom={delay + 0.12}
        />
      </motion.g>

      <motion.g
        animate={rotating ? { rotate: -360 } : undefined}
        transition={rotating ? { duration: 260, repeat: Infinity, ease: 'linear' } : undefined}
        style={{ transformOrigin: '70px 70px' }}
      >
        {/* The khatam itself */}
        <motion.path
          d={starPath(70, 70, 54, 27)}
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinejoin="round"
          variants={trace}
          custom={delay + 0.28}
        />
        <motion.path
          d={starPath(70, 70, 44, 22, 8, 22.5)}
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.6"
          strokeLinejoin="round"
          variants={trace}
          custom={delay + 0.5}
        />
      </motion.g>

      {/* Petal fill, blooming outward once the lines exist */}
      <motion.path
        d={starPath(70, 70, 54, 27)}
        fill="currentColor"
        fillOpacity="0.09"
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={animate ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.5, delay: delay + 1.1, ease: [0.34, 1.26, 0.64, 1] }}
        style={{ transformOrigin: '70px 70px' }}
      />

      {/* Inner medallion */}
      <motion.circle
        cx="70"
        cy="70"
        r="25"
        fill="var(--color-ivory)"
        stroke="currentColor"
        strokeWidth="0.7"
        initial={animate ? { scale: 0 } : false}
        animate={animate ? { scale: 1 } : undefined}
        transition={{ duration: 1, delay: delay + 1.35, ease: [0.34, 1.26, 0.64, 1] }}
        style={{ transformOrigin: '70px 70px' }}
      />

      {/* Initials */}
      <motion.text
        x="58"
        y="78"
        textAnchor="middle"
        className="fill-current font-display"
        style={{ fontSize: 26, fontWeight: 300 }}
        initial={animate ? { opacity: 0, y: 6 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.1, delay: delay + 1.6, ease: EASE.luxe }}
      >
        {COUPLE_ORDER[0].initial}
      </motion.text>

      <motion.path
        d="M70 56 L70 84"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        variants={trace}
        custom={delay + 1.7}
      />

      <motion.text
        x="82"
        y="78"
        textAnchor="middle"
        className="fill-current font-display"
        style={{ fontSize: 26, fontWeight: 300 }}
        initial={animate ? { opacity: 0, y: 6 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.1, delay: delay + 1.75, ease: EASE.luxe }}
      >
        {COUPLE_ORDER[1].initial}
      </motion.text>
    </motion.svg>
  );
}
