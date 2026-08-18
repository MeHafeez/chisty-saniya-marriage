'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

export interface ScratchRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Prompt shown on the foil before the guest starts. */
  hint?: string;
  /** Fraction of the foil that must be removed before it clears itself. */
  threshold?: number;
  /** Mid-tone of the foil, so it can be keyed to whatever it is covering. */
  foilTint?: string;
  onReveal?: () => void;
}

/**
 * A gold foil panel the guest rubs away to uncover what is underneath.
 *
 * The foil is a canvas painted with a gold gradient plus fine grain; scratching
 * punches through it with `destination-out`. Coverage is sampled cheaply (every
 * 16th pixel on a throttled interval) and once the threshold is passed the
 * remainder dissolves on its own, so nobody has to scrub the corners.
 *
 * Fully keyboard- and reduced-motion-accessible: the panel is revealed outright
 * for anyone who cannot or would rather not scratch.
 */
export function ScratchReveal({
  children,
  className,
  hint = 'Scratch to reveal',
  threshold = 0.42,
  foilTint,
  onReveal,
}: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const hasRevealed = useRef(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const reveal = useCallback(() => {
    if (hasRevealed.current) return;
    hasRevealed.current = true;
    setIsRevealed(true);
    onReveal?.();
  }, [onReveal]);

  /* Paint the foil */
  useEffect(() => {
    if (reducedMotion) {
      reveal();
      return;
    }

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !wrap || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const paint = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0) return;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Brushed foil. The tint only shifts the mid-stops, so the highlight and
      // the shadow keep the metal reading as metal whatever colour it is.
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, '#8E6C22');
      gradient.addColorStop(0.22, foilTint ?? '#D9B871');
      gradient.addColorStop(0.4, '#F2E0B4');
      gradient.addColorStop(0.6, foilTint ?? '#C9A45C');
      gradient.addColorStop(0.82, '#EBD7A6');
      gradient.addColorStop(1, '#9A7628');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Fine brushed grain so it does not read as flat vector
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < rect.width; i += 2) {
        ctx.fillStyle = i % 4 === 0 ? '#FFF6DF' : '#7A5A18';
        ctx.fillRect(i, 0, 1, rect.height);
      }
      ctx.globalAlpha = 1;
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [reducedMotion, reveal, foilTint]);

  /* Scratch handling */
  useEffect(() => {
    if (reducedMotion || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const pointAt = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const scratch = (from: { x: number; y: number } | null, to: { x: number; y: number }) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 46;

      ctx.beginPath();
      if (from) {
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
      ctx.arc(to.x, to.y, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    let sampleTimer = 0;
    const sampleCoverage = () => {
      const { width, height } = canvas;
      if (!width || !height) return;
      const data = ctx.getImageData(0, 0, width, height).data;

      let clear = 0;
      let total = 0;
      // Every 16th pixel is plenty to estimate coverage and keeps this cheap.
      for (let i = 3; i < data.length; i += 4 * 16) {
        total += 1;
        if (data[i]! < 40) clear += 1;
      }
      if (total > 0 && clear / total >= threshold) reveal();
    };

    const onDown = (event: PointerEvent) => {
      drawing.current = true;
      setHasStarted(true);
      canvas.setPointerCapture(event.pointerId);
      const point = pointAt(event);
      lastPoint.current = point;
      scratch(null, point);
    };

    const onMove = (event: PointerEvent) => {
      if (!drawing.current) return;
      event.preventDefault();
      const point = pointAt(event);
      scratch(lastPoint.current, point);
      lastPoint.current = point;

      if (!sampleTimer) {
        sampleTimer = window.setTimeout(() => {
          sampleTimer = 0;
          sampleCoverage();
        }, 220);
      }
    };

    const onUp = () => {
      drawing.current = false;
      lastPoint.current = null;
      sampleCoverage();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove, { passive: false });
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onUp);

    return () => {
      if (sampleTimer) window.clearTimeout(sampleTimer);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, [isRevealed, reducedMotion, reveal, threshold]);

  return (
    <div ref={wrapRef} className={cn('relative overflow-hidden', className)}>
      {/* What lies underneath — always in the DOM so it is readable to
          assistive tech regardless of whether the foil has been scratched. */}
      <div className="relative z-0">{children}</div>

      {!isRevealed && !reducedMotion && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 h-full w-full touch-none"
            style={{ cursor: 'grab' }}
            aria-hidden
          />

          {/* Prompt, fading the moment the guest starts */}
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{ opacity: hasStarted ? 0 : 1 }}
            aria-hidden
          >
            <span
              className="font-script text-[#3A2A0E]"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}
            >
              {hint}
            </span>
          </div>

          {/* Keyboard / assistive escape hatch */}
          <button
            type="button"
            onClick={reveal}
            className="absolute inset-x-0 bottom-0 z-30 mx-auto mb-2 w-fit rounded-full px-3 py-1 font-sans text-[0.5625rem] uppercase tracking-[0.28em] text-[#3A2A0E]/70 underline-offset-4 opacity-0 focus-visible:opacity-100"
          >
            Reveal without scratching
          </button>
        </>
      )}
    </div>
  );
}
