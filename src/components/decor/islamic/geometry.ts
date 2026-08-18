/**
 * Islamic geometric construction helpers.
 *
 * Everything the portal, the mosque and the girih lattices are drawn from lives
 * here as pure path-string builders — no DOM, no React, trivially testable, and
 * reusable at any scale because every value is expressed relative to its inputs.
 */

const rad = (deg: number) => (deg * Math.PI) / 180;
const fixed = (value: number) => Number(value.toFixed(3));

/**
 * An n-pointed star polygon (khatam). The 8-pointed form is the backbone of
 * girih tiling; 4-pointed fills the interstices.
 *
 * @param inner Radius of the concave vertices. Around 0.55 × outer reads as a
 *              classic khatam; higher values flatten toward a polygon.
 */
export function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 8,
  rotationDeg = 0,
): string {
  const step = Math.PI / points;
  const start = rad(rotationDeg) - Math.PI / 2;

  const coords: string[] = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = start + i * step;
    coords.push(`${fixed(cx + radius * Math.cos(angle))} ${fixed(cy + radius * Math.sin(angle))}`);
  }

  return `M${coords.join('L')}Z`;
}

/** A regular polygon — used for the octagon rings that frame each star. */
export function polygonPath(
  cx: number,
  cy: number,
  radius: number,
  sides = 8,
  rotationDeg = 0,
): string {
  const step = (Math.PI * 2) / sides;
  const start = rad(rotationDeg) - Math.PI / 2;

  const coords = Array.from({ length: sides }, (_, i) => {
    const angle = start + i * step;
    return `${fixed(cx + radius * Math.cos(angle))} ${fixed(cy + radius * Math.sin(angle))}`;
  });

  return `M${coords.join('L')}Z`;
}

/**
 * A two-centred pointed arch — the equilateral form found across Mughal and
 * Persian architecture. Returns a closed path standing on `y`.
 *
 * @param rise Fraction of the height given to the curve; the remainder is the
 *             straight jamb below the springing line.
 */
export function pointedArchPath(
  x: number,
  y: number,
  width: number,
  height: number,
  rise = 0.55,
): string {
  const springY = y - height * (1 - rise);
  const apexY = y - height;
  const midX = x + width / 2;

  return [
    `M${fixed(x)} ${fixed(y)}`,
    `L${fixed(x)} ${fixed(springY)}`,
    `Q${fixed(x)} ${fixed(apexY + height * rise * 0.18)} ${fixed(midX)} ${fixed(apexY)}`,
    `Q${fixed(x + width)} ${fixed(apexY + height * rise * 0.18)} ${fixed(x + width)} ${fixed(springY)}`,
    `L${fixed(x + width)} ${fixed(y)}`,
    'Z',
  ].join(' ');
}

/**
 * A bulbous onion dome sitting on `baseY`, with the finial point at the top.
 * `halfWidth` is the widest radius; `height` the distance from base to point.
 */
export function onionDomePath(cx: number, baseY: number, halfWidth: number, height: number): string {
  const w = halfWidth;
  const h = height;

  return [
    `M${fixed(cx - w)} ${fixed(baseY)}`,
    `C${fixed(cx - w)} ${fixed(baseY - h * 0.42)} ${fixed(cx - w * 0.99)} ${fixed(baseY - h * 0.7)} ${fixed(cx - w * 0.44)} ${fixed(baseY - h * 0.9)}`,
    `C${fixed(cx - w * 0.2)} ${fixed(baseY - h * 0.98)} ${fixed(cx - w * 0.07)} ${fixed(baseY - h * 1.02)} ${fixed(cx)} ${fixed(baseY - h * 1.12)}`,
    `C${fixed(cx + w * 0.07)} ${fixed(baseY - h * 1.02)} ${fixed(cx + w * 0.2)} ${fixed(baseY - h * 0.98)} ${fixed(cx + w * 0.44)} ${fixed(baseY - h * 0.9)}`,
    `C${fixed(cx + w * 0.99)} ${fixed(baseY - h * 0.7)} ${fixed(cx + w)} ${fixed(baseY - h * 0.42)} ${fixed(cx + w)} ${fixed(baseY)}`,
    'Z',
  ].join(' ');
}

/** Crescent (hilal) finial, opening to the right. */
export function crescentPath(cx: number, cy: number, radius: number): string {
  const r = radius;
  const inner = r * 0.82;
  const shift = r * 0.34;

  return [
    `M${fixed(cx)} ${fixed(cy - r)}`,
    `A${fixed(r)} ${fixed(r)} 0 1 0 ${fixed(cx)} ${fixed(cy + r)}`,
    `A${fixed(inner)} ${fixed(inner)} 0 1 1 ${fixed(cx - shift)} ${fixed(cy - r * 0.86)}`,
    'Z',
  ].join(' ');
}

/**
 * The arch as a unit-square path for an SVG `<clipPath clipPathUnits="objectBoundingBox">`.
 *
 * A referenced clipPath beats a `mask-image` data URI here: it needs no URL
 * escaping (a single mis-encoded character silently hides the whole element),
 * and `objectBoundingBox` units make it stretch to any container for free.
 */
export function archClipPath(rise: number): string {
  // Normalised straight from pointedArchPath: the springing line sits at
  // `rise` of the height, and the curve's control point at 18% of that.
  const springY = fixed(rise);
  const controlY = fixed(rise * 0.18);

  return `M0 1 L0 ${springY} Q0 ${controlY} 0.5 0 Q1 ${controlY} 1 ${springY} L1 1 Z`;
}

/**
 * The two arch proportions used across the site. Keeping it to a fixed set
 * means both clip paths can be registered once in the document.
 */
export const ARCH_RISE = {
  /** Sharply pointed — the portal and the hero. */
  tall: 0.62,
  /** Gentler shoulder, for wider portrait cards. */
  soft: 0.48,
} as const;

export type ArchVariant = keyof typeof ARCH_RISE;

/** DOM id of the registered clipPath for a given variant. */
export const archClipId = (variant: ArchVariant): string => `arch-clip-${variant}`;
