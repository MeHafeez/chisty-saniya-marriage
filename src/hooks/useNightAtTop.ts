'use client';

import { useEffect, useState } from 'react';

/**
 * Reports whether a night-toned section is currently under the top chrome.
 *
 * The fixed header and music toggle otherwise sit as a pale slab over the dark
 * sections. Knowing this lets them flip their own palette to match.
 *
 * @param offset Distance from the top of the viewport to probe, in pixels.
 */
export function useNightAtTop(offset = 56): boolean {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone="night"]'));
    if (sections.length === 0) return;

    let frame = 0;

    const check = () => {
      frame = 0;
      setIsNight(
        sections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= offset && rect.bottom >= offset;
        }),
      );
    };

    // Coalesce to one read per frame; scroll fires far more often than that.
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
  }, [offset]);

  return isNight;
}
