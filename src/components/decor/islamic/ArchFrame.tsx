'use client';

import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/utils/cn';
import { ARCH_RISE, archClipId, pointedArchPath, type ArchVariant } from './geometry';

export interface ArchFrameProps {
  children: ReactNode;
  className?: string;
  /** `tall` is the portal proportion; `soft` suits wider portrait cards. */
  variant?: ArchVariant;
  /** Draws a gold outline that follows the arch exactly. */
  outline?: boolean;
  /** Adds a second, inset hairline — the mouldings seen on the portal doors. */
  innerOutline?: boolean;
  /**
   * A CSS `drop-shadow()` argument, e.g. `"0 24px 44px rgba(58,46,42,0.22)"`.
   * Applied to the wrapper rather than the clipped child so the shadow follows
   * the arch silhouette instead of a rectangle.
   */
  shadow?: string;
  style?: CSSProperties;
}

/**
 * Clips any content into a two-centred pointed arch.
 *
 * Uses a referenced `clipPath` (see `ArchClipDefs`) rather than a mask data
 * URI — the latter fails silently and takes the whole element with it.
 * The outline uses `vector-effect="non-scaling-stroke"` so the hairline stays
 * exactly 1px however far the viewBox is stretched.
 */
export function ArchFrame({
  children,
  className,
  variant = 'tall',
  outline = true,
  innerOutline = false,
  shadow,
  style,
}: ArchFrameProps) {
  const clip = `url(#${archClipId(variant)})`;
  const path = pointedArchPath(0, 160, 100, 160, ARCH_RISE[variant]);

  return (
    <div className={cn('relative', className)} style={style}>
      {/* The filter wraps only the clipped content. Applied to the outer box it
          also takes in the full-bleed outline <svg>, which rasterises as an
          opaque rectangle and leaves a grey card behind the arch. */}
      <div
        className="absolute inset-0"
        style={{ filter: shadow ? `drop-shadow(${shadow})` : undefined }}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: clip, WebkitClipPath: clip }}
        >
          {children}
        </div>
      </div>

      {(outline || innerOutline) && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-gold"
          viewBox="0 0 100 160"
          preserveAspectRatio="none"
          aria-hidden
        >
          {outline && (
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {innerOutline && (
            <g transform="translate(50 80) scale(0.955) translate(-50 -80)">
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
