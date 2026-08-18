'use client';

import { cn } from '@/utils/cn';

export interface OrnamentProps {
  className?: string;
  size?: number;
  variant?: 'sprig' | 'crest' | 'wreath';
}

/** Small fixed flourishes used inside cards and above headings. */
export function Ornament({ className, size = 48, variant = 'sprig' }: OrnamentProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    'aria-hidden': true as const,
    className: cn('text-gold', className),
  };

  if (variant === 'crest') {
    return (
      <svg {...common}>
        <path d="M24 4 30 14h11l-8 8 3 12-12-7-12 7 3-12-8-8h11L24 4Z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3" fill="currentColor" fillOpacity="0.3" />
      </svg>
    );
  }

  if (variant === 'wreath') {
    return (
      <svg {...common}>
        <path d="M24 6c-9.9 0-18 8.1-18 18s8.1 18 18 18" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M24 6c9.9 0 18 8.1 18 18s-8.1 18-18 18" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M24 16c-3 3-4.5 6-4.5 9s1.5 6 4.5 8c3-2 4.5-5 4.5-8s-1.5-6-4.5-9Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 64 24">
      <path d="M2 12h18M44 12h18" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M32 3c-3.4 3.6-5 6.6-5 9s1.6 5.4 5 9c3.4-3.6 5-6.6 5-9s-1.6-5.4-5-9Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="22" cy="12" r="1.3" fill="currentColor" />
      <circle cx="42" cy="12" r="1.3" fill="currentColor" />
    </svg>
  );
}
