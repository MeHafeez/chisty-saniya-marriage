'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import { NAV_LINKS } from '@/constants/wedding';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { cn } from '@/utils/cn';

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

interface ScrollProgressProps {
  visible: boolean;
}

/**
 * Reading position indicator. A hairline rule on desktop with the current
 * section named alongside it; a thin gold bar across the top on mobile.
 */
export function ScrollProgress({ visible }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  const percent = useTransform(progress, (value) => `${Math.round(value * 100)}`);

  const activeId = useActiveSection(SECTION_IDS, visible);
  const activeLabel = NAV_LINKS.find((link) => link.id === activeId)?.label ?? '';

  // Held back over the hero banner along with the rest of the chrome — the
  // artwork is meant to be seen without any interface text on it.
  const pastHero = useScrolledPast('#hero', 120);
  const isVisible = visible && pastHero;

  return (
    <>
      {/* Mobile: top bar */}
      <motion.div
        aria-hidden
        className="no-print fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-soft lg:hidden"
        style={{ scaleX: progress }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Desktop: vertical rule */}
      <motion.div
        className={cn(
          'no-print fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex',
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      >
        <motion.span className="font-sans text-[0.5625rem] tabular-nums tracking-[0.3em] text-muted">
          {percent}
        </motion.span>

        <div className="relative h-40 w-px bg-line">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-gold-deep to-gold-soft"
            style={{ scaleY: progress, height: '100%' }}
          />
        </div>

        <span
          className="font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-gold-deep"
          style={{ writingMode: 'vertical-rl' }}
        >
          {activeLabel}
        </span>
      </motion.div>
    </>
  );
}
