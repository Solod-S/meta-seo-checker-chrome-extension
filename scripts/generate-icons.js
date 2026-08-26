import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background rounded rectangle
  const cornerRadius = size * 0.22;
  const padding = size * 0.04;
  const drawSize = size - padding * 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(padding, padding, drawSize, drawSize, cornerRadius);
  ctx.clip();

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#2563eb');
  grad.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle inner glow
  const innerGlow = ctx.createRadialGradient(size * 0.3, size * 0.3, 0, size * 0.3, size * 0.3, size * 0.8);
  innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  ctx.fillStyle = innerGlow;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  // Icon symbol: Modern Search Glass + SEO Check / Spark
  const cx = size * 0.44;
  const cy = size * 0.44;
  const radius = size * 0.24;
  const strokeWidth = Math.max(1.5, size * 0.09);

  // Glass circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Glass handle
  const handleStart = radius + strokeWidth * 0.2;
  const handleEnd = radius * 1.85;
  const angle = Math.PI / 4; // 45 degrees

  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(angle) * handleStart, cy + Math.sin(angle) * handleStart);
  ctx.lineTo(cx + Math.cos(angle) * handleEnd, cy + Math.sin(angle) * handleEnd);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = strokeWidth * 1.1;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Checkmark inside the lens
  if (size >= 32) {
    const checkScale = size / 48;
    ctx.beginPath();
    ctx.moveTo(cx - 5 * checkScale, cy);
    ctx.lineTo(cx - 1 * checkScale, cy + 4 * checkScale);
    ctx.lineTo(cx + 6 * checkScale, cy - 4 * checkScale);
    ctx.strokeStyle = '#38bdf8'; // Cyan checkmark
    ctx.lineWidth = Math.max(2, strokeWidth * 0.85);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  } else {
    // For 16px, small central dot / check
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }

  ctx.restore();

  return canvas.toBuffer('image/png');
}

const sizes = [16, 32, 48, 128];

for (const size of sizes) {
  const buffer = drawIcon(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filePath}`);
}

console.log('All icons generated successfully.');
