'use client';

import Image from 'next/image';

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

export interface KenBurnsProps {
  src: string;
  alt: string;
  className?: string;
  /** Seconds for one full pass. Long on purpose — this should be barely noticed. */
  duration?: number;
  /** Ending scale. 1.08 is about the limit before it reads as a zoom. */
  scale?: number;
  priority?: boolean;
  sizes?: string;
  /** Alternates the drift direction so consecutive slides do not move alike. */
  direction?: 'in' | 'out';
  objectPosition?: string;
}

/**
 * A very slow drifting zoom.
 *
 * Runs as a CSS keyframe on a transform only, so it stays on the compositor and
 * costs nothing per frame. Disabled entirely under reduced motion — the image
 * simply sits still.
 */
export function KenBurns({
  src,
  alt,
  className,
  duration = 18,
  scale = 1.08,
  priority = false,
  sizes = '100vw',
  direction = 'in',
  objectPosition = 'center',
}: KenBurnsProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animation = reducedMotion
    ? undefined
    : `${direction === 'in' ? 'ken-burns-in' : 'ken-burns-out'} ${duration}s ease-in-out infinite alternate`;

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ animation, ['--kb-scale' as string]: String(scale) }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
    </div>
  );
}
