import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storeAssetsDir = path.resolve(__dirname, '../store/assets');

if (!fs.existsSync(storeAssetsDir)) {
  fs.mkdirSync(storeAssetsDir, { recursive: true });
}

// 1. Generate Promo Marquee (1400x560)
function generatePromoMarquee() {
  const width = 1400;
  const height = 560;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Modern gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative circles / glow
  const glow1 = ctx.createRadialGradient(250, 200, 0, 250, 200, 450);
  glow1.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
  glow1.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1150, 360, 0, 1150, 360, 400);
  glow2.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
  glow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Left Content: Typography & Value Proposition
  // Badge
  ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(80, 75, 230, 34, 17);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('⚡ 100% IN-BROWSER SEO AUDIT', 98, 97);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('META SEO Checker', 80, 165);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Instant On-Page SEO Inspector for Google Chrome', 80, 205);

  // Key feature pills
  const pills = [
    '✓ Titles, Descriptions & Canonical',
    '✓ Headings Hierarchy (H1–H6)',
    '✓ Images & Missing ALT Audit',
    '✓ Link Analysis (Internal / External)',
    '✓ Open Graph & Twitter Cards',
    '✓ JSON-LD Schema & Microdata'
  ];

  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  pills.forEach((pill, idx) => {
    const col = idx < 3 ? 80 : 370;
    const row = 255 + (idx % 3) * 44;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(col, row, 270, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(pill, col + 14, row + 23);
  });

  // Footer Tagline
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🔒 Zero Servers • Zero Tracking • 100% Local Execution', 80, 435);

  // Right Side: Chrome Extension Window Mockup
  const mockX = 720;
  const mockY = 50;
  const mockW = 600;
  const mockH = 460;

  // Window Shadow & Container
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 15;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 12);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Window Header
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, 60, [12, 12, 0, 0]);
  ctx.fill();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mockX, mockY + 60);
  ctx.lineTo(mockX + mockW, mockY + 60);
  ctx.stroke();

  // Header Icon & Title
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(mockX + 16, mockY + 16, 28, 28, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('🔍', mockX + 21, mockY + 36);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('META SEO Checker', mockX + 54, mockY + 32);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🌐 example.com/article', mockX + 54, mockY + 46);

  // Badges in header
  ctx.fillStyle = '#fef2f2';
  ctx.strokeStyle = '#fecaca';
  ctx.beginPath();
  ctx.roundRect(mockX + 380, mockY + 18, 60, 24, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('0 Errors', mockX + 390, mockY + 34);

  ctx.fillStyle = '#fffbeb';
  ctx.strokeStyle = '#fde68a';
  ctx.beginPath();
  ctx.roundRect(mockX + 448, mockY + 18, 72, 24, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('1 Warning', mockX + 456, mockY + 34);

  ctx.fillStyle = '#ecfdf5';
  ctx.strokeStyle = '#a7f3d0';
  ctx.beginPath();
  ctx.roundRect(mockX + 528, mockY + 18, 60, 24, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('8 Passed', mockX + 536, mockY + 34);

  // Tabs Bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mockX, mockY + 61, mockW, 36);
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(mockX, mockY + 97);
  ctx.lineTo(mockX + mockW, mockY + 97);
  ctx.stroke();

  const tabs = ['Summary', 'Headings', 'Images (12)', 'Links (144)', 'Social'];
  tabs.forEach((t, i) => {
    const tx = mockX + 16 + i * 110;
    if (i === 0) {
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(t, tx, mockY + 83);
      ctx.fillRect(tx - 4, mockY + 95, 65, 2);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '500 12px sans-serif';
      ctx.fillText(t, tx, mockY + 83);
    }
  });

  // Mock Content Area: Cards
  // Card 1: Title
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(mockX + 16, mockY + 112, mockW - 32, 82, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('TITLE (52 CHARS) • RECOMMENDED: 30–60', mockX + 28, mockY + 132);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('✓ OPTIMAL', mockX + mockW - 110, mockY + 132);

  ctx.fillStyle = '#1e293b';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Complete Guide to On-Page SEO Best Practices in 2026', mockX + 28, mockY + 162);

  // Card 2: Meta Description
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(mockX + 16, mockY + 204, mockW - 32, 82, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('META DESCRIPTION (134 CHARS)', mockX + 28, mockY + 224);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('✓ OPTIMAL', mockX + mockW - 110, mockY + 224);

  ctx.fillStyle = '#475569';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Learn essential on-page SEO optimization techniques including title tags,', mockX + 28, mockY + 248);
  ctx.fillText('meta descriptions, heading hierarchy, image ALT text, and JSON-LD markup.', mockX + 28, mockY + 268);

  // Card 3: Metrics Grid
  const gridW = (mockW - 32 - 16) / 3;
  const metrics = [
    { label: 'HEADINGS', val: 'H1: 1 • H2: 6 • H3: 14' },
    { label: 'IMAGES', val: '12 Total • 0 Missing ALT' },
    { label: 'STRUCTURED DATA', val: 'JSON-LD: 3 Blocks' }
  ];

  metrics.forEach((m, idx) => {
    const gx = mockX + 16 + idx * (gridW + 8);
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(gx, mockY + 296, gridW, 64, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(m.label, gx + 10, mockY + 316);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.fillText(m.val, gx + 10, mockY + 338);
  });

  // Footer inside popup
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(mockX + 16, mockY + 375, 140, 30, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('📄 Copy SEO Report', mockX + 28, mockY + 394);

  return canvas.toBuffer('image/png');
}

// 2. Generate Feature Screenshot Helper (1280x800)
function generateFeatureScreenshot(title, subtitle, activeTabIdx, drawContentFn) {
  const width = 1280;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#f1f5f9');
  bgGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Top Header Banner
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`META SEO Checker — ${title}`, 40, 44);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(subtitle, 40, 66);

  // Extension Popup Window Mockup Centered
  const mockX = 180;
  const mockY = 110;
  const mockW = 920;
  const mockH = 640;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 10);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Popup Header
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, 60, [10, 10, 0, 0]);
  ctx.fill();

  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(mockX, mockY + 60);
  ctx.lineTo(mockX + mockW, mockY + 60);
  ctx.stroke();

  // Brand Info
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(mockX + 16, mockY + 16, 28, 28, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('🔍', mockX + 22, mockY + 35);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('META SEO Checker', mockX + 54, mockY + 32);

  ctx.fillStyle = '#64748b';
  ctx.font = '11px sans-serif';
  ctx.fillText('🌐 https://example.com/blog/on-page-seo', mockX + 54, mockY + 47);

  // Buttons in popup header
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(mockX + mockW - 190, mockY + 18, 85, 26, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('🔄 Refresh', mockX + mockW - 176, mockY + 35);

  ctx.fillStyle = '#f1f5f9';
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.roundRect(mockX + mockW - 95, mockY + 18, 80, 26, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('📄 Report', mockX + mockW - 80, mockY + 35);

  // Tabs Bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mockX, mockY + 61, mockW, 36);
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(mockX, mockY + 97);
  ctx.lineTo(mockX + mockW, mockY + 97);
  ctx.stroke();

  const tabs = ['Summary', 'Headings', 'Images', 'Links', 'Social'];
  tabs.forEach((t, i) => {
    const tx = mockX + 20 + i * 140;
    if (i === activeTabIdx) {
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(t, tx, mockY + 84);
      ctx.fillRect(tx - 6, mockY + 95, 75, 2);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = '500 13px sans-serif';
      ctx.fillText(t, tx, mockY + 84);
    }
  });

  // Render Specific Content
  if (drawContentFn) {
    drawContentFn(ctx, mockX + 20, mockY + 110, mockW - 40, mockH - 125);
  }

  return canvas.toBuffer('image/png');
}

// Generate Screenshots
// 1. Summary Screenshot
const summaryImg = generateFeatureScreenshot('Summary & SEO Health', 'Instant audit of on-page meta tags, canonical, robots, and status checks', 0, (ctx, x, y, w, h) => {
  // Title Card
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x, y, w, 90, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11.5px sans-serif';
  ctx.fillText('TITLE • 54 CHARACTERS (RECOMMENDED: 30–60)', x + 14, y + 24);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('✓ LENGTH OPTIMAL', x + w - 130, y + 24);

  ctx.fillStyle = '#0f172a';
  ctx.font = '14px sans-serif';
  ctx.fillText('10 Proven On-Page SEO Techniques to Rank Higher in 2026', x + 14, y + 54);

  // Description Card
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x, y + 100, w, 90, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11.5px sans-serif';
  ctx.fillText('META DESCRIPTION • 142 CHARACTERS (RECOMMENDED: 70–160)', x + 14, y + 124);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('✓ LENGTH OPTIMAL', x + w - 130, y + 124);

  ctx.fillStyle = '#334155';
  ctx.font = '13px sans-serif';
  ctx.fillText('Discover actionable on-page SEO strategies for optimizing titles, meta tags, headers, image alt text, and', x + 14, y + 152);
  ctx.fillText('Schema.org structured data to boost search engine visibility and user engagement.', x + 14, y + 172);

  // Canonical & Robots 2-Col
  const colW = (w - 14) / 2;
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x, y + 200, colW, 80, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11.5px sans-serif';
  ctx.fillText('CANONICAL URL', x + 14, y + 222);
  ctx.fillStyle = '#059669';
  ctx.fillText('✓ SELF-REFERENCING', x + colW - 140, y + 222);
  ctx.fillStyle = '#475569';
  ctx.font = '12px monospace';
  ctx.fillText('https://example.com/blog/on-page-seo', x + 14, y + 252);

  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x + colW + 14, y + 200, colW, 80, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11.5px sans-serif';
  ctx.fillText('ROBOTS DIRECTIVES', x + colW + 28, y + 222);
  ctx.fillStyle = '#059669';
  ctx.fillText('✓ INDEXABLE', x + w - 90, y + 222);
  ctx.fillStyle = '#475569';
  ctx.font = '12px sans-serif';
  ctx.fillText('INDEX, FOLLOW, MAX-SNIPPET:-1', x + colW + 28, y + 252);

  // 4 Mini Metrics
  const mColW = (w - 30) / 4;
  const mini = [
    { k: 'LANGUAGE', v: 'en-US' },
    { k: 'CHARSET', v: 'UTF-8' },
    { k: 'VIEWPORT', v: 'Configured' },
    { k: 'HREFLANG', v: '2 Alternate Tags' }
  ];

  mini.forEach((m, idx) => {
    const mx = x + idx * (mColW + 10);
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(mx, y + 290, mColW, 60, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(m.k, mx + 12, y + 310);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12.5px sans-serif';
    ctx.fillText(m.v, mx + 12, y + 334);
  });
});

// 2. Headings Screenshot
const headingsImg = generateFeatureScreenshot('Headings Hierarchy', 'Visual DOM-order tree, missing H1 & skipped hierarchy level detection', 1, (ctx, x, y, w, h) => {
  // Filter chips
  const chips = ['All (8)', 'H1 (1)', 'H2 (3)', 'H3 (4)', 'H4 (0)', 'H5 (0)', 'H6 (0)'];
  chips.forEach((c, idx) => {
    ctx.fillStyle = idx === 0 ? '#eff6ff' : '#f8fafc';
    ctx.strokeStyle = idx === 0 ? '#3b82f6' : '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x + idx * 95, y, 85, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = idx === 0 ? '#2563eb' : '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(c, x + idx * 95 + 16, y + 18);
  });

  // Hierarchy items
  const headingList = [
    { lvl: 1, text: '10 Proven On-Page SEO Techniques to Rank Higher', indent: 0, tagColor: '#2563eb', tagBg: '#eff6ff' },
    { lvl: 2, text: '1. Master Your Title Tags and Meta Descriptions', indent: 1, tagColor: '#15803d', tagBg: '#f0fdf4' },
    { lvl: 3, text: 'Keep Title Length Between 30 and 60 Characters', indent: 2, tagColor: '#7c3aed', tagBg: '#f5f3ff' },
    { lvl: 3, text: 'Write Compelling Value-Driven Descriptions', indent: 2, tagColor: '#7c3aed', tagBg: '#f5f3ff' },
    { lvl: 2, text: '2. Optimize Visual Content with Meaningful ALT Attributes', indent: 1, tagColor: '#15803d', tagBg: '#f0fdf4' },
    { lvl: 3, text: 'Handling Decorative Images vs Informative Photos', indent: 2, tagColor: '#7c3aed', tagBg: '#f5f3ff' },
    { lvl: 2, text: '3. Add JSON-LD Schema Structured Data', indent: 1, tagColor: '#15803d', tagBg: '#f0fdf4' },
  ];

  headingList.forEach((hd, idx) => {
    const hy = y + 42 + idx * 46;
    const hx = x + hd.indent * 24;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(hx, hy, w - (hd.indent * 24), 38, 4);
    ctx.fill();
    ctx.stroke();

    // Tag badge
    ctx.fillStyle = hd.tagBg;
    ctx.beginPath();
    ctx.roundRect(hx + 8, hy + 7, 32, 24, 4);
    ctx.fill();
    ctx.fillStyle = hd.tagColor;
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`H${hd.lvl}`, hx + 16, hy + 23);

    // Text
    ctx.fillStyle = '#0f172a';
    ctx.font = '13px sans-serif';
    ctx.fillText(hd.text, hx + 50, hy + 23);

    // Action buttons
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('📋 Copy  👁️ Highlight', x + w - 140, hy + 23);
  });
});

// 3. Images Screenshot
const imagesImg = generateFeatureScreenshot('Images & ALT Text Audit', 'Detect missing ALT tags, view dimensions, preview thumbnails, and inspect lazy loading', 2, (ctx, x, y, w, h) => {
  // Quick Filters
  const filters = ['All Images (12)', 'Missing ALT (1)', 'Empty ALT (2)', 'Lazy Loaded (9)'];
  filters.forEach((f, idx) => {
    ctx.fillStyle = idx === 0 ? '#eff6ff' : '#f8fafc';
    ctx.strokeStyle = idx === 0 ? '#3b82f6' : '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x + idx * 140, y, 130, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = idx === 0 ? '#2563eb' : '#475569';
    ctx.font = 'bold 11.5px sans-serif';
    ctx.fillText(f, x + idx * 140 + 14, y + 18);
  });

  // Images items
  const imgList = [
    { file: 'seo-audit-checklist-hero.webp', alt: 'Complete on-page SEO checklist diagram', dim: '1200 × 630 px', altOk: true, lazy: true },
    { file: 'google-serp-preview-sample.png', alt: 'Google search engine results page mockup', dim: '840 × 460 px', altOk: true, lazy: true },
    { file: 'decorative-divider-icon.svg', alt: '"" (Decorative empty alt)', dim: '24 × 24 px', altOk: true, empty: true, lazy: false },
    { file: 'author-profile-headshot.jpg', alt: 'Missing ALT attribute', dim: '160 × 160 px', altOk: false, lazy: true },
  ];

  imgList.forEach((im, idx) => {
    const iy = y + 42 + idx * 78;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x, iy, w, 70, 6);
    ctx.fill();
    ctx.stroke();

    // Thumb box
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(x + 10, iy + 10, 68, 50, 4);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('🖼️', x + 32, iy + 42);

    // Filename & dimensions
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12.5px sans-serif';
    ctx.fillText(im.file, x + 90, iy + 26);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.fillText(im.dim, x + 380, iy + 26);

    // ALT Row
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10.5px sans-serif';
    ctx.fillText('ALT:', x + 90, iy + 48);

    if (im.altOk) {
      ctx.fillStyle = im.empty ? '#64748b' : '#059669';
      ctx.font = '12px sans-serif';
      ctx.fillText(im.alt, x + 124, iy + 48);
    } else {
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚠️ Missing ALT Attribute', x + 124, iy + 48);
    }

    // Badges
    if (!im.altOk) {
      ctx.fillStyle = '#fef2f2';
      ctx.strokeStyle = '#fecaca';
      ctx.beginPath();
      ctx.roundRect(x + w - 120, iy + 14, 105, 20, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('MISSING ALT', x + w - 105, iy + 28);
    } else {
      ctx.fillStyle = '#ecfdf5';
      ctx.strokeStyle = '#a7f3d0';
      ctx.beginPath();
      ctx.roundRect(x + w - 85, iy + 14, 70, 20, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('✓ ALT OK', x + w - 74, iy + 28);
    }
  });
});

// 4. Links Screenshot
const linksImg = generateFeatureScreenshot('Links & Anchor Text', 'Internal vs External categorization, rel directives, unique count & duplicates', 3, (ctx, x, y, w, h) => {
  const chips = ['All (144)', 'Internal (112)', 'External (24)', 'NoFollow (8)', 'Sponsored (2)', 'Anchors (6)'];
  chips.forEach((c, idx) => {
    ctx.fillStyle = idx === 0 ? '#eff6ff' : '#f8fafc';
    ctx.strokeStyle = idx === 0 ? '#3b82f6' : '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x + idx * 115, y, 105, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = idx === 0 ? '#2563eb' : '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(c, x + idx * 115 + 12, y + 18);
  });

  const linkRows = [
    { anchor: 'SEO Best Practices Guide', url: 'https://example.com/guides/seo-fundamentals', type: 'internal', rel: 'follow', occ: 3 },
    { anchor: 'Google Search Central Documentation', url: 'https://developers.google.com/search', type: 'external', rel: 'nofollow noopener', occ: 1 },
    { anchor: 'Try Semrush Keyword Tool', url: 'https://partner.semrush.com/affiliate', type: 'external', rel: 'sponsored nofollow', occ: 1 },
    { anchor: 'Jump to Top Overview', url: '#overview-heading', type: 'anchor', rel: '', occ: 2 },
  ];

  linkRows.forEach((lr, idx) => {
    const ly = y + 42 + idx * 74;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(x, ly, w, 66, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`Anchor: "${lr.anchor}"`, x + 14, y + 66 + idx * 74);

    // Type Badge
    ctx.fillStyle = lr.type === 'internal' ? '#eff6ff' : lr.type === 'external' ? '#fdf4ff' : '#f0fdf4';
    ctx.beginPath();
    ctx.roundRect(x + w - 180, ly + 8, 70, 20, 3);
    ctx.fill();
    ctx.fillStyle = lr.type === 'internal' ? '#1d4ed8' : lr.type === 'external' ? '#86198f' : '#15803d';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(lr.type.toUpperCase(), x + w - 170, ly + 22);

    if (lr.occ > 1) {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(x + w - 100, ly + 8, 85, 20, 3);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`×${lr.occ} Occurrences`, x + w - 95, ly + 22);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '11.5px monospace';
    ctx.fillText(lr.url, x + 14, y + 90 + idx * 74);
  });
});

// 5. Social Screenshot
const socialImg = generateFeatureScreenshot('Social Meta & JSON-LD Structured Data', 'Open Graph, Twitter Cards, Schema.org entities and syntax validation', 4, (ctx, x, y, w, h) => {
  // OG Card
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x, y, w, 150, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('📡 OPEN GRAPH METADATA (6 TAGS DETECTED)', x + 14, y + 24);

  // Preview thumb
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(x + 14, y + 36, 140, 75, 4);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px sans-serif';
  ctx.fillText('🖼️ OG Preview', x + 35, y + 80);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('og:title: Complete On-Page SEO Checklist for 2026', x + 170, y + 54);
  ctx.fillStyle = '#475569';
  ctx.font = '11.5px sans-serif';
  ctx.fillText('og:description: Master on-page SEO signals including meta tags, headers and structured data.', x + 170, y + 74);
  ctx.fillText('og:image: https://example.com/images/seo-og-banner.jpg', x + 170, y + 94);

  // JSON-LD Card
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x, y + 165, w, 175, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('📄 JSON-LD STRUCTURED DATA • SCHEMA.ORG (3 BLOCKS)', x + 14, y + 189);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('✓ VALID SYNTAX', x + w - 120, y + 189);

  // Code box mockup
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x + 14, y + 202, w - 28, 125, 4);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px monospace';
  ctx.fillText('{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Complete On-Page SEO Checklist for 2026",\n  "author": { "@type": "Person", "name": "Alex SEO Specialist" },\n  "publisher": { "@type": "Organization", "name": "SEO Academy" }\n}', x + 24, y + 222);
});

// Save all
fs.writeFileSync(path.join(storeAssetsDir, 'promo_marquee_1400x560.png'), generatePromoMarquee());
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot_1_summary_1280x800.png'), summaryImg);
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot_2_headings_1280x800.png'), headingsImg);
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot_3_images_1280x800.png'), imagesImg);
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot_4_links_1280x800.png'), linksImg);
fs.writeFileSync(path.join(storeAssetsDir, 'screenshot_5_social_1280x800.png'), socialImg);

console.log('All store assets & screenshots generated successfully in store/assets/');
