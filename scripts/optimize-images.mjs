#!/usr/bin/env node
/**
 * One-off image optimizer for public/media.
 *
 * Resizes + re-compresses source images in place so they stay reasonably
 * sized. Existing file paths/extensions are preserved, so no code changes are
 * required and next/image still serves webp/avif on top of the smaller source.
 *
 * Originals are copied to ./original-media-backup once (never overwritten), so
 * this script is safe to re-run and easy to revert. That backup folder can be
 * deleted after you've verified the results.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const MEDIA_DIR = path.join(ROOT, 'public', 'media');
const BACKUP_DIR = path.join(ROOT, 'original-media-backup');

// Large "hero"/full-bleed images get a bigger cap; everything else is a
// gallery/thumbnail asset and can be much smaller.
const HERO_MATCHERS = [/hero/i, /about2nd/i];
const HERO_MAX_WIDTH = 1920;
const DEFAULT_MAX_WIDTH = 900;
const JPEG_QUALITY = 72;
const PNG_QUALITY = 80;

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png']);

function maxWidthFor(fileName) {
  return HERO_MATCHERS.some((re) => re.test(fileName)) ? HERO_MAX_WIDTH : DEFAULT_MAX_WIDTH;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function backupOnce(absPath) {
  const rel = path.relative(MEDIA_DIR, absPath);
  const dest = path.join(BACKUP_DIR, rel);
  try {
    await fs.access(dest);
    return; // already backed up
  } catch {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(absPath, dest);
  }
}

function fmt(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function optimize(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  if (!RASTER_EXT.has(ext)) return null;

  const before = (await fs.stat(absPath)).size;
  await backupOnce(absPath);

  const input = sharp(await fs.readFile(absPath), { failOn: 'none' });
  const meta = await input.metadata();
  const cap = maxWidthFor(path.basename(absPath));
  const pipeline = input.rotate();

  if (meta.width && meta.width > cap) {
    pipeline.resize({ width: cap, withoutEnlargement: true });
  }

  let output;
  if (ext === '.png') {
    output = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
  } else {
    output = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  // Only write if we actually made it smaller.
  if (output.length < before) {
    await fs.writeFile(absPath, output);
  }
  const after = (await fs.stat(absPath)).size;
  return { rel: path.relative(MEDIA_DIR, absPath), before, after };
}

async function main() {
  const files = await walk(MEDIA_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const result = await optimize(file);
    if (!result) continue;
    totalBefore += result.before;
    totalAfter += result.after;
    const pct = ((1 - result.after / result.before) * 100).toFixed(0);
    console.log(`${result.rel.padEnd(28)} ${fmt(result.before)} -> ${fmt(result.after)} (-${pct}%)`);
  }
  console.log('-'.repeat(60));
  console.log(`TOTAL ${fmt(totalBefore)} -> ${fmt(totalAfter)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
