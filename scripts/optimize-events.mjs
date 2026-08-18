/**
 * Produces web-sized WebP renditions of the ceremony cards.
 *
 *   node scripts/optimize-events.mjs
 *
 * Re-run after replacing any of haldi.png / nikha.png / valima.png.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'images', 'events');

// `nikha.png` is the filename as supplied; the ceremony itself is the Nikah.
const SOURCES = [
  { file: 'haldi.png', name: 'haldi' },
  { file: 'nikha.png', name: 'nikah' },
  { file: 'valima.png', name: 'valima' },
];

const WIDTHS = [540, 800, 1054];
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(OUT, { recursive: true });

for (const source of SOURCES) {
  const input = join(PUBLIC, source.file);
  try {
    await stat(input);
  } catch {
    console.warn(`  ! skipped ${source.file} — not found`);
    continue;
  }

  const original = await stat(input);
  const meta = await sharp(input).metadata();
  console.log(`\n${source.file}  ${meta.width}x${meta.height}  ${kb(original.size)}`);

  for (const width of WIDTHS) {
    if (meta.width && width > meta.width) continue;
    const webp = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();
    await writeFile(join(OUT, `${source.name}-${width}.webp`), webp);
    console.log(`  ✓ images/events/${source.name}-${width}.webp  ${kb(webp.length)}`);
  }

  const jpeg = await sharp(input)
    .resize({ width: WIDTHS[WIDTHS.length - 1], withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  await writeFile(join(OUT, `${source.name}-fallback.jpg`), jpeg);
  console.log(`  ✓ images/events/${source.name}-fallback.jpg  ${kb(jpeg.length)}`);
}

console.log('\nDone.');
