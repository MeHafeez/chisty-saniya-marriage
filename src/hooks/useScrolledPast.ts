'use client';

import { useEffect, useState } from 'react';

/**
 * Reports whether the page has scrolled past a given element.
 *
 * Used to keep the fixed chrome off the hero banner: the artwork already carries
 * the couple's names, so navigation over it would print them twice and clutter
 * the one image the guest is meant to take in.
 *
 * @param selector Element to clear, e.g. `'#hero'`.
 * @param offset   Pixels before the element's bottom at which to flip.
 */
export function useScrolledPast(selector: string, offset = 140): boolean {
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const element = document.querySelector(selector);

      // No such element — nothing to clear, so never withhold the chrome.
      if (!element) {
        setHasPassed(true);
        return;
      }

      const rect = element.getBoundingClientRect();
      setHasPassed(rect.bottom <= offset);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [selector, offset]);

  return hasPassed;
}
