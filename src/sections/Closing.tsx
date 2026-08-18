'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { GirihCorner } from '@/components/decor/islamic/GirihCorner';
import { ParticleCanvas } from '@/components/decor/ParticleCanvas';
import { SuccessBloom } from '@/components/form/SuccessBloom';
import { IslamicMonogram } from '@/components/decor/islamic/IslamicMonogram';
import { Divider } from '@/components/ui/Divider';
import { SplitText } from '@/components/ui/SplitText';
import { CLOSING, COUPLE_ORDER, WEDDING } from '@/constants/wedding';
import { EASE } from '@/constants/motion';
import { formatLongDate } from '@/utils/format';

/** Section 12 — the last word. A flower opens, and the invitation closes. */
export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      id="closing"
      aria-label="Thank you"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-[var(--spacing-section)]"
    >
      <div className="paper-grain absolute inset-0 bg-gradient-to-b from-ivory via-champagne/50 to-ivory" />
      <ParticleCanvas variant="petals" density={30} opacity={0.65} />

      <GirihCorner corner="top-left" size={300} opacity={0.34} />
      <GirihCorner corner="top-right" size={300} opacity={0.34} delay={0.15} />
      <GirihCorner corner="bottom-left" size={300} opacity={0.34} delay={0.3} />
      <GirihCorner corner="bottom-right" size={300} opacity={0.34} delay={0.45} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* The bloom only opens once the section is properly in view. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 1.4, ease: EASE.luxe }}
        >
          {inView && <SuccessBloom size={150} className="opacity-90" />}
        </motion.div>

        <SplitText
          as="h2"
          text={CLOSING.heading}
          mode="char"
          stagger={0.06}
          delay={0.8}
          className="mt-12 font-script text-[length:var(--text-h1)] leading-[1.1] text-foil"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-8 w-full"
        >
          <Divider className="mx-auto" width={260} variant="leaf" />
        </motion.div>

        <div className="mt-10 flex flex-col gap-4">
          {CLOSING.lines.map((line, index) => (
            <motion.p
              key={line}
              className="text-pretty font-serif text-[length:var(--text-lead)] font-light leading-relaxed text-muted"
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 26, filter: 'blur(8px)' }
              }
              transition={{ duration: 1.2, delay: 1.6 + index * 0.32, ease: EASE.luxe }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="mt-12 font-display text-[length:var(--text-h3)] font-light italic leading-tight text-ink"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.5, delay: 2.7, ease: EASE.luxe }}
        >
          {CLOSING.farewell}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.6, delay: 3, ease: EASE.luxe }}
          className="mt-14"
        >
          <IslamicMonogram size={124} animate={inView} delay={3.1} />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.4, delay: 3.6 }}
        >
          <p className="font-script text-3xl text-ink sm:text-4xl">
            {COUPLE_ORDER[0].name} &amp; {COUPLE_ORDER[1].name}
          </p>
          <p className="font-sans text-[0.625rem] uppercase tracking-[0.36em] text-gold-deep">
            {formatLongDate(WEDDING.date)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
