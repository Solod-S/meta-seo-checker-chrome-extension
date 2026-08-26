import { describe, it, expect } from 'vitest';
import { extractPageMeta } from '../../src/analyzer/extractPageMeta.js';
import { JSDOM } from 'jsdom';

describe('extractPageMeta', () => {
  it('extracts basic title, description, canonical, robots', () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="This is a test meta description." />
          <meta name="keywords" content="seo, chrome extension, test" />
          <link rel="canonical" href="https://example.com/test" />
          <meta name="robots" content="index, follow" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="alternate" hreflang="es" href="https://example.com/es/test" />
          <link rel="alternate" hreflang="en" href="https://example.com/test" />
        </head>
        <body></body>
      </html>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com/test' });
    const meta = extractPageMeta(dom.window.document, dom.window.location);

    expect(meta.title).toBe('Test Page Title');
    expect(meta.titleLength).toBe(15);
    expect(meta.description).toBe('This is a test meta description.');
    expect(meta.descriptionLength).toBe(32);
    expect(meta.keywords).toEqual(['seo', 'chrome extension', 'test']);
    expect(meta.canonical).toBe('https://example.com/test');
    expect(meta.canonicals.length).toBe(1);
    expect(meta.canonicals[0].matchesCurrentUrl).toBe(true);
    expect(meta.robots.isIndexable).toBe(true);
    expect(meta.robots.isNoIndex).toBe(false);
    expect(meta.lang).toBe('en');
    expect(meta.charset).toBe('UTF-8');
    expect(meta.viewport).toBe('width=device-width, initial-scale=1.0');
    expect(meta.hreflangs.length).toBe(2);
    expect(meta.hreflangs[0].hreflang).toBe('es');
  });

  it('detects multiple titles and descriptions', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>First Title</title>
          <title>Second Title</title>
          <meta name="description" content="Desc 1" />
          <meta name="description" content="Desc 2" />
          <link rel="canonical" href="https://example.com/1" />
          <link rel="canonical" href="https://example.com/2" />
        </head>
      </html>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com/current' });
    const meta = extractPageMeta(dom.window.document, dom.window.location);

    expect(meta.titles.length).toBe(2);
    expect(meta.descriptions.length).toBe(2);
    expect(meta.canonicals.length).toBe(2);
    expect(meta.canonicals[0].matchesCurrentUrl).toBe(false);
  });

  it('detects NOINDEX and NOFOLLOW directives', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="robots" content="noindex, nofollow, noarchive" />
        </head>
      </html>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com' });
    const meta = extractPageMeta(dom.window.document, dom.window.location);

    expect(meta.robots.isNoIndex).toBe(true);
    expect(meta.robots.isNoFollow).toBe(true);
    expect(meta.robots.isIndexable).toBe(false);
    expect(meta.robots.directives).toContain('noindex');
    expect(meta.robots.directives).toContain('nofollow');
    expect(meta.robots.directives).toContain('noarchive');
  });
});
