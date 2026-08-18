'use client';

import { motion } from 'framer-motion';

import { fadeUp, stagger } from '@/animations/variants';
import { VIEWPORT } from '@/constants/motion';
import { cn } from '@/utils/cn';
import { Divider } from './Divider';
import { SplitText } from './SplitText';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Rendered in Great Vibes, tucked above the title like a hand-written note. */
  script?: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
  divider?: boolean;
}

/** The consistent three-part heading used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  script,
  description,
  align = 'center',
  className,
  divider = true,
}: SectionHeadingProps) {
  const centred = align === 'center';

  return (
    <motion.header
      className={cn(
        'flex flex-col',
        centred ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
      variants={stagger(0, 0.14)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: VIEWPORT.margin }}
    >
      {eyebrow && (
        <motion.p variants={fadeUp} className="eyebrow mb-5">
          {eyebrow}
        </motion.p>
      )}

      {script && (
        <motion.p
          variants={fadeUp}
          className="font-script text-3xl text-gold sm:text-4xl md:text-5xl"
        >
          {script}
        </motion.p>
      )}

      <SplitText
        as="h2"
        text={title}
        mode="char"
        stagger={0.022}
        className={cn(
          'font-display text-ink',
          'text-[length:var(--text-h2)] leading-[0.98]',
          script && 'mt-2',
        )}
      />

      {divider && (
        <Divider className={cn('mt-7 w-full', centred ? 'mx-auto' : 'mx-0')} width={centred ? 240 : 180} />
      )}

      {description && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'mt-7 max-w-xl text-[length:var(--text-lead)] font-light leading-relaxed text-muted',
            centred && 'mx-auto',
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.header>
  );
}
