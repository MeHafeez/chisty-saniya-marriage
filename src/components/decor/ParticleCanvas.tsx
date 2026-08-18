'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { randomBetween } from '@/utils/math';
import { cn } from '@/utils/cn';

type Variant = 'dust' | 'petals' | 'both';

export interface ParticleCanvasProps {
  variant?: Variant;
  className?: string;
  /** Particle count at 1440px wide; scaled down proportionally on small screens. */
  density?: number;
  opacity?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  drift: number;
  driftSpeed: number;
  rotation: number;
  spin: number;
  alpha: number;
  kind: 'dust' | 'petal';
  hue: string;
}

const PETAL_COLOURS = ['#E9D6B8', '#F0DCC4', '#DEC79E', '#F5E4D0'];

function createParticle(width: number, height: number, kind: 'dust' | 'petal', seedY?: number): Particle {
  const isPetal = kind === 'petal';

  return {
    x: randomBetween(0, width),
    y: seedY ?? randomBetween(-height * 0.4, height),
    size: isPetal ? randomBetween(5, 13) : randomBetween(0.6, 2.1),
    speedY: isPetal ? randomBetween(14, 34) : randomBetween(-7, -18),
    speedX: isPetal ? randomBetween(-9, 9) : randomBetween(-4, 4),
    drift: randomBetween(0, Math.PI * 2),
    driftSpeed: randomBetween(0.25, 0.75),
    rotation: randomBetween(0, Math.PI * 2),
    spin: randomBetween(-0.6, 0.6),
    alpha: isPetal ? randomBetween(0.3, 0.7) : randomBetween(0.18, 0.55),
    kind,
    hue: isPetal ? (PETAL_COLOURS[Math.floor(randomBetween(0, PETAL_COLOURS.length))] ?? '#E9D6B8') : '#C6A66A',
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.hue;

  // A single teardrop petal: two mirrored quadratic curves.
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.quadraticCurveTo(p.size * 0.72, -p.size * 0.2, 0, p.size);
  ctx.quadraticCurveTo(-p.size * 0.72, -p.size * 0.2, 0, -p.size);
  ctx.closePath();
  ctx.fill();

  // Centre vein
  ctx.globalAlpha = p.alpha * 0.35;
  ctx.strokeStyle = '#A8863F';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -p.size * 0.85);
  ctx.lineTo(0, p.size * 0.85);
  ctx.stroke();

  ctx.restore();
}

function drawDust(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = p.alpha;

  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
  glow.addColorStop(0, 'rgba(198,166,106,0.85)');
  glow.addColorStop(1, 'rgba(198,166,106,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Ambient canvas: gold dust rising, petals falling.
 * Pauses when off-screen or when the tab is hidden, and renders nothing at all
 * under `prefers-reduced-motion`.
 */
export function ParticleCanvas({
  variant = 'both',
  className,
  density = 46,
  opacity = 1,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let last = performance.now();
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const scale = Math.max(0.4, Math.min(width / 1440, 1));
      const count = Math.round(density * scale);

      const petalShare = variant === 'petals' ? 1 : variant === 'dust' ? 0 : 0.45;
      const petalCount = Math.round(count * petalShare);

      particles = [
        ...Array.from({ length: petalCount }, () => createParticle(width, height, 'petal')),
        ...Array.from({ length: count - petalCount }, () => createParticle(width, height, 'dust')),
      ];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = (now: number) => {
      if (!running) return;

      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.drift += p.driftSpeed * delta;
        p.x += (p.speedX + Math.sin(p.drift) * 12) * delta;
        p.y += p.speedY * delta;
        p.rotation += p.spin * delta;

        // Recycle at the opposite edge so the field never empties.
        if (p.kind === 'petal' && p.y - p.size > height) {
          Object.assign(p, createParticle(width, height, 'petal', -p.size * 2));
        } else if (p.kind === 'dust' && p.y + p.size * 4 < 0) {
          Object.assign(p, createParticle(width, height, 'dust', height + p.size * 4));
        }

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        if (p.kind === 'petal') drawPetal(ctx, p);
        else drawDust(ctx, p);
      }

      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(tick);

    // Stop burning frames when the tab is in the background.
    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [density, reducedMotion, variant]);

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
