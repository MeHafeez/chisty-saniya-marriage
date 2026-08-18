'use client';

import { motion } from 'framer-motion';
import { HiOutlineArrowLongUp } from 'react-icons/hi2';

import { COUPLE_ORDER, WEDDING } from '@/constants/wedding';
import { useExperience } from '@/context/ExperienceProvider';
import { formatLongDate } from '@/utils/format';

/** The quiet last line of the page. */
export function Footer() {
  const { scrollTo } = useExperience();

  const openHallowByte = () => {
    window.open('https://www.hallowbyte.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="relative border-t border-line bg-ivory py-14">
      <div className="container-luxe flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
        {/* Couple */}
        <div>
          <p className="font-display text-lg tracking-[0.3em] text-ink">
            {COUPLE_ORDER[0].initial}
            <span className="mx-1.5 text-gold">&amp;</span>
            {COUPLE_ORDER[1].initial}
          </p>

          <p className="mt-2 font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted">
            {formatLongDate(WEDDING.date)} · {WEDDING.city}
          </p>
        </div>

        {/* Hashtag */}
        <p className="font-script text-2xl text-gold">
          {WEDDING.hashtag}
        </p>

        {/* HallowByte */}
        <motion.button
          type="button"
          onClick={openHallowByte}
          className="group flex flex-col items-center text-center"
          whileHover={{ y: -2 }}
          aria-label="Visit HallowByte"
        >
          <span className="font-sans text-[0.5rem] uppercase tracking-[0.28em] text-muted">
            Crafted with love by
          </span>

          <span className="mt-1 font-display text-sm tracking-[0.18em] text-ink transition-colors duration-500 group-hover:text-gold-deep">
            HALLOWBYTE
          </span>

          <span className="mt-1 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
        </motion.button>

        {/* Back to top */}
        <motion.button
          type="button"
          onClick={() => scrollTo('#hero')}
          className="no-print group flex items-center gap-3 font-sans text-[0.5625rem] uppercase tracking-[0.3em] text-muted transition-colors duration-500 hover:text-gold-deep"
          whileHover={{ y: -2 }}
          aria-label="Back to the top of the invitation"
        >
          Back to top

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-500 group-hover:border-gold">
            <HiOutlineArrowLongUp
              aria-hidden
              className="transition-transform duration-500 group-hover:-translate-y-0.5"
            />
          </span>
        </motion.button>
      </div>
    </footer>
  );
}