# Chrome Web Store Publication Checklist & Metadata

## 📋 Store Metadata

| Field | Value (English) | Value (Russian) |
| :--- | :--- | :--- |
| **Extension Name** | `META SEO Checker` | `META SEO Checker` |
| **Short Description (max 132 chars)** | `Inspect titles, meta tags, headings, images, links, Open Graph, Twitter Cards and structured data in one click.` | `Мгновенный аудит онпейдж SEO: мета-теги, заголовки H1–H6, картинки и ALT, ссылки, Open Graph и Schema.org без передачи данных на сервер.` |
| **Primary Category** | `Developer Tools` | `Инструменты для разработчиков` |
| **Secondary Category** | `Productivity` | `Производительность` |
| **Pricing** | Free | Бесплатно |
| **Manifest Version** | Manifest V3 | Manifest V3 |

---

## 🏷️ Search Keywords & Tags (SEO for Chrome Web Store)

- `seo checker`
- `meta tags inspector`
- `on page seo`
- `open graph preview`
- `headings h1 h6 hierarchy`
- `missing alt finder`
- `json-ld schema validator`
- `canonical url check`
- `twitter card tester`
- `seo audit report`
- `аудит сайта`
- `проверка метатегов`

---

## 🎨 Promotional Media Assets Checklist

All assets are located in [`store/assets/`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/):

1. **Store Screenshots (1280 × 800 px, 16:10 ratio):**
   - [`screenshot_1_summary_1280x800.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/screenshot_1_summary_1280x800.png) — Summary & On-Page Meta Diagnostics
   - [`screenshot_2_headings_1280x800.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/screenshot_2_headings_1280x800.png) — Headings Structure & Hierarchy (H1–H6)
   - [`screenshot_3_images_1280x800.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/screenshot_3_images_1280x800.png) — Images & ALT Text Inspector
   - [`screenshot_4_links_1280x800.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/screenshot_4_links_1280x800.png) — Link Classifier & Rel Directives Tracker
   - [`screenshot_5_social_1280x800.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/screenshot_5_social_1280x800.png) — Social Metadata & JSON-LD Structured Data

2. **Promo Banners & Tiles:**
   - [`promo_marquee_1400x560.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/promo_marquee_1400x560.png) — Marquee Promo Tile (1400 × 560 px)
   - [`promo_large_tile_920x680.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/promo_large_tile_920x680.png) — Large Promo Tile (920 × 680 px)
   - [`promo_small_tile_440x280.png`](file:///Users/serg/Documents/dev/chrome/meta-seo-checker-chrome-extension/store/assets/promo_small_tile_440x280.png) — Small Promo Tile (440 × 280 px)

3. **Extension Icons (PNG):**
   - `public/icons/icon-16.png`
   - `public/icons/icon-32.png`
   - `public/icons/icon-48.png`
   - `public/icons/icon-128.png`

---

## 🔒 Privacy & Single Purpose Justification (Store Review Answers)

### Single Purpose Statement
> META SEO Checker is an on-page SEO inspection extension designed to analyze and display the metadata, headings, images, links, and structured data of the active web page directly inside the browser.

### Permission Justifications
- **`activeTab`**: Used only when the user clicks the extension action icon to inspect DOM elements on the current page.
- **`scripting`**: Used to execute the local in-page DOM analyzer script and highlight chosen elements on user demand.

### Data Privacy Declaration
- **Does this extension collect user data?** No.
- **Does this extension transmit data to external servers?** No. All calculations, parsing, and inspections run 100% locally in the browser context.
