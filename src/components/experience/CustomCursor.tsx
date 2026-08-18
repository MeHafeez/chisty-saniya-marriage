'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]';

/**
 * Two-part cursor: a solid gold dot that tracks exactly, and a lagging ring
 * with a soft glow. The ring expands over anything interactive.
 * Never renders on touch devices, and never under reduced-motion.
 */
export function CustomCursor() {
  const finePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 240, damping: 26, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 240, damping: 26, mass: 0.55 });
  const dotX = useSpring(x, { stiffness: 900, damping: 42, mass: 0.25 });
  const dotY = useSpring(y, { stiffness: 900, damping: 42, mass: 0.25 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.dataset.cursor = 'custom';

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!isVisible) setIsVisible(true);

      const target = event.target as Element | null;
      setIsHovering(Boolean(target?.closest(INTERACTIVE)));
    };

    const leave = () => setIsVisible(false);
    const down = () => setIsPressed(true);
    const up = () => setIsPressed(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled, isVisible, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      {/* Lagging ring + glow */}
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-gold/60"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 24px 6px rgba(198,166,106,0.18)',
        }}
        animate={{
          width: isHovering ? 62 : 34,
          height: isHovering ? 62 : 34,
          opacity: isVisible ? (isHovering ? 0.95 : 0.6) : 0,
          backgroundColor: isHovering ? 'rgba(198,166,106,0.1)' : 'rgba(198,166,106,0)',
          scale: isPressed ? 0.82 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />

      {/* Precise dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-gold"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHovering ? 4 : 7,
          height: isHovering ? 4 : 7,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </div>
  );
}
