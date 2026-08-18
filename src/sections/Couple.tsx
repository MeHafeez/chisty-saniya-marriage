'use client';

import { motion } from 'framer-motion';

import { CoupleCard } from '@/components/cards/CoupleCard';
import { GirihCorner } from '@/components/decor/islamic/GirihCorner';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COUPLE_ORDER } from '@/constants/wedding';
import { EASE } from '@/constants/motion';

/** Section 03 — the two people this is all about. */
export function Couple() {
  return (
    <Section id="couple" tone="champagne" label="The bride and groom">
      <GirihCorner corner="top-right" size={240} opacity={0.3} />
      <GirihCorner corner="bottom-left" size={240} opacity={0.3} />

      <SectionHeading
        eyebrow="Two Families, One Bond"
        script="Meet the"
        title="Groom & Bride"
        description="With the blessings of Almighty Allah and of their elders, two families are joined."
      />

      <div className="relative mt-14 grid gap-20 sm:mt-18 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 xl:gap-16">
        <div className="flex justify-center lg:justify-end">
          <CoupleCard person={COUPLE_ORDER[0]} align="right" priority />
        </div>

        {/* The ampersand column */}
        <div className="flex items-center justify-center lg:flex-col lg:gap-8">
          <motion.span
            className="hidden h-24 w-px bg-gradient-to-b from-transparent to-gold/50 lg:block"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE.luxe }}
            style={{ transformOrigin: 'top' }}
          />
          <motion.span
            className="font-display text-6xl font-light text-gold sm:text-7xl"
            initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.34, 1.26, 0.64, 1] }}
          >
            &
          </motion.span>
          <motion.span
            className="hidden h-24 w-px bg-gradient-to-t from-transparent to-gold/50 lg:block"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE.luxe }}
            style={{ transformOrigin: 'bottom' }}
          />
        </div>

        <div className="flex justify-center lg:justify-start">
          <CoupleCard person={COUPLE_ORDER[1]} align="left" delay={0.15} />
        </div>
      </div>
    </Section>
  );
}
