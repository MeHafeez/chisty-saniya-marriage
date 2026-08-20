'use client';

import { motion } from 'framer-motion';
import { HiOutlineArrowUpRight, HiOutlineMapPin, HiOutlineCalendarDays } from 'react-icons/hi2';

import { MapCard } from '@/components/cards/MapCard';
import { GoldParticles } from '@/components/royal/GoldParticles';
import { FloralAccent, OrnamentalLine, RoyalCorner } from '@/components/royal/RoyalOrnaments';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COUPLE_ORDER, EVENTS, VENUE, WEDDING } from '@/constants/wedding';
import { EASE, STAGGER, VIEWPORT } from '@/constants/motion';
import { splitDate } from '@/utils/format';

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(7px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.15, ease: EASE.luxe } },
};

function generateCalendarEvent() {
  const event = EVENTS[EVENTS.length - 1]; // Valima
  const startTime = WEDDING.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endTime = new Date(WEDDING.date.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
UID:wedding-${WEDDING.date.getTime()}@example.com
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:${WEDDING.occasion} - ${COUPLE_ORDER[0].fullName} & ${COUPLE_ORDER[1].fullName}
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LOCATION:${VENUE.name}\\, ${VENUE.addressLines.join(', ')}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${WEDDING.occasion}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icalContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${COUPLE_ORDER[0].name}-${COUPLE_ORDER[1].name}-valima.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Section 07 — the venue.
 *
 * `VENUE` is untouched, including both Google Maps URLs and the coordinates the
 * schema.org listing uses. The map is deliberately secondary: the invitation
 * information leads, the plate supports it.
 */
export function Venue() {
  const date = splitDate(WEDDING.date);
  const valima = EVENTS[EVENTS.length - 1];

  return (
    <Section id="venue" tone="night" label="Wedding venue" className="overflow-hidden">
      <GoldParticles count={24} intensity={0.55} opacity={0.55} />

      <SectionHeading eyebrow="Find Your Way" script="Come to" title="The Venue" />

      {/* ——— The royal location plate ——— */}
      <motion.div
        className="relative mx-auto mt-14 w-full max-w-5xl sm:mt-18"
        initial={{ opacity: 0, y: 42 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: VIEWPORT.margin }}
        transition={{ duration: 1.5, ease: EASE.luxe }}
      >
        <div aria-hidden className="absolute inset-0 border border-gold/30" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(70% 80% at 50% 30%, rgba(201,164,92,0.14) 0%, rgba(201,164,92,0) 74%)',
          }}
        />
        <RoyalCorner corner="top-left" size={104} opacity={0.6} className="left-0 top-0" />
        <RoyalCorner corner="top-right" size={104} opacity={0.6} className="right-0 top-0" />
        <RoyalCorner corner="bottom-left" size={104} opacity={0.6} className="bottom-0 left-0" />
        <RoyalCorner corner="bottom-right" size={104} opacity={0.6} className="bottom-0 right-0" />

        <div className="grid items-center gap-[clamp(2.25rem,5vw,4rem)] p-[clamp(1.75rem,5vw,3.5rem)] lg:grid-cols-[1.15fr_1fr]">
          {/* Information leads */}
          <motion.div
            variants={{ visible: { transition: { staggerChildren: STAGGER.base } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3, margin: VIEWPORT.margin }}
          >
            <motion.div variants={item}>
              <FloralAccent variant="sprig" size={58} className="opacity-85" />
            </motion.div>

            <motion.h3
              variants={item}
              className="mt-5 font-display text-[length:var(--text-h2)] font-light leading-[1.02] text-ink"
            >
              {VENUE.name}
            </motion.h3>

            <motion.address variants={item} className="mt-5 not-italic">
              {VENUE.addressLines.map((line) => (
                <span
                  key={line}
                  className="block font-serif text-[length:var(--text-lead)] font-light leading-relaxed text-muted"
                >
                  {line}
                </span>
              ))}
            </motion.address>

            <motion.div variants={item} className="mt-7">
              <OrnamentalLine width={240} className="opacity-85" />
            </motion.div>

            {/* Date and time of the ceremony held here */}
            <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="font-sans text-[0.5625rem] uppercase tracking-[0.32em] text-muted">Date</p>
                <p className="mt-1 font-serif text-[length:var(--text-lead)] font-light text-ink">
                  {date.weekday}, {date.day} {date.month} {date.year}
                </p>
              </div>
              {valima && (
                <>
                  <span className="hidden h-9 w-px bg-gold/35 sm:block" />
                  <div>
                    <p className="font-sans text-[0.5625rem] uppercase tracking-[0.32em] text-muted">Time</p>
                    <p className="mt-1 font-serif text-[length:var(--text-lead)] font-light text-ink">
                      {valima.time}
                    </p>
                  </div>
                </>
              )}
            </motion.div>

            <motion.p
              variants={item}
              className="mt-7 flex max-w-md items-start gap-3 text-pretty font-serif text-[0.9375rem] font-light leading-[1.9] text-muted"
            >
              <HiOutlineMapPin aria-hidden className="mt-1.5 shrink-0 text-base text-gold-deep" />
              {VENUE.note}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
              <Button
                href={VENUE.mapsUrl}
                external
                variant="wine"
                icon={<HiOutlineArrowUpRight aria-hidden />}
                aria-label={`View ${VENUE.name} on Google Maps`}
              >
                View Location
              </Button>
              <Button
                href={VENUE.directionsUrl}
                external
                variant="outline"
                icon={<HiOutlineArrowUpRight aria-hidden />}
                aria-label={`Get directions to ${VENUE.name}`}
              >
                Get Directions
              </Button>
              <Button
                onClick={generateCalendarEvent}
                variant="outline"
                icon={<HiOutlineCalendarDays aria-hidden />}
                aria-label="Add to calendar"
              >
                Add to Calendar
              </Button>
            </motion.div>
          </motion.div>

          {/* The plate supports it */}
          <MapCard label={`${VENUE.name} · ${VENUE.addressLines[1] ?? VENUE.city}`} />
        </div>
      </motion.div>
    </Section>
  );
}
