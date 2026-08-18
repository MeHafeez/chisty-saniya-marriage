/** Constrain `value` to the inclusive range [min, max]. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Linear interpolation between `a` and `b`. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Frame-rate independent lerp. `factor` is the fraction closed per 60fps frame,
 * corrected by the real elapsed time so easing feels identical on 120Hz displays.
 */
export const damp = (a: number, b: number, factor: number, deltaMs: number): number =>
  lerp(a, b, 1 - Math.pow(1 - factor, deltaMs / (1000 / 60)));

/** Remap `value` from one range to another without clamping. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Random float in [min, max). */
export const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);

/** Random integer in [min, max]. */
export const randomInt = (min: number, max: number): number =>
  Math.floor(randomBetween(min, max + 1));

/** Pick a random element. Returns `undefined` only for an empty list. */
export const pick = <T,>(items: readonly T[]): T | undefined =>
  items[randomInt(0, items.length - 1)];
