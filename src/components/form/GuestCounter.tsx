'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineMinusSmall, HiOutlinePlusSmall } from 'react-icons/hi2';

import { EASE } from '@/constants/motion';
import { MAX_GUESTS } from '@/utils/validation';
import { clamp } from '@/utils/math';
import { cn } from '@/utils/cn';

interface GuestCounterProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  className?: string;
}

/** A stepper instead of a number input — no spinners, no keyboard traps. */
export function GuestCounter({ value, onChange, error, className }: GuestCounterProps) {
  const step = (delta: number) => onChange(clamp(value + delta, 1, MAX_GUESTS));

  const buttonClasses =
    'flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 hover:border-gold hover:text-gold-deep disabled:pointer-events-none disabled:opacity-30';

  return (
    <div className={cn('flex flex-col', className)}>
      <span className="mb-2 font-sans text-[0.5625rem] uppercase tracking-[0.32em] text-muted">
        Number of Guests <span className="ml-1 text-gold">*</span>
      </span>

      <div
        className="flex items-center gap-5 border-b border-line pb-2"
        role="group"
        aria-label="Number of guests"
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={value <= 1}
          className={buttonClasses}
          aria-label="One fewer guest"
        >
          <HiOutlineMinusSmall aria-hidden className="text-lg" />
        </button>

        <div className="relative h-12 min-w-[3.5rem] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              className="absolute inset-0 flex items-center justify-center font-display text-4xl font-light tabular-nums text-ink"
              initial={{ y: 26, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -26, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: EASE.luxe }}
              aria-live="polite"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={value >= MAX_GUESTS}
          className={buttonClasses}
          aria-label="One more guest"
        >
          <HiOutlinePlusSmall aria-hidden className="text-lg" />
        </button>

        <span className="ml-auto font-sans text-[0.625rem] uppercase tracking-[0.24em] text-muted/70">
          {value === 1 ? 'Just me' : `${value} seats`}
        </span>
      </div>

      <div className="min-h-[1.5rem] pt-2">
        {error && (
          <motion.p
            role="alert"
            className="font-sans text-[0.6875rem] text-[#b4553f]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
