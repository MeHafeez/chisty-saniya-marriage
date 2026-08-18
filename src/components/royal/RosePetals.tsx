'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { randomBetween, pick } from '@/utils/math';
import { cn } from '@/utils/cn';

/** A petal colour is `[face, shadowed edge]`. */
export type PetalColour = readonly [string, string];

export interface RosePetalsProps {
  className?: string;
  /** Petal count at 1440px wide, scaled down on narrower screens. */
  count?: number;
  opacity?: number;
  /** Multiplies fall speed. Below 1 drifts more slowly. */
  speed?: number;
  /** Override the palette — e.g. marigold for the Haldi. */
  colours?: readonly PetalColour[];
}

interface Petal {
  x: number;
  y: number;
  size: number;
  fall: number;
  sway: number;
  swayPhase: number;
  swayRate: number;
  spin: number;
  rotation: number;
  /** Drives the flutter — the petal turning edge-on as it tumbles. */
  flutter: number;
  flutterRate: number;
  alpha: number;
  colour: readonly [string, string];
}

/**
 * Ivory rose petals matching the banner's roses — warm whites, creams and the
 * faintest blush, not pink. Each pair is [face, shadowed edge].
 */
const PETAL_COLOURS: readonly PetalColour[] = [
  ['#FDF6EA', '#E8D6BE'],
  ['#F7EBD9', '#DFC8A9'],
  ['#F4E3D3', '#DBBFA6'],
  ['#EFD9CE', '#D2AE9C'],
  ['#FBF2E2', '#E3CDAE'],
];

/**
 * Rose petals falling across a section.
 *
 * Each petal tumbles on two independent cycles: a horizontal sway and a
 * "flutter" that squashes it horizontally as it turns edge-on, which is what
 * stops falling petals reading as sliding stickers. Pure canvas, one rAF loop,
 * paused off-tab, and absent entirely under reduced motion.
 */
export function RosePetals({
  className,
  count = 30,
  opacity = 1,
  speed = 1,
  colours,
}: RosePetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Derived inside the effect so the only dependency is the prop itself.
    // Callers pass module-level palettes, so identity is stable per theme.
    const palette = colours && colours.length > 0 ? colours : PETAL_COLOURS;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let petals: Petal[] = [];
    let frame = 0;
    let last = performance.now();
    let running = true;

    const makePetal = (seed = false): Petal => ({
      x: randomBetween(-40, width + 40),
      y: seed ? randomBetween(-height * 0.3, height) : randomBetween(-140, -20),
      size: randomBetween(9, 20),
      fall: randomBetween(22, 52) * speed,
      sway: randomBetween(14, 42),
      swayPhase: randomBetween(0, Math.PI * 2),
      swayRate: randomBetween(0.3, 0.75),
      spin: randomBetween(-0.5, 0.5),
      rotation: randomBetween(0, Math.PI * 2),
      flutter: randomBetween(0, Math.PI * 2),
      flutterRate: randomBetween(0.8, 1.9),
      alpha: randomBetween(0.55, 0.95),
      colour: pick(palette) ?? palette[0]!,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scaled = Math.round(count * Math.max(0.5, Math.min(width / 1440, 1)));
      petals = Array.from({ length: scaled }, () => makePetal(true));
    };

    const draw = (petal: Petal) => {
      // Flutter squashes the petal horizontally; at the extremes it is edge-on.
      const turn = Math.cos(petal.flutter);
      const squash = Math.abs(turn) * 0.85 + 0.15;

      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.scale(squash, 1);
      ctx.globalAlpha = petal.alpha;

      const [face, edge] = petal.colour;
      const s = petal.size;

      // The far side of the turn is the shaded underside of the petal.
      const gradient = ctx.createLinearGradient(-s * 0.6, -s, s * 0.6, s);
      if (turn >= 0) {
        gradient.addColorStop(0, face);
        gradient.addColorStop(1, edge);
      } else {
        gradient.addColorStop(0, edge);
        gradient.addColorStop(1, face);
      }
      ctx.fillStyle = gradient;

      // A rose petal: broad rounded top, notched tip, tapering to the base.
      ctx.beginPath();
      ctx.moveTo(0, s * 0.9);
      ctx.bezierCurveTo(-s * 0.95, s * 0.35, -s * 0.85, -s * 0.7, -s * 0.14, -s * 0.86);
      ctx.bezierCurveTo(-s * 0.05, -s * 0.72, s * 0.05, -s * 0.72, s * 0.14, -s * 0.86);
      ctx.bezierCurveTo(s * 0.85, -s * 0.7, s * 0.95, s * 0.35, 0, s * 0.9);
      ctx.closePath();
      ctx.fill();

      // Central vein, barely there
      ctx.globalAlpha = petal.alpha * 0.22;
      ctx.strokeStyle = edge;
      ctx.lineWidth = Math.max(0.5, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.8);
      ctx.lineTo(0, -s * 0.7);
      ctx.stroke();

      ctx.restore();
    };

    const tick = (now: number) => {
      if (!running) return;
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (const petal of petals) {
        petal.swayPhase += petal.swayRate * delta;
        petal.flutter += petal.flutterRate * delta;
        petal.rotation += petal.spin * delta;

        petal.y += petal.fall * delta;
        petal.x += Math.sin(petal.swayPhase) * petal.sway * delta;

        if (petal.y - petal.size > height) Object.assign(petal, makePetal());

        draw(petal);
      }

      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(tick);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, opacity, reducedMotion, speed, colours]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    />
  );
}
