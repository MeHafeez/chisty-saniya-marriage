/**
 * Generates every placeholder image the invitation ships with.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Each file is a self-contained SVG built from the same Islamic geometry the
 * site uses — a girih star medallion on a warm ground — so the page reads as
 * finished before a single photograph exists. Drop real photos over these
 * paths and nothing else needs to change.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

/** SVG is XML: a bare `&` is a fatal parse error and the image will not render. */
const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PALETTE = {
  ivory: '#FDF9F5',
  ink: '#3A2E2A',
  gold: '#C6A66A',
  goldSoft: '#E3CE9F',
  goldDeep: '#9C7A33',
  muted: '#8B7D74',
};

/**
 * Warm grounds with real saturation. The previous set sat within a couple of
 * percent of the page background, which made every image read as a blank box.
 */
const TONES = [
  { from: '#F0E2CB', to: '#CBAE83', ink: '#4A3826' },
  { from: '#EDE1D6', to: '#C2A184', ink: '#43312A' },
  { from: '#F2E7D2', to: '#C8AC7C', ink: '#463421' },
  { from: '#E9DFD2', to: '#B9A184', ink: '#3D2F27' },
  { from: '#F4E9D8', to: '#D2B588', ink: '#4A3724' },
  { from: '#EFE3D0', to: '#C4A67B', ink: '#453322' },
];

const tone = (index) => TONES[index % TONES.length];

/* — Geometry (mirrors src/components/decor/islamic/geometry.ts) ————— */

const fix = (n) => Number(n.toFixed(2));

function starPath(cx, cy, outer, inner, points = 8, rotationDeg = 0) {
  const step = Math.PI / points;
  const start = (rotationDeg * Math.PI) / 180 - Math.PI / 2;
  const coords = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = start + i * step;
    coords.push(`${fix(cx + r * Math.cos(a))} ${fix(cy + r * Math.sin(a))}`);
  }
  return `M${coords.join('L')}Z`;
}

function polygonPath(cx, cy, radius, sides = 8, rotationDeg = 0) {
  const step = (Math.PI * 2) / sides;
  const start = (rotationDeg * Math.PI) / 180 - Math.PI / 2;
  return `M${Array.from({ length: sides }, (_, i) => {
    const a = start + i * step;
    return `${fix(cx + radius * Math.cos(a))} ${fix(cy + radius * Math.sin(a))}`;
  }).join('L')}Z`;
}

/** A layered khatam medallion — the focal ornament of every placeholder. */
function medallion(cx, cy, r, gold, opacity = 1) {
  return `
  <g opacity="${opacity}">
    <circle cx="${fix(cx)}" cy="${fix(cy)}" r="${fix(r * 1.16)}" fill="none" stroke="${gold}" stroke-opacity="0.3" stroke-width="${fix(r * 0.012)}"/>
    <path d="${polygonPath(cx, cy, r * 1.02, 8, 22.5)}" fill="none" stroke="${gold}" stroke-opacity="0.45" stroke-width="${fix(r * 0.016)}"/>
    <path d="${starPath(cx, cy, r, r * 0.5)}" fill="${gold}" fill-opacity="0.16" stroke="${gold}" stroke-opacity="0.62" stroke-width="${fix(r * 0.018)}" stroke-linejoin="round"/>
    <path d="${starPath(cx, cy, r * 0.62, r * 0.31, 8, 22.5)}" fill="${gold}" fill-opacity="0.22" stroke="${gold}" stroke-opacity="0.5" stroke-width="${fix(r * 0.014)}" stroke-linejoin="round"/>
    <path d="${polygonPath(cx, cy, r * 0.3, 8, 0)}" fill="${gold}" fill-opacity="0.3" stroke="${gold}" stroke-opacity="0.7" stroke-width="${fix(r * 0.012)}"/>
  </g>`;
}

/** Quarter medallions tucked into the corners for depth. */
function cornerSprigs(w, h, r, gold) {
  return [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]
    .map(
      ([x, y]) => `
    <path d="${starPath(x, y, r, r * 0.5)}" fill="${gold}" fill-opacity="0.12" stroke="${gold}" stroke-opacity="0.3" stroke-width="${fix(r * 0.02)}" stroke-linejoin="round"/>`,
    )
    .join('');
}

/**
 * The shared placeholder frame: saturated ground, corner geometry, a central
 * khatam medallion carrying an optional letter, and a captioned gold rule.
 */
function makePlaceholder({ width, height, index, monogram = '', caption = '' }) {
  const t = tone(index);
  const id = `${width}x${height}-${index}`;
  const short = Math.min(width, height);
  const cx = width / 2;
  const cy = height * 0.44;
  const r = short * 0.24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(caption || 'Decorative placeholder')}">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0.65" y2="1">
      <stop offset="0%" stop-color="${t.from}"/>
      <stop offset="100%" stop-color="${t.to}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0%" stop-color="${PALETTE.ivory}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${PALETTE.ivory}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${id}" cx="0.5" cy="0.46" r="0.72">
      <stop offset="55%" stop-color="${t.ink}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${t.ink}" stop-opacity="0.42"/>
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg-${id})"/>
  <rect width="${width}" height="${height}" fill="url(#glow-${id})"/>

  ${cornerSprigs(width, height, short * 0.13, PALETTE.goldDeep)}
  ${medallion(cx, cy, r, PALETTE.goldDeep)}

  ${
    monogram
      ? `<text x="${fix(cx)}" y="${fix(cy)}" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fix(r * 0.62)}" font-weight="400"
        fill="${t.ink}" fill-opacity="0.62">${esc(monogram)}</text>`
      : ''
  }

  <rect width="${width}" height="${height}" fill="url(#vig-${id})"/>

  ${
    caption
      ? `<g>
    <line x1="${fix(cx - short * 0.16)}" y1="${fix(height - short * 0.155)}" x2="${fix(cx + short * 0.16)}" y2="${fix(height - short * 0.155)}" stroke="${PALETTE.goldDeep}" stroke-opacity="0.5" stroke-width="${fix(short * 0.004)}"/>
    <text x="${fix(cx)}" y="${fix(height - short * 0.09)}" text-anchor="middle"
      font-family="Helvetica, Arial, sans-serif" font-size="${fix(Math.max(11, short * 0.036))}"
      fill="${t.ink}" fill-opacity="0.72" letter-spacing="${fix(short * 0.014)}">${esc(caption.toUpperCase())}</text>
  </g>`
      : ''
  }

  <rect x="${fix(short * 0.03)}" y="${fix(short * 0.03)}" width="${fix(width - short * 0.06)}" height="${fix(height - short * 0.06)}"
    fill="none" stroke="${PALETTE.goldDeep}" stroke-opacity="0.35" stroke-width="${fix(short * 0.003)}"/>
</svg>
`;
}

/* — The OG card and favicon are bespoke ————————————————— */

/** Keep in step with COUPLE / WEDDING in src/constants/wedding.ts. */
const CARD = {
  groom: { name: 'Khaja', initial: 'K' },
  bride: { name: 'Saniya', initial: 'S' },
  occasion: 'VALIMA CEREMONY',
  date: '3 OCTOBER 2026',
  place: 'GUNTUR, ANDHRA PRADESH',
};

function makeOgImage() {
  const gold = PALETTE.goldDeep;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(`${CARD.groom.name} & ${CARD.bride.name} — ${CARD.occasion}`)}">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#2A1F18"/>
      <stop offset="55%" stop-color="#1C1410"/>
      <stop offset="100%" stop-color="#120D0A"/>
    </linearGradient>
    <linearGradient id="og-foil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${PALETTE.goldDeep}"/>
      <stop offset="42%" stop-color="#F0DFB4"/>
      <stop offset="100%" stop-color="${PALETTE.gold}"/>
    </linearGradient>
    <radialGradient id="og-glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0%" stop-color="#C6A66A" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#C6A66A" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#og-bg)"/>
  <rect width="1200" height="630" fill="url(#og-glow)"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="${PALETTE.gold}" stroke-opacity="0.4"/>
  <rect x="46" y="46" width="1108" height="538" fill="none" stroke="${PALETTE.gold}" stroke-opacity="0.16"/>

  ${medallion(160, 315, 84, PALETTE.gold, 0.5)}
  ${medallion(1040, 315, 84, PALETTE.gold, 0.5)}

  <text x="600" y="214" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="21"
    fill="${PALETTE.goldSoft}" fill-opacity="0.85" letter-spacing="13">${esc(CARD.occasion)}</text>

  <text x="600" y="345" text-anchor="middle" font-family="Georgia, serif" font-size="104"
    fill="url(#og-foil)">${esc(`${CARD.groom.name} & ${CARD.bride.name}`)}</text>

  <line x1="470" y1="400" x2="730" y2="400" stroke="${gold}" stroke-opacity="0.6" stroke-width="1"/>

  <text x="600" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="34"
    fill="#F3E7D3" letter-spacing="7">${esc(CARD.date)}</text>

  <text x="600" y="512" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18"
    fill="${PALETTE.goldSoft}" fill-opacity="0.7" letter-spacing="8">${esc(CARD.place)}</text>
</svg>
`;
}

function makeFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#1C1410"/>
  <path d="${starPath(32, 32, 25, 12.5)}" fill="${PALETTE.gold}" fill-opacity="0.2" stroke="${PALETTE.gold}" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="${starPath(32, 32, 12, 6, 8, 22.5)}" fill="${PALETTE.goldSoft}" fill-opacity="0.9"/>
</svg>
`;
}

/* — Manifest ————————————————————————————————————————— */

const FILES = [
  {
    path: 'images/portraits/bride.svg',
    svg: makePlaceholder({ width: 900, height: 1200, index: 0, monogram: CARD.bride.initial, caption: 'The Bride' }),
  },
  {
    path: 'images/portraits/groom.svg',
    svg: makePlaceholder({ width: 900, height: 1200, index: 2, monogram: CARD.groom.initial, caption: 'The Groom' }),
  },
  {
    path: 'images/portraits/couple-arch.svg',
    svg: makePlaceholder({
      width: 800,
      height: 1120,
      index: 4,
      caption: `${CARD.groom.name} & ${CARD.bride.name}`,
    }),
  },
  ...['The Haldi', 'The Nikah', 'The Valima'].map((caption, index) => ({
    path: `images/story/chapter-0${index + 1}.svg`,
    svg: makePlaceholder({
      width: 1000,
      height: 750,
      index: index + 1,
      monogram: ['I', 'II', 'III'][index],
      caption,
    }),
  })),
  ...[
    { w: 800, h: 1100, caption: 'Haldi' },
    { w: 800, h: 800, caption: 'Mehendi' },
    { w: 800, h: 1000, caption: 'The Nikah' },
    { w: 800, h: 640, caption: 'Two circles, no ends' },
    { w: 800, h: 1180, caption: 'The Bride' },
    { w: 800, h: 900, caption: 'One long table' },
    { w: 800, h: 760, caption: 'Flowers for the hall' },
    { w: 800, h: 1060, caption: 'The Valima' },
    { w: 800, h: 820, caption: 'Two families, one' },
  ].map((frame, index) => ({
    path: `images/gallery/frame-0${index + 1}.svg`,
    svg: makePlaceholder({ width: frame.w, height: frame.h, index, caption: frame.caption }),
  })),
  { path: 'images/og-image.svg', svg: makeOgImage() },
  { path: 'favicon.svg', svg: makeFavicon() },
];

/* — Write ————————————————————————————————————————————— */

for (const file of FILES) {
  const target = join(PUBLIC, file.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, file.svg, 'utf8');
  console.log(`  ✓ public/${file.path}`);
}

console.log(`\nGenerated ${FILES.length} placeholder assets.`);
