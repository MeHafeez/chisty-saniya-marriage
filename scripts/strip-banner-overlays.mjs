/**
 * Paints out the parts of the hero banners the page now provides itself.
 *
 *   node scripts/strip-banner-overlays.mjs [--check]
 *
 * Two things were painted into this artwork that the site has since taken over.
 * "The Wedding Of", both names and the ampersand are now live type, set by
 * BannerLockup and revealed by Hero.tsx, rather than arriving fully formed with
 * the image. And the scroll cue at the foot of the mobile crop — a gold disc
 * and "scroll down to continue" — duplicated the real button Hero.tsx renders,
 * so a phone showed two of them, only one of which did anything.
 *
 * Each band is rebuilt column by column, interpolating between clean ground
 * found directly above and below it. Vertically, because what runs through
 * these bands runs that way too: light rays down the arch behind the names, and
 * lantern reflections down the polished floor behind the cue. Interpolating
 * across them would flatten them; interpolating along them leaves every column
 * its own brightness.
 *
 * Bands are looser than what they cover, since the type is set with a soft
 * luminous halo and covering only the solid strokes leaves a ghost of it.
 *
 * A band's lower edge can be stepped rather than straight. The names are set in
 * a script face whose descenders loop far below the baseline — the y of
 * "Chisty", the y of "Saniya" — while the ornament beneath them and the minaret
 * finials beside them come up nearly as high. A straight edge deep enough for
 * the swashes would eat both.
 *
 * Order matters: a band takes its anchors from the rows just outside itself, so
 * where two bands nearly touch the lower one is painted first. On mobile only
 * eight rows separate "Mohiddin Chisty" from the ampersand below it.
 *
 * Re-run `npm run banners` afterwards if the WebP renditions are wired up.
 */

import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

// `y1` is either a straight edge or a stepped one: [xUpTo, bottom] segments.
const TARGETS = [
  {
    file: 'assets-src/banner-desktop.png',
    bands: [
      { of: 'THE WEDDING OF', x0: 690, x1: 980, y0: 272, y1: 312 },
      { of: 'Shaik Khaja / Mohiddin Chisty', x0: 372, x1: 862, y0: 316,
        y1: [[700, 470], [862, 488]] },                    // ...488 clears the y of Chisty
      { of: 'ampersand', x0: 864, x1: 1000, y0: 316, y1: 478 },
      { of: 'Syed / Saniya', x0: 1002, x1: 1272, y0: 312,
        y1: [[1050, 484], [1232, 508], [1272, 466]] },     // 508 for the swash, 466 off the minaret
    ],
  },
  {
    file: 'assets-src/banner-mobile.png',
    bands: [
      { of: 'THE WEDDING OF', x0: 292, x1: 562, y0: 648, y1: 690 },
      // Before the line above it, which has to sample the wash beneath itself.
      { of: 'ampersand', x0: 372, x1: 504, y0: 876, y1: 996 },
      { of: 'Shaik Khaja / Mohiddin Chisty', x0: 126, x1: 722, y0: 700,
        y1: [[620, 886], [722, 900]] },                    // ...900 clears the y of Chisty
      { of: 'Syed / Saniya', x0: 276, x1: 574, y0: 1004, y1: 1182 },
      // The scroll cue. The disc goes before its caption so the caption has
      // clean floor to read above itself.
      { of: 'scroll cue disc', x0: 382, x1: 480, y0: 1556, y1: 1658 },
      { of: 'scroll cue caption', x0: 288, x1: 572, y0: 1658, y1: 1700 },
    ],
  },
];

const FX = 8;       // horizontal feather at the band's sides
const FY = 3;       // vertical feather at its top and bottom
const SEARCH = 90;  // how far out to hunt for clean wash
const RUN = 3;      // consecutive clean pixels needed to trust an anchor
const SMOOTH = 6;   // horizontal averaging radius for anchors

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const step = (t) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const bottomAt = (y1, x) => {
  if (typeof y1 === 'number') return y1;
  for (const [upTo, v] of y1) if (x <= upTo) return v;
  return y1[y1.length - 1][1];
};

for (const t of TARGETS) {
  const path = join(ROOT, t.file);
  const { data, info } = await sharp(path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const at = (x, y) => (y * W + x) * C;
  console.log(`\n${t.file}  ${W}x${H}`);

  for (const b of t.bands) {
    // Walk out from the band's edge and take the first stable stretch of wash.
    // Judged against the walk's own upper quartile rather than a fixed level:
    // the rays alone swing the wash further than any fixed threshold allows.
    const anchor = (x, from, dir) => {
      const walk = [];
      for (let k = 0; k < SEARCH; k++) {
        const y = from + dir * k;
        if (y < 0 || y >= H) break;
        const i = at(x, y);
        walk.push([lum(data[i], data[i + 1], data[i + 2]), data[i], data[i + 1], data[i + 2]]);
      }
      if (!walk.length) return null;
      const q = walk.map((w) => w[0]).sort((m, n) => m - n)[Math.floor(walk.length * 0.75)];
      let run = [], best = null;
      for (const w of walk) {
        if (w[0] >= q - 8) { run.push(w); if (run.length === RUN) { best = run; break; } }
        else run = [];
      }
      if (!best) best = [...walk].sort((m, n) => n[0] - m[0]).slice(0, RUN);
      const acc = [0, 0, 0];
      for (const w of best) { acc[0] += w[1]; acc[1] += w[2]; acc[2] += w[3]; }
      return acc.map((v) => v / best.length);
    };

    const cols = [];
    for (let x = b.x0; x <= b.x1; x++) {
      cols.push({ top: anchor(x, b.y0 - 1, -1), bot: anchor(x, bottomAt(b.y1, x) + 1, 1) });
    }

    // Average anchors across neighbouring columns, or grain in any one column
    // prints as a vertical streak down the whole band.
    const blur = (k, side) => {
      const acc = [0, 0, 0]; let n = 0;
      for (let j = Math.max(0, k - SMOOTH); j <= Math.min(cols.length - 1, k + SMOOTH); j++) {
        const c = cols[j][side] ?? cols[j][side === 'top' ? 'bot' : 'top'];
        if (c) { acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; n++; }
      }
      return n ? acc.map((v) => v / n) : null;
    };

    if (CHECK) { console.log(`  would paint ${b.of}: x ${b.x0}..${b.x1}  y ${b.y0}..`); continue; }

    for (let k = 0; k < cols.length; k++) {
      const x = b.x0 + k;
      const top = blur(k, 'top'), bot = blur(k, 'bot');
      if (!top || !bot) continue;
      const y1 = bottomAt(b.y1, x), span = y1 - b.y0;
      const ax = step(Math.min((x - b.x0) / FX, (b.x1 - x) / FX));
      for (let y = b.y0; y <= y1; y++) {
        const a = ax * step(Math.min((y - b.y0) / FY, (y1 - y) / FY));
        if (a <= 0) continue;
        const ty = (y - b.y0) / span;
        const i = at(x, y);
        for (let c = 0; c < 3; c++) {
          data[i + c] = Math.round(data[i + c] * (1 - a) + (top[c] + (bot[c] - top[c]) * ty) * a);
        }
      }
    }
    console.log(`  ✓ ${b.of}`);
  }

  if (CHECK) continue;
  await sharp(data, { raw: { width: W, height: H, channels: C } })
    .png({ compressionLevel: 9, effort: 10 }).toFile(path);
  console.log('  ✓ written');
}

console.log(CHECK ? '\nCheck only — nothing written.' : '\nDone.');
