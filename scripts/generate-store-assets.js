import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storeAssetsDir = path.resolve(__dirname, '../store/assets');
const uploadedDir = '/Users/serg/.gemini/antigravity-ide/brain/407174f2-5005-4972-8e77-f10e6773e6e8/.user_uploaded';

if (!fs.existsSync(storeAssetsDir)) {
  fs.mkdirSync(storeAssetsDir, { recursive: true });
}

// 1. Generate 5 High-Quality 1280x800 Store Screenshots
async function generateAllScreenshots() {
  const items = [
    {
      file: 'media_1787893871659.png',
      out: 'screenshot_1_summary_1280x800.png',
      badge: '⚡ INSTANT ON-PAGE SEO AUDIT',
      title: 'Summary & Meta Tags Diagnostics',
      subtitle: 'Analyze Title, Description, Canonical, Robots Directives, Charset, Viewport & Technical Signals'
    },
    {
      file: 'media_1787893882452.png',
      out: 'screenshot_2_headings_1280x800.png',
      badge: '📑 DOM HIERARCHY INSPECTOR',
      title: 'Headings Structure & Hierarchy (H1–H6)',
      subtitle: 'DOM-order tree outline, missing H1 detection, empty heading tags alert & skipped level warnings'
    },
    {
      file: 'media_1787893896471.png',
      out: 'screenshot_3_images_1280x800.png',
      badge: '🖼️ ASSETS & ACCESSIBILITY AUDIT',
      title: 'Images & ALT Text Inspector',
      subtitle: 'Detect missing ALTs vs decorative empty ALTs, preview thumbnails, dimensions & lazy loading'
    },
    {
      file: 'media_1787893905317.png',
      out: 'screenshot_4_links_1280x800.png',
      badge: '🔗 LINK PROFILE & DIRECTIVES',
      title: 'Link Classifier & Rel Directives Tracker',
      subtitle: 'Internal vs External, nofollow / sponsored / ugc tags, unique counter & duplicate occurrence alerts'
    },
    {
      file: 'media_1787893915457.png',
      out: 'screenshot_5_social_1280x800.png',
      badge: '📡 SOCIAL METADATA & SCHEMA.ORG',
      title: 'Open Graph, Twitter Cards & JSON-LD',
      subtitle: 'Inspect social snippet previews, Twitter card tags & validate Schema.org structured data'
    }
  ];

  for (const item of items) {
    const width = 1280;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Premium Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Radial ambient glows
    const glow1 = ctx.createRadialGradient(250, 140, 0, 250, 140, 420);
    glow1.addColorStop(0, 'rgba(37, 99, 235, 0.24)');
    glow1.addColorStop(1, 'rgba(37, 99, 235, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(1050, 650, 0, 1050, 650, 480);
    glow2.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
    glow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Top Header Section
    // Badge
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const badgeWidth = ctx.measureText(item.badge).width + 24;
    ctx.fillStyle = 'rgba(37, 99, 235, 0.35)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width / 2 - badgeWidth / 2, 22, badgeWidth, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.textAlign = 'center';
    ctx.fillText(item.badge, width / 2, 39);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(item.title, width / 2, 76);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(item.subtitle, width / 2, 102);

    // Window Mockup Frame with Real Screenshot
    const rawImg = await loadImage(path.join(uploadedDir, item.file));
    const winW = 1080;
    const scale = winW / rawImg.width;
    const winH = rawImg.height * scale;
    const winX = (width - winW) / 2;
    const winY = 128;

    // Window shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    // Window background container
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 12);
    ctx.fill();
    ctx.restore();

    // Clip and draw screenshot
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 12);
    ctx.clip();
    ctx.drawImage(rawImg, winX, winY, winW, winH);
    ctx.restore();

    // Border overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 12);
    ctx.stroke();

    const outPath = path.join(storeAssetsDir, item.out);
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`✓ Generated Screenshot: ${item.out}`);
  }
}

// 2. Generate Promo Marquee Banner (1400x560)
async function generatePromoMarquee() {
  const width = 1400;
  const height = 560;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative ambient glow
  const glow1 = ctx.createRadialGradient(260, 200, 0, 260, 200, 480);
  glow1.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
  glow1.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1200, 360, 0, 1200, 360, 420);
  glow2.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  glow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Tech grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Left Content: Typography & Value Proposition
  // Badge
  ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(70, 60, 250, 34, 17);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡ 100% IN-BROWSER SEO AUDIT', 88, 82);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('META SEO Checker', 70, 150);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Instant On-Page SEO Inspector for Google Chrome', 70, 190);

  // Key feature pills
  const pills = [
    '✓ Titles, Descriptions & Canonical',
    '✓ Headings Hierarchy (H1–H6)',
    '✓ Images & Missing ALT Audit',
    '✓ Link Analysis (Internal / External)',
    '✓ Open Graph & Twitter Cards',
    '✓ JSON-LD Schema & Microdata'
  ];

  ctx.font = '14.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  pills.forEach((pill, idx) => {
    const col = idx < 3 ? 70 : 355;
    const row = 238 + (idx % 3) * 44;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(col, row, 265, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(pill, col + 14, row + 23);
  });

  // Footer Tagline
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🔒 Zero Servers • Zero Tracking • 100% Client-Side Privacy', 70, 420);

  // Right Side: Real Screenshot in High-Res Window Frame
  const rawSummary = await loadImage(path.join(uploadedDir, 'media_1787893871659.png'));
  const mockX = 660;
  const mockY = 50;
  const mockW = 670;
  const scale = mockW / rawSummary.width;
  const mockH = rawSummary.height * scale;

  // Window Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = -5;
  ctx.shadowOffsetY = 20;

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 12);
  ctx.fill();
  ctx.restore();

  // Clip and draw image
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 12);
  ctx.clip();
  ctx.drawImage(rawSummary, mockX, mockY, mockW, mockH);
  ctx.restore();

  // Window border overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 12);
  ctx.stroke();

  const outPath = path.join(storeAssetsDir, 'promo_marquee_1400x560.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Generated Banner: promo_marquee_1400x560.png');
}

// 3. Generate Large Promo Tile (920x680)
async function generateLargeTile() {
  const width = 920;
  const height = 680;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radial ambient glows
  const glow1 = ctx.createRadialGradient(200, 120, 0, 200, 120, 350);
  glow1.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
  glow1.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  // Badge
  const badgeText = '⚡ 100% CLIENT-SIDE SEO INSPECTOR';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 20;
  ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width / 2 - badgeWidth / 2, 20, badgeWidth, 24, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#60a5fa';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, width / 2, 36);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('META SEO Checker', width / 2, 70);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Instant In-Browser Audit for Meta Tags, Headings, Images, Links & Schema', width / 2, 94);

  // Real Screenshot in Card
  const rawSummary = await loadImage(path.join(uploadedDir, 'media_1787893871659.png'));
  const winW = 820;
  const scale = winW / rawSummary.width;
  const winH = rawSummary.height * scale;
  const winX = (width - winW) / 2;
  const winY = 118;

  // Window Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(winX, winY, winW, winH, 10);
  ctx.fill();
  ctx.restore();

  // Clip and draw image
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(winX, winY, winW, winH, 10);
  ctx.clip();
  ctx.drawImage(rawSummary, winX, winY, winW, winH);
  ctx.restore();

  // Window border overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(winX, winY, winW, winH, 10);
  ctx.stroke();

  // Footer Tagline
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🔒 Zero External APIs • Zero Tracking • 100% Free & Open Source', width / 2, winY + winH + 34);

  const outPath = path.join(storeAssetsDir, 'promo_large_tile_920x680.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Generated Tile: promo_large_tile_920x680.png');
}

// 4. Generate Small Promo Tile (440x280)
async function generateSmallTile() {
  const width = 440;
  const height = 280;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radial glow
  const glow = ctx.createRadialGradient(220, 140, 0, 220, 140, 200);
  glow.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
  glow.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(2, 2, width - 4, height - 4, 12);
  ctx.stroke();

  // Icon / Logo Box
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(30, 24, 46, 46, 10);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔍', 53, 55);

  // Title & Category
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('META SEO Checker', 88, 44);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡ Instant On-Page SEO Inspector', 88, 64);

  // Feature Checklist
  const features = [
    '✓ Titles, Meta Tags & Canonical',
    '✓ Headings Hierarchy Tree (H1–H6)',
    '✓ Image ALT & Dimension Audit',
    '✓ Open Graph & JSON-LD Schema'
  ];

  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  features.forEach((feat, idx) => {
    const fy = 104 + idx * 27;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(28, fy - 15, width - 56, 23, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(feat, 38, fy + 1);
  });

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔒 100% Local • Zero External Server Requests', width / 2, 238);

  const outPath = path.join(storeAssetsDir, 'promo_small_tile_440x280.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Generated Tile: promo_small_tile_440x280.png');
}

async function run() {
  console.log('Generating high-resolution Chrome Web Store assets...');
  await generateAllScreenshots();
  await generatePromoMarquee();
  await generateLargeTile();
  await generateSmallTile();
  console.log('\n✨ All store assets & screenshots generated successfully in store/assets/!');
}

run().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
