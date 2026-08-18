'use client';

import { polygonPath, starPath } from './geometry';

export interface GirihPatternProps {
  /** Must be unique per document — it becomes the `url(#id)` fill reference. */
  id: string;
  /** Edge length of one repeating tile in user units. */
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
}

/**
 * A seamless girih tile: an eight-pointed khatam star at the centre, quarter
 * stars at every corner, and four-pointed stars filling the edge midpoints.
 * Because the corner stars are shared between neighbours, the tiling repeats
 * with no visible seam.
 *
 * Render inside `<defs>`, then fill any shape with `url(#your-id)`.
 */
export function GirihPattern({
  id,
  size = 64,
  stroke = 'currentColor',
  strokeWidth = 0.7,
  fillOpacity = 0.1,
  strokeOpacity = 0.75,
}: GirihPatternProps) {
  const c = size / 2;
  const outer = size * 0.3;
  const inner = size * 0.155;
  const smallOuter = size * 0.115;
  const smallInner = size * 0.05;

  const corners: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [size, 0],
    [0, size],
    [size, size],
  ];

  const edges: ReadonlyArray<readonly [number, number]> = [
    [c, 0],
    [0, c],
    [size, c],
    [c, size],
  ];

  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <g
        fill={stroke}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeLinejoin="round"
      >
        {/* Octagon ring framing the central star */}
        <path d={polygonPath(c, c, outer * 1.32, 8, 22.5)} fill="none" strokeOpacity={strokeOpacity * 0.45} />
        <path d={starPath(c, c, outer, inner)} />

        {corners.map(([x, y]) => (
          <path key={`corner-${x}-${y}`} d={starPath(x, y, outer, inner)} />
        ))}

        {edges.map(([x, y]) => (
          <path key={`edge-${x}-${y}`} d={starPath(x, y, smallOuter, smallInner, 4, 45)} />
        ))}
      </g>
    </pattern>
  );
}
