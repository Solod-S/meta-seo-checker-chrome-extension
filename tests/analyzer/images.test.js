import { describe, it, expect } from 'vitest';
import { extractImages } from '../../src/analyzer/extractImages.js';
import { JSDOM } from 'jsdom';

describe('extractImages', () => {
  it('correctly categorizes ALT attributes, dimensions, and lazy loading', () => {
    const html = `
      <div>
        <img src="/img1.jpg" alt="Description 1" width="200" height="100" loading="lazy" />
        <img src="https://cdn.example.com/img2.png" alt="" title="Decorative" />
        <img src="/img3.webp" />
      </div>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com/page' });
    const { items, counts } = extractImages(dom.window.document, dom.window.location);

    expect(counts.total).toBe(3);
    expect(counts.missingAlt).toBe(1);
    expect(counts.emptyAlt).toBe(1);
    expect(counts.missingTitle).toBe(2);
    expect(counts.lazyLoaded).toBe(1);

    expect(items[0].alt).toBe('Description 1');
    expect(items[0].hasAlt).toBe(true);
    expect(items[0].isEmptyAlt).toBe(false);
    expect(items[0].width).toBe(200);
    expect(items[0].height).toBe(100);
    expect(items[0].filename).toBe('img1.jpg');
    expect(items[0].absoluteSrc).toBe('https://example.com/img1.jpg');

    expect(items[1].hasAlt).toBe(true);
    expect(items[1].isEmptyAlt).toBe(true);
    expect(items[1].hasTitle).toBe(true);

    expect(items[2].hasAlt).toBe(false);
    expect(items[2].isEmptyAlt).toBe(false);
  });
});
