'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { EASE } from '@/constants/motion';
import { pad } from '@/utils/format';
import { clamp } from '@/utils/math';

export interface CountdownUnitProps {
  value: number;
  label: string;
  /** Denominator for the ring arc — 60 for seconds, 24 for hours, and so on. */
  max: number;
  index: number;
  isReady: boolean;
}

const SIZE = 148;
const STROKE = 1.5;
const RADIUS = SIZE / 2 - STROKE * 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** One unit of the countdown: a scrubbing gold ring around rolling digits. */
export function CountdownUnit({ value, label, max, index, isReady }: CountdownUnitProps) {
  const fraction = clamp(value / max, 0, 1);
  const display = pad(value, label === 'Days' ? 3 : 2);

  return (
    <motion.div
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.3, delay: index * 0.12, ease: EASE.luxe }}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Rings */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS + 7}
            fill="none"
            stroke="var(--color-gold)"
            strokeOpacity="0.18"
            strokeWidth="0.6"
            strokeDasharray="2 6"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#countdown-gold)"
            strokeWidth={STROKE * 1.6}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - (isReady ? fraction : 0)) }}
            transition={{ duration: 0.9, ease: EASE.luxe }}
          />
          <defs>
            <linearGradient id="countdown-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-gold-deep)" />
              <stop offset="50%" stopColor="var(--color-gold)" />
              <stop offset="100%" stopColor="var(--color-gold-soft)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Slow orbiting dot */}
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[calc(100%-1rem)] w-px -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 26 + index * 5, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-gold/60" />
        </motion.span>

        {/* Digits */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              className="font-display text-[2.75rem] font-light leading-none tabular-nums text-ink sm:text-[3.25rem]"
              initial={{ y: '55%', opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-55%', opacity: 0, filter: 'blur(6px)', position: 'absolute' }}
              transition={{ duration: 0.7, ease: EASE.luxe }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <span className="mt-5 font-sans text-[0.5625rem] uppercase tracking-[0.42em] text-muted transition-colors duration-500 group-hover:text-gold-deep">
        {label}
      </span>
    </motion.div>
  );
}
