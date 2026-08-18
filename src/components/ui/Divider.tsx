'use client';

import { motion } from 'framer-motion';

import { VIEWPORT } from '@/constants/motion';
import { cn } from '@/utils/cn';

export interface DividerProps {
  className?: string;
  /** `bloom` centres a diamond, `leaf` draws a botanical sprig, `rule` is a plain hairline. */
  variant?: 'bloom' | 'leaf' | 'rule';
  width?: number;
}

const line = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const centre = {
  hidden: { scale: 0, rotate: -90, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { duration: 1.1, delay: 0.5, ease: [0.34, 1.26, 0.64, 1] as [number, number, number, number] },
  },
};

/** The gold rule that separates every movement of the invitation. */
export function Divider({ className, variant = 'bloom', width = 220 }: DividerProps) {
  return (
    <motion.div
      className={cn('flex items-center justify-center gap-3 sm:gap-4', className)}
      style={{ maxWidth: width }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8, margin: VIEWPORT.margin }}
      aria-hidden
    >
      <motion.span
        variants={line}
        className="h-px flex-1 origin-right bg-gradient-to-l from-gold/70 to-transparent"
      />

      {variant === 'rule' ? null : (
        <motion.span variants={centre} className="shrink-0 text-gold">
          {variant === 'bloom' ? <BloomMark /> : <LeafMark />}
        </motion.span>
      )}

      <motion.span
        variants={line}
        className="h-px flex-1 origin-left bg-gradient-to-r from-gold/70 to-transparent"
      />
    </motion.div>
  );
}

function BloomMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 1.5c1.6 4.6 5.9 8.9 10.5 11.5-4.6 2.6-8.9 6.9-10.5 11.5C11.4 19.9 7.1 15.6 2.5 13 7.1 10.4 11.4 6.1 13 1.5Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <circle cx="13" cy="13" r="1.6" fill="var(--color-ivory)" />
    </svg>
  );
}

function LeafMark() {
  return (
    <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
      <path
        d="M17 3c-3.4 0-6.5 2.6-6.5 7 0 4.4 3.1 7 6.5 7s6.5-2.6 6.5-7c0-4.4-3.1-7-6.5-7Z"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path d="M17 3v14M11 10h12" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.65" />
      <circle cx="3" cy="10" r="1.4" fill="currentColor" />
      <circle cx="31" cy="10" r="1.4" fill="currentColor" />
    </svg>
  );
}
