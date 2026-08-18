'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

import { ArchFrame } from '@/components/decor/islamic/ArchFrame';
import { GirihPattern } from '@/components/decor/islamic/GirihPattern';
import { Ornament } from '@/components/decor/Ornament';
import { EASE, VIEWPORT } from '@/constants/motion';
import { useParallax } from '@/hooks/useParallax';
import { cn } from '@/utils/cn';
import type { Person } from '@/types';

const SOCIAL_ICONS: Record<string, IconType> = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  twitter: FaXTwitter,
};

export interface CoupleCardProps {
  person: Person;
  /** Mirrors the layout so the pair reads as a matched set facing each other. */
  align?: 'left' | 'right';
  delay?: number;
  priority?: boolean;
}

/** A portrait card with an arched frame, inner parallax and a gold hover glow. */
export function CoupleCard({ person, align = 'left', delay = 0, priority = false }: CoupleCardProps) {
  const { ref, y } = useParallax<HTMLDivElement>(34);
  const mirrored = align === 'right';

  return (
    <motion.article
      className={cn('group relative flex flex-col', mirrored ? 'lg:items-end lg:text-right' : 'lg:items-start')}
      initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25, margin: VIEWPORT.margin }}
      transition={{ duration: 1.5, delay, ease: EASE.luxe }}
    >
      {/* Portrait */}
      <div ref={ref} className="relative w-full max-w-[24rem]">
        <ArchFrame
          innerOutline
          variant="soft"
          shadow="0 16px 32px rgba(47,37,33,0.15)"
          className="aspect-[4/5] w-full"
        >
          {/* ——— Backdrop ———
              The portraits are transparent cut-outs, so the arch has to supply
              the ground they stand on: a warm studio wash, a girih veil for
              material, and a pool of light behind the figure. The backdrop takes
              the parallax so the figure itself stays planted on the base. */}
          <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(170deg, #FBF3E7 0%, #F2E4CE 46%, #E4D0B2 100%)' }}
            />
            <svg className="absolute inset-0 h-full w-full text-gold-deep opacity-30" aria-hidden>
              <defs>
                <GirihPattern
                  id={`portrait-veil-${person.id}`}
                  size={52}
                  strokeWidth={0.6}
                  fillOpacity={0.07}
                  strokeOpacity={0.4}
                />
              </defs>
              <rect width="100%" height="100%" fill={`url(#portrait-veil-${person.id})`} />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(56% 46% at 50% 34%, rgba(255,250,238,0.92) 0%, rgba(255,250,238,0) 70%)',
              }}
            />
          </motion.div>

          {/* Ground shadow, so the cut-out is standing rather than floating */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[14%] bottom-[2.5%] h-[8%] rounded-[50%] blur-lg"
            style={{ background: 'radial-gradient(ellipse, rgba(74,55,36,0.38), transparent 72%)' }}
          />

          {/* ——— The figure ———
              `contain` + bottom keeps the whole cut-out visible and grounded on
              the arch base. `cover` would crop the veil or the turban, and the
              two sources have different aspect ratios so a crop cannot suit both. */}
          <Image
            src={person.image}
            alt={`Portrait of ${person.fullName}`}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            sizes="(max-width: 1024px) 85vw, 24rem"
            className="object-contain object-bottom transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
            style={{ filter: 'drop-shadow(0 10px 18px rgba(74,55,36,0.2))' }}
          />

          {/* Bottom fade. The source cut-outs are cropped mid-torso, so without
              this the figure ends on a hard horizontal line across the arch;
              blending into the backdrop reads as a vignetted portrait instead. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%]"
            style={{
              background:
                'linear-gradient(180deg, rgba(228,208,178,0) 0%, rgba(228,208,178,0.72) 55%, rgba(224,202,170,0.96) 100%)',
            }}
          />

          {/* Vignette, and a gold sheen that lifts on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(82% 74% at 50% 42%, rgba(74,55,36,0) 56%, rgba(74,55,36,0.18) 100%)',
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/25 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </ArchFrame>

        {/* Floating initial — on the *outer* edge of each card. On the inner edge
            the two initials met in the gap between the arches and read as a
            mistake once real portraits replaced the monogrammed placeholders. */}
        <motion.span
          aria-hidden
          className={cn(
            'absolute -top-7 font-display text-[6rem] font-light leading-none text-gold/25 sm:text-[8rem]',
            mirrored ? '-left-4' : '-right-4',
          )}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: delay + 0.3, ease: EASE.luxe }}
        >
          {person.initial}
        </motion.span>
      </div>

      {/* Copy */}
      <div className={cn('mt-9 flex w-full max-w-[24rem] flex-col', mirrored && 'lg:items-end')}>
        <p className="eyebrow">{person.role}</p>

        <h3 className="mt-4 font-display text-[length:var(--text-h3)] font-light leading-tight text-ink">
          {person.fullName}
        </h3>

        {person.title && (
          <p className="mt-2 font-serif text-[0.9375rem] font-light italic text-muted">
            {person.title}
          </p>
        )}

        <Ornament
          variant="sprig"
          size={54}
          className={cn('my-5 opacity-70', mirrored && 'lg:self-end')}
        />

        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-gold-deep">
          {person.parents}
        </p>

        {person.grandparents && (
          <p className="mt-2 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-muted">
            {person.grandparents}
          </p>
        )}

        <p className="mt-5 text-pretty font-serif text-[0.9375rem] font-light leading-[1.9] text-muted">
          {person.bio}
        </p>

        {person.socials && person.socials.length > 0 && (
          <div className={cn('mt-7 flex gap-3', mirrored && 'lg:justify-end')}>
            {person.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon] ?? FaInstagram;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on ${social.label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-all duration-500 hover:border-gold hover:text-gold-deep hover:shadow-[var(--shadow-glow)]"
                >
                  <Icon aria-hidden className="text-sm" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}
