'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineArrowsPointingOut } from 'react-icons/hi2';

import { KenBurns } from './KenBurns';
import { OrnamentalLine, RoyalCorner } from './RoyalOrnaments';
import { EASE } from '@/constants/motion';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { pad } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { GalleryImage } from '@/types';

export interface RoyalSlideshowProps {
  images: readonly GalleryImage[];
  className?: string;
  /** Seconds each slide holds before advancing. */
  interval?: number;
  /** Opens the full-screen viewer. */
  onExpand?: (index: number) => void;
}

/**
 * A cinematic single-frame slideshow.
 *
 * One near-full-width plate at a time, each drifting under Ken Burns, crossfading
 * slowly into the next inside an ornamental gold frame. Works unchanged whether
 * the source is the shipped SVG placeholders or real photographs later — it only
 * reads `src`/`alt`/`caption` off the gallery data.
 */
export function RoyalSlideshow({
  images,
  className,
  interval = 7,
  onExpand,
}: RoyalSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reducedMotion = usePrefersReducedMotion();

  const total = images.length;

  const go = useCallback(
    (delta: 1 | -1) => {
      if (total === 0) return;
      setDirection(delta);
      setIndex((current) => (current + delta + total) % total);
    },
    [total],
  );

  // Advance on a timer, but never while hovered, focused or reduced-motion.
  useEffect(() => {
    if (isPaused || reducedMotion || total <= 1) return;
    const id = window.setTimeout(() => go(1), interval * 1000);
    return () => window.clearTimeout(id);
  }, [index, isPaused, reducedMotion, interval, total, go]);

  if (total === 0) return null;
  const active = images[index]!;

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* ——— The plate ——— */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-tile)] bg-[#1A0F09] sm:aspect-[16/9]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: reducedMotion ? 0.2 : 1.8, ease: EASE.soft }}
          >
            <KenBurns
              src={active.src}
              alt={active.alt}
              duration={22}
              scale={1.09}
              // Alternate the drift so consecutive slides never move alike.
              direction={index % 2 === 0 ? 'in' : 'out'}
              sizes="(max-width: 1024px) 94vw, 70rem"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic grade over the plate */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,12,7,0.35) 0%, rgba(20,12,7,0) 32%, rgba(20,12,7,0.12) 62%, rgba(20,12,7,0.82) 100%)',
          }}
        />

        {/* Ornamental frame */}
        <div aria-hidden className="pointer-events-none absolute inset-3 border border-[#E4C98D]/35" />
        <RoyalCorner corner="top-left" size={86} tone="#EBD7A6" opacity={0.7} className="left-2 top-2" />
        <RoyalCorner corner="top-right" size={86} tone="#EBD7A6" opacity={0.7} className="right-2 top-2" />
        <RoyalCorner corner="bottom-left" size={86} tone="#EBD7A6" opacity={0.7} className="bottom-2 left-2" />
        <RoyalCorner corner="bottom-right" size={86} tone="#EBD7A6" opacity={0.7} className="bottom-2 right-2" />

        {/* Caption + counter */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(1rem,3vw,2rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: EASE.luxe }}
              className="min-w-0"
            >
              <p className="font-script text-2xl leading-tight text-[#F4E6C4] sm:text-3xl">
                {active.caption}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex shrink-0 items-center gap-4">
            <span className="font-sans text-[0.625rem] tabular-nums tracking-[0.28em] text-[#EBD7A6]/85">
              {pad(index + 1, 2)} <span className="text-[#EBD7A6]/40">/</span> {pad(total, 2)}
            </span>
            {onExpand && (
              <button
                type="button"
                onClick={() => onExpand(index)}
                aria-label={`Open ${active.caption} full screen`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBD7A6]/45 text-[#EBD7A6] transition-colors duration-500 hover:border-[#EBD7A6] hover:bg-[#EBD7A6]/10"
              >
                <HiOutlineArrowsPointingOut aria-hidden className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ——— Controls ——— */}
      <div className="mt-7 flex items-center justify-center gap-6">
        <SlideControl direction="prev" onClick={() => go(-1)} />

        {/* Progress pips double as direct navigation */}
        <div className="flex items-center gap-2.5">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Show ${image.caption}`}
              aria-current={i === index}
              className="group relative py-2"
            >
              <span
                className={cn(
                  'block h-px transition-all duration-700 ease-[var(--ease-luxe)]',
                  i === index ? 'w-9 bg-gold' : 'w-4 bg-gold/35 group-hover:bg-gold/70',
                )}
              />
            </button>
          ))}
        </div>

        <SlideControl direction="next" onClick={() => go(1)} />
      </div>

      <OrnamentalLine width={220} className="mx-auto mt-5 opacity-60" />

      {/* Announce slide changes without narrating every tick */}
      <span className="sr-only" aria-live="polite">
        {`Image ${index + 1} of ${total}: ${active.caption}`}
      </span>
      <span className="hidden">{direction}</span>
    </div>
  );
}

function SlideControl({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const Icon = direction === 'prev' ? HiOutlineChevronLeft : HiOutlineChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-500 hover:border-gold hover:bg-gold/10"
    >
      <Icon
        aria-hidden
        className={cn(
          'text-lg transition-transform duration-500 ease-[var(--ease-luxe)]',
          direction === 'prev' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5',
        )}
      />
    </button>
  );
}
