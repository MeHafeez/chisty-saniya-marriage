/**
 * Produces web-sized WebP renditions of the couple's portraits.
 *
 *   node scripts/optimize-portraits.mjs
 *
 * These are transparent cut-outs, so alpha has to survive — WebP keeps it and
 * still lands roughly a tenth of the PNG's weight. A PNG fallback is emitted
 * for the rare browser without WebP.
 *
 * Re-run after replacing either groom.png or bride.png.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'images', 'portraits');

const SOURCES = [
  { file: 'groom.png', name: 'groom' },
  { file: 'bride.png', name: 'bride' },
];

const WIDTHS = [480, 720, 1000];
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
  console.log(
    `\n${source.file}  ${meta.width}x${meta.height}  ${kb(original.size)}  alpha=${meta.hasAlpha}`,
  );

  for (const width of WIDTHS) {
    if (meta.width && width > meta.width) continue;

    const webp = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      // `alphaQuality` keeps the cut-out edge clean; a soft edge shows badly
      // against the warm backdrop these sit on.
      .webp({ quality: 86, alphaQuality: 92, effort: 5 })
      .toBuffer();

    await writeFile(join(OUT, `${source.name}-${width}.webp`), webp);
    console.log(`  ✓ images/portraits/${source.name}-${width}.webp  ${kb(webp.length)}`);
  }

  const png = await sharp(input)
    .resize({ width: WIDTHS[WIDTHS.length - 1], withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  await writeFile(join(OUT, `${source.name}-fallback.png`), png);
  console.log(`  ✓ images/portraits/${source.name}-fallback.png  ${kb(png.length)}`);
}

console.log('\nDone.');
