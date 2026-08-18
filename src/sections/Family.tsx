'use client';

import { motion } from 'framer-motion';

import { Ornament } from '@/components/decor/Ornament';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { COUPLE, FAMILY, WELL_WISHERS } from '@/constants/wedding';
import { EASE, STAGGER, VIEWPORT } from '@/constants/motion';
import type { FamilyMember } from '@/types';

const card = {
  hidden: { opacity: 0, y: 34, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE.luxe } },
};

interface FamilyColumnProps {
  title: string;
  subtitle: string;
  members: readonly FamilyMember[];
  delay: number;
}

function FamilyColumn({ title, subtitle, members, delay }: FamilyColumnProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      variants={{ visible: { transition: { delayChildren: delay, staggerChildren: STAGGER.base } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: VIEWPORT.margin }}
    >
      <motion.div variants={card}>
        <Ornament variant="wreath" size={40} className="opacity-75" />
      </motion.div>

      <motion.p variants={card} className="eyebrow mt-5">
        {subtitle}
      </motion.p>

      <motion.h3
        variants={card}
        className="mt-3 font-display text-[length:var(--text-h3)] font-light leading-tight text-ink"
      >
        {title}
      </motion.h3>

      <motion.span variants={card} className="mt-6 h-px w-16 bg-gold/50" />

      <ul className="mt-9 flex w-full flex-col gap-3">
        {members.map((member) => (
          <motion.li
            key={member.id}
            variants={card}
            className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-ivory/50 px-6 py-5 backdrop-blur-sm transition-all duration-700 ease-[var(--ease-luxe)] hover:-translate-y-1 hover:border-gold/45 hover:bg-ivory hover:shadow-[var(--shadow-lift)]"
          >
            {/* Gold rule that grows in from the left */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-gold transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-y-100"
            />
            <p className="font-serif text-[length:var(--text-lead)] font-light leading-snug text-ink">
              {member.name}
            </p>
            <p className="mt-1.5 font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted transition-colors duration-500 group-hover:text-gold-deep">
              {member.relation}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Section 09 — the families whose blessing makes this possible. */
export function Family() {
  const brideSide = FAMILY.filter((member) => member.side === 'bride');
  const groomSide = FAMILY.filter((member) => member.side === 'groom');

  return (
    <Section id="family" tone="champagne" label="Our families">
      <SectionHeading
        eyebrow="With Their Blessings"
        script="Our beloved"
        title="Families"
        description="No two people marry alone. These are the hands that raised them and the elders whose blessings brought this day about."
      />

      <div className="relative mt-14 grid gap-16 sm:mt-18 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
        <FamilyColumn
          title={`The ${COUPLE.groom.familyName} Family`}
          subtitle="Groom's Side"
          members={groomSide}
          delay={0}
        />

        <motion.span
          className="mx-auto hidden w-px bg-gradient-to-b from-transparent via-line to-transparent lg:block"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE.luxe }}
        />

        <FamilyColumn
          title={`The ${COUPLE.bride.familyName} Family`}
          subtitle="Bride's Side"
          members={brideSide}
          delay={0.2}
        />
      </div>

      {/* "Best compliments from" — reproduced from the printed card. */}
      <motion.div
        className="mt-20 flex flex-col items-center text-center"
        variants={{ visible: { transition: { staggerChildren: STAGGER.base } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3, margin: VIEWPORT.margin }}
      >
        <motion.div variants={card}>
          <Ornament variant="sprig" size={58} className="opacity-70" />
        </motion.div>

        <motion.h3 variants={card} className="eyebrow mt-6">
          {WELL_WISHERS.heading}
        </motion.h3>

        <motion.ul
          variants={card}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-5"
        >
          {WELL_WISHERS.names.map((name, index) => (
            <motion.li key={name} variants={card} className="flex items-center gap-3 sm:gap-5">
              <span className="font-serif text-[length:var(--text-lead)] font-light leading-snug text-ink">
                {name}
              </span>
              {index < WELL_WISHERS.names.length - 1 && (
                <span aria-hidden className="hidden h-1 w-1 rotate-45 bg-gold/60 sm:block" />
              )}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={card} className="mt-8 flex items-center gap-4">
          <span className="h-px w-12 bg-gold/45" />
          <span className="font-script text-2xl text-gold">{WELL_WISHERS.closing}</span>
          <span className="h-px w-12 bg-gold/45" />
        </motion.div>
      </motion.div>
    </Section>
  );
}
