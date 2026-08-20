'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { CountdownNumerals } from '@/components/royal/CountdownNumerals';
import { GoldParticles } from '@/components/royal/GoldParticles';
import { ScratchReveal } from '@/components/royal/ScratchReveal';
import { FloralAccent, OrnamentalLine, RoyalCorner } from '@/components/royal/RoyalOrnaments';
import { GirihCorner } from '@/components/decor/islamic/GirihCorner';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EVENTS, WEDDING } from '@/constants/wedding';
import { EASE } from '@/constants/motion';
import { useCountdown } from '@/hooks/useCountdown';
import { formatLongDate, splitDate } from '@/utils/format';

/**
 * Section 06 — how long until the Valima.
 *
 * The countdown logic and target date are untouched (`useCountdown(WEDDING.date)`);
 * only the presentation changed — engraved numerals on a deep royal ground
 * instead of a row of ringed cards.
 */
export function Countdown() {
  const { timeLeft, isReady, hasPassed } = useCountdown(WEDDING.date);
  const [dateRevealed, setDateRevealed] = useState(false);
  const scratchDate = splitDate(WEDDING.date);

  const units = [
    { label: 'Days', value: timeLeft.days, digits: 3 },
    { label: 'Hours', value: timeLeft.hours, digits: 2 },
    { label: 'Minutes', value: timeLeft.minutes, digits: 2 },
    { label: 'Seconds', value: timeLeft.seconds, digits: 2 },
  ];

  const valima = EVENTS[EVENTS.length - 1];

  return (
    <Section id="countdown" tone="night" label="Countdown to the wedding" className="overflow-hidden">
      <GirihCorner corner="top-left" size={260} opacity={0.22} />
      <GirihCorner corner="bottom-right" size={260} opacity={0.22} />
      <GoldParticles count={34} intensity={0.75} opacity={0.7} />

      <SectionHeading
        eyebrow={formatLongDate(WEDDING.date)}
        script="Counting down to"
        title={hasPassed ? 'Forever Begins' : 'Forever'}
        description={
          hasPassed
            ? 'The vows are spoken and the celebration has begun. Thank you for being part of it.'
            : undefined
        }
      />

      {/* ——— The numerals, inside their own ornamental plate ——— */}
      <motion.div
        className="relative mx-auto mt-14 w-full max-w-4xl px-[clamp(1rem,4vw,3rem)] py-[clamp(2rem,5vw,3.5rem)] sm:mt-18"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.5, ease: EASE.luxe }}
      >
        {/* Soft light behind the figures */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(70% 80% at 50% 45%, rgba(201,164,92,0.16) 0%, rgba(201,164,92,0) 72%)',
          }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 border border-gold/20" />
        <RoyalCorner corner="top-left" size={92} opacity={0.55} className="left-0 top-0" />
        <RoyalCorner corner="top-right" size={92} opacity={0.55} className="right-0 top-0" />
        <RoyalCorner corner="bottom-left" size={92} opacity={0.55} className="bottom-0 left-0" />
        <RoyalCorner corner="bottom-right" size={92} opacity={0.55} className="bottom-0 right-0" />

        <CountdownNumerals units={units} isReady={isReady} />
      </motion.div>

      {/* ——— Scratch to reveal — shows the existing date, nothing invented ——— */}
      <motion.div
        className="mx-auto mt-16 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.3, ease: EASE.luxe }}
      >
        <p className="mb-5 text-center font-sans text-[0.5625rem] uppercase tracking-[0.34em] text-gold-deep">
          A little something to uncover
        </p>
      </motion.div>

      <motion.div
        className="mt-14 flex flex-col items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.15 }}
      >
        <OrnamentalLine width={240} />
        <p className="mt-7 text-center font-script text-3xl text-gold sm:text-4xl">
          {WEDDING.hashtag}
        </p>
      </motion.div>

      {/* Gold puff the moment the foil clears */}
      {dateRevealed && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <GoldParticles count={26} intensity={1.3} opacity={0.95} />
        </div>
      )}
    </Section>
  );
}
