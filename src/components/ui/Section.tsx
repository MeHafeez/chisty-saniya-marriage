import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** `narrow` for prose, `wide` for cards and galleries, `full` for edge-to-edge. */
  width?: 'narrow' | 'wide' | 'full';
  /**
   * Ground tone. `night` flips the palette tokens for the whole section, which
   * gives the scroll a rhythm of light and shade — without it the page reads as
   * one flat wash of cream.
   */
  tone?: 'ivory' | 'champagne' | 'night' | 'none';
  label?: string;
}

const WIDTHS = {
  narrow: 'container-narrow',
  wide: 'container-luxe',
  full: 'w-full',
} as const;

// Light tones stay translucent so the ambient dust and petals show through;
// night is opaque because it is a different world.
const TONES = {
  ivory: 'bg-ivory/80',
  champagne: 'bg-champagne/85',
  night: 'bg-ivory',
  none: '',
} as const;

/** Consistent vertical rhythm + landmark semantics for every movement. */
export function Section({
  id,
  children,
  className,
  width = 'wide',
  tone = 'none',
  label,
}: SectionProps) {
  const isNight = tone === 'night';

  return (
    <section
      id={id}
      aria-label={label}
      data-tone={isNight ? 'night' : undefined}
      className={cn('relative isolate py-[var(--spacing-section)]', TONES[tone], className)}
    >
      {isNight && (
        <>
          {/* Warmth pooling at the top edge so the block does not read as a slab */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[36rem]"
            style={{
              background:
                'radial-gradient(70% 100% at 50% 0%, rgba(198,166,106,0.16) 0%, rgba(198,166,106,0) 70%)',
            }}
          />
          {/* Hairlines to seat it against the ivory above and below */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/25" />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold/25" />
        </>
      )}

      <div className={cn('relative', WIDTHS[width])}>{children}</div>
    </section>
  );
}
