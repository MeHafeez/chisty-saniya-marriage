'use client';

import { motion } from 'framer-motion';
import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin } from 'react-icons/hi2';

import { EASE } from '@/constants/motion';
import type { WeddingEvent } from '@/types';

export interface EventCardProps {
  event: WeddingEvent;
  index: number;
}

const card = {
  hidden: { opacity: 0, y: 70, rotateX: -8, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: EASE.luxe },
  },
};

const DETAIL_ICONS = [HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin] as const;

/** One ceremony, as a card that lifts and warms toward its own accent colour. */
export function EventCard({ event, index }: EventCardProps) {
  const Icon = event.icon;

  const details = [
    { label: 'Date', value: `${event.day}, ${event.date}` },
    { label: 'Time', value: event.time },
    { label: 'Venue', value: event.venue, sub: event.address },
  ];

  return (
    <motion.article
      variants={card}
      className="group relative flex h-full flex-col overflow-hidden border border-line bg-ivory/60 p-8 backdrop-blur-sm rounded-[var(--radius-card)] transition-[border-color,transform,box-shadow] duration-700 ease-[var(--ease-luxe)] hover:-translate-y-2 hover:border-gold/50 hover:shadow-[var(--shadow-float)] sm:p-10"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Accent wash that blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-0 blur-3xl transition-opacity duration-[900ms] group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${event.accent}66, transparent 70%)` }}
      />

      {/* Ordinal */}
      <span
        aria-hidden
        className="absolute right-6 top-5 font-display text-5xl font-light leading-none text-gold/15 transition-colors duration-700 group-hover:text-gold/30"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-champagne/60 transition-all duration-700 group-hover:border-gold/60 group-hover:bg-champagne">
        <Icon
          aria-hidden
          className="text-2xl transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:rotate-12 group-hover:scale-110"
          style={{ color: event.accent }}
        />
      </span>

      <h3 className="relative mt-7 font-display text-[length:var(--text-h3)] font-light leading-none text-ink">
        {event.name}
      </h3>
      <p className="relative mt-2 font-script text-2xl text-gold">{event.tagline}</p>

      <span className="relative mt-6 block h-px w-14 bg-gold/50 transition-all duration-700 group-hover:w-24" />

      <p className="relative mt-6 text-pretty font-serif text-[0.9375rem] font-light leading-[1.85] text-muted">
        {event.description}
      </p>

      <dl className="relative mt-8 flex flex-col gap-4 border-t border-line pt-7">
        {details.map((detail, detailIndex) => {
          const DetailIcon = DETAIL_ICONS[detailIndex] ?? HiOutlineMapPin;

          return (
            <div key={detail.label} className="flex items-start gap-3.5">
              <DetailIcon aria-hidden className="mt-1 shrink-0 text-base text-gold-deep" />
              <div className="min-w-0">
                <dt className="font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
                  {detail.label}
                </dt>
                <dd className="mt-1 font-serif text-[0.9375rem] font-light leading-snug text-ink">
                  {detail.value}
                  {detail.sub && (
                    <span className="mt-0.5 block font-sans text-xs text-muted">{detail.sub}</span>
                  )}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>

      <p className="relative mt-7 font-sans text-[0.5625rem] uppercase tracking-[0.28em] text-gold-deep">
        Dress code · {event.dressCode}
      </p>

      {/* Bottom rule that fills on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${event.accent}, transparent)` }}
      />
    </motion.article>
  );
}
