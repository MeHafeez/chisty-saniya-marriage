'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { Lightbox } from '@/components/gallery/Lightbox';
import { GoldParticles } from '@/components/royal/GoldParticles';
import { RoyalSlideshow } from '@/components/royal/RoyalSlideshow';
import { GirihCorner } from '@/components/decor/islamic/GirihCorner';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GALLERY } from '@/constants/wedding';
import { EASE } from '@/constants/motion';

/**
 * Section 08 — the gallery, presented as one cinematic frame at a time.
 *
 * Reads `GALLERY` unchanged. The shipped assets are generated placeholders, so
 * nothing here claims to be a photograph — when real photographs replace those
 * paths this component needs no edit.
 */
export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="gallery" tone="night" label="Photo gallery" className="overflow-hidden">
      <GirihCorner corner="top-right" size={240} opacity={0.2} />
      <GirihCorner corner="bottom-left" size={240} opacity={0.2} />
      <GoldParticles count={26} intensity={0.6} opacity={0.6} />

      <SectionHeading
        eyebrow="Moments We Keep"
        script="A few of our"
        title="Favourite Frames"
        description="Photographs from the days that brought two families together."
      />

      <motion.div
        className="mx-auto mt-14 w-full max-w-5xl sm:mt-18"
        initial={{ opacity: 0, y: 44, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.6, ease: EASE.luxe }}
      >
        <RoyalSlideshow images={GALLERY} onExpand={setActiveIndex} />
      </motion.div>

      <Lightbox
        images={GALLERY}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </Section>
  );
}
