'use client';

import { COUPLE } from '@/constants/wedding';
import { cn } from '@/utils/cn';
import type { Person } from '@/types';

/**
 * The couple's names, set live over the hero banner.
 *
 * These words used to be painted into banner-desktop.png and banner-mobile.png;
 * `scripts/strip-banner-names.mjs` lifted them out so they could be typeset and
 * revealed rather than simply arriving with the image. Hero.tsx runs the reveal.
 *
 * Placement is the fiddly part. The banner is `object-cover`, so where the arch
 * panel falls on screen depends on the viewport's aspect ratio, not just its
 * size. This renders into a box built by the same rule the browser uses to
 * cover — the larger of the viewport and the image's own aspect applied to it —
 * and centred the same way, so the box lies exactly over the artwork. Anything
 * positioned as a percentage of it therefore lands on the same spot of the
 * painting at every size, and `container-type: size` makes `cqw` a percentage
 * of that same box, so the type scales with the arch and not with the viewport.
 *
 * The `vw` ceilings are the one departure. On a window taller than it is wide
 * the artwork is cropped left and right, and type sized purely off the box
 * would run out past both edges; the ceiling lets it shrink instead.
 *
 * The two banners are different crops, so each gets its own geometry. They swap
 * at the same 768px breakpoint as the <picture> they sit over.
 */

/* Sampled from the lettering that was removed, so the live type matches the
   ink the artwork was drawn around. */
const INK = '#3C1902';
const LEAD = '#43200A';
const EYEBROW = '#7A5423';
const GOLD = '#B8842C';

const CROPS = {
  /** banner-desktop.png — the names sit in a row, either side of the ampersand. */
  wide: {
    w: 1682,
    h: 935,
    /** Centre of the lockup, down the crop: between the Bismillah and the ornament. */
    top: '39.8%',
    eyebrow: 'min(0.92cqw, 1.6vw)',
    lead: 'min(1.85cqw, 3.2vw)',
    feature: 'min(4.4cqw, 7.6vw)',
    amp: 'min(5.6cqw, 9.6vw)',
    eyebrowGap: 'min(1.5cqw, 2.6vw)',
    blockGap: 'min(1.6cqw, 2.8vw)',
  },
  /** banner-mobile.png — a taller crop, so the same words stack. */
  tall: {
    w: 853,
    h: 1844,
    top: '49.4%',
    eyebrow: 'min(1.95cqw, 2.1vw)',
    lead: 'min(3.9cqw, 4.2vw)',
    feature: 'min(10.4cqw, 11vw)',
    amp: 'min(11cqw, 11.6vw)',
    eyebrowGap: 'min(3.4cqw, 3.6vw)',
    blockGap: 'min(1.4cqw, 1.5vw)',
  },
} as const;

type Crop = (typeof CROPS)[keyof typeof CROPS];

function NameBlock({ person, crop }: { person: Person; crop: Crop }) {
  // The two always compose back to `fullName`, so the name can never drift.
  const feature = person.fullName.slice(person.nameLead.length).trim();

  return (
    <span className="flex flex-col items-center">
      <span
        data-hero-line
        className="invisible font-display whitespace-nowrap"
        style={{ fontSize: crop.lead, color: LEAD, letterSpacing: '0.04em', lineHeight: 1.25 }}
      >
        {person.nameLead}
      </span>
      <span
        data-hero-name
        className="invisible font-script whitespace-nowrap"
        style={{ fontSize: crop.feature, color: INK, lineHeight: 1.08 }}
      >
        {feature}
      </span>
    </span>
  );
}

export function BannerLockup({ crop: which }: { crop: keyof typeof CROPS }) {
  const crop = CROPS[which];
  const stacked = which === 'tall';
  const ratio = crop.w / crop.h;

  return (
    <div
      data-hero-crop={which}
      className={cn(
        'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        stacked ? 'md:hidden' : 'hidden md:block',
      )}
      style={{
        // The browser's own cover rule, written out.
        width: `max(100vw, ${(100 * ratio).toFixed(2)}svh)`,
        height: `max(100svh, ${(100 / ratio).toFixed(2)}vw)`,
        containerType: 'size',
      }}
    >
      <h1
        className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ top: crop.top }}
      >
        <span className="sr-only">
          {COUPLE.groom.fullName} and {COUPLE.bride.fullName}
        </span>

        <span
          data-hero-line
          aria-hidden
          className="invisible font-sans uppercase"
          style={{
            fontSize: crop.eyebrow,
            letterSpacing: '0.42em',
            color: EYEBROW,
            // Tracking is added to the right of the last letter too; pull it back
            // so the words stay centred on the arch rather than sitting left of it.
            textIndent: '0.42em',
            marginBottom: crop.eyebrowGap,
          }}
        >
          The Wedding Of
        </span>

        <span
          aria-hidden
          className={cn('flex', stacked ? 'flex-col items-center' : 'items-center justify-center')}
          style={{ gap: crop.blockGap }}
        >
          <NameBlock person={COUPLE.groom} crop={crop} />

          <span className="flex flex-col items-center">
            {/* Holds the ampersand down onto the line of the script names, the
                way it sits on the printed card, rather than centring it against
                the whole two-line block. */}
            {!stacked && (
              <span aria-hidden className="invisible font-display" style={{ fontSize: crop.lead, lineHeight: 1.25 }}>
                &nbsp;
              </span>
            )}
            <span
              data-hero-amp
              className="invisible font-script"
              style={{ fontSize: crop.amp, color: GOLD, lineHeight: 1.08 }}
            >
              &amp;
            </span>
          </span>

          <NameBlock person={COUPLE.bride} crop={crop} />
        </span>
      </h1>
    </div>
  );
}
