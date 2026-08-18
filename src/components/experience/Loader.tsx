'use client';

import { motion } from 'framer-motion';

import { IslamicMonogram } from '@/components/decor/islamic/IslamicMonogram';
import { COUPLE, WEDDING } from '@/constants/wedding';
import { EASE, SEQUENCE } from '@/constants/motion';
import { formatLongDate } from '@/utils/format';

interface LoaderProps {
  progress: number;
}

const panel = {
  initial: { y: '0%' },
  exit: (direction: -1 | 1) => ({
    y: `${direction * 101}%`,
    transition: { duration: SEQUENCE.loaderExit, ease: EASE.drama, delay: 0.45 },
  }),
};

const content = {
  initial: { opacity: 1 },
  exit: { opacity: 0, filter: 'blur(12px)', y: -24, transition: { duration: 0.55, ease: EASE.soft } },
};

/**
 * Act I. Two ivory panels holding a self-drawing monogram and a hairline
 * progress rule; on exit the content dissolves and the panels part like curtains.
 */
export function Loader({ progress }: LoaderProps) {
  const percent = Math.round(progress * 100);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      initial="initial"
      exit="exit"
      role="status"
      aria-live="polite"
      aria-label={`Loading invitation, ${percent} percent`}
    >
      {/* Parting curtains */}
      <motion.div
        variants={panel}
        custom={-1}
        className="paper-grain absolute inset-x-0 top-0 h-1/2 bg-ivory"
      />
      <motion.div
        variants={panel}
        custom={1}
        className="paper-grain absolute inset-x-0 bottom-0 h-1/2 bg-ivory"
      />

      {/* Hairline where the curtains meet */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px origin-center bg-gold/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.4, ease: EASE.luxe }}
      />

      <motion.div
        variants={content}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        <IslamicMonogram size={148} delay={0.3} />

        <motion.p
          className="eyebrow mt-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: EASE.luxe }}
        >
          {COUPLE.bride.name} &nbsp;&&nbsp; {COUPLE.groom.name}
        </motion.p>

        <motion.p
          className="mt-3 font-serif text-xs font-light tracking-[0.2em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.8 }}
        >
          {formatLongDate(WEDDING.date)}
        </motion.p>

        {/* Progress rule */}
        <div className="mt-12 flex w-[min(18rem,70vw)] flex-col items-center gap-3">
          <div className="relative h-px w-full overflow-hidden bg-line">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
              style={{ width: `${percent}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <span className="font-sans text-[0.625rem] tabular-nums tracking-[0.4em] text-muted">
            {percent.toString().padStart(3, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
