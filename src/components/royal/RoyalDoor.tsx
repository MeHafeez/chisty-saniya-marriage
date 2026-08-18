'use client';

import { forwardRef } from 'react';

import { cn } from '@/utils/cn';
import { EmbossedPanel } from '@/components/decor/islamic/EmbossedPanel';
import { FILTER } from '@/components/decor/islamic/MaterialDefs';
import { pointedArchPath, polygonPath, starPath } from '@/components/decor/islamic/geometry';
import { RoyalCorner } from './RoyalOrnaments';

export interface RoyalDoorProps {
  side: 'left' | 'right';
  className?: string;
  /** Name carved into the lower panel. */
  label?: string;
}

/**
 * One leaf of the entrance.
 *
 * Hinged on its **outer** edge so the leaf swings outward and away — the free
 * inner edge travels toward the viewer before receding, which is what gives the
 * open real depth. The intro timeline drives `rotateY` on this element; nothing
 * here animates on its own.
 */
export const RoyalDoor = forwardRef<HTMLDivElement, RoyalDoorProps>(function RoyalDoor(
  { side, className, label },
  ref,
) {
  const isLeft = side === 'left';

  return (
    <div
      ref={ref}
      className={cn(
        'absolute inset-y-0 w-1/2 will-change-transform',
        isLeft ? 'left-0' : 'right-0',
        className,
      )}
      style={{
        transformOrigin: isLeft ? 'left center' : 'right center',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* ——— Leaf body: deep royal stock, not flat colour ——— */}
      <EmbossedPanel
        patternSize={46}
        depth={0.75}
        tooth={0.22}
        inkColor="#8A6320"
        background={
          isLeft
            ? 'linear-gradient(102deg, #3A2413 0%, #55321A 40%, #402512 74%, #2A1709 100%)'
            : 'linear-gradient(258deg, #3A2413 0%, #55321A 40%, #402512 74%, #2A1709 100%)'
        }
      />

      {/* Warm sheen raking across the timber */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: isLeft
            ? 'linear-gradient(102deg, rgba(255,214,150,0.16) 0%, rgba(255,214,150,0) 42%, rgba(0,0,0,0.42) 100%)'
            : 'linear-gradient(258deg, rgba(255,214,150,0.16) 0%, rgba(255,214,150,0) 42%, rgba(0,0,0,0.42) 100%)',
        }}
      />

      {/* ——— Gold mouldings and the arched sunk panel ——— */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g filter={`url(#${FILTER.foil})`}>
          {/* Outer moulding */}
          <rect
            x="5"
            y="3"
            width="90"
            height="194"
            fill="none"
            stroke="#C9A45C"
            strokeOpacity="0.95"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="9"
            y="6"
            width="82"
            height="188"
            fill="none"
            stroke="#E4C98D"
            strokeOpacity="0.55"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
          />
          {/* Sunk arched panel in the upper leaf */}
          <path
            d={pointedArchPath(16, 118, 68, 96, 0.62)}
            fill="none"
            stroke="#C9A45C"
            strokeOpacity="0.85"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
          {/* Lower panel */}
          <rect
            x="16"
            y="130"
            width="68"
            height="58"
            fill="none"
            stroke="#C9A45C"
            strokeOpacity="0.7"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Ornamental corners inside the moulding */}
      <RoyalCorner corner="top-left" size={72} tone="#D9B871" opacity={0.75} className="left-[6%] top-[2.5%]" />
      <RoyalCorner corner="top-right" size={72} tone="#D9B871" opacity={0.75} className="right-[6%] top-[2.5%]" />
      <RoyalCorner corner="bottom-left" size={64} tone="#D9B871" opacity={0.6} className="bottom-[2%] left-[6%]" />
      <RoyalCorner corner="bottom-right" size={64} tone="#D9B871" opacity={0.6} className="bottom-[2%] right-[6%]" />

      {/* ——— Central medallion in the arched panel ——— */}
      <svg
        className="pointer-events-none absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 text-[#E0C084]"
        style={{ width: 'clamp(3.5rem, 13%, 7rem)', height: 'clamp(3.5rem, 13%, 7rem)' }}
        viewBox="0 0 100 100"
        aria-hidden
      >
        <g filter={`url(#${FILTER.emboss})`}>
          <path d={polygonPath(50, 50, 42, 8, 22.5)} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          <path
            d={starPath(50, 50, 36, 17)}
            fill="currentColor"
            fillOpacity="0.16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d={starPath(50, 50, 17, 8, 8, 22.5)} fill="currentColor" fillOpacity="0.55" />
        </g>
      </svg>

      {/* ——— Name plate on the lower panel ——— */}
      {label && (
        <div className="absolute inset-x-0 top-[72%] flex flex-col items-center px-4">
          <span className="h-px w-8 bg-[#C9A45C]/70 sm:w-12" />
          <span
            className="mt-2.5 text-center font-display font-light leading-none tracking-[0.14em] text-[#F0DFB8]"
            style={{ fontSize: 'clamp(0.95rem, 4.2vw, 1.9rem)' }}
          >
            {label}
          </span>
          <span className="mt-2.5 h-px w-8 bg-[#C9A45C]/70 sm:w-12" />
        </div>
      )}

      {/* ——— Handle ring on the free edge ——— */}
      <div
        className={cn(
          'absolute top-[46%] flex flex-col items-center',
          isLeft ? 'right-[7%]' : 'left-[7%]',
        )}
      >
        <span className="h-2.5 w-px bg-[#C9A45C]/80" />
        <span
          className="block rounded-full border-[2px] border-[#D9B871]/85"
          style={{
            width: 'clamp(0.9rem, 3.2vw, 1.5rem)',
            height: 'clamp(0.9rem, 3.2vw, 1.5rem)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,232,190,0.5)',
          }}
        />
      </div>

      {/* ——— Depth: the inner edge darkens as the leaf turns ——— */}
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-y-0 w-[42%]', isLeft ? 'right-0' : 'left-0')}
        style={{
          background: isLeft
            ? 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)'
            : 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Bright seam where the two leaves meet */}
      <div
        aria-hidden
        className={cn('absolute inset-y-0 w-px bg-[#E4C98D]/45', isLeft ? 'right-0' : 'left-0')}
      />
    </div>
  );
});
