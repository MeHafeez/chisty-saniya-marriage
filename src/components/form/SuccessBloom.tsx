'use client';

import { motion } from 'framer-motion';

import { EASE } from '@/constants/motion';
import { cn } from '@/utils/cn';

interface SuccessBloomProps {
  size?: number;
  className?: string;
}

const PETALS = 8;

/**
 * A flower that opens petal by petal, then draws a tick at its centre.
 * Used for the RSVP confirmation and reused by the closing section.
 */
export function SuccessBloom({ size = 128, className }: SuccessBloomProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={cn('text-gold', className)}
      aria-hidden
      initial="hidden"
      animate="visible"
    >
      {/* Expanding halo */}
      <motion.circle
        cx="60"
        cy="60"
        r="52"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.4"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.15, 1], opacity: [0, 0.7, 0.35] }}
        transition={{ duration: 2, ease: EASE.luxe }}
        style={{ transformOrigin: '60px 60px' }}
      />

      {/* Outer petals */}
      {Array.from({ length: PETALS }).map((_, index) => (
        <motion.ellipse
          key={`outer-${index}`}
          cx="60"
          cy="34"
          rx="9"
          ry="24"
          fill="currentColor"
          fillOpacity="0.22"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.1,
            delay: 0.15 + index * 0.075,
            ease: [0.34, 1.26, 0.64, 1],
          }}
          style={{
            transformOrigin: '60px 60px',
            rotate: `${(360 / PETALS) * index}deg`,
          }}
        />
      ))}

      {/* Inner petals, offset */}
      {Array.from({ length: PETALS }).map((_, index) => (
        <motion.ellipse
          key={`inner-${index}`}
          cx="60"
          cy="44"
          rx="6"
          ry="15"
          fill="currentColor"
          fillOpacity="0.35"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.75 + index * 0.055,
            ease: [0.34, 1.26, 0.64, 1],
          }}
          style={{
            transformOrigin: '60px 60px',
            rotate: `${(360 / PETALS) * index + 360 / (PETALS * 2)}deg`,
          }}
        />
      ))}

      {/* Centre */}
      <motion.circle
        cx="60"
        cy="60"
        r="13"
        fill="var(--color-ivory)"
        stroke="currentColor"
        strokeWidth="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 1.35, ease: [0.34, 1.26, 0.64, 1] }}
        style={{ transformOrigin: '60px 60px' }}
      />

      {/* Tick */}
      <motion.path
        d="M53.5 60.5 58.5 65.5 67 55"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.75, delay: 1.75, ease: EASE.luxe }}
      />
    </motion.svg>
  );
}
