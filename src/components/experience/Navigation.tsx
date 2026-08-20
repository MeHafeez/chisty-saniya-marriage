'use client';

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

import { Divider } from '@/components/ui/Divider';
import { COUPLE_ORDER, NAV_LINKS, WEDDING } from '@/constants/wedding';
import { EASE } from '@/constants/motion';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useNightAtTop } from '@/hooks/useNightAtTop';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { formatLongDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface NavigationProps {
  visible: boolean;
  onNavigate: (href: string) => void;
}

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

const linkVariants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 0.28 + i * 0.07, ease: EASE.luxe },
  }),
  exit: { opacity: 0, y: -24, filter: 'blur(8px)', transition: { duration: 0.4 } },
};

/** Slim monogram bar with a full-screen overlay menu. */
export function Navigation({ visible, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const { scrollY } = useScroll();
  const activeId = useActiveSection(SECTION_IDS, visible);
  // Over a night section the bar flips its own palette rather than sitting on
  // top as a pale slab.
  const overNight = useNightAtTop(56);
  // The banner carries the names in the artwork; keep the chrome off it entirely
  // until the guest has scrolled past.
  const pastHero = useScrolledPast('#hero', 120);
  const isVisible = visible && (pastHero || isOpen);

  useMotionValueEvent(scrollY, 'change', (value) => setIsCondensed(value > 120));

  const handleNavigate = useCallback(
    (href: string) => {
      setIsOpen(false);
      // Let the overlay begin closing before the scroll starts.
      window.setTimeout(() => onNavigate(href), 260);
    },
    [onNavigate],
  );

  // Escape closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <>
      <motion.header
        data-tone={overNight && !isOpen ? 'night' : undefined}
        className={cn(
          'no-print fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-700',
          isCondensed && !isOpen
            ? 'border-b border-line/60 bg-ivory/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -80,
          opacity: isVisible ? 1 : 0,
          // Off the banner it must not intercept clicks either.
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.9, delay: isVisible ? 0.15 : 0, ease: EASE.luxe }}
      >
        <nav
          className="container-luxe flex items-center justify-between py-4 sm:py-5"
          aria-label="Primary"
        >
          <button
            type="button"
            onClick={() => handleNavigate('#hero')}
            className="font-display text-lg tracking-[0.32em] text-ink transition-colors duration-500 hover:text-gold-deep"
            aria-label="Back to top"
          >
            {COUPLE_ORDER[0].initial}
            <span className="mx-1 text-gold">&</span>
            {COUPLE_ORDER[1].initial}
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavigate(link.href)}
                className={cn(
                  'group relative py-1 font-sans text-[0.625rem] uppercase tracking-[0.28em] transition-colors duration-500',
                  activeId === link.id ? 'text-gold-deep' : 'text-muted hover:text-ink',
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ease-[var(--ease-luxe)]',
                    activeId === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="group relative z-[81] flex h-10 w-10 items-center justify-center"
          >
            <span className="relative block h-3 w-6">
              <motion.span
                className="absolute left-0 block h-px w-full bg-ink"
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: EASE.luxe }}
              />
              <motion.span
                className="absolute left-0 top-3 block h-px w-full bg-ink"
                animate={isOpen ? { rotate: -45, y: -6, width: '100%' } : { rotate: 0, y: 0, width: '65%' }}
                transition={{ duration: 0.5, ease: EASE.luxe }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="no-print fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ivory"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.8, ease: EASE.drama } }}
            transition={{ duration: 0.9, ease: EASE.drama }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="paper-grain absolute inset-0 bg-gradient-to-b from-ivory to-champagne/60" />

            {/* Close button for mobile and desktop */}
            <motion.button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 hover:text-gold-deep"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.5 } }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <HiOutlineXMark className="text-2xl" />
            </motion.button>

            <nav className="relative z-10 flex flex-col items-center gap-1 text-center">
              {NAV_LINKS.map((link, index) => (
                <motion.button
                  key={link.id}
                  type="button"
                  custom={index}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => handleNavigate(link.href)}
                  className="group relative px-4 py-1.5 font-display text-[clamp(1.9rem,6vw,3.4rem)] font-light leading-tight text-ink transition-colors duration-500 hover:text-gold-deep sm:py-2"
                >
                  <span className="absolute -left-6 top-1/2 h-px w-4 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:scale-x-100" />
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              className="relative z-10 mt-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.9, duration: 1 } }}
              exit={{ opacity: 0 }}
            >
              <Divider width={200} />
              <p className="mt-6 font-serif text-sm font-light tracking-[0.18em] text-muted">
                {formatLongDate(WEDDING.date)}
              </p>
              <p className="mt-2 font-sans text-[0.625rem] uppercase tracking-[0.32em] text-gold-deep">
                {WEDDING.hashtag}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
