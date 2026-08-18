'use client';

import { useLayoutEffect, useRef } from 'react';

import { registerGsap } from '@/animations/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { pad } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface CountdownNumeralsProps {
  units: ReadonlyArray<{ label: string; value: number; digits?: number }>;
  isReady: boolean;
  className?: string;
}

/**
 * The countdown as engraved numerals rather than a row of cards.
 *
 * Each numeral is a large light serif separated by a hairline rule. When a value
 * changes GSAP lifts the old glyph out and drops the new one in — a short fade
 * plus a few pixels of travel, nothing that reads as a flip clock.
 */
export function CountdownNumerals({ units, isReady, className }: CountdownNumeralsProps) {
  return (
    <div
      className={cn(
        'flex w-full items-start justify-center',
        'gap-[clamp(0.85rem,4vw,3.25rem)]',
        className,
      )}
      role="timer"
      aria-live="off"
    >
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-start">
          <Numeral
            value={unit.value}
            label={unit.label}
            digits={unit.digits ?? 2}
            isReady={isReady}
          />
          {index < units.length - 1 && (
            <span
              aria-hidden
              className="ml-[clamp(0.85rem,4vw,3.25rem)] mt-[0.35em] block w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent"
              style={{ height: 'clamp(2.75rem, 9vw, 5.5rem)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Numeral({
  value,
  label,
  digits,
  isReady,
}: {
  value: number;
  label: string;
  digits: number;
  isReady: boolean;
}) {
  const currentRef = useRef<HTMLSpanElement>(null);
  const incomingRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const display = isReady ? pad(value, digits) : pad(0, digits);

  useLayoutEffect(() => {
    if (!isReady) return;

    const outgoing = currentRef.current;
    const incoming = incomingRef.current;

    // First paint just sets the value; only changes are animated.
    if (previous.current === null || reducedMotion || !outgoing || !incoming) {
      previous.current = value;
      return;
    }
    if (previous.current === value) return;
    previous.current = value;

    const gsap = registerGsap();
    const timeline = gsap.timeline();

    timeline
      .fromTo(
        incoming,
        { yPercent: 45, autoAlpha: 0, filter: 'blur(5px)' },
        { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.62, ease: 'power3.out' },
        0,
      )
      .fromTo(
        outgoing,
        { yPercent: 0, autoAlpha: 1 },
        { yPercent: -45, autoAlpha: 0, filter: 'blur(5px)', duration: 0.62, ease: 'power3.out' },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [value, isReady, reducedMotion]);

  return (
    <div className="flex flex-col items-center">
      <span
        className="relative block overflow-hidden text-center tabular-nums"
        style={{ height: '1em', lineHeight: 1, fontSize: 'clamp(2.5rem, 9.5vw, 6rem)' }}
      >
        {/* Outgoing glyph sits underneath; the incoming one is what you read. */}
        <span
          ref={currentRef}
          aria-hidden
          className="absolute inset-0 block font-display font-light text-ink opacity-0"
        >
          {display}
        </span>
        <span
          ref={incomingRef}
          key={display}
          className="block font-display font-light text-ink"
        >
          {display}
        </span>
      </span>

      <span
        className="mt-4 font-sans uppercase text-muted"
        style={{ fontSize: 'clamp(0.4375rem, 1.6vw, 0.5625rem)', letterSpacing: '0.38em' }}
      >
        {label}
      </span>
    </div>
  );
}
