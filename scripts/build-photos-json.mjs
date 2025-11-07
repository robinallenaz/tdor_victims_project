#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const photosDir = path.join(projectRoot, 'photos');
const dataDir = path.join(projectRoot, 'data');
const outFile = path.join(dataDir, 'photos.json');

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(full, rel));
    } else if (exts.has(path.extname(e.name).toLowerCase())) {
      files.push(rel.replace(/\\/g, '/'));
    }
  }
  return files;
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(photosDir);
  } catch {
    console.error(`Missing photos directory: ${photosDir}`);
    process.exit(1);
  }
  const images = await walk(photosDir);
  images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  const payload = { images };
  await fs.writeFile(outFile, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${images.length} entries to ${path.relative(projectRoot, outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
