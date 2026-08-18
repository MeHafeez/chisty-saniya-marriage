'use client';

import { motion } from 'framer-motion';

import { EASE } from '@/constants/motion';
import { cn } from '@/utils/cn';

export interface MapCardProps {
  label: string;
  className?: string;
}

/**
 * An illustrated map in the invitation's own palette — no third-party embed,
 * no external request, no Google chrome breaking the art direction.
 * The real map lives one click away behind the buttons beside it.
 */
export function MapCard({ label, className }: MapCardProps) {
  return (
    <motion.div
      className={cn(
        'group relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-tile)] border border-gold/20 bg-champagne shadow-[var(--shadow-lift)] transition-shadow duration-700 hover:shadow-[var(--shadow-float)]',
        className,
      )}
      initial={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.8, ease: EASE.luxe }}
    >
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        role="img"
        aria-label={`Stylised map showing the location of ${label}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill="var(--color-champagne)" />

        {/* Water */}
        <path
          d="M0 232c46 6 78-14 122-12 42 2 66 26 110 24 40-2 62-22 96-18 30 4 52 18 72 14v60H0Z"
          fill="var(--color-gold)"
          fillOpacity="0.09"
        />
        <path
          d="M0 232c46 6 78-14 122-12 42 2 66 26 110 24 40-2 62-22 96-18 30 4 52 18 72 14"
          stroke="var(--color-gold)"
          strokeOpacity="0.3"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Parkland */}
        <circle cx="72" cy="76" r="42" fill="var(--color-gold)" fillOpacity="0.08" />
        <circle cx="330" cy="112" r="34" fill="var(--color-gold)" fillOpacity="0.07" />

        {/* Minor grid */}
        <g stroke="var(--color-line)" strokeWidth="0.7">
          {[40, 84, 128, 172, 216, 260, 304, 348].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x - 18} y2="300" />
          ))}
          {[38, 84, 130, 176, 222, 268].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y + 10} />
          ))}
        </g>

        {/* Arterial roads */}
        <g stroke="var(--color-gold)" strokeOpacity="0.45" strokeWidth="2.4" fill="none" strokeLinecap="round">
          <path d="M-10 120 Q 130 96 200 150 T 410 128" />
          <path d="M186 -10 Q 208 90 200 150 T 236 310" />
        </g>
        <g stroke="var(--color-ivory)" strokeWidth="0.8" strokeDasharray="5 7" fill="none">
          <path d="M-10 120 Q 130 96 200 150 T 410 128" />
          <path d="M186 -10 Q 208 90 200 150 T 236 310" />
        </g>

        {/* Blocks */}
        <g fill="var(--color-ink)" fillOpacity="0.05">
          <rect x="46" y="152" width="52" height="34" />
          <rect x="112" y="180" width="40" height="46" />
          <rect x="248" y="52" width="46" height="30" />
          <rect x="298" y="188" width="56" height="38" />
          <rect x="126" y="40" width="34" height="26" />
        </g>

        {/* Destination halo */}
        <circle cx="200" cy="150" r="46" fill="var(--color-gold)" fillOpacity="0.1" />
      </svg>

      {/* Animated pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        {/* Pulses */}
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            aria-hidden
            className="absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
            animate={{ scale: [1, 3.6], opacity: [0.55, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: ring * 1.05 }}
          />
        ))}

        <motion.svg
          width="34"
          height="46"
          viewBox="0 0 34 46"
          fill="none"
          aria-hidden
          initial={{ y: -70, opacity: 0, scale: 0.6 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.34, 1.26, 0.64, 1] }}
          className="relative drop-shadow-[0_6px_10px_rgba(58,46,42,0.28)]"
        >
          <path
            d="M17 1C8.7 1 2 7.7 2 16c0 10.9 13 26.6 14.1 27.9a1.2 1.2 0 0 0 1.8 0C19 42.6 32 26.9 32 16 32 7.7 25.3 1 17 1Z"
            fill="var(--color-ink)"
            stroke="var(--color-gold)"
            strokeWidth="1.2"
          />
          <circle cx="17" cy="16" r="5.4" fill="var(--color-gold)" />
        </motion.svg>
      </div>

      {/* Label plate */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 flex items-center gap-3 border border-gold/25 bg-ivory/85 px-4 py-3 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 1, ease: EASE.luxe }}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
        <span className="truncate font-sans text-[0.625rem] uppercase tracking-[0.28em] text-ink">
          {label}
        </span>
      </motion.div>

      {/* Grain over the whole plate */}
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />
    </motion.div>
  );
}
