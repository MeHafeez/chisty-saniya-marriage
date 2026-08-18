'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/utils/cn';

type Variant = 'solid' | 'outline' | 'ghost' | 'wine';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Strength of the cursor pull. 0 disables the magnet. */
  magnetic?: number;
  icon?: ReactNode;
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-ink text-ivory border-ink hover:border-gold',
  wine: 'bg-wine text-ivory border-wine shadow-[0_10px_24px_-10px_rgba(90,21,38,0.7)] hover:border-gold',
  outline: 'bg-transparent text-ink border-ink/25 hover:border-gold hover:text-ivory',
  ghost: 'bg-transparent text-ink border-transparent hover:text-gold-deep',
};

const SIZES: Record<Size, string> = {
  sm: 'px-7 py-3 text-[0.6875rem] tracking-[0.28em]',
  md: 'px-9 py-4 text-[0.75rem] tracking-[0.3em]',
  lg: 'px-12 py-5 text-[0.8125rem] tracking-[0.32em]',
};

/**
 * The invitation's only button. Magnetic on fine pointers, with a gold curtain
 * that wipes up from the base on hover.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'solid',
    size = 'md',
    className,
    magnetic = 0.3,
    icon,
    ...rest
  } = props as BaseProps & Record<string, unknown>;

  const magnet = useMagnetic(magnetic);
  const isLink = 'href' in props && typeof props.href === 'string';

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden',
    'rounded-full border font-sans font-medium uppercase',
    'transition-[color,border-color] duration-500 ease-[var(--ease-luxe)]',
    'disabled:pointer-events-none disabled:opacity-45',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const inner = (
    <>
      {/* Gold curtain wipe */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -z-0 origin-bottom scale-y-0 bg-gold',
          'transition-transform duration-[700ms] ease-[var(--ease-luxe)]',
          'group-hover:scale-y-100 group-focus-visible:scale-y-100',
        )}
      />
      {/* Light sweep */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-ivory/25 opacity-0 transition-opacity duration-300 group-hover:animate-[shimmer_1.1s_ease-out] group-hover:opacity-100" />
      </span>

      <span className="relative z-10 transition-colors duration-500 group-hover:text-ivory">
        {children}
      </span>
      {icon && (
        <span className="relative z-10 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1 group-hover:text-ivory">
          {icon}
        </span>
      )}
    </>
  );

  return (
    <motion.div
      ref={magnet.ref}
      className="inline-block"
      style={magnet.isEnabled ? { x: magnet.x, y: magnet.y } : undefined}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      {isLink ? (
        <a
          className={classes}
          href={(props as ButtonAsLink).href}
          onClick={(props as ButtonAsLink).onClick}
          aria-label={(props as ButtonAsLink)['aria-label']}
          {...((props as ButtonAsLink).external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {inner}
        </a>
      ) : (
        <button className={classes} type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
