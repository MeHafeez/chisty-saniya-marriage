'use client';

import { useId } from 'react';

import { cn } from '@/utils/cn';
import { FILTER } from './MaterialDefs';
import { GirihPattern } from './GirihPattern';

export interface EmbossedPanelProps {
  className?: string;
  /** Base sheet colour, or a CSS gradient. */
  background?: string;
  /** Scale of the girih repeat, in user units. */
  patternSize?: number;
  /** 0–1. How deeply the pattern is pressed in. */
  depth?: number;
  /** 0–1. Strength of the fine paper fibre. */
  tooth?: number;
  /** Colour of the debossed pattern before lighting. */
  inkColor?: string;
}

/**
 * A sheet of embossed stock: a girih damask pressed into paper, lit from the
 * upper left, with fibre tooth over the top.
 *
 * The relief is real lighting maths, not a painted gradient, so it holds up
 * at any size and shifts correctly as the pattern scales.
 */
export function EmbossedPanel({
  className,
  background = 'linear-gradient(150deg, #F6EDDF 0%, #FBF5EC 45%, #EFE2CE 100%)',
  patternSize = 58,
  depth = 0.5,
  tooth = 0.35,
  inkColor = '#B9945A',
}: EmbossedPanelProps) {
  // Scoped so several panels can coexist with different pattern scales.
  const uid = useId().replace(/:/g, '');
  const patternId = `emboss-girih-${uid}`;

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="absolute inset-0" style={{ background }} />

      {/* Debossed girih */}
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.55 + depth * 0.45 }}>
        <defs>
          <GirihPattern
            id={patternId}
            size={patternSize}
            stroke={inkColor}
            strokeWidth={0.9}
            fillOpacity={0.1 + depth * 0.18}
            strokeOpacity={0.4 + depth * 0.5}
          />
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          filter={`url(#${FILTER.deboss})`}
        />
      </svg>

      {/* Fibre tooth, multiplied so it darkens rather than washes out */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode: 'multiply', opacity: tooth }}
      >
        <rect width="100%" height="100%" filter={`url(#${FILTER.paper})`} />
      </svg>

      {/* Sheet lighting: a soft raking gradient so the panel is not flat */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(148deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 38%, rgba(90,66,40,0.09) 100%)',
        }}
      />
    </div>
  );
}
