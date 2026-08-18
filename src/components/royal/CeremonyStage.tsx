'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin } from 'react-icons/hi2';

import { GoldParticles } from './GoldParticles';
import { RosePetals, type PetalColour } from './RosePetals';
import { ScratchReveal } from './ScratchReveal';
import { FloralAccent, OrnamentalLine, RoyalCorner } from './RoyalOrnaments';
import { registerGsap } from '@/animations/gsap';
import { EASE, VIEWPORT } from '@/constants/motion';
import { WEDDING } from '@/constants/wedding';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import type { WeddingEvent } from '@/types';

export interface CeremonyTheme {
  ground: string;
  glow: string;
  petals: readonly PetalColour[];
  foil: string;
}

export interface CeremonyStageProps {
  /** The chosen ceremony, or `null` before anything is picked. */
  event: WeddingEvent | null;
  theme: CeremonyTheme | null;
  /** 1-based position, for the "Ceremony 02" eyebrow. */
  ordinal: number | null;
}

/**
 * What the foil hides. Dress code was removed at the couple's request — the
 * field is still in the data, so restoring it is one row.
 */
const DETAIL_ROWS = [
  { icon: HiOutlineCalendarDays, label: 'Date', get: (e: WeddingEvent) => `${e.day}, ${e.date}` },
  { icon: HiOutlineClock, label: 'Time', get: (e: WeddingEvent) => e.time },
  {
    icon: HiOutlineMapPin,
    label: 'Venue',
    get: (e: WeddingEvent) => e.venue,
    sub: (e: WeddingEvent) => e.address,
  },
] as const;

const FRAME_INSET = 'clamp(0.75rem,2.5vw,2.25rem)';

/**
 * The ceremony stage.
 *
 * Full-bleed and tall, so choosing a ceremony genuinely changes the room the
 * guest is standing in. The chosen card's own artwork becomes the ground —
 * scaled and blurred far past legibility, so it reads as light and colour
 * rather than as a picture (which also keeps its printed text out of play).
 * Over that: the theme grade, that ceremony's flowers, gold dust, an
 * ornamental frame, and the foil.
 *
 * One GSAP timeline re-runs on every change of ceremony, so the ground, the
 * title and the foil arrive in sequence rather than all at once.
 */
export function CeremonyStage({ event, theme, ordinal }: CeremonyStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const eventId = event?.id ?? null;

  useLayoutEffect(() => {
    const gsap = registerGsap();

    const context = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-stage]');
      if (targets.length === 0) return;

      if (reducedMotion) {
        gsap.set(targets, { autoAlpha: 1, y: 0, scale: 1, filter: 'none' });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          '[data-stage="ground"]',
          { autoAlpha: 0, scale: 1.1 },
          { autoAlpha: 1, scale: 1, duration: 1.5 },
          0,
        )
        // The Bismillah leads, and holds for a beat before the rest follows.
        .fromTo(
          '[data-stage="bismillah"]',
          { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
          0.15,
        )
        .fromTo(
          '[data-stage="eyebrow"]',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.85 },
          0.65,
        )
        .fromTo(
          '[data-stage="title"]',
          { autoAlpha: 0, y: 34, filter: 'blur(12px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2 },
          0.78,
        )
        .fromTo(
          '[data-stage="rule"]',
          { autoAlpha: 0, scaleX: 0.3 },
          { autoAlpha: 1, scaleX: 1, duration: 0.95 },
          1.02,
        )
        .fromTo(
          '[data-stage="foil"]',
          { autoAlpha: 0, y: 30, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 },
          1.12,
        );
    }, stageRef);

    return () => context.revert();
  }, [eventId, reducedMotion]);

  return (
    <motion.div
      className="relative mt-[clamp(2.5rem,5vw,4rem)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15, margin: VIEWPORT.margin }}
      transition={{ duration: 1.2, ease: EASE.luxe }}
    >
      {/* Breaks out of the container to the full viewport width. The parent
          Section is `overflow-hidden`, so this cannot create a scrollbar. */}
      <div
        id="ceremony-stage"
        ref={stageRef}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
        style={{ minHeight: 'clamp(32rem, 76svh, 50rem)' }}
      >
        {/* ——— Ground ——— */}
        <div key={eventId ?? 'idle'} data-stage="ground" className="invisible absolute inset-0">
          {/* Held back to about half strength: at full opacity every ceremony's
              artwork blurs down to the same warm tan and the themes stop reading
              as different rooms. The image supplies texture; the grade supplies
              the colour. */}
          {event?.image && (
            <div className="absolute inset-0 overflow-hidden opacity-50">
              <Image
                src={event.image}
                alt=""
                aria-hidden
                fill
                // A small rendition is plenty; it is blurred past recognition.
                sizes="60vw"
                className="scale-[1.35] object-cover"
                style={{
                  filter: 'blur(40px) saturate(1.3)',
                  animation: reducedMotion
                    ? undefined
                    : 'ken-burns-in 30s ease-in-out infinite alternate',
                  ['--kb-scale' as string]: '1.12',
                }}
              />
            </div>
          )}

          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.88]"
            style={{
              background: theme?.ground ?? 'linear-gradient(160deg, #FBF4EA 0%, #F3E7D6 52%, #EADCC4 100%)',
              mixBlendMode: 'soft-light',
            }}
          />
          {/* A second, flat pass of the same grade so the hue is unmistakable */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: theme?.ground ?? 'linear-gradient(160deg, #FBF4EA 0%, #F3E7D6 52%, #EADCC4 100%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                theme?.glow ??
                'radial-gradient(60% 60% at 50% 34%, rgba(255,250,238,0.9) 0%, rgba(255,250,238,0) 72%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(100% 78% at 50% 50%, rgba(74,55,36,0) 52%, rgba(74,55,36,0.32) 100%)',
            }}
          />
          {/* Feathered top and bottom so the stage seats into the cream section */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: 'linear-gradient(180deg, var(--color-champagne), transparent)' }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: 'linear-gradient(0deg, var(--color-champagne), transparent)' }}
          />
        </div>

        {/* ——— Weather ——— */}
        <RosePetals
          key={`${eventId ?? 'idle'}-petals`}
          count={40}
          opacity={0.9}
          speed={0.75}
          colours={theme?.petals}
        />
        <GoldParticles count={30} intensity={0.65} opacity={0.6} />

        {/* ——— Frame ——— */}
        <div
          aria-hidden
          className="pointer-events-none absolute border border-gold/40"
          style={{ inset: FRAME_INSET }}
        />
        {(
          [
            ['top-left', { top: FRAME_INSET, left: FRAME_INSET }],
            ['top-right', { top: FRAME_INSET, right: FRAME_INSET }],
            ['bottom-left', { bottom: FRAME_INSET, left: FRAME_INSET }],
            ['bottom-right', { bottom: FRAME_INSET, right: FRAME_INSET }],
          ] as const
        ).map(([corner, position]) => (
          <RoyalCorner key={corner} corner={corner} size={118} opacity={0.65} style={position} />
        ))}

        {/* ——— Content ——— */}
        <div
          className="relative flex flex-col items-center justify-center px-[clamp(1.5rem,6vw,5rem)] py-[clamp(3.5rem,8vw,6rem)]"
          style={{ minHeight: 'clamp(32rem, 76svh, 50rem)' }}
        >
          <div key={`${eventId ?? 'idle'}-head`} className="flex flex-col items-center text-center">
            {/* Every ceremony opens in the name of Allah, before anything else. */}
            <p
              data-stage="bismillah"
              lang="ar"
              dir="rtl"
              className="invisible font-serif text-gold-deep"
              style={{ fontSize: 'clamp(1.05rem, 3.6vw, 1.65rem)' }}
            >
              {WEDDING.bismillah}
            </p>

            <div data-stage="eyebrow" className="invisible mt-5 flex flex-col items-center">
              <FloralAccent variant="swag" size={56} className="opacity-85" />
              <p
                className="mt-4 font-sans uppercase text-gold-deep"
                style={{ fontSize: 'clamp(0.5rem,1.8vw,0.625rem)', letterSpacing: '0.4em' }}
              >
                {ordinal ? `Ceremony ${String(ordinal).padStart(2, '0')}` : 'The Journey'}
              </p>
            </div>

            <h3
              data-stage="title"
              className="invisible mt-4 font-display font-light leading-[0.95] text-ink"
              style={{ fontSize: 'clamp(2.75rem, 9vw, 6rem)' }}
            >
              {event ? event.name : 'Choose a Day'}
            </h3>

            {event && (
              <p className="mt-2 font-script text-2xl text-gold-deep sm:text-3xl">{event.tagline}</p>
            )}

            <div data-stage="rule" className="invisible mt-6">
              <OrnamentalLine width={260} className="opacity-85" />
            </div>
          </div>

          <div data-stage="foil" className="invisible mt-10 w-full max-w-2xl">
            {!event ? (
              <p className="text-center font-serif text-[length:var(--text-lead)] font-light leading-relaxed text-ink/80">
                Pick a ceremony above, then scratch the foil to uncover the day, the hour and the
                place.
              </p>
            ) : (
              <ScratchReveal
                key={event.id}
                className="rounded-[var(--radius-tile)] border border-gold/50 shadow-[0_28px_60px_-28px_rgba(47,37,33,0.55)]"
                hint="Scratch to reveal"
                foilTint={theme?.foil}
              >
                <div className="relative bg-[#FDF9F2]/94 px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2rem,4vw,3rem)]">
                  <dl className="grid gap-6 sm:grid-cols-2">
                    {DETAIL_ROWS.map((row) => {
                      const RowIcon = row.icon;
                      const sub = 'sub' in row ? row.sub(event) : undefined;

                      return (
                        <div key={row.label} className="flex items-start gap-3.5">
                          <RowIcon aria-hidden className="mt-1 shrink-0 text-base text-gold-deep" />
                          <div className="min-w-0">
                            <dt className="font-sans text-[0.5rem] uppercase tracking-[0.32em] text-muted">
                              {row.label}
                            </dt>
                            <dd className="mt-1 font-serif text-[length:var(--text-lead)] font-light leading-snug text-ink">
                              {row.get(event)}
                              {sub && (
                                <span className="mt-0.5 block font-sans text-xs text-muted">{sub}</span>
                              )}
                            </dd>
                          </div>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </ScratchReveal>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
