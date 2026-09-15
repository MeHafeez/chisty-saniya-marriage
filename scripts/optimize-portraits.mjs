/**
 * Produces web-sized WebP renditions of the couple's portraits.
 *
 *   node scripts/optimize-portraits.mjs
 *
 * These are transparent cut-outs, so alpha has to survive — WebP keeps it and
 * still lands roughly a tenth of the PNG's weight.
 *
 * Re-run after replacing either groom.png or bride.png in assets-src/.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
// Build inputs live outside public/ so they are never served or deployed.
const SOURCE = join(ROOT, 'assets-src');
const OUT = join(PUBLIC, 'images', 'portraits');

const SOURCES = [
  { file: 'groom.png', name: 'groom' },
  { file: 'bride.png', name: 'bride' },
];

// One rendition each. These are consumed through next/image, which builds its
// own responsive set from the source at request time and never asks for a
// sibling file — so the narrower variants and the fallback this used to emit
// were shipped to the CDN and downloaded by nobody.
const WIDTH = 1000;
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(OUT, { recursive: true });

for (const source of SOURCES) {
  const input = join(SOURCE, source.file);

  try {
    await stat(input);
  } catch {
    console.warn(`  ! skipped ${source.file} — not found`);
    continue;
  }

  const original = await stat(input);
  const meta = await sharp(input).metadata();
  console.log(
    `\n${source.file}  ${meta.width}x${meta.height}  ${kb(original.size)}  alpha=${meta.hasAlpha}`,
  );

  const webp = await sharp(input)
    .resize({ width: WIDTH, withoutEnlargement: true })
    // `alphaQuality` keeps the cut-out edge clean; a soft edge shows badly
    // against the warm backdrop these sit on.
    .webp({ quality: 86, alphaQuality: 92, effort: 5 })
    .toBuffer();
  await writeFile(join(OUT, `${source.name}-${WIDTH}.webp`), webp);
  console.log(`  ✓ images/portraits/${source.name}-${WIDTH}.webp  ${kb(webp.length)}`);
}

console.log('\nDone.');
