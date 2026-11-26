import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'public', 'preview.png');

const W = 1200;
const H = 630;

const photo = await sharp(join(root, 'public', 'vice-city.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.72, saturation: 0.85 })
  .jpeg({ quality: 88 })
  .toBuffer();

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#14111a" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#14111a" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#14111a" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  <text x="600" y="290" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="132" fill="#f3e9dc" letter-spacing="-2">TheGT</text>
  <text x="600" y="344" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#d9c4a9" letter-spacing="12">VICE CITY RADIO</text>
  <text x="600" y="582" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#f3e9dc" opacity="0.6" letter-spacing="8">LEONIDA · 2026</text>
</svg>`);

const png = await sharp(photo).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
writeFileSync(outPath, png);
console.log(`Preview generated: ${(png.length / 1024).toFixed(1)} KB`);
