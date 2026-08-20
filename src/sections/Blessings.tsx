'use client';

import { motion } from 'framer-motion';

import { FloatingHearts } from '@/components/decor/FloatingHearts';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BLESSINGS } from '@/constants/wedding';
import { EASE, VIEWPORT } from '@/constants/motion';

/** Section 11 — words from the people who love them. */
export function Blessings() {
  return (
    <Section id="blessings" tone="champagne" label="Blessings and wishes" className="overflow-hidden">
      <FloatingHearts count={16} />

      <SectionHeading
        eyebrow="What Allah Says"
        script="About"
        title="Marriage"
        description="The Quranic guidance for this sacred union."
      />

      <div className="relative mt-14 flex justify-center sm:mt-18">
        {BLESSINGS.map((blessing) => (
          <motion.figure
            key={blessing.id}
            className="group w-full max-w-2xl rounded-[var(--radius-card)] border border-line bg-ivory/55 p-8 backdrop-blur-sm transition-all duration-700 ease-[var(--ease-luxe)] hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-[var(--shadow-lift)] sm:p-10"
            initial={{ opacity: 0, y: 54, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.25, margin: VIEWPORT.margin }}
            transition={{ duration: 1.3, ease: EASE.luxe }}
          >
            {/* Opening quote mark */}
            <span
              aria-hidden
              className="relative -top-2 left-0 block font-display text-[5.5rem] leading-none text-gold/25 transition-colors duration-700 group-hover:text-gold/45"
            >
              &ldquo;
            </span>

            <blockquote className="relative -mt-6">
              <p className="text-pretty font-serif text-[length:var(--text-lead)] font-light italic leading-[1.9] text-ink/90">
                {blessing.message}
              </p>
            </blockquote>

            <figcaption className="mt-8 border-t border-line pt-6 text-center">
              <span className="block font-display text-lg leading-tight text-ink">
                {blessing.name}
              </span>
              <span className="mt-2 block font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
                {blessing.relation}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
