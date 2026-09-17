'use client';

import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';

import { useAmbient } from '@/hooks/useMotion';
import { randomBetween } from '@/utils/math';
import { cn } from '@/utils/cn';

export interface GoldParticlesHandle {
  /** Ramps the field up or down — the intro timeline drives this. */
  setIntensity: (value: number) => void;
  /** One-off outward puff from a point, in 0–1 viewport coordinates. */
  burst: (x?: number, y?: number, count?: number) => void;
}

export interface GoldParticlesProps {
  ref?: Ref<GoldParticlesHandle>;
  className?: string;
  /** Particle count at rest. Kept deliberately low — this is dust, not confetti. */
  count?: number;
  /** Starting intensity, 0–1. */
  intensity?: number;
  opacity?: number;
}

interface Mote {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  drift: number;
  driftRate: number;
  alpha: number;
  /** Phase of the slow twinkle. */
  phase: number;
  twinkleRate: number;
  warm: boolean;
  /** Burst motes fade out and are recycled into the ambient field. */
  life: number;
}

const GOLD = [
  [232, 202, 138],
  [255, 240, 208],
  [201, 164, 92],
] as const;

/**
 * Floating gold dust.
 *
 * Deliberately restrained: small counts, slow drift, soft radial falloff and a
 * long twinkle period. Anything faster reads as confetti or sparks, which is
 * exactly the cheap effect this is trying not to be.
 */
export function GoldParticles({
  ref,
  className,
  count: motes = 54,
  intensity = 1,
  opacity = 1,
}: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const burstQueue = useRef<Array<{ x: number; y: number; count: number }>>([]);
  // Thinned and slowed when the guest asks for reduced motion, rather than
  // removed. The policy lives in hooks/useMotion.
  const { count } = useAmbient(motes);

  useImperativeHandle(
    ref,
    () => ({
      setIntensity: (value: number) => {
        intensityRef.current = Math.max(0, Math.min(1.6, value));
      },
      burst: (x = 0.5, y = 0.5, n = 26) => {
        burstQueue.current.push({ x, y, count: n });
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let frame = 0;
    let last = performance.now();
    let running = true;

    const makeMote = (seed = false): Mote => ({
      x: randomBetween(0, width),
      y: seed ? randomBetween(0, height) : height + randomBetween(10, 80),
      size: randomBetween(0.7, 2.4),
      vx: randomBetween(-6, 6),
      vy: randomBetween(-9, -26),
      drift: randomBetween(0, Math.PI * 2),
      driftRate: randomBetween(0.2, 0.6),
      alpha: randomBetween(0.25, 0.75),
      phase: randomBetween(0, Math.PI * 2),
      twinkleRate: randomBetween(0.25, 0.8),
      warm: Math.random() > 0.55,
      life: -1,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scaled = Math.round(count * Math.max(0.45, Math.min(width / 1440, 1)));
      motes = Array.from({ length: scaled }, () => makeMote(true));
    };

    const draw = (mote: Mote, twinkle: number) => {
      const [r, g, b] = mote.warm ? GOLD[1] : GOLD[Math.random() > 0.5 ? 0 : 2];
      const a = mote.alpha * twinkle * intensityRef.current * (mote.life >= 0 ? mote.life : 1);
      if (a <= 0.01) return;

      const radius = mote.size * 5;
      const glow = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, radius);
      glow.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      glow.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.35})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Hard core keeps the mote legible against bright ground.
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, a * 1.5)})`;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.size * 0.42, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (now: number) => {
      if (!running) return;
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);

      // Fold any queued bursts into the field.
      while (burstQueue.current.length) {
        const b = burstQueue.current.shift()!;
        for (let i = 0; i < b.count; i += 1) {
          const angle = randomBetween(0, Math.PI * 2);
          const speed = randomBetween(30, 140);
          motes.push({
            ...makeMote(true),
            x: b.x * width,
            y: b.y * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 20,
            size: randomBetween(1, 3),
            alpha: randomBetween(0.5, 1),
            life: 1,
          });
        }
      }

      for (let i = motes.length - 1; i >= 0; i -= 1) {
        const mote = motes[i]!;
        mote.drift += mote.driftRate * delta;
        mote.phase += mote.twinkleRate * delta;
        mote.x += (mote.vx + Math.sin(mote.drift) * 9) * delta;
        mote.y += mote.vy * delta;

        if (mote.life >= 0) {
          mote.life -= delta * 0.55;
          mote.vx *= 0.97;
          mote.vy *= 0.97;
          if (mote.life <= 0) {
            motes.splice(i, 1);
            continue;
          }
        } else if (mote.y + mote.size * 5 < 0) {
          Object.assign(mote, makeMote());
        }

        if (mote.x < -30) mote.x = width + 30;
        if (mote.x > width + 30) mote.x = -30;

        // Slow asymmetric twinkle, never a strobe.
        const twinkle = 0.55 + Math.sin(mote.phase) * 0.45;
        draw(mote, twinkle);
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
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    />
  );
}
