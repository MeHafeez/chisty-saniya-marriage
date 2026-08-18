/**
 * Every duration, delay and curve in the experience lives here.
 * Cinematic timing means slow, overlapping, never-instant — these numbers
 * are deliberately longer than a typical marketing site.
 */

type Bezier = [number, number, number, number];

/** Custom cubic-béziers. `EASE.luxe` is the house curve: heavy out, weightless in. */
export const EASE = {
  luxe: [0.16, 1, 0.3, 1] as Bezier,
  soft: [0.25, 0.46, 0.45, 0.94] as Bezier,
  drama: [0.77, 0, 0.175, 1] as Bezier,
  gentle: [0.4, 0, 0.2, 1] as Bezier,
  overshoot: [0.34, 1.26, 0.64, 1] as Bezier,
} as const;

/** GSAP takes eases as strings. */
export const GSAP_EASE = {
  luxe: 'power4.out',
  soft: 'power2.out',
  drama: 'expo.inOut',
  float: 'sine.inOut',
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  cinematic: 1.8,
  epic: 2.6,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.09,
  loose: 0.16,
  line: 0.28,
} as const;

/**
 * Loading + portal choreography, in seconds.
 *
 * The entrance runs: seal breaks → both leaves swing (`doorsOpen`) → the camera
 * travels through the archway (`cameraPush`) → the invitation is revealed.
 */
export const SEQUENCE = {
  loaderMinimum: 2.6,
  loaderExit: 1.1,
  coverEnter: 1.4,
  /** Click → doors fully open. Must cover the leaf delay (0.55) + swing (2.1). */
  doorsOpen: 2.5,
  /** Doors open → through the arch and into the invitation. */
  cameraPush: 1.9,
} as const;

/** Shared viewport trigger for scroll-in reveals. */
export const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' } as const;
