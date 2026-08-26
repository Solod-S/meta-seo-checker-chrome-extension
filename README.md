# META SEO Checker

> Fast, lightweight, and privacy-focused Chrome Extension for instant on-page SEO analysis.

![META SEO Checker Extension](public/icons/icon128.png)

---

## Overview

**META SEO Checker** allows you to inspect all essential on-page SEO signals in a single click without leaving your active tab. The extension runs entirely in the browser without any backend servers, external APIs, or analytics tracking.

---

## Features

- **Summary Dashboard:**
  - Page Title with character counter & recommended length guidance.
  - Meta Description with character counter & duplicate warnings.
  - Canonical URL verification (detects missing, multiple, or relative tags).
  - Robots directives parsing (`index`, `noindex`, `follow`, `nofollow`, `noarchive`, etc.).
  - Technical signals: HTML `lang`, `charset`, `viewport`, and `hreflang` alternate links.
  - Instant one-click **Copy SEO Report** (formatted Markdown).

- **Headings Inspector:**
  - H1–H6 counts and sequential hierarchy analysis in DOM order.
  - Detection of missing H1, multiple H1s, empty headings, and skipped hierarchy levels.
  - Interactive **Highlight on Page** with smooth scrolling and animated outline.

- **Images Audit:**
  - Total image inventory with breakdown of Missing ALT, Empty ALT (`alt=""`), and Missing Title.
  - Intrinsic and rendered dimensions (`naturalWidth` / `naturalHeight`).
  - Image thumbnails, quick filter chips, and live on-page element highlighting.

- **Links Inspector:**
  - Classification: Internal, External, Anchors, Mailto, Tel, and Empty links.
  - Rel attributes parsing (`nofollow`, `sponsored`, `ugc`, `noopener`, `noreferrer`).
  - Unique URL counting and occurrences tracker.
  - Filter chips and fast keyword search.

- **Social & Structured Data:**
  - Complete Open Graph tag extraction with duplicate detection and preview card.
  - Twitter / X Cards extraction.
  - Article and Facebook metadata.
  - JSON-LD structured data parser with `@context`, `@type`, and `@graph` inspection.
  - Microdata Schema.org and RDFa detection.
  - Shortcut to launch the Google Rich Results Test tool.

---

## Tech Stack

- **Platform:** Manifest V3 Chrome Extension
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Language:** Modern JavaScript (ES2022+), JSDoc typing
- **Icons:** Lucide React & custom PNG suite
- **Testing:** Vitest, React Testing Library, JSDOM

---

## Permissions & Privacy

- `activeTab` & `scripting`: Used strictly on user gesture (clicking the extension icon) to run local DOM inspection.
- **100% Local:** No user data or page content is ever transmitted to external servers.

---

## Development & Build

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```
The compiled extension will be output to the `dist/` directory.

### Packaging for Release
```bash
npm run package
```
Generates a release-ready ZIP file at `release/meta-seo-checker-v1.0.0.zip`.

---

## Loading Unpacked Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** and select the `dist/` folder.
4. Open any website (e.g. `https://en.wikipedia.org` or your local development page) and click the **META SEO Checker** icon in the toolbar.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
