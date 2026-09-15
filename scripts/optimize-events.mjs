/**
 * Produces web-sized WebP renditions of the ceremony cards.
 *
 *   node scripts/optimize-events.mjs
 *
 * Re-run after replacing any of haldi.png / nikha.png / valima.png in assets-src/.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
// Build inputs live outside public/ so they are never served or deployed.
const SOURCE = join(ROOT, 'assets-src');
const OUT = join(PUBLIC, 'images', 'events');

// `nikha.png` is the filename as supplied; the ceremony itself is the Nikah.
const SOURCES = [
  { file: 'haldi.png', name: 'haldi' },
  { file: 'nikha.png', name: 'nikah' },
  { file: 'valima.png', name: 'valima' },
];

// One rendition each. These are consumed through next/image, which builds its
// own responsive set from the source at request time and never asks for a
// sibling file — so the narrower variants and the fallback this used to emit
// were shipped to the CDN and downloaded by nobody.
const WIDTH = 1054;
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
  console.log(`\n${source.file}  ${meta.width}x${meta.height}  ${kb(original.size)}`);

  const webp = await sharp(input)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toBuffer();
  await writeFile(join(OUT, `${source.name}-${WIDTH}.webp`), webp);
  console.log(`  ✓ images/events/${source.name}-${WIDTH}.webp  ${kb(webp.length)}`);
}

console.log('\nDone.');
