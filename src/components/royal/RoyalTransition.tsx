'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { GoldParticles } from './GoldParticles';
import { FloralAccent, OrnamentalLine } from './RoyalOrnaments';

type Tone = 'cream' | 'night';

export interface RoyalTransitionProps {
  /** Ground the transition is leaving. */
  from: Tone;
  /** Ground the transition is arriving at. */
  to: Tone;
  /** Which ornament carries the join — varied so the page has a rhythm. */
  motif?: 'line' | 'sprig' | 'swag' | 'dust' | 'none';
  className?: string;
}

const GROUND: Record<Tone, string> = {
  cream: 'var(--royal-cream)',
  night: 'var(--royal-bg)',
};

/**
 * The seam between two sections.
 *
 * Rather than a hard cut, each join blends the two grounds through a gradient,
 * lays a gold ornament across the middle, and — where the guest is crossing
 * into or out of the dark — drifts a little gold dust through it. Same visual
 * language every time, different motif, so the page reads as one continuous
 * document instead of a stack of components.
 */
export function RoyalTransition({ from, to, motif = 'line', className }: RoyalTransitionProps) {
  const crossesTone = from !== to;

  return (
    <div
      aria-hidden
      className={cn('relative isolate w-full overflow-hidden', className)}
      style={{ height: crossesTone ? 'clamp(6rem,12vw,11rem)' : 'clamp(4rem,8vw,7rem)' }}
    >
      {/* Ground blend */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${GROUND[from]} 0%, ${GROUND[to]} 100%)` }}
      />

      {/* Warm light pooling at the seam */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 90% at 50% 50%, rgba(201,164,92,0.2) 0%, rgba(201,164,92,0) 72%)',
        }}
      />

      {/* Gold dust only where the tone actually changes — otherwise it is noise */}
      {crossesTone && motif !== 'none' && (
        <GoldParticles count={16} intensity={0.7} opacity={0.75} />
      )}

      {/* The motif itself, drawing open as the seam enters view */}
      {motif !== 'none' && motif !== 'dust' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {motif === 'line' && <OrnamentalLine width={280} className="text-[--royal-gold]" />}
          {motif === 'sprig' && <FloralAccent variant="sprig" size={64} className="text-[--royal-gold]" />}
          {motif === 'swag' && <FloralAccent variant="swag" size={54} className="text-[--royal-gold]" />}
        </motion.div>
      )}

      {/* Hairlines seating the seam against both neighbours */}
      <span className="absolute inset-x-0 top-0 h-px bg-gold/20" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-gold/20" />
    </div>
  );
}
