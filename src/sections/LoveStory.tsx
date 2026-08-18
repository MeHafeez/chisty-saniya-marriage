'use client';

import { useLayoutEffect, useRef } from 'react';

import { GoldParticles } from '@/components/royal/GoldParticles';
import { FloralAccent, OrnamentalLine } from '@/components/royal/RoyalOrnaments';
import { KenBurns } from '@/components/royal/KenBurns';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { STORY_CHAPTERS } from '@/constants/wedding';
import { registerGsap, ScrollTrigger } from '@/animations/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

/**
 * Section 04 — the three days, as a royal vertical timeline.
 *
 * Entirely GSAP ScrollTrigger: the gold spine draws downward on scrub, and each
 * chapter plays its own sequence — marker, then date, title, description, then
 * the plate — as it enters. No cards; the composition is editorial.
 *
 * Content is `STORY_CHAPTERS` verbatim.
 */
export function LoveStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const gsap = registerGsap();

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('[data-story-el]', { autoAlpha: 1, y: 0, scale: 1, filter: 'none' });
        gsap.set(spineRef.current, { scaleY: 1 });
        return;
      }

      // The spine draws as the guest moves through the section.
      gsap.fromTo(
        spineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 74%',
            end: 'bottom 80%',
            scrub: 0.7,
          },
        },
      );

      // Each chapter runs its own ordered reveal.
      const items = gsap.utils.toArray<HTMLElement>('[data-story-item]');
      items.forEach((item) => {
        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: item, start: 'top 78%', once: true },
        });

        timeline
          .fromTo(
            item.querySelector('[data-story-marker]'),
            { autoAlpha: 0, scale: 0.3 },
            { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(2)' },
            0,
          )
          .fromTo(
            item.querySelector('[data-story-date]'),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            0.2,
          )
          .fromTo(
            item.querySelector('[data-story-title]'),
            { autoAlpha: 0, y: 26, filter: 'blur(8px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1 },
            0.35,
          )
          .fromTo(
            item.querySelector('[data-story-place]'),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            0.5,
          )
          .fromTo(
            item.querySelector('[data-story-rule]'),
            { scaleX: 0, autoAlpha: 0 },
            { scaleX: 1, autoAlpha: 1, duration: 1 },
            0.6,
          )
          .fromTo(
            item.querySelector('[data-story-body]'),
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 1.1 },
            0.7,
          )
          .fromTo(
            item.querySelector('[data-story-plate]'),
            { autoAlpha: 0, y: 40, scale: 1.05, filter: 'blur(12px)' },
            { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5 },
            0.3,
          );
      });
    }, trackRef);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <Section id="story" tone="night" label="The three days" className="overflow-hidden">
      <GoldParticles count={30} intensity={0.6} opacity={0.6} />

      <SectionHeading
        eyebrow="Haldi · Nikah · Valima"
        script="The"
        title="Three Days"
        description="Three ceremonies, three days, one union — and what each of them means."
      />

      <div ref={trackRef} className="relative mt-14 sm:mt-20">
        {/* ——— The spine ——— */}
        <div className="absolute bottom-0 left-[17px] top-0 w-px bg-gold/15 md:left-1/2 md:-translate-x-1/2">
          <div
            ref={spineRef}
            className="h-full w-full origin-top"
            style={{
              background: 'linear-gradient(180deg, #E2CB96 0%, #C9A45C 50%, #8E6C22 100%)',
              transform: reducedMotion ? 'scaleY(1)' : 'scaleY(0)',
            }}
          />
        </div>

        <ol className="flex flex-col gap-20 sm:gap-28">
          {STORY_CHAPTERS.map((chapter, index) => {
            const isRight = index % 2 === 1;

            return (
              <li key={chapter.id} data-story-item className="relative">
                <div className="grid items-center gap-9 pl-14 md:grid-cols-[1fr_auto_1fr] md:gap-16 md:pl-0">
                  {/* ——— Copy ——— */}
                  <div
                    className={cn(
                      'md:col-start-1',
                      isRight ? 'md:order-3 md:col-start-3 md:text-left' : 'md:text-right',
                    )}
                  >
                    <p
                      data-story-el
                      data-story-date
                      className="invisible font-sans text-[0.625rem] uppercase tracking-[0.34em] text-gold-deep"
                    >
                      {chapter.date}
                    </p>
                    <h3
                      data-story-el
                      data-story-title
                      className="invisible mt-3 font-display text-[length:var(--text-h2)] font-light leading-[1.02] text-ink"
                    >
                      {chapter.title}
                    </h3>
                    <p
                      data-story-el
                      data-story-place
                      className="invisible mt-2 font-script text-2xl text-gold sm:text-3xl"
                    >
                      {chapter.place}
                    </p>
                    <span
                      data-story-el
                      data-story-rule
                      className={cn(
                        'invisible mt-6 block h-px w-24 bg-gradient-to-r from-gold to-transparent',
                        isRight ? 'md:origin-left' : 'md:ml-auto md:origin-right md:bg-gradient-to-l',
                      )}
                    />
                    <p
                      data-story-el
                      data-story-body
                      className="invisible mt-6 max-w-md text-pretty font-serif text-[0.9375rem] font-light leading-[1.95] text-muted md:inline-block"
                    >
                      {chapter.description}
                    </p>
                  </div>

                  {/* ——— Marker on the spine ——— */}
                  <div
                    data-story-el
                    data-story-marker
                    className="invisible absolute left-0 top-1 flex h-9 w-9 items-center justify-center md:relative md:left-auto md:top-auto md:order-2 md:col-start-2 md:h-16 md:w-16"
                  >
                    <span className="absolute inset-0 rounded-full border border-gold/40 bg-ivory" />
                    <FloralAccent
                      variant="rosette"
                      size={26}
                      className="absolute opacity-70 md:h-11 md:w-11"
                    />
                    <span className="relative font-display text-[0.6875rem] text-gold-deep md:text-base">
                      {chapter.index}
                    </span>
                  </div>

                  {/* ——— Plate ——— */}
                  <figure
                    data-story-el
                    data-story-plate
                    className={cn('invisible group md:col-start-3', isRight && 'md:order-1 md:col-start-1')}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-tile)] border border-gold/25">
                      <KenBurns
                        src={chapter.image}
                        alt={chapter.title}
                        duration={24}
                        scale={1.07}
                        direction={isRight ? 'out' : 'in'}
                        sizes="(max-width: 768px) 88vw, 38vw"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(20,12,7,0.1) 0%, rgba(20,12,7,0) 45%, rgba(20,12,7,0.5) 100%)',
                        }}
                      />
                      <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-[#EBD7A6]/25" />
                    </div>
                  </figure>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <OrnamentalLine width={260} className="mx-auto mt-20 opacity-70" />
    </Section>
  );
}
