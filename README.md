# Khaja & Saniya — Valima Invitation

An ultra-premium, motion-led wedding invitation for the Valima Ceremony of
**Shaik Khaja Mohiddin Chisty** and **Syed Saniya**, Saturday 3 October 2026 at
B. Convention Centre, Guntur.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP and Lenis.

The experience opens in three acts: a **loader** that traces a khatam star, an **Islamic portal**
whose two carved doors must be unsealed by hand, and the **invitation itself** — twelve sections
that reveal as you scroll through them.

---

## Quick start

```bash
npm install
npm run assets   # regenerate the placeholder artwork (already committed)
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Regenerate every placeholder SVG in `public/` |

---

## Making it yours

### 1. All the words and dates — one file

Everything a guest reads lives in [`src/constants/wedding.ts`](src/constants/wedding.ts).
No name, date or venue is hard-coded in any component.

```ts
export const COUPLE       = { groom: { … }, bride: { … } };
export const COUPLE_ORDER = [COUPLE.groom, COUPLE.bride];  // display order
export const WEDDING      = { date: new Date('2026-10-03T20:00:00+05:30'), … };
export const EVENTS       = [ … ];   // Haldi, Nikah, Valima
export const VENUE, GALLERY, FAMILY, WELL_WISHERS, BLESSINGS,
             STORY_CHAPTERS, WELCOME_LETTER, CLOSING
```

Changing `WEDDING.date` updates the hero, the countdown, the navigation menu, the footer,
the page title and the schema.org event automatically.

**`COUPLE_ORDER` controls whose name comes first.** It is set to groom-first to match the
printed card — the groom's family host the Valima. Swap the two entries and every paired
appearance follows: the portal doors, the hero, the couple cards, the monogram, the nav
initials, the footer and the page title.

#### What came from the card, and what did not

Values transcribed from the printed invitation are marked `— from the card` and should only
change if the card changes: both names, the professions, all parents and grandparents, the
three ceremonies with their dates/times/venues, the Hijri date, the hosts, and the
"Best Compliments From" list.

Four things are **not** on the card and ship as neutral placeholders marked `TODO (family)`:

| Placeholder | What to do |
| --- | --- |
| `COUPLE.groom.bio` / `COUPLE.bride.bio` | Replace with a few lines in your own words |
| `GALLERY` | Replace the SVGs with photographs and write real captions |
| `WEDDING.hashtag` | Currently `#KhajaWedsSaniya` — change or delete |
| `RSVP_DEADLINE` | Currently 20 September 2026 — set a date that suits you |

The Blessings section deliberately carries **authentic marriage duas with their sources**
(Sunan Abi Dawud 2130, Al-Furqan 25:74, Ar-Rum 30:21) rather than invented quotes attributed
to named relatives. Swap them for real messages from guests whenever you have them.

### 2. Photographs

The project ships with generated SVG placeholders so it looks finished out of the box.
Replace the files at these paths with real photographs (same names, or update the paths in
`wedding.ts`):

```
public/images/portraits/bride.svg        →  the bride
public/images/portraits/groom.svg        →  the groom
public/images/portraits/couple-arch.svg  →  the hero arch
public/images/story/chapter-0{1..3}.svg  →  the three days
public/images/gallery/frame-0{1..9}.svg  →  gallery (any aspect ratio)
public/images/og-image.svg               →  link preview card (1200×630)
```

When you switch to JPG/PNG/WebP, remember to update `width`/`height` in `GALLERY`, and you can
delete the three `dangerouslyAllowSVG` lines from [`next.config.ts`](next.config.ts) — they exist
only to let the optimiser serve the placeholder SVGs.

### 3. Music

Drop an MP3 at `public/audio/ambient.mp3`. The toggle appears **only** when the file loads, so
the site is complete without it. Configure in [`src/constants/site.ts`](src/constants/site.ts).

Playback starts on the "Open Invitation" click — a real user gesture — so no browser blocks it.

### 4. RSVP delivery

The form posts to [`src/app/api/rsvp/route.ts`](src/app/api/rsvp/route.ts), which re-validates
server-side and currently logs the reply. Replace the marked block with a database write, an
email, or a Google Sheet append. The client contract does not change.

### 5. Colours and type

Design tokens are declared once in the `@theme` block of
[`src/styles/globals.css`](src/styles/globals.css) and become Tailwind utilities
(`bg-ivory`, `text-gold`, `font-display`…). Change a value there and it propagates everywhere.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ivory` | `#FDF9F5` | Page ground |
| `--color-champagne` | `#F6EFE7` | Alternating sections |
| `--color-ink` | `#3A2E2A` | Primary text, buttons |
| `--color-gold` | `#C6A66A` | Accent, hover state |
| `--color-muted` | `#8B7D74` | Secondary text |

Typefaces are loaded through `next/font/google` in `src/app/layout.tsx`:
Cormorant Garamond (headings), Playfair Display (sub-heads), Inter (body), Great Vibes (script).

---

## Architecture

```
src/
├── app/                 Next.js App Router — layout, page, API route, sitemap, robots
├── sections/            The twelve movements of the invitation, in scroll order
├── components/
│   ├── experience/      Loader, cover screen, cursor, music, navigation, progress
│   ├── ui/              Button, Section, SectionHeading, SplitText, Divider, Reveal
│   ├── cards/           CoupleCard, EventCard, CountdownUnit, MapCard
│   ├── form/            TextField, ChoiceGroup, GuestCounter, SuccessBloom
│   ├── gallery/         Lightbox
│   ├── decor/
│   │   ├── islamic/     geometry, GirihPattern, ArchFrame, PortalDoors,
│   │   │                CourtyardScene, MosqueSilhouette, IslamicMonogram
│   │   └── …            AmbientBackground, ParticleCanvas, FloralCorner, FloatingHearts
│   └── layout/          Footer
├── context/             ExperienceProvider — the three-act state machine
├── hooks/               Lenis, countdown, magnetic, parallax, media queries, audio…
├── animations/          Shared variants, GSAP registration, text splitting
├── constants/           wedding.ts (content) · site.ts (SEO) · motion.ts (timing)
├── utils/               cn, math, formatting, validation
├── types/               Shared domain types
└── styles/              globals.css — tokens, base, primitives, keyframes
```

### How the three acts work

[`ExperienceProvider`](src/context/ExperienceProvider.tsx) owns a single `phase` value:

```
loading  →  cover  →  revealed
```

- **loading** — progress is driven by `document.fonts.ready` racing a floor duration, so the
  loader never flashes past and never traps a guest on a slow connection.
- **cover** — scroll is frozen (Lenis is stopped *and* the body carries `data-locked`, which
  also covers the reduced-motion path where Lenis never runs).
- **revealed** — the page unlocks and the chrome fades in.

The page content stays mounted underneath the whole time, so the browser has already painted
it before the portal opens.

### The entrance

[`CoverScreen`](src/components/experience/CoverScreen.tsx) runs its own three-stage machine —
`sealed → opening → entering` — over roughly 4.4 seconds:

| Stage | What happens |
| --- | --- |
| `sealed` | A pointed-arch portal stands closed. Both leaves are carved with a girih lattice; the bride's name is on the left leaf, the groom's on the right. A khatam wax seal spans the join, half on each leaf. |
| `opening` | The seal's two halves rotate apart, the keystone star turns 45°, both handles rotate, and the leaves swing inward on a 2.1s hinge. Behind them a dusk courtyard assembles: stars, a crescent moon, hanging lanterns and a domed mosque with two minarets. Light floods out through the widening gap. |
| `entering` | The camera pushes through the archway — the whole scene scales toward the arch opening while the surrounding text retreats — and a warm bloom floods to white, handing over to the invitation. |

Timings live in `SEQUENCE` in [`src/constants/motion.ts`](src/constants/motion.ts).

**Reviewing content?** Add `?preview=1` to the URL to skip straight past the loader and the
portal to the invitation itself — useful when you are proofreading names and dates rather than
watching the entrance.

Two details worth knowing if you change it:

- **Audio must start on the click.** `onBegin` fires synchronously inside the click handler
  (browsers only honour `play()` inside the gesture itself); `onOpen` fires ~4.4s later once the
  camera has arrived. Do not merge them.
- **Reduced motion collapses the whole sequence** to a ~0.5s fade, and the courtyard's ambient
  loops never start.

### Islamic geometry

Everything architectural is constructed from pure functions in
[`src/components/decor/islamic/geometry.ts`](src/components/decor/islamic/geometry.ts) — no
hand-tuned path strings, so every shape scales exactly:

| Function | Produces |
| --- | --- |
| `starPath` | An n-pointed khatam star (8-point is the girih backbone, 4-point fills interstices) |
| `polygonPath` | The octagon rings that frame each star |
| `pointedArchPath` | A two-centred pointed arch |
| `onionDomePath` | A bulbous dome with its finial point |
| `crescentPath` | A hilal finial |
| `archMaskUrl` | The arch as a stretchable `mask-image` data URI |

`archMaskUrl` is why the portal and every arched portrait stay responsive without measuring
anything: one shape with `preserveAspectRatio="none"` stretches to any box, and outlines use
`vector-effect="non-scaling-stroke"` so hairlines stay exactly 1px however far it stretches.

`<GirihPattern>` emits a seamless SVG `<pattern>` — corner stars are shared between neighbouring
tiles, so the lattice repeats with no visible seam. `<ArchFrame>` clips any content into the
arch and is reused by the hero portrait and both couple cards, so arriving through the portal
lands you on the same geometry you walked through.

### Motion

- **Framer Motion** drives everything declarative: reveals, staggers, split text, the lightbox,
  the form, page chrome. Shared variants live in `src/animations/variants.ts`.
- **GSAP + ScrollTrigger** drives the scrubbed timeline spine in the Love Story section — the
  one place a scroll-linked scrub beats a viewport trigger.
- **Lenis** owns scrolling and is stepped from GSAP's ticker so both share one clock.
- Every duration, delay and easing curve is centralised in `src/constants/motion.ts`.

---

## Accessibility

Motion *is* the product here, so it degrades rather than disappears:

- `prefers-reduced-motion` keeps every element **visible** and removes only the movement.
  Lenis, the particle canvas, floating hearts and the custom cursor all switch off.
- The custom cursor only replaces the native one on true pointer devices (`hover: hover`).
- `SplitText` renders animated glyphs as `aria-hidden` alongside a visually-hidden copy of the
  real string, so screen readers and copy-paste get clean text.
- The main content is `aria-hidden` until the invitation is opened, and a skip link is the
  first focusable element.
- The lightbox traps Escape/arrow keys and restores focus to the tile that opened it.
- All form fields have labels, `aria-invalid`, `role="alert"` errors and visible focus rings.

## Performance

- Canvas particle fields pause on tab blur and scale their count to viewport width.
- Images are lazy by default; only the hero arch and the bride's portrait are `priority`.
- `optimizePackageImports` trims `react-icons` and `framer-motion` barrel imports.
- The whole page is statically prerendered — first load is ~235 kB JS.

## Browser support

Evergreen Chrome, Edge, Firefox and Safari (including iOS). `backdrop-filter`, `clip-path`,
`color-mix()` and `100svh` are all used and all have current support; `100dvh`/`100svh` fall
back gracefully to a full-height layout.

## Licence

Private commission. The placeholder artwork is generated by `scripts/generate-placeholders.mjs`
and is free to replace or delete.
