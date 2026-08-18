'use client';

import { motion } from 'framer-motion';

import { useNightAtTop } from '@/hooks/useNightAtTop';
import { cn } from '@/utils/cn';

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}

const BARS = [0.45, 0.9, 0.6, 1, 0.5];

/**
 * Ambient-sound control. The equaliser bars animate only while playing, so the
 * button reads as "on" without needing a label.
 */
export function MusicToggle({ isPlaying, onToggle, visible }: MusicToggleProps) {
  // Probed at the button's own height so it inverts with the section behind it.
  const overNight = useNightAtTop(
    typeof window === 'undefined' ? 56 : window.innerHeight - 60,
  );

  return (
    <motion.button
      type="button"
      data-tone={overNight ? 'night' : undefined}
      onClick={onToggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      className={cn(
        'no-print group fixed bottom-7 left-6 z-50 flex h-12 w-12 items-center justify-center',
        // Struck gold disc rather than a translucent chip, so it belongs to the
        // same stationery as everything else.
        'rounded-full border border-gold/60 backdrop-blur-md',
        'transition-colors duration-500 hover:border-gold-soft',
        'sm:bottom-9 sm:left-9',
      )}
      style={{
        background:
          'radial-gradient(circle at 34% 28%, rgba(255,246,223,0.9) 0%, rgba(233,203,141,0.55) 42%, rgba(142,108,34,0.35) 100%)',
        boxShadow: '0 6px 18px -8px rgba(47,37,33,0.5), inset 0 1px 2px rgba(255,246,223,0.7)',
      }}
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        y: visible ? 0 : 16,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: visible ? 1.2 : 0 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Thin ring that pulses outward only while playing */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border border-gold/55"
        animate={isPlaying ? { scale: [1, 1.5], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
        transition={
          isPlaying ? { duration: 2.6, repeat: Infinity, ease: 'easeOut' } : { duration: 0.4 }
        }
      />
      {/* Second, offset ring for depth */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border border-gold/35"
        animate={isPlaying ? { scale: [1, 1.9], opacity: [0.4, 0] } : { scale: 1, opacity: 0 }}
        transition={
          isPlaying
            ? { duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }
            : { duration: 0.4 }
        }
      />

      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {BARS.map((height, index) => (
          <motion.span
            key={index}
            className="w-[2px] rounded-full bg-[#4E3A16]"
            initial={{ height: 3 }}
            animate={
              isPlaying
                ? { height: [3, 16 * height, 5, 13 * height, 3] }
                : { height: 3 }
            }
            transition={
              isPlaying
                ? {
                    duration: 1.1 + index * 0.17,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.08,
                  }
                : { duration: 0.4, ease: 'easeOut' }
            }
          />
        ))}
      </span>
    </motion.button>
  );
}
