'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { AmbientBackground } from '@/components/decor/AmbientBackground';
import { MaterialDefs } from '@/components/decor/islamic/MaterialDefs';
import { useExperience } from '@/context/ExperienceProvider';
import { EASE } from '@/constants/motion';
import { RoyalOpening } from './RoyalOpening';
import { CustomCursor } from './CustomCursor';
import { Loader } from './Loader';
import { MusicToggle } from './MusicToggle';
import { Navigation } from './Navigation';
import { ScrollProgress } from './ScrollProgress';

/**
 * Composes the three acts around the page content and owns every fixed-position
 * chrome element. The content itself stays mounted throughout so the browser
 * has already painted it by the time the cover lifts.
 */
export function ExperienceShell({ children }: { children: ReactNode }) {
  const { phase, progress, isRevealed, beginOpening, openInvitation, scrollTo, audio } =
    useExperience();

  return (
    <>
      {/* Shared geometry + lighting filters — must exist before anything uses them. */}
      <MaterialDefs />
      <AmbientBackground />
      <CustomCursor />

      <a
        href="#welcome"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[300] focus:bg-ink focus:px-5 focus:py-3 focus:font-sans focus:text-xs focus:uppercase focus:tracking-[0.25em] focus:text-ivory"
      >
        Skip to invitation
      </a>

      <Navigation visible={isRevealed} onNavigate={scrollTo} />
      <ScrollProgress visible={isRevealed} />
      {audio.isAvailable && (
        <MusicToggle isPlaying={audio.isPlaying} onToggle={audio.toggle} visible={isRevealed} />
      )}

      <AnimatePresence mode="wait">
        {phase === 'loading' && <Loader key="loader" progress={progress} />}
        {phase === 'cover' && (
          <RoyalOpening key="cover" onBegin={beginOpening} onOpen={openInvitation} />
        )}
      </AnimatePresence>

      <motion.main
        id="content"
        // Kept out of the tab order and the a11y tree until the guest opens it.
        aria-hidden={!isRevealed}
        className={isRevealed ? undefined : 'pointer-events-none select-none'}
        initial={{ opacity: 0, scale: 1.03, filter: 'blur(14px)' }}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 1.03, filter: 'blur(14px)' }
        }
        transition={{ duration: 2.2, ease: EASE.luxe, delay: isRevealed ? 0.35 : 0 }}
      >
        {children}
      </motion.main>
    </>
  );
}
