'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import { fadeUp } from '@/animations/variants';
import { VIEWPORT } from '@/constants/motion';
import { cn } from '@/utils/cn';

/** Restricted to the tags this project actually reveals — keeps the lookup total. */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  figure: motion.figure,
} as const;

export interface RevealProps {
  children: ReactNode;
  /** Any variant pair with `hidden` / `visible` states. Defaults to fade-up-blur. */
  variants?: Variants;
  delay?: number;
  className?: string;
  as?: keyof typeof TAGS;
  /** Re-run the reveal every time the element re-enters the viewport. */
  repeat?: boolean;
  amount?: number;
}

/**
 * The workhorse scroll reveal. Wrap anything; it stays hidden until it enters
 * the viewport, then plays the house fade-up-blur (or a variant you pass).
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = 'div',
  repeat = false,
  amount = VIEWPORT.amount,
}: RevealProps) {
  const MotionTag = TAGS[as];

  return (
    <MotionTag
      className={cn('will-animate', className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount, margin: VIEWPORT.margin }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
