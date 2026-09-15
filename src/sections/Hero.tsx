'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiOutlineArrowLongDown } from 'react-icons/hi2';

import { BannerLockup } from '@/components/royal/BannerLockup';
import { RosePetals } from '@/components/royal/RosePetals';
import { COUPLE, WEDDING } from '@/constants/wedding';
import { registerGsap } from '@/animations/gsap';
import { useExperience } from '@/context/ExperienceProvider';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Act III — the banner.
 *
 * The artwork carries the Bismillah, the arch and the ornament. The couple's
 * names were painted into it too, which meant they could only ever arrive with
 * the image, fully formed. `scripts/strip-banner-names.mjs` lifted them out and
 * BannerLockup sets them as live type, so the reveal below can bring them in a
 * line at a time. Rose petals fall across it and a wordless arrow points on.
 *
 * Art direction is a real `<picture>`: the desktop and mobile banners are
 * different crops, not one image at two sizes, so the browser must pick — and
 * this way it downloads only the one it needs. WebP with a JPEG fallback, at
 * three widths each; see `scripts/optimize-banners.mjs`. This is the page's LCP
 * image on a phone, and the source PNG was 744 KB of it.
 */
export function Hero() {
  const { isRevealed, scrollTo } = useExperience();
  const containerRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const exitOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // The banner arrives out of the intro's flash.
  useLayoutEffect(() => {
    if (!isRevealed) return;
    const gsap = registerGsap();

    const context = gsap.context(() => {
      const pick = gsap.utils.selector(containerRef);
      // Both crops are always in the DOM — CSS decides which one shows, so that
      // the choice survives server rendering. Each is given the same reveal at
      // the same moment, and whichever is showing keeps the intended timing.
      const crops = (['wide', 'tall'] as const).map((crop) => {
        const within = (sel: string) => pick(`[data-hero-crop="${crop}"] ${sel}`);
        return {
          lines: within('[data-hero-line]'),
          names: within('[data-hero-name]'),
          amp: within('[data-hero-amp]'),
        };
      });

      if (reducedMotion) {
        gsap.set([plateRef.current, cueRef.current], { autoAlpha: 1, scale: 1, filter: 'none' });
        gsap.set(crops.flatMap((c) => [...c.lines, ...c.names, ...c.amp]), {
          autoAlpha: 1, y: 0, scale: 1, rotate: 0, filter: 'none', clipPath: 'none',
        });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } }).fromTo(
        plateRef.current,
        { autoAlpha: 0, scale: 1.04, filter: 'blur(8px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2.4 },
        0,
      );

      for (const crop of crops) {
        timeline
          // "The Wedding Of", then each family name over the name it introduces.
          .fromTo(crop.lines, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.14 }, 1.15)
          // The script names are wiped in left to right, the way they were
          // written. Only the right edge does the wiping: every other side is
          // held outside the box, because the capitals in this face throw loops
          // well above the line and swashes well left of it, and an inset of 0
          // shears them off — the C of "Chisty" as surely as the M, since the
          // cut lands at a height rather than at the element's edge. The right
          // starts past 100% so none of that overhang shows before the wipe,
          // and clipPath is dropped altogether once the tween lands.
          .fromTo(
            crop.names,
            { autoAlpha: 0, clipPath: 'inset(-100% 120% -100% -20%)', filter: 'blur(5px)' },
            {
              autoAlpha: 1, clipPath: 'inset(-100% -8% -100% -20%)', filter: 'blur(0px)',
              duration: 1.7, stagger: 0.34, ease: 'power2.out', clearProps: 'clipPath,filter',
            },
            1.45,
          )
          // The ampersand lands last and settles, so the pair reads as a pair.
          .fromTo(
            crop.amp,
            { autoAlpha: 0, scale: 0.5, rotate: -14 },
            { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.9)' },
            2.05,
          );
      }

      timeline.fromTo(cueRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 3.3);
    }, containerRef);

    return () => context.revert();
  }, [isRevealed, reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label={`${COUPLE.groom.fullName} and ${COUPLE.bride.fullName} — ${WEDDING.occasion}`}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#F6ECDC]"
    >
      <motion.div
        ref={plateRef}
        className="invisible absolute inset-0"
        style={{ y: exitY }}
      >
        {/* `sizes` is the cover rule again: the banner is scaled to the larger
            of the viewport and its own aspect applied to the viewport, so on a
            window squarer than the crop the image is drawn wider than 100vw and
            a flat 100vw would pick a rendition a step too small. A browser that
            cannot parse it falls back to 100vw, which is the sane default. */}
        <picture>
          {/* Desktop crop */}
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet="/images/banner/desktop-1024.webp 1024w, /images/banner/desktop-1440.webp 1440w, /images/banner/desktop-1672.webp 1672w"
            sizes="max(100vw, 179.9vh)"
          />
          <source media="(min-width: 768px)" srcSet="/images/banner/desktop-fallback.jpg" />
          {/* Mobile crop */}
          <source
            type="image/webp"
            srcSet="/images/banner/mobile-480.webp 480w, /images/banner/mobile-640.webp 640w, /images/banner/mobile-852.webp 852w"
            sizes="max(100vw, 46.26vh)"
          />
          <img
            src="/images/banner/mobile-fallback.jpg"
            // Decorative: the names it used to carry are set as live type above
            // it now, and the heading in BannerLockup is what announces them.
            alt=""
            className="h-full w-full object-cover object-center"
            style={{
              animation: reducedMotion ? undefined : 'banner-zoom 30s ease-in-out infinite alternate',
              transformOrigin: '50% 50%',
            }}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </motion.div>

      {/* The names, lifted out of the artwork so they can be revealed. Set
          before the petals so those still drift in front of them, as they did
          when the words were part of the painting. */}
      <motion.div className="absolute inset-0" style={{ opacity: exitOpacity, y: exitY }}>
        <BannerLockup crop="wide" />
        <BannerLockup crop="tall" />
      </motion.div>

      {/* Rose petals falling across the banner */}
      <motion.div className="absolute inset-0" style={{ opacity: exitOpacity }}>
        <RosePetals count={60} opacity={1} speed={0.75} />
      </motion.div>

      {/* Wordless scroll cue */}
      <motion.button
        ref={cueRef}
        type="button"
        onClick={() => scrollTo('#welcome')}
        className="no-print group invisible absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
        style={{ opacity: exitOpacity }}
        aria-label="Scroll to the invitation"
      >
        <span className="relative block h-11 w-px overflow-hidden bg-[#8E6C22]/35">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-[#8E6C22]"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8E6C22]/45 bg-[#FDF8F0]/70 backdrop-blur-sm transition-colors duration-500 group-hover:border-[#8E6C22]">
          <HiOutlineArrowLongDown
            aria-hidden
            className="text-[#8E6C22] transition-transform duration-500 group-hover:translate-y-0.5"
          />
        </span>
      </motion.button>
    </section>
  );
}
