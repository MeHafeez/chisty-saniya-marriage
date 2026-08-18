'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { FILTER } from './MaterialDefs';
import { polygonPath, starPath } from './geometry';

export interface WaxSealProps {
  /** A number is treated as pixels; a string is used as a raw CSS length. */
  size?: number | string;
  className?: string;
  /** Text pressed into the wax. Two or three characters read best. */
  monogram?: string;
  /** Wax colour. Defaults to the invitation's deep gold. */
  tone?: 'gold' | 'wine';
  /** Rotates and lifts slightly, as if just about to break. */
  isBreaking?: boolean;
  /** `blob` is the round struck seal; `heart` is the same wax poured in a heart. */
  shape?: 'blob' | 'heart';
  /** Short instruction debossed into the face, e.g. `['Tap to', 'open']`. */
  caption?: readonly string[];
}

/**
 * A struck wax seal.
 *
 * The outline is a wobbling blob rather than a circle — real wax squeezes out
 * unevenly under the stamp — and the relief comes from `feSpecularLighting`
 * rather than a painted gradient, so the highlight sits correctly on the
 * moulded surface and the whole thing casts its own shadow.
 */
export function WaxSeal({
  size = 96,
  className,
  monogram,
  tone = 'gold',
  isBreaking = false,
  shape = 'blob',
  caption,
}: WaxSealProps) {
  const isHeart = shape === 'heart';
  const palette =
    tone === 'wine'
      ? { light: '#A8324B', mid: '#7A1F35', dark: '#521022', ink: '#3E0C19' }
      : { light: '#E7C88B', mid: '#C09545', dark: '#8E6A22', ink: '#6B4E14' };

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={cn('overflow-visible', className)}
      style={{ width: size, height: size, filter: 'drop-shadow(0 3px 8px rgba(42,24,16,0.28))' }}
      animate={isBreaking ? { rotate: -8, scale: 0.96 } : { rotate: 0, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`wax-body-${tone}`} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0%" stopColor={palette.light} />
          <stop offset="55%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.dark} />
        </radialGradient>
      </defs>

      <g filter={`url(#${FILTER.wax})`}>
        {/* Molten skirt — the wax that squeezed out beyond the die */}
        <path
          d={isHeart ? heartPath(60, 62, 54, 2.6) : moltenBlob(60, 60, 52, 13, 4.4)}
          fill={`url(#wax-body-${tone})`}
        />
        {/* The struck face, slightly proud of the skirt */}
        <path
          d={isHeart ? heartPath(60, 61, 44, 0) : `M60 19 a41 41 0 1 0 0 82 a41 41 0 1 0 0 -82 Z`}
          fill={`url(#wax-body-${tone})`}
        />
      </g>

      {/* Everything below is pressed into the face by the die */}
      <g filter={`url(#${FILTER.deboss})`} opacity="0.92">
        {isHeart ? (
          <path
            d={heartPath(60, 60, 36, 0)}
            fill="none"
            stroke={palette.ink}
            strokeOpacity="0.4"
            strokeWidth="1.3"
          />
        ) : (
          <>
            <circle
              cx="60"
              cy="60"
              r="35"
              fill="none"
              stroke={palette.ink}
              strokeOpacity="0.45"
              strokeWidth="1.4"
            />
            <path
              d={polygonPath(60, 60, 30, 8, 22.5)}
              fill="none"
              stroke={palette.ink}
              strokeOpacity="0.34"
              strokeWidth="1"
            />
          </>
        )}

        {/* The khatam sits behind whatever the die says, smaller on the heart so
            the text stays the thing you read. */}
        <path
          d={starPath(60, isHeart ? 58 : 60, isHeart ? 19 : 27, isHeart ? 9.5 : 13.5)}
          fill={palette.ink}
          fillOpacity={caption ? 0.06 : 0.18}
          stroke={palette.ink}
          strokeOpacity={caption ? 0.14 : 0.4}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {caption ? (
          <g
            className="font-display"
            fill={palette.ink}
            fillOpacity="0.92"
            // Sized generously: on the heart this instruction is the only
            // affordance, so it has to be readable at thumbnail scale.
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.04em' }}
          >
            {caption.map((line, index) => (
              <text
                key={line}
                x="60"
                textAnchor="middle"
                // Centred on the heart's widest band rather than its geometric
                // middle, so a second line does not run into the point.
                y={(isHeart ? 47 : 56) + index * 19 - (caption.length - 1) * 9.5}
                dominantBaseline="central"
              >
                {line}
              </text>
            ))}
          </g>
        ) : monogram ? (
          <text
            x="60"
            y="61"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display"
            style={{ fontSize: 22, fontWeight: 500, letterSpacing: '0.06em' }}
            fill={palette.ink}
            fillOpacity="0.62"
          >
            {monogram}
          </text>
        ) : (
          <path d={starPath(60, 60, 12, 6, 8, 22.5)} fill={palette.ink} fillOpacity="0.4" />
        )}
      </g>
    </motion.svg>
  );
}

/**
 * A heart, drawn as four cubics from the bottom point up over each lobe.
 *
 * `wobble` nudges the control points outward on one side so a poured-wax heart
 * is not perfectly symmetrical — pass 0 for the crisp die-struck face.
 */
function heartPath(cx: number, cy: number, size: number, wobble: number): string {
  const s = size;
  const w = wobble;
  const f = (n: number) => Number(n.toFixed(2));

  return [
    `M${f(cx)} ${f(cy + s * 0.72)}`,
    // Up the left flank and over the left lobe
    `C${f(cx - s * 0.52 - w)} ${f(cy + s * 0.34)} ${f(cx - s - w)} ${f(cy - s * 0.14)} ${f(cx - s - w)} ${f(cy - s * 0.43)}`,
    `C${f(cx - s - w)} ${f(cy - s * 0.79)} ${f(cx - s * 0.55)} ${f(cy - s * 0.96 - w)} ${f(cx)} ${f(cy - s * 0.54)}`,
    // Over the right lobe and back down to the point
    `C${f(cx + s * 0.55)} ${f(cy - s * 0.96 + w)} ${f(cx + s + w * 0.6)} ${f(cy - s * 0.79)} ${f(cx + s + w * 0.6)} ${f(cy - s * 0.43)}`,
    `C${f(cx + s + w * 0.6)} ${f(cy - s * 0.14)} ${f(cx + s * 0.52)} ${f(cy + s * 0.34)} ${f(cx)} ${f(cy + s * 0.72)}`,
    'Z',
  ].join(' ');
}

/**
 * A closed blob whose radius wobbles around the circle, giving wax its
 * characteristic uneven squeeze-out. Deterministic so it never flickers
 * between renders.
 */
function moltenBlob(cx: number, cy: number, radius: number, lobes: number, amplitude: number): string {
  const steps = lobes * 6;
  const points: string[] = [];

  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    // Two out-of-phase harmonics read as organic rather than mechanical.
    const wobble =
      Math.sin(angle * lobes) * amplitude + Math.sin(angle * (lobes * 2) + 1.1) * amplitude * 0.4;
    const r = radius + wobble;
    points.push(`${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }

  // Quadratic midpoint smoothing keeps the outline soft, like cooled wax.
  let d = `M${points[0]}`;
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i]!.split(' ').map(Number) as [number, number];
    const next = points[(i + 1) % points.length]!.split(' ').map(Number) as [number, number];
    const midX = (current[0] + next[0]) / 2;
    const midY = (current[1] + next[1]) / 2;
    d += ` Q${current[0].toFixed(2)} ${current[1].toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }

  return `${d} Z`;
}
