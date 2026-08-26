import { describe, it, expect } from 'vitest';
import { runSeoRules } from '../../src/seo/seoRulesEngine.js';

describe('seoRulesEngine', () => {
  it('detects missing title, missing H1, and missing meta description', () => {
    const emptyScanResult = {
      page: { url: 'https://example.com' },
      meta: {
        title: '',
        titleLength: 0,
        titles: [],
        description: '',
        descriptionLength: 0,
        descriptions: [],
        canonical: '',
        canonicals: [],
        robots: { isNoIndex: false, isNoFollow: false },
        lang: '',
        viewport: '',
        charset: '',
      },
      headings: [],
      headingsCounts: { h1: 0, total: 0, emptyCount: 0, skippedCount: 0 },
      images: [],
      imagesCounts: { total: 0, missingAlt: 0 },
      links: [],
      linksCounts: { total: 0 },
      social: {
        openGraph: { hasOg: false },
        twitter: { hasTwitter: false },
      },
      structuredData: {
        jsonLd: { total: 0, invalidCount: 0 },
        microdata: { total: 0 },
      },
    };

    const { issues, counts } = runSeoRules(emptyScanResult);

    expect(counts.error).toBeGreaterThan(0); // Title missing, H1 missing
    expect(issues.some(i => i.id === 'title-missing')).toBe(true);
    expect(issues.some(i => i.id === 'heading-h1-missing')).toBe(true);
    expect(issues.some(i => i.id === 'description-missing')).toBe(true);
    expect(issues.some(i => i.id === 'canonical-missing')).toBe(true);
    expect(issues.some(i => i.id === 'lang-missing')).toBe(true);
    expect(issues.some(i => i.id === 'viewport-missing')).toBe(true);
  });

  it('correctly passes valid SEO signals', () => {
    const goodScanResult = {
      page: { url: 'https://example.com/page' },
      meta: {
        title: 'Perfect Page Title For Great Search Results and SEO',
        titleLength: 51,
        titles: ['Perfect Page Title For Great Search Results and SEO'],
        description: 'This is an optimal meta description with just the right character length for search engine display.',
        descriptionLength: 100,
        descriptions: ['This is an optimal meta description with just the right character length for search engine display.'],
        canonical: 'https://example.com/page',
        canonicals: [{ rawHref: 'https://example.com/page', absoluteHref: 'https://example.com/page', isRelative: false, matchesCurrentUrl: true }],
        robots: { isNoIndex: false, isNoFollow: false, summaryText: 'INDEX, FOLLOW' },
        lang: 'en',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8',
      },
      headings: [{ level: 1, text: 'Main Page H1', isEmpty: false }],
      headingsCounts: { h1: 1, total: 1, emptyCount: 0, skippedCount: 0 },
      images: [{ alt: 'Alt text', hasAlt: true, isEmptyAlt: false }],
      imagesCounts: { total: 1, missingAlt: 0, emptyAlt: 0 },
      links: [{ absoluteHref: 'https://example.com/other' }],
      linksCounts: { total: 1 },
      social: {
        openGraph: {
          hasOg: true,
          title: 'OG Title',
          description: 'OG Desc',
          image: 'https://example.com/og.jpg',
          url: 'https://example.com/page',
          items: [{ property: 'og:title', content: 'OG Title' }],
          counts: { 'og:title': 1 },
        },
        twitter: {
          hasTwitter: true,
          card: 'summary_large_image',
          items: [{ name: 'twitter:card', content: 'summary_large_image' }],
          counts: { 'twitter:card': 1 },
        },
      },
      structuredData: {
        jsonLd: {
          total: 1,
          validCount: 1,
          invalidCount: 0,
          blocks: [{ valid: true, types: ['Article'], hasContext: true, hasType: true }],
        },
        microdata: { total: 0 },
      },
    };

    const { issues, counts } = runSeoRules(goodScanResult);

    expect(counts.error).toBe(0);
    expect(counts.passed).toBeGreaterThan(5);
    expect(issues.some(i => i.id === 'title-optimal')).toBe(true);
    expect(issues.some(i => i.id === 'description-optimal')).toBe(true);
    expect(issues.some(i => i.id === 'canonical-self')).toBe(true);
    expect(issues.some(i => i.id === 'heading-h1-single')).toBe(true);
    expect(issues.some(i => i.id === 'images-all-alt')).toBe(true);
  });
});
