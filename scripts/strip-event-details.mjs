/**
 * Paints out the date / time / venue / dress-code block baked into the Haldi
 * and Valima card artwork.
 *
 *   node scripts/strip-event-details.mjs [--check]
 *
 * Those details are pixels, not markup, and they had drifted out of sync with
 * EVENTS in src/constants/wedding.ts. The card only needs to carry the ceremony
 * name — the scratch panel is what reveals when and where. Nikah was authored
 * without the block and is left alone.
 *
 * The block sits on a near-flat wash, so each row is rebuilt by sampling clean
 * background either side and interpolating across: the gradient survives, the
 * lettering does not. The patch follows the lettering row by row rather than
 * covering one rectangle, because marigolds and roses climb to within a few
 * pixels of the text at the foot of both cards and must not be clipped.
 *
 * Ink is judged against each row's own background rather than a fixed level.
 * The hairline rules beside the values sit only ~20 below the wash they lie on
 * and a fixed threshold either misses them or starts eating the wash itself.
 *
 * Run `npm run events` afterwards to rebuild the WebP renditions.
 */

import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const TARGETS = [
  // xMin/xMax bracket the block; ink touching either edge is border art or a
  // figure, never lettering. floorL guards the few rows where a leaf sits close
  // enough to the dress-code motif to be mistaken for it.
  { file: 'assets-src/haldi.png',  xMin: 95, xMax: 400, floorL: 110, yTop: 600, yBottom: 1060, vpad: 14 },
  { file: 'assets-src/valima.png', xMin: 88, xMax: 375, floorL: 100, yTop: 805, yBottom: 1251, vpad: 8 },
];

const DELTA = 12;    // how far under its row's background a pixel must fall to be ink
const PAD = 14;      // ideal feather either side of the lettering
const MINPAD = 3;    // ...squeezed to this where the artwork crowds in
const SEARCH = 70;   // how far out to hunt for a clean sample
const RUN = 6;       // consecutive clean pixels needed to trust a sample
const SMOOTH = 12;    // vertical averaging radius for sampled colours
const GROW = 4;      // rows either side a span is widened over, for soft glyphs

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const step = (t) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };

for (const t of TARGETS) {
  const path = join(ROOT, t.file);
  const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const at = (x, y) => (y * W + x) * C;
  const lumAt = (x, y) => { const i = at(x, y); return lum(data[i], data[i + 1], data[i + 2]); };

  // The wash drifts down the card, so each row gets its own background level.
  // Lettering is a minority of any row inside the window, so the median lands
  // on the wash rather than on the ink.
  const bg = new Map();
  const rowBg = (y) => {
    let v = bg.get(y);
    if (v === undefined) {
      const s = [];
      for (let x = t.xMin; x <= t.xMax; x++) s.push(lumAt(x, y));
      s.sort((a, b) => a - b);
      v = s[s.length >> 1];
      bg.set(y, v);
    }
    return v;
  };
  const ink = (x, y) => lumAt(x, y) < rowBg(y) - DELTA;

  // ——— Where does the lettering actually sit on each row? ———
  const raw = [];
  for (let y = t.yTop; y <= t.yBottom; y++) {
    const runs = []; let s = -1;
    for (let x = t.xMin; x <= t.xMax; x++) {
      const on = ink(x, y);
      if (on && s < 0) s = x;
      if (!on && s >= 0) { runs.push([s, x - 1]); s = -1; }
    }
    if (s >= 0) runs.push([s, t.xMax]);
    const letters = runs.filter(([a, b]) => a > t.xMin && b < t.xMax && a >= t.floorL);
    raw.push(letters.length
      ? [Math.min(...letters.map((r) => r[0])), Math.max(...letters.map((r) => r[1]))]
      : null);
  }

  const Y0 = t.yTop - t.vpad, Y1 = t.yBottom + t.vpad;
  // Nearest row that actually carries lettering, searching one way.
  const near = (idx, dir) => {
    for (let k = idx; k >= 0 && k < raw.length; k += dir) if (raw[k]) return raw[k];
    return null;
  };

  const rows = [];
  for (let y = Y0; y <= Y1; y++) {
    // Widen across neighbouring rows so anti-aliased glyph edges are covered,
    // and carry the span through the gaps between lines so the patch stays one
    // continuous shape rather than striping the background.
    let L = Infinity, R = -Infinity;
    const idx = Math.max(0, Math.min(raw.length - 1, y - t.yTop));
    for (let k = idx - GROW; k <= idx + GROW; k++) {
      const r = raw[Math.max(0, Math.min(raw.length - 1, k))];
      if (r) { L = Math.min(L, r[0]); R = Math.max(R, r[1]); }
    }
    if (!Number.isFinite(L)) {
      // Bridge the gap between two lines. Leaving these rows alone banded the
      // wash at every former line: only the lettering rows were being rebuilt,
      // and the fill never matches the original quite closely enough to hide
      // a seam that runs the width of the block.
      for (const r of [near(idx, -1), near(idx, 1)]) {
        if (r) { L = Math.min(L, r[0]); R = Math.max(R, r[1]); }
      }
    }
    if (!Number.isFinite(L)) { rows.push(null); continue; }

    // Squeeze the feather to whatever clean margin the artwork leaves.
    let gapL = 0; while (gapL < PAD && L - 1 - gapL >= 0 && !ink(L - 1 - gapL, y)) gapL++;
    let gapR = 0; while (gapR < PAD && R + 1 + gapR < W && !ink(R + 1 + gapR, y)) gapR++;
    rows.push({ L, R, padL: Math.max(MINPAD, gapL - 1), padR: Math.max(MINPAD, gapR - 1) });
  }

  // ——— Clean background either side of every row ———
  const sample = (y, from, dir) => {
    let n = 0, acc = [0, 0, 0];
    for (let k = 0; k < SEARCH; k++) {
      const x = from + dir * k;
      if (x < 0 || x >= W) break;
      if (!ink(x, y)) {
        const i = at(x, y);
        acc[0] += data[i]; acc[1] += data[i + 1]; acc[2] += data[i + 2];
        if (++n === RUN) return acc.map((v) => v / RUN);
      } else { n = 0; acc = [0, 0, 0]; }
    }
    return null;
  };

  const picks = rows.map((r, k) => r
    ? { L: sample(Y0 + k, r.L - r.padL - 1, -1), R: sample(Y0 + k, r.R + r.padR + 1, 1) }
    : null);

  // Average vertically so film grain in the samples cannot band across the fill.
  const blur = (k, side) => {
    const acc = [0, 0, 0]; let n = 0;
    for (let j = Math.max(0, k - SMOOTH); j <= Math.min(picks.length - 1, k + SMOOTH); j++) {
      const p = picks[j]; if (!p) continue;
      const c = p[side] ?? p[side === 'L' ? 'R' : 'L'];
      if (c) { acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; n++; }
    }
    return n ? acc.map((v) => v / n) : null;
  };

  let painted = 0, tightest = PAD, widest = 0;
  for (let k = 0; k < rows.length; k++) {
    const r = rows[k]; if (!r) continue;
    const y = Y0 + k;
    const cl = blur(k, 'L'), cr = blur(k, 'R');
    if (!cl || !cr) continue;

    const vf = y < t.yTop ? (y - Y0) / t.vpad : y > t.yBottom ? (Y1 - y) / t.vpad : 1;
    const av = step(vf);
    const x0 = r.L - r.padL, x1 = r.R + r.padR;
    tightest = Math.min(tightest, r.padL, r.padR);
    widest = Math.max(widest, x1 - x0);

    for (let x = x0; x <= x1; x++) {
      const a = step(Math.min((x - x0) / r.padL, (x1 - x) / r.padR)) * av;
      if (a <= 0) continue;
      const tx = (x - x0) / (x1 - x0);
      const i = at(x, y);
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.round(data[i + c] * (1 - a) + (cl[c] + (cr[c] - cl[c]) * tx) * a);
      }
    }
    painted++;
  }

  const spans = rows.filter(Boolean);
  console.log(`\n${t.file}  ${W}x${H}`);
  console.log(`  lettering x ${Math.min(...spans.map((r) => r.L))}..${Math.max(...spans.map((r) => r.R))}  y ${t.yTop}..${t.yBottom}`);
  console.log(`  ${painted} rows painted, widest ${widest}px, tightest feather ${tightest}px`);

  if (CHECK) continue;
  await sharp(data, { raw: { width: W, height: H, channels: C } })
    .png({ compressionLevel: 9, effort: 10 }).toFile(path);
  console.log('  ✓ written');
}

console.log(CHECK ? '\nCheck only — nothing written.' : '\nDone. Now run: npm run events');
