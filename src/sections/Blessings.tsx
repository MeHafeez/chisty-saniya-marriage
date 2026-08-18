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
        eyebrow="Duas For The Couple"
        script="Blessings &"
        title="Good Wishes"
        description="The prayers said over every marriage, and the ones we hold for this one."
      />

      <div className="relative mt-14 columns-1 gap-6 sm:mt-18 md:columns-2">
        {BLESSINGS.map((blessing, index) => (
          <motion.figure
            key={blessing.id}
            className="group relative mb-6 break-inside-avoid rounded-[var(--radius-card)] border border-line bg-ivory/55 p-8 backdrop-blur-sm transition-all duration-700 ease-[var(--ease-luxe)] hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-[var(--shadow-lift)] sm:p-10"
            initial={{ opacity: 0, y: 54, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.25, margin: VIEWPORT.margin }}
            transition={{ duration: 1.3, delay: (index % 2) * 0.14, ease: EASE.luxe }}
          >
            {/* Opening quote mark */}
            <span
              aria-hidden
              className="absolute -top-2 left-6 font-display text-[5.5rem] leading-none text-gold/25 transition-colors duration-700 group-hover:text-gold/45"
            >
              &ldquo;
            </span>

            <blockquote className="relative pt-8">
              <p className="text-pretty font-serif text-[length:var(--text-lead)] font-light italic leading-[1.9] text-ink/90">
                {blessing.message}
              </p>
            </blockquote>

            <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
              {/* Initial disc */}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-champagne font-display text-lg text-gold-deep transition-colors duration-700 group-hover:border-gold/60">
                {blessing.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block font-script text-2xl leading-tight text-ink">
                  {blessing.name}
                </span>
                <span className="mt-0.5 block font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
                  {blessing.relation}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
