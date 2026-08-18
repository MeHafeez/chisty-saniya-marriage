'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

import { ParticleCanvas } from './ParticleCanvas';

/**
 * The fixed atmosphere behind every section: warm gradient wash, two very slow
 * drifting light blooms, gold dust and falling petals, finished with paper grain.
 * Sits at z-index 0 with all content stacked above it.
 */
export function AmbientBackground() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // The whole ground shifts a few percent over the full page — imperceptible
  // per screen, but the bottom of the page feels warmer than the top.
  const warmth = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-ivory" />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: reducedMotion ? 0.5 : warmth,
          background:
            'radial-gradient(120% 80% at 50% 100%, rgba(246,239,231,0.9) 0%, rgba(253,249,245,0) 62%)',
        }}
      />

      {/* Slow light blooms */}
      <motion.div
        className="absolute -left-[18%] top-[6%] h-[52vw] w-[52vw] rounded-full blur-[110px]"
        style={{
          y: reducedMotion ? 0 : blobY,
          background: 'radial-gradient(circle, rgba(198,166,106,0.16), rgba(198,166,106,0) 68%)',
          animation: reducedMotion ? undefined : 'breathe 26s ease-in-out infinite',
        }}
      />
      <motion.div
        className="absolute -right-[14%] top-[52%] h-[46vw] w-[46vw] rounded-full blur-[120px]"
        style={{
          y: reducedMotion ? 0 : blobY,
          background: 'radial-gradient(circle, rgba(221,199,154,0.2), rgba(221,199,154,0) 70%)',
          animation: reducedMotion ? undefined : 'breathe 34s ease-in-out infinite reverse',
        }}
      />

      {/* Vignette keeps the eye centred */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 50%, rgba(253,249,245,0) 55%, rgba(58,46,42,0.055) 100%)',
        }}
      />

      <ParticleCanvas variant="both" density={44} opacity={0.85} />

      {/* Paper grain, last so it sits over everything */}
      <div className="paper-grain absolute inset-0" />
    </div>
  );
}
