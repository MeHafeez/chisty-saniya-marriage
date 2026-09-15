/**
 * Produces web-sized WebP renditions of the hero banners.
 *
 *   node scripts/optimize-banners.mjs
 *
 * The source PNGs are ~2.6 MB each, which is far too heavy for a hero — and
 * because the two banners are different crops (not one image at two sizes) they
 * need `<picture>` art direction rather than the Next image optimiser, so the
 * work has to happen ahead of time.
 *
 * Re-run this after replacing either banner-*.png in assets-src/.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
// Build inputs live outside public/ so they are never served or deployed.
const SOURCE = join(ROOT, 'assets-src');
const OUT = join(PUBLIC, 'images', 'banner');

const SOURCES = [
  { file: 'banner-desktop.png', name: 'desktop', widths: [1024, 1440, 1672] },
  { file: 'banner-mobile.png', name: 'mobile', widths: [480, 640, 852] },
];

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

  for (const width of source.widths) {
    // Never upscale past the source.
    if (meta.width && width > meta.width) continue;

    const webp = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();

    const target = join(OUT, `${source.name}-${width}.webp`);
    await writeFile(target, webp);
    console.log(`  ✓ images/banner/${source.name}-${width}.webp  ${kb(webp.length)}`);
  }

  // A JPEG fallback for the rare browser without WebP, at one size only.
  const fallbackWidth = source.widths[source.widths.length - 1];
  const jpeg = await sharp(input)
    .resize({ width: fallbackWidth, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(join(OUT, `${source.name}-fallback.jpg`), jpeg);
  console.log(`  ✓ images/banner/${source.name}-fallback.jpg  ${kb(jpeg.length)}`);
}

console.log('\nDone.');
