'use client';

import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * What the page is allowed to do with motion — decided in one place, on purpose.
 *
 * `prefers-reduced-motion` is a request about vestibular comfort. It is about
 * large, sweeping or unexpected travel: leaves swinging open in 3D, a camera
 * pushing to nearly twice its size, long parallax slides. It is not a request
 * for a still page.
 *
 * This site used to read it as one. Five components answered it independently
 * with `return null` and the opening collapsed to a third of a second, so a
 * guest who had the setting on opened their invitation to a cream rectangle:
 * no petals, no dust, no doors. Several Android skins turn that setting on by
 * themselves the moment battery saver engages, so it is not a rare guest.
 *
 * The rule, and the reason this lives in one module rather than in each
 * component: `calm` suppresses *travel*, and thins and slows everything else
 * instead of deleting it. Ambient decoration stays — petals drifting down, dust
 * hanging in the light — because none of it moves far or fast enough to be what
 * the setting is protecting anyone from. Anything that sweeps, zooms or flies
 * is what has to go, and that is a judgement each new component should inherit
 * rather than make again.
 */
export type MotionLevel = 'full' | 'calm';

export function useMotionLevel(): MotionLevel {
  return usePrefersReducedMotion() ? 'calm' : 'full';
}

/** How far ambient decoration is thinned and slowed when the level is `calm`. */
export const CALM = { density: 0.4, speed: 0.4 } as const;

export interface Ambient {
  count: number;
  speed: number;
  calm: boolean;
}

/**
 * Scales an ambient decoration for the current level. The count never reaches
 * zero: `calm` thins the air, it does not empty it.
 */
export function useAmbient(count: number, speed = 1): Ambient {
  const calm = useMotionLevel() === 'calm';
  if (!calm) return { count, speed, calm };
  return {
    count: Math.max(1, Math.round(count * CALM.density)),
    speed: speed * CALM.speed,
    calm,
  };
}
