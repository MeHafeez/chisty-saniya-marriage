'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * SSR-safe media query. Always reports `false` on the server so the first paint
 * matches the mobile-first markup, then corrects on hydration.
 *
 * Both callbacks are memoised on `query`. `useSyncExternalStore` tears down and
 * re-adds its listener whenever `subscribe` changes identity, and these hooks
 * are called from a great many components — an inline closure meant every one
 * of them removed and re-attached a `matchMedia` listener on every render.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px)');
export const useHasFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
