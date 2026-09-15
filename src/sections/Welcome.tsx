'use client';

import { useLayoutEffect, useRef } from 'react';

import { EmbossedPanel } from '@/components/decor/islamic/EmbossedPanel';
import { GirihPattern } from '@/components/decor/islamic/GirihPattern';
import { GoldParticles } from '@/components/royal/GoldParticles';
import { FloralAccent, OrnamentalLine, RoyalCorner } from '@/components/royal/RoyalOrnaments';
import { Section } from '@/components/ui/Section';
import { WELCOME_LETTER, WEDDING } from '@/constants/wedding';
import { registerGsap, ScrollTrigger } from '@/animations/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Section 02 — the invitation card.
 *
 * A wide sheet of embossed stationery on an ornamented ground. Every element is
 * revealed by a single GSAP ScrollTrigger timeline that only builds when the
 * section approaches the viewport, so nothing animates — or costs a frame —
 * until the guest is actually near it.
 *
 * All copy is `WELCOME_LETTER` / `WEDDING`; nothing here is authored.
 */
export function Welcome() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const gsap = registerGsap();

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-welcome]');
      if (items.length === 0) return;

      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0, filter: 'none', clipPath: 'none' });
        return;
      }

      // The card lifts as a whole…
      gsap.fromTo(
        '[data-welcome-card]',
        { autoAlpha: 0, y: 56, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true },
        },
      );

      // …then its contents arrive in reading order.
      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
        })
        .fromTo(
          '[data-welcome="crest"]',
          { autoAlpha: 0, scale: 0.6, y: 12 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.1 },
          0,
        )
        .fromTo(
          '[data-welcome="salutation"]',
          { autoAlpha: 0, y: 22, filter: 'blur(8px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2 },
          0.2,
        )
        .fromTo(
          '[data-welcome="rule"]',
          { autoAlpha: 0, scaleX: 0.3 },
          { autoAlpha: 1, scaleX: 1, duration: 1.1 },
          0.4,
        )
        // The message, one line at a time — the lazy part the guest actually
        // reads. Kept brisk: the whole card resolves in about three seconds, so
        // someone scrolling at a normal pace still sees the signature written.
        .fromTo(
          '[data-welcome="line"]',
          { autoAlpha: 0, y: 24, filter: 'blur(7px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85, stagger: 0.16 },
          0.5,
        )
        .fromTo(
          '[data-welcome="quote"]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.95 },
          '-=0.35',
        )
        .fromTo(
          '[data-welcome="closing"]',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          '-=0.5',
        )
        // The signature wipes on left-to-right, like it is being written. Only
        // the right edge wipes: every other side is held outside the box. The
        // script face throws loops well above the line and swashes well left of
        // it, and an inset of 0 shears them off at a fixed height — which takes
        // the C of "Chinna" as surely as the M it starts with. The right begins
        // past 100% so that overhang is not showing before the wipe reaches it,
        // and the clip is dropped once the tween lands.
        .fromTo(
          '[data-welcome="signature"]',
          { autoAlpha: 0, clipPath: 'inset(-100% 120% -100% -20%)' },
          {
            autoAlpha: 1, clipPath: 'inset(-100% -8% -100% -20%)',
            duration: 1.35, ease: 'power2.inOut', clearProps: 'clipPath',
          },
          '-=0.25',
        )
        .fromTo(
          '[data-welcome="flourish"]',
          { autoAlpha: 0, width: 0 },
          { autoAlpha: 1, width: 170, duration: 0.9 },
          '-=0.5',
        );
    }, sectionRef);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <Section id="welcome" width="wide" label="A personal welcome" className="overflow-hidden">
      <div ref={sectionRef} className="relative">
        {/* ——— Background ——————————————————————————————— */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Warm ground, deepened toward the edges so the cream sheet reads as
              lying *on* something rather than dissolving into the page. */}
          <div
            className="absolute -inset-x-[6vw] -inset-y-16"
            style={{
              background:
                'radial-gradient(64% 56% at 50% 34%, rgba(255,252,246,0.9) 0%, rgba(238,225,204,0.85) 52%, rgba(226,209,182,0.9) 100%)',
            }}
          />

          {/* A large girih medallion turning behind the card, radially faded */}
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold"
            style={{
              width: 'min(130vw, 70rem)',
              height: 'min(130vw, 70rem)',
              opacity: 0.2,
              animation: reducedMotion ? undefined : 'spin-slow 300s linear infinite',
            }}
            viewBox="0 0 400 400"
          >
            <defs>
              <GirihPattern
                id="welcome-medallion"
                size={46}
                strokeWidth={0.5}
                fillOpacity={0.05}
                strokeOpacity={0.55}
              />
              <radialGradient id="welcome-fade" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="65%" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="welcome-mask">
                <rect width="400" height="400" fill="url(#welcome-fade)" />
              </mask>
            </defs>
            <rect width="400" height="400" fill="url(#welcome-medallion)" mask="url(#welcome-mask)" />
          </svg>

          {/* Ornamental corners framing the whole movement */}
          <RoyalCorner corner="top-left" size={150} opacity={0.4} className="left-0 top-0" />
          <RoyalCorner corner="top-right" size={150} opacity={0.4} className="right-0 top-0" />
          <RoyalCorner corner="bottom-left" size={150} opacity={0.4} className="bottom-0 left-0" />
          <RoyalCorner corner="bottom-right" size={150} opacity={0.4} className="bottom-0 right-0" />

          <GoldParticles count={26} intensity={0.5} opacity={0.55} />
        </div>

        {/* ——— The sheet ——————————————————————————————— */}
        <div
          data-welcome-card
          className="relative mx-auto w-full max-w-5xl shadow-[0_34px_80px_-40px_rgba(47,37,33,0.42)]"
          style={{ visibility: reducedMotion ? 'visible' : 'hidden' }}
        >
          <EmbossedPanel
            patternSize={58}
            depth={0.2}
            tooth={0.4}
            inkColor="#C7A469"
            background="linear-gradient(160deg, #FDF9F2 0%, #F7EEDF 52%, #F0E4D1 100%)"
          />

          <div className="pointer-events-none absolute inset-[clamp(0.6rem,1.6vw,1.15rem)] border border-gold/45" />
          <div className="pointer-events-none absolute inset-[clamp(0.95rem,2.2vw,1.6rem)] border border-gold/20" />
          <RoyalCorner corner="top-left" size={112} opacity={0.7} className="left-1 top-1" />
          <RoyalCorner corner="top-right" size={112} opacity={0.7} className="right-1 top-1" />
          <RoyalCorner corner="bottom-left" size={112} opacity={0.7} className="bottom-1 left-1" />
          <RoyalCorner corner="bottom-right" size={112} opacity={0.7} className="bottom-1 right-1" />

          <article className="relative px-[clamp(1.75rem,6vw,5.5rem)] py-[clamp(3rem,7vw,5rem)] text-center">
            <div data-welcome="crest" className="invisible">
              <FloralAccent variant="sprig" size={78} className="mx-auto opacity-85" />
            </div>

            <p
              data-welcome="salutation"
              className="invisible mt-6 font-script text-4xl text-gold sm:text-5xl"
            >
              {WELCOME_LETTER.salutation}
            </p>

            <div data-welcome="rule" className="invisible">
              <OrnamentalLine width={240} className="mx-auto my-8 opacity-80" />
            </div>

            {/* Wider measure than before, but still capped for readability */}
            <div className="mx-auto flex max-w-3xl flex-col gap-7">
              {WELCOME_LETTER.lines.map((text) => (
                <p
                  key={text}
                  data-welcome="line"
                  className="invisible text-pretty font-serif text-[length:var(--text-lead)] font-light leading-[1.95] text-ink/90"
                >
                  {text}
                </p>
              ))}
            </div>

            <blockquote
              data-welcome="quote"
              className="invisible mx-auto mt-14 max-w-3xl border-t border-gold/25 pt-11"
            >
              <p className="text-pretty font-display text-[length:var(--text-h4)] font-light italic leading-relaxed text-ink">
                &ldquo;{WEDDING.quote.text}&rdquo;
              </p>
              <cite className="mt-5 block font-sans text-[0.625rem] uppercase not-italic tracking-[0.34em] text-gold-deep">
                {WEDDING.quote.source}
              </cite>
            </blockquote>

            <div className="mt-14 flex flex-col items-center">
              <p
                data-welcome="closing"
                className="invisible font-sans text-[0.625rem] uppercase tracking-[0.34em] text-muted"
              >
                {WELCOME_LETTER.closing}
              </p>

              <p
                data-welcome="signature"
                className="invisible mt-3 font-script text-4xl text-ink sm:text-5xl"
              >
                {WELCOME_LETTER.signature}
              </p>

              <span data-welcome="flourish" className="invisible mt-3 block h-px bg-gold/60" />
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
