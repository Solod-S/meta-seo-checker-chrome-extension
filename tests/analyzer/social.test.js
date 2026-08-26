import { describe, it, expect } from 'vitest';
import { extractSocial } from '../../src/analyzer/extractSocial.js';
import { JSDOM } from 'jsdom';

describe('extractSocial', () => {
  it('extracts Open Graph and Twitter tags while preserving duplicate entries', () => {
    const html = `
      <head>
        <meta property="og:title" content="OG Title 1" />
        <meta property="og:title" content="OG Title 2 (Duplicate)" />
        <meta property="og:description" content="OG Description" />
        <meta property="og:image" content="/images/og.jpg" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Twitter Title" />
        <meta name="twitter:image" content="https://example.com/tw.png" />
        <meta property="article:author" content="John Doe" />
        <meta property="fb:app_id" content="12345678" />
        <link rel="image_src" href="/images/thumb.jpg" />
      </head>
    `;

    const dom = new JSDOM(html, { url: 'https://example.com/article' });
    const social = extractSocial(dom.window.document, dom.window.location);

    expect(social.openGraph.hasOg).toBe(true);
    expect(social.openGraph.items.length).toBe(5);
    expect(social.openGraph.counts['og:title']).toBe(2);
    expect(social.openGraph.title).toBe('OG Title 1');
    expect(social.openGraph.image).toBe('https://example.com/images/og.jpg');

    expect(social.twitter.hasTwitter).toBe(true);
    expect(social.twitter.card).toBe('summary_large_image');
    expect(social.twitter.title).toBe('Twitter Title');

    expect(social.article.hasArticle).toBe(true);
    expect(social.facebook.hasFacebook).toBe(true);
    expect(social.imageSrc.hasImageSrc).toBe(true);
    expect(social.imageSrc.links[0].absoluteHref).toBe('https://example.com/images/thumb.jpg');
  });
});
