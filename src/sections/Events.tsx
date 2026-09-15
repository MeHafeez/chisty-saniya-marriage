'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { HiOutlineArrowLongDown, HiOutlineCursorArrowRays } from 'react-icons/hi2';

import { CeremonyStage, type CeremonyTheme } from '@/components/royal/CeremonyStage';
import { FloralAccent, RoyalCorner } from '@/components/royal/RoyalOrnaments';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EVENTS } from '@/constants/wedding';
import { EASE, VIEWPORT } from '@/constants/motion';
import { useExperience } from '@/context/ExperienceProvider';
import { cn } from '@/utils/cn';
import type { WeddingEvent } from '@/types';

/* ——— Per-ceremony theming ———————————————————————————
 * Presentation only; keyed by the event ids already in the data. Anything not
 * listed falls back to the event's own `accent`, so adding a ceremony never
 * breaks this section.
 * ------------------------------------------------------------------ */

const THEMES: Record<string, CeremonyTheme> = {
  haldi: {
    ground: 'linear-gradient(160deg, #FDF4D9 0%, #F6E3A4 46%, #E8C86A 100%)',
    glow: 'radial-gradient(60% 60% at 50% 34%, rgba(255,238,178,0.9) 0%, rgba(255,238,178,0) 72%)',
    // Marigold, the flower actually strung at a Haldi.
    petals: [
      ['#FFD75E', '#E0A828'],
      ['#FFC93C', '#D9971C'],
      ['#FFE694', '#E8BC55'],
      ['#F9B733', '#C98A16'],
    ],
    foil: '#C9971C',
  },
  nikah: {
    ground: 'linear-gradient(160deg, #FBFBF6 0%, #EFF3E6 48%, #DCE6D2 100%)',
    glow: 'radial-gradient(60% 60% at 50% 34%, rgba(255,255,250,0.95) 0%, rgba(255,255,250,0) 72%)',
    // White roses and jasmine, as on the card.
    petals: [
      ['#FFFFFF', '#DCE3D2'],
      ['#FAFDF4', '#D2DCC6'],
      ['#F4F8EC', '#C8D4BA'],
      ['#FFFDF6', '#E2E8D6'],
    ],
    foil: '#8FA07A',
  },
  valima: {
    ground: 'linear-gradient(160deg, #F6F2E4 0%, #DFDCC0 48%, #B9B489 100%)',
    glow: 'radial-gradient(60% 60% at 50% 34%, rgba(255,250,230,0.9) 0%, rgba(255,250,230,0) 72%)',
    // Ivory roses against the olive drapes of the Valima card.
    petals: [
      ['#FFFBEE', '#D8CFA8'],
      ['#F6EFD8', '#C6BC90'],
      ['#EFE9CE', '#B7AE82'],
      ['#FDF8E6', '#CEC49A'],
    ],
    foil: '#9A8F52',
  },
};

const themeFor = (event: WeddingEvent): CeremonyTheme =>
  THEMES[event.id] ?? {
    ground: `linear-gradient(160deg, #FBF4EA 0%, ${event.accent}88 48%, #E4D0B2 100%)`,
    glow: 'radial-gradient(60% 60% at 50% 34%, rgba(255,250,238,0.9) 0%, rgba(255,250,238,0) 72%)',
    petals: [['#FDF6EA', '#E8D6BE']],
    foil: event.accent,
  };

/**
 * Section 05 — the ceremonies, as a journey.
 *
 * The three cards are the choice; the panel below is the reveal. Nothing about
 * a ceremony's date, time or venue is shown until the guest picks one and
 * scratches the foil off it — so the section is something you *do*, not a table
 * you skim. The panel takes its ground, its foil and its falling flowers from
 * whichever ceremony is selected.
 */
export function Events() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { scrollTo } = useExperience();

  const selected = EVENTS.find((event) => event.id === selectedId) ?? null;

  const choose = useCallback(
    (id: string) => {
      setSelectedId(id);
      // Lenis rather than native smooth scroll, so the travel matches the
      // easing of every other move on the page.
      window.requestAnimationFrame(() => scrollTo('#ceremony-stage'));
    },
    [scrollTo],
  );

  return (
    <Section id="events" tone="champagne" label="Wedding ceremonies" className="overflow-hidden">
      <SectionHeading
        eyebrow="1 — 3 October 2026"
        script="Join us for the"
        title="Ceremonies"
        description="Three days, three celebrations. Choose one below and scratch the foil to uncover where and when."
      />

      {/* ——— The choice ——— */}
      <div className="mt-14 grid gap-[clamp(2rem,4vw,3rem)] sm:mt-18 lg:grid-cols-3">
        {EVENTS.map((event, index) => (
          <CeremonyCard
            key={event.id}
            event={event}
            index={index}
            isSelected={event.id === selectedId}
            onSelect={() => choose(event.id)}
          />
        ))}
      </div>

      {/* ——— The instruction ——— */}
      <SelectionHint hasSelected={selected !== null} />

      {/* ——— The reveal ——— */}
      <CeremonyStage
        event={selected}
        theme={selected ? themeFor(selected) : null}
        ordinal={selected ? EVENTS.indexOf(selected) + 1 : null}
        onBack={() => setSelectedId(null)}
        onNext={() => {
          const currentIndex = EVENTS.findIndex((e) => e.id === selectedId);
          if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % EVENTS.length;
            choose(EVENTS[nextIndex]!.id);
          }
        }}
        onPrev={() => {
          const currentIndex = EVENTS.findIndex((e) => e.id === selectedId);
          if (currentIndex !== -1) {
            const prevIndex = (currentIndex - 1 + EVENTS.length) % EVENTS.length;
            choose(EVENTS[prevIndex]!.id);
          }
        }}
      />
    </Section>
  );
}

function CeremonyCard({
  event,
  index,
  isSelected,
  onSelect,
}: {
  event: WeddingEvent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 54, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2, margin: VIEWPORT.margin }}
      transition={{ duration: 1.4, delay: index * 0.14, ease: EASE.luxe }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-label={`Reveal the details for ${event.name}`}
        className="group block w-full appearance-none border-0 bg-transparent p-0 text-left"
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-[var(--radius-tile)] border transition-all duration-700 ease-[var(--ease-luxe)]',
            isSelected
              ? '-translate-y-1.5 border-gold shadow-[0_28px_58px_-22px_rgba(47,37,33,0.6)]'
              : 'border-gold/35 shadow-[0_18px_40px_-22px_rgba(47,37,33,0.45)] group-hover:-translate-y-1 group-hover:border-gold/70',
          )}
          style={{ aspectRatio: '1054 / 1492' }}
        >
          {event.image ? (
            <Image
              src={event.image}
              alt={`${event.name} — ${event.tagline}`}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 32vw"
              className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(150deg, #FBF4EA 0%, ${event.accent}55 50%, #EFE2CE 100%)` }}
            >
              <FloralAccent variant="rosette" size={72} tone={event.accent} />
            </div>
          )}

          {/* Grounds the prompt below without dulling the couple above it */}
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ink/65 via-ink/20 to-transparent transition-opacity duration-700',
              isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100',
            )}
          />

          <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-gold/35" />
          <RoyalCorner corner="top-left" size={64} opacity={0.65} className="left-1 top-1" />
          <RoyalCorner corner="top-right" size={64} opacity={0.65} className="right-1 top-1" />
          <RoyalCorner corner="bottom-left" size={64} opacity={0.65} className="bottom-1 left-1" />
          <RoyalCorner corner="bottom-right" size={64} opacity={0.65} className="bottom-1 right-1" />

          {/* Selected state reads as lit rather than outlined */}
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 transition-opacity duration-700',
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
            )}
            style={{ background: `radial-gradient(70% 50% at 50% 100%, ${event.accent}55, transparent 70%)` }}
          />

          {/* ——— The invitation to tap ———
              The artwork no longer carries the date, time or venue — the panel
              below reveals those — so the card has to say out loud that it is
              something to press. Sitting on the image rather than beside the
              caption, because the image is what the guest is looking at and
              what they have to tap. Duplicates the button's own aria-label,
              hence hidden from screen readers. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-[7%]">
            <span
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-700 ease-[var(--ease-luxe)]',
                isSelected
                  ? 'border-gold bg-ink/85 text-gold-soft'
                  : 'border-gold/70 bg-ink/70 text-champagne group-hover:border-gold group-hover:bg-ink/85',
              )}
            >
              <HiOutlineCursorArrowRays className="text-sm" />
              <span className="font-sans text-[0.625rem] uppercase tracking-[0.28em]">
                {isSelected ? 'Showing below' : 'Tap to reveal'}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <span
            className={cn(
              'h-px transition-all duration-700',
              isSelected ? 'w-12 bg-gold' : 'w-8 bg-gold/45',
            )}
          />
          <span
            className={cn(
              'font-sans text-[0.5625rem] uppercase tracking-[0.34em] transition-colors duration-500',
              isSelected ? 'text-ink' : 'text-gold-deep',
            )}
          >
            {String(index + 1).padStart(2, '0')} · {event.name}
          </span>
          <span
            className={cn(
              'h-px transition-all duration-700',
              isSelected ? 'w-12 bg-gold' : 'w-8 bg-gold/45',
            )}
          />
        </div>
      </button>
    </motion.div>
  );
}

/**
 * The bar under the three cards.
 *
 * Without it the cards read as decoration and nobody discovers that the dates
 * are behind them. It shimmers and points downward to pull the eye to the panel,
 * and changes wording once a ceremony has been picked rather than disappearing —
 * the guest still needs to know they can switch.
 */
function SelectionHint({ hasSelected }: { hasSelected: boolean }) {
  return (
    <motion.div
      className="mt-[clamp(2rem,4vw,3rem)] flex justify-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, ease: EASE.luxe }}
    >
      <div className="relative flex items-center gap-[clamp(0.75rem,2vw,1.5rem)] overflow-hidden px-[clamp(1rem,3vw,2rem)] py-3">
        {/* Hairline rules running out to either side */}
        <span aria-hidden className="h-px w-[clamp(1.5rem,6vw,5rem)] bg-gradient-to-l from-gold/60 to-transparent" />

        <motion.span
          aria-hidden
          className="text-gold-deep"
          animate={{ scale: [1, 0.86, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiOutlineCursorArrowRays className="text-lg" />
        </motion.span>

        <AnimatePresence mode="wait">
          <motion.p
            key={hasSelected ? 'switch' : 'pick'}
            className="whitespace-nowrap font-sans uppercase text-gold-deep"
            style={{ fontSize: 'clamp(0.5rem, 1.9vw, 0.625rem)', letterSpacing: '0.3em' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE.luxe }}
          >
            {hasSelected
              ? 'Tap another ceremony to switch'
              : 'Tap an image to reveal its date & venue'}
          </motion.p>
        </AnimatePresence>

        <motion.span
          aria-hidden
          className="text-gold-deep"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiOutlineArrowLongDown className="text-base" />
        </motion.span>

        <span aria-hidden className="h-px w-[clamp(1.5rem,6vw,5rem)] bg-gradient-to-r from-gold/60 to-transparent" />

        {/* Light sweeping along the bar, so it reads as live */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.span
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/18 to-transparent"
            animate={{ x: ['-120%', '320%'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
          />
        </span>
      </div>
    </motion.div>
  );
}


