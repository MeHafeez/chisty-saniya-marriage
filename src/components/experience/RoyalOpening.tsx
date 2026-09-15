'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { GoldParticles, type GoldParticlesHandle } from '@/components/royal/GoldParticles';
import { RoyalDoor } from '@/components/royal/RoyalDoor';
import { RoyalCorner, OrnamentalLine, FloralAccent } from '@/components/royal/RoyalOrnaments';
import { IslamicMonogram } from '@/components/decor/islamic/IslamicMonogram';
import { WaxSeal } from '@/components/decor/islamic/WaxSeal';
import { COUPLE_ORDER, WEDDING } from '@/constants/wedding';
import { buildIntroTimeline } from '@/animations/introTimeline';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { splitDate } from '@/utils/format';

interface RoyalOpeningProps {
  /** Fired synchronously on the click — the only legal moment to start audio. */
  onBegin: () => void;
  /** Fired when the invitation should take over. */
  onOpen: () => void;
}

/**
 * Act II — the royal entrance.
 *
 * Fullscreen, no page chrome: an atmospheric royal ground, an ornamental frame
 * carrying the couple's names, and two hinged leaves that swing outward on a
 * single GSAP master timeline (see `animations/introTimeline.ts`) onto the warm
 * light behind them. Nothing is pictured through the doorway — the light alone
 * carries it, and the camera is already travelling through by then.
 *
 * All names, dates and places come from `constants/wedding.ts` — nothing here
 * is authored copy.
 */
export function RoyalOpening({ onBegin, onOpen }: RoyalOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const date = splitDate(WEDDING.date);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<GoldParticlesHandle>(null);
  const timelineRef = useRef<ReturnType<typeof buildIntroTimeline> | null>(null);

  // Build the timeline once, paused, so the click only has to play it.
  useLayoutEffect(() => {
    const timeline = buildIntroTimeline(
      {
        root: stageRef.current,
        vignette: vignetteRef.current,
        cover: coverRef.current,
        light: lightRef.current,
        seal: sealRef.current,
        leftDoor: leftDoorRef.current,
        rightDoor: rightDoorRef.current,
        flash: flashRef.current,
        particles: particlesRef.current,
      },
      { reducedMotion, onComplete: onOpen },
    );

    timelineRef.current = timeline;
    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [reducedMotion, onOpen]);

  const handleOpen = useCallback(() => {
    // Lock the interaction immediately — a second press must not restart it.
    if (isOpening) return;
    setIsOpening(true);
    onBegin();
    timelineRef.current?.play(0);
  }, [isOpening, onBegin]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] overflow-hidden bg-[#0E0805]"
      role="dialog"
      aria-label="Open the wedding invitation"
    >
      {/* ——— Atmosphere ——— */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 46%, #2A1810 0%, #1A0F09 42%, #0E0805 78%)',
        }}
      />
      <div className="paper-grain absolute inset-0 opacity-40" />

      {/* Darkening layer the timeline brings up on press */}
      <div ref={vignetteRef} className="absolute inset-0 bg-black/45 opacity-0" />

      <GoldParticles ref={particlesRef} count={62} intensity={0.85} opacity={0.95} />

      {/* Outer ornamental frame — the stationery border */}
      <div className="pointer-events-none absolute inset-[clamp(0.6rem,2vw,1.75rem)] border border-[#C9A45C]/35">
        <RoyalCorner corner="top-left" size={120} tone="#D9B871" opacity={0.7} className="left-0 top-0" />
        <RoyalCorner corner="top-right" size={120} tone="#D9B871" opacity={0.7} className="right-0 top-0" />
        <RoyalCorner corner="bottom-left" size={120} tone="#D9B871" opacity={0.7} className="bottom-0 left-0" />
        <RoyalCorner corner="bottom-right" size={120} tone="#D9B871" opacity={0.7} className="bottom-0 right-0" />
      </div>

      {/* ——— The stage: everything the camera pushes through ——— */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-5 py-6"
        style={{ perspective: '1600px', transformOrigin: '50% 48%', willChange: 'transform' }}
      >
        {/* The doorway itself — and the trigger. There is no separate button:
            the guest opens the invitation by pressing the seal in the middle. */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          aria-label={isOpening ? 'Opening the invitation' : 'Press the seal to open the invitation'}
          className="group relative block cursor-pointer appearance-none border-0 bg-transparent p-0 text-left disabled:cursor-default"
          style={{
            width: 'min(90vw, 34rem, 46svh)',
            aspectRatio: '100 / 148',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Warm light BEHIND the leaves.
              The softness is all in the gradient's stops. It used to come from
              a `filter: blur(18px)`, but this element is scaled for most of the
              opening while the stage scales again on top of it, and a blurred
              layer has to be recomputed at every step of that — which is what
              made the doors stutter on a phone. Extra colour stops give the same
              falloff for nothing, and the transparent stop means there is no
              rectangular edge for the blur to have been hiding. */}
          <div
            ref={lightRef}
            aria-hidden
            className="absolute inset-0 opacity-0"
            style={{
              background:
                'radial-gradient(circle at 50% 55%, #FFF0CE 0%, #FDE7B4 14%, #F4C978 30%, rgba(214,160,86,0.72) 44%, rgba(198,138,58,0.45) 58%, rgba(160,104,44,0.2) 70%, rgba(120,70,25,0) 82%)',
              willChange: 'transform, opacity',
            }}
          />

          {/* The two leaves. No labels on them: the cover panel in front already
              carries the names, and centring it over both leaves put two sets of
              type on top of each other. */}
          <RoyalDoor ref={leftDoorRef} side="left" />
          <RoyalDoor ref={rightDoorRef} side="right" />

          {/* ——— The cover furniture that sits in front, before opening ——— */}
          <div
            ref={coverRef}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-[9%] text-center"
          >
            {/* Scrim: the girih behind is deliberately busy, and the small caps
                disappear into it without something to sit on. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(58% 42% at 50% 50%, rgba(14,8,5,0.92) 0%, rgba(14,8,5,0.75) 45%, rgba(14,8,5,0) 78%)',
              }}
            />
            <p
              lang="ar"
              dir="rtl"
              className="font-serif text-[#E7C88B] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
              style={{ fontSize: 'clamp(0.8rem, 3.2vw, 1.1rem)' }}
            >
              {WEDDING.bismillah}
            </p>

            <FloralAccent variant="swag" size={44} className="mt-3 text-[#D9B871] opacity-80" />

            {/* ——— The heart seal: both the ornament and the trigger ———
                With the button gone this is the only affordance, so it carries
                the instruction on its face and breathes to invite the press. */}
            <div ref={sealRef} className="relative my-4">
              {/* Halo that swells under the cursor */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-60 blur-xl transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle, rgba(233,199,131,0.55), transparent 70%)',
                  animation: reducedMotion ? undefined : 'breathe 3.4s ease-in-out infinite',
                }}
              />
              <span
                className="block transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.07] group-active:scale-[0.97]"
                style={{ animation: reducedMotion ? undefined : 'seal-beat 3.4s ease-in-out infinite' }}
              >
                <WaxSeal
                  shape="heart"
                  size="clamp(5.5rem, 19vw, 8.5rem)"
                  caption={['Tap to', 'open']}
                />
              </span>
            </div>

            <p
              className="font-display font-light leading-none text-[#F4E6C4]"
              style={{ fontSize: 'clamp(1.5rem, 6.4vw, 3rem)', letterSpacing: '0.04em' }}
            >
              {COUPLE_ORDER[0].name}
              <span className="mx-2 font-script text-[#D9B871]">&amp;</span>
              {COUPLE_ORDER[1].name}
            </p>

            <OrnamentalLine width={210} className="mt-4 text-[#C9A45C]" />
          </div>
        </button>

        {/* The only remaining instruction, and it sits clear of the artwork */}
        <p
          className="relative z-30 mt-6 font-sans uppercase text-[#C9A45C]/55"
          style={{
            fontSize: 'clamp(0.44rem, 1.7vw, 0.5625rem)',
            letterSpacing: '0.3em',
            opacity: isOpening ? 0 : 1,
            transition: 'opacity 600ms ease',
          }}
        >
          Best experienced with sound
        </p>
      </div>

      {/* Monogram watermark, low in the frame */}
      <div className="pointer-events-none absolute bottom-[clamp(1.5rem,4vw,3rem)] left-1/2 -translate-x-1/2 opacity-25">
        <IslamicMonogram size={54} animate={false} rotating={false} className="text-[#D9B871]" />
      </div>

      {/* Cinematic flash for the hand-off */}
      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #FFF8EA 0%, #FBEBCE 40%, rgba(253,249,245,0.85) 72%, rgba(253,249,245,0.6) 100%)',
        }}
      />

      {/* Screen-reader fallback: the sequence is decorative, the content is not. */}
      <span className="sr-only">
        {`${COUPLE_ORDER[0].fullName} and ${COUPLE_ORDER[1].fullName}. ${WEDDING.occasion}, ${date.weekday} ${date.day} ${date.month} ${date.year}, ${WEDDING.city}.`}
      </span>

      <span className="sr-only" aria-live="polite">
        {isOpening ? 'Opening the invitation' : ''}
      </span>
    </div>
  );
}
