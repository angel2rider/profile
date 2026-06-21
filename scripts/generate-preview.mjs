import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'preview.png');

const W = 1200;
const H = 630;

// Generate star particles as SVG circles
const stars = Array.from({ length: 80 }, (_, i) => {
  const cx = Math.random() * W;
  const cy = Math.random() * H;
  const r = Math.random() * 1.5 + 0.5;
  const opacity = Math.random() * 0.5 + 0.2;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}" />`;
}).join('\n');

// A few bright "hero" stars with glow
const heroStars = Array.from({ length: 6 }, () => {
  const cx = 200 + Math.random() * 800;
  const cy = 50 + Math.random() * 200;
  const r = Math.random() * 2 + 1.5;
  return `<circle cx="${cx}" cy="${cy}" r="${r * 3}" fill="white" opacity="0.08" />\n<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="0.9" />`;
}).join('\n');

// Subtle grid lines
const vertLines = Array.from({ length: 21 }, (_, i) =>
  `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${H}" stroke="white" stroke-width="0.5"/>`
).join('\n');
const horzLines = Array.from({ length: 11 }, (_, i) =>
  `<line x1="0" y1="${i * 63}" x2="${W}" y2="${i * 63}" stroke="white" stroke-width="0.5"/>`
).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="50%" style="stop-color:#0f0f1a"/>
      <stop offset="100%" style="stop-color:#050508"/>
    </linearGradient>
    <radialGradient id="glow1" cx="30%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="70%" cy="60%" r="50%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="50%" style="stop-color:#e0e7ff"/>
      <stop offset="100%" style="stop-color:#c7d2fe"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <g opacity="0.025">
    ${vertLines}
    ${horzLines}
  </g>

  ${stars}
  ${heroStars}

  <line x1="${W/2 - 140}" y1="${H/2 + 65}" x2="${W/2 + 140}" y2="${H/2 + 65}" stroke="url(#textGrad)" stroke-width="1" opacity="0.25"/>

  <text x="${W/2}" y="${H/2 - 10}" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="120" font-weight="800" fill="url(#textGrad)" filter="url(#glow)" letter-spacing="8">TheGT</text>

  <text x="${W/2}" y="${H/2 + 115}" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="22" font-weight="400" fill="#a5b4fc" opacity="0.8" letter-spacing="12">GREATNESS LIES AHEAD</text>

  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#textGrad)" opacity="0.4"/>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, png);
console.log(`Preview generated: ${(png.length / 1024).toFixed(1)} KB`);
