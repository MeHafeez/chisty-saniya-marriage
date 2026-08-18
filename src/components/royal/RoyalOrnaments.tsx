'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { polygonPath, starPath } from '@/components/decor/islamic/geometry';

/* ==================================================================== *
 *  The ornamental system.
 *
 *  All artwork here is original, drawn from the same khatam/girih geometry
 *  the rest of the invitation is built from. Nothing is traced from another
 *  site and nothing is a raster asset.
 * ==================================================================== */

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_TRANSFORM: Record<Corner, string> = {
  'top-left': '',
  'top-right': 'scale(-1,1)',
  'bottom-left': 'scale(1,-1)',
  'bottom-right': 'scale(-1,-1)',
};

/* ——— RoyalCorner ————————————————————————————————————— */

export interface RoyalCornerProps {
  corner: Corner;
  size?: number;
  className?: string;
  /** Stroke colour; defaults to the gold token. */
  tone?: string;
  opacity?: number;
  /** Positioning, when the offset needs a computed value rather than a class. */
  style?: React.CSSProperties;
}

/**
 * An ornate corner piece: a double gold rule turning the corner, an arabesque
 * scroll springing from it, and a khatam rosette at the elbow.
 */
export function RoyalCorner({
  corner,
  size = 190,
  className,
  tone = 'currentColor',
  opacity = 1,
  style,
}: RoyalCornerProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn('pointer-events-none absolute text-gold', className)}
      style={{ opacity, ...style }}
      aria-hidden
    >
      <g transform={CORNER_TRANSFORM[corner]} style={{ transformOrigin: '100px 100px' }}>
        {/* Double rule */}
        <path d="M6 74 L6 6 L74 6" fill="none" stroke={tone} strokeWidth="2.2" strokeLinecap="square" />
        <path d="M15 82 L15 15 L82 15" fill="none" stroke={tone} strokeWidth="0.9" strokeOpacity="0.7" />

        {/* Arabesque scrolls */}
        <path
          d="M15 96 C 46 96, 64 78, 66 48 C 67 34, 60 26, 50 27 C 40 28, 36 38, 42 45 C 47 51, 57 49, 58 41"
          fill="none"
          stroke={tone}
          strokeWidth="1.15"
          strokeOpacity="0.9"
          strokeLinecap="round"
        />
        <path
          d="M96 15 C 96 46, 78 64, 48 66 C 34 67, 26 60, 27 50 C 28 40, 38 36, 45 42 C 51 47, 49 57, 41 58"
          fill="none"
          stroke={tone}
          strokeWidth="1.15"
          strokeOpacity="0.9"
          strokeLinecap="round"
        />

        {/* Inner leaves */}
        <path d="M34 78 C 44 74, 52 66, 56 56 C 46 58, 38 66, 34 78 Z" fill={tone} fillOpacity="0.32" />
        <path d="M78 34 C 74 44, 66 52, 56 56 C 58 46, 66 38, 78 34 Z" fill={tone} fillOpacity="0.32" />

        {/* Elbow rosette */}
        <g transform="translate(28 28)">
          <path d={polygonPath(0, 0, 15, 8, 22.5)} fill="none" stroke={tone} strokeWidth="0.8" strokeOpacity="0.6" />
          <path d={starPath(0, 0, 12.5, 6)} fill={tone} fillOpacity="0.42" stroke={tone} strokeWidth="0.8" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="2.6" fill={tone} />
        </g>

        {/* Tapering finials down each rule */}
        {[112, 140, 164].map((d, i) => (
          <g key={d}>
            <path d={starPath(6, d, 5 - i, 2.4 - i * 0.5, 4, 45)} fill={tone} fillOpacity={0.6 - i * 0.15} />
            <path d={starPath(d, 6, 5 - i, 2.4 - i * 0.5, 4, 45)} fill={tone} fillOpacity={0.6 - i * 0.15} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ——— RoyalFrame ————————————————————————————————————— */

export interface RoyalFrameProps {
  className?: string;
  /** Inset of the frame from its container. */
  inset?: string;
  tone?: string;
  cornerSize?: number;
  /** Animates the rules drawing outward from the centre of each edge. */
  animate?: boolean;
  children?: React.ReactNode;
}

/** A complete ornamental border: four rules plus four RoyalCorners. */
export function RoyalFrame({
  className,
  inset = '0px',
  tone = 'currentColor',
  cornerSize = 150,
  animate = false,
  children,
}: RoyalFrameProps) {
  const rule = 'absolute bg-current';
  const draw = animate
    ? { initial: { scaleX: 0, scaleY: 0 }, animate: { scaleX: 1, scaleY: 1 } }
    : {};

  return (
    <div
      className={cn('pointer-events-none absolute text-gold', className)}
      style={{ inset }}
      aria-hidden
    >
      {/* Edge rules, drawn from the middle out */}
      <motion.span
        className={cn(rule, 'left-0 right-0 top-0 h-px origin-center')}
        {...draw}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className={cn(rule, 'bottom-0 left-0 right-0 h-px origin-center')}
        {...draw}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className={cn(rule, 'bottom-0 left-0 top-0 w-px origin-center')}
        {...draw}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className={cn(rule, 'bottom-0 right-0 top-0 w-px origin-center')}
        {...draw}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />

      <RoyalCorner corner="top-left" size={cornerSize} tone={tone} className="left-0 top-0" />
      <RoyalCorner corner="top-right" size={cornerSize} tone={tone} className="right-0 top-0" />
      <RoyalCorner corner="bottom-left" size={cornerSize} tone={tone} className="bottom-0 left-0" />
      <RoyalCorner corner="bottom-right" size={cornerSize} tone={tone} className="bottom-0 right-0" />

      {children}
    </div>
  );
}

/* ——— OrnamentalLine ————————————————————————————————— */

export interface OrnamentalLineProps {
  className?: string;
  width?: number;
  tone?: string;
  /** Height of the central motif relative to the rule. */
  scale?: number;
}

/** A horizontal rule with a khatam centre and tapering ends. */
export function OrnamentalLine({
  className,
  width = 320,
  tone = 'currentColor',
  scale = 1,
}: OrnamentalLineProps) {
  const h = 26 * scale;

  return (
    <svg
      viewBox={`0 0 ${width} ${h}`}
      width={width}
      height={h}
      className={cn('text-gold', className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="orn-line-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tone} stopOpacity="0" />
          <stop offset="35%" stopColor={tone} stopOpacity="0.85" />
          <stop offset="65%" stopColor={tone} stopOpacity="0.85" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>

      <line x1="0" y1={h / 2} x2={width} y2={h / 2} stroke="url(#orn-line-fade)" strokeWidth="1" />

      {/* Centre motif */}
      <g transform={`translate(${width / 2} ${h / 2})`}>
        <path d={starPath(0, 0, 9 * scale, 4 * scale)} fill={tone} fillOpacity="0.9" />
        <path
          d={polygonPath(0, 0, 12 * scale, 8, 22.5)}
          fill="none"
          stroke={tone}
          strokeWidth="0.7"
          strokeOpacity="0.55"
        />
      </g>

      {/* Flanking diamonds */}
      {[-1, 1].map((dir) => (
        <g key={dir} transform={`translate(${width / 2 + dir * 34 * scale} ${h / 2})`}>
          <path d={starPath(0, 0, 4 * scale, 1.8 * scale, 4, 45)} fill={tone} fillOpacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

/* ——— GoldDivider ————————————————————————————————————— */

export interface GoldDividerProps {
  className?: string;
  width?: number;
  /** Plays the draw-in on scroll rather than immediately. */
  onScroll?: boolean;
}

/** The section divider: an OrnamentalLine that draws itself open. */
export function GoldDivider({ className, width = 300, onScroll = true }: GoldDividerProps) {
  const state = onScroll
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true, amount: 0.8 } }
    : { initial: 'hidden' as const, animate: 'visible' as const };

  return (
    <motion.div
      className={cn('flex justify-center', className)}
      variants={{
        hidden: { opacity: 0, scaleX: 0.3 },
        visible: { opacity: 1, scaleX: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...state}
      aria-hidden
    >
      <OrnamentalLine width={width} />
    </motion.div>
  );
}

/* ——— FloralAccent ————————————————————————————————————— */

export interface FloralAccentProps {
  className?: string;
  size?: number;
  tone?: string;
  /** `sprig` points up, `swag` hangs down, `rosette` is radial. */
  variant?: 'sprig' | 'swag' | 'rosette';
}

/** A small arabesque flourish for headings and card corners. */
export function FloralAccent({
  className,
  size = 64,
  tone = 'currentColor',
  variant = 'sprig',
}: FloralAccentProps) {
  if (variant === 'rosette') {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} className={cn('text-gold', className)} aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="32"
            cy="16"
            rx="4.6"
            ry="13"
            fill={tone}
            fillOpacity="0.3"
            stroke={tone}
            strokeWidth="0.6"
            strokeOpacity="0.55"
            transform={`rotate(${i * 45} 32 32)`}
          />
        ))}
        <path d={starPath(32, 32, 9, 4.2, 8, 22.5)} fill={tone} fillOpacity="0.75" />
      </svg>
    );
  }

  if (variant === 'swag') {
    return (
      <svg viewBox="0 0 120 44" width={size * 1.9} height={size * 0.7} className={cn('text-gold', className)} aria-hidden>
        <path d="M4 4 C 30 34, 90 34, 116 4" fill="none" stroke={tone} strokeWidth="1" strokeOpacity="0.8" />
        <path d="M12 4 C 34 28, 86 28, 108 4" fill="none" stroke={tone} strokeWidth="0.6" strokeOpacity="0.5" />
        {[28, 60, 92].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i === 1 ? 28 : 24})`}>
            <path d="M0 0 C -5 8, -3 15, 0 19 C 3 15, 5 8, 0 0 Z" fill={tone} fillOpacity="0.42" />
          </g>
        ))}
        <path d={starPath(60, 30, 5, 2.4, 4, 45)} fill={tone} fillOpacity="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 40" width={size} height={size * 0.62} className={cn('text-gold', className)} aria-hidden>
      <path d="M32 38 L32 16" stroke={tone} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M32 30 C 22 30, 15 25, 12 18 C 21 17, 29 22, 32 30 Z" fill={tone} fillOpacity="0.34" stroke={tone} strokeWidth="0.6" />
      <path d="M32 30 C 42 30, 49 25, 52 18 C 43 17, 35 22, 32 30 Z" fill={tone} fillOpacity="0.34" stroke={tone} strokeWidth="0.6" />
      <path d="M32 22 C 26 20, 22 15, 21 9 C 27 10, 31 15, 32 22 Z" fill={tone} fillOpacity="0.26" />
      <path d="M32 22 C 38 20, 42 15, 43 9 C 37 10, 33 15, 32 22 Z" fill={tone} fillOpacity="0.26" />
      <path d={starPath(32, 10, 6, 2.8)} fill={tone} fillOpacity="0.85" />
    </svg>
  );
}
