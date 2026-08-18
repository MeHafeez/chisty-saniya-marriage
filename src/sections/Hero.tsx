'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiOutlineArrowLongDown } from 'react-icons/hi2';

import { RosePetals } from '@/components/royal/RosePetals';
import { COUPLE, WEDDING } from '@/constants/wedding';
import { registerGsap } from '@/animations/gsap';
import { useExperience } from '@/context/ExperienceProvider';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Act III — the banner.
 *
 * The artwork already carries the Bismillah, "The Wedding Of", both full names
 * and the ornament, so nothing is overlaid on it: any heading here would simply
 * print the same words twice. The only additions are rose petals falling across
 * it and a wordless scroll arrow.
 *
 * Art direction is a real `<picture>`: the desktop and mobile banners are
 * different crops, not one image at two sizes, so the browser must pick — and
 * this way it downloads only the one it needs. WebP with a JPEG fallback; see
 * `scripts/optimize-banners.mjs`.
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
      if (reducedMotion) {
        gsap.set([plateRef.current, cueRef.current], { autoAlpha: 1, scale: 1, filter: 'none' });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          plateRef.current,
          { autoAlpha: 0, scale: 1.04, filter: 'blur(8px)' },
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2.4 },
          0,
        )
        .fromTo(cueRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.9);
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
        <picture>
          {/* Desktop crop */}
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet="/images/banner/desktop-1024.webp 1024w, /images/banner/desktop-1440.webp 1440w, /images/banner/desktop-1672.webp 1672w"
            sizes="100vw"
          />
          <source media="(min-width: 768px)" srcSet="/images/banner/desktop-fallback.jpg" />
          {/* Mobile crop */}
          <source
            type="image/webp"
            srcSet="/images/banner/mobile-480.webp 480w, /images/banner/mobile-640.webp 640w, /images/banner/mobile-852.webp 852w"
            sizes="100vw"
          />
          {/* A plain <img> rather than next/image: <picture> art direction needs
              real <source media> switching, which next/image cannot express, and
              these renditions are already pre-optimised by the banners script. */}
          <img
            src="/images/banner/mobile-fallback.jpg"
            alt={`${COUPLE.groom.fullName} and ${COUPLE.bride.fullName} — ${WEDDING.occasion}`}
            className="h-full w-full object-cover object-center"
            style={{
              // A very slight centre-origin breath. No translate, so the baked-in
              // names never drift toward a crop edge.
              animation: reducedMotion ? undefined : 'banner-breathe 26s ease-in-out infinite alternate',
            }}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </motion.div>

      {/* Rose petals falling across the banner */}
      <motion.div className="absolute inset-0" style={{ opacity: exitOpacity }}>
        <RosePetals count={34} opacity={0.9} speed={0.85} />
      </motion.div>

      {/* Wordless scroll cue — the only thing added over the artwork */}
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
