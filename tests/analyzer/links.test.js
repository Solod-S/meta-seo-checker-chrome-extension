import { describe, it, expect } from 'vitest';
import { extractLinks } from '../../src/analyzer/extractLinks.js';
import { JSDOM } from 'jsdom';

describe('extractLinks', () => {
  it('classifies internal, external, anchors, mailto, and rel attributes', () => {
    const html = `
      <div>
        <a href="/about">About Us</a>
        <a href="/about">About Us Duplicate</a>
        <a href="https://external.org/blog" rel="nofollow noopener">External Link</a>
        <a href="#section-contact">Jump to contact</a>
        <a href="mailto:info@example.com">Email Us</a>
        <a href="tel:+123456789">Call Us</a>
        <a>Empty Link</a>
        <a href="https://partner.com" rel="sponsored ugc">Partner</a>
      </div>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com/page' });
    const { items, counts } = extractLinks(dom.window.document, dom.window.location);

    expect(counts.total).toBe(8);
    expect(counts.unique).toBe(7);
    expect(counts.internal).toBe(2);
    expect(counts.external).toBe(2);
    expect(counts.anchor).toBe(1);
    expect(counts.mailto).toBe(1);
    expect(counts.tel).toBe(1);
    expect(counts.emptyHref).toBe(1);
    expect(counts.nofollow).toBe(1);
    expect(counts.sponsored).toBe(1);
    expect(counts.ugc).toBe(1);

    // Duplicate occurrences check
    const aboutLink = items.find(l => l.absoluteHref === 'https://example.com/about');
    expect(aboutLink.occurrences).toBe(2);
  });
});
