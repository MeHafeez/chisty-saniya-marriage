'use client';

import { motion } from 'framer-motion';
import type { ElementType } from 'react';

import { letterReveal, maskLine } from '@/animations/variants';
import { splitWords } from '@/animations/splitText';
import { DURATION, EASE, VIEWPORT } from '@/constants/motion';
import { cn } from '@/utils/cn';

export interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** `char` for display headlines, `word` for sub-heads, `line` for a masked slide. */
  mode?: 'char' | 'word' | 'line';
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll — used inside the loader and cover. */
  animateOnMount?: boolean;
  /**
   * Externally controlled trigger. When provided it overrides both other modes:
   * the text holds its hidden state until `active` flips true. The hero needs
   * this because it is on screen — and would otherwise self-trigger — while
   * still concealed behind the cover.
   */
  active?: boolean;
  repeat?: boolean;
}

/**
 * Typographic reveal that keeps text accessible: the animated glyphs are
 * `aria-hidden` and a visually-hidden copy carries the real string for
 * screen readers and for copy-paste.
 */
export function SplitText({
  text,
  as = 'span',
  className,
  mode = 'char',
  delay = 0,
  stagger = 0.028,
  animateOnMount = false,
  active,
  repeat = false,
}: SplitTextProps) {
  const Tag = as;
  const words = splitWords(text);

  const motionProps =
    active !== undefined
      ? { initial: 'hidden' as const, animate: active ? ('visible' as const) : ('hidden' as const) }
      : animateOnMount
        ? { initial: 'hidden' as const, animate: 'visible' as const }
        : {
            initial: 'hidden' as const,
            whileInView: 'visible' as const,
            viewport: { once: !repeat, amount: 0.4, margin: VIEWPORT.margin },
          };

  if (mode === 'line') {
    return (
      <Tag className={cn('block', className)}>
        <span className="sr-only">{text}</span>
        <motion.span className="split-line" aria-hidden {...motionProps}>
          <motion.span
            className="block will-animate"
            variants={maskLine}
            transition={{ delay, duration: DURATION.cinematic, ease: EASE.luxe }}
          >
            {text}
          </motion.span>
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag className={cn('inline-block', className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline-block [perspective:800px]"
        {...motionProps}
        variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {words.map((word, wordIndex) => (
          <span key={`${word.text}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {mode === 'char' ? (
              word.chars.map((char, charIndex) => (
                <motion.span
                  key={`${char}-${charIndex}`}
                  className="inline-block will-animate [transform-style:preserve-3d]"
                  variants={letterReveal}
                >
                  {char}
                </motion.span>
              ))
            ) : (
              <motion.span className="inline-block will-animate" variants={letterReveal}>
                {word.text}
              </motion.span>
            )}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
