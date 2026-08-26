import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/popup/App.jsx';

// Mock scanActiveTab to return sample data
vi.mock('../../src/extension/scanActiveTab.js', () => ({
  scanActiveTab: vi.fn().mockResolvedValue({
    success: true,
    tabId: 101,
    data: {
      page: {
        url: 'https://example.com/blog/seo-guide',
        origin: 'https://example.com',
        protocol: 'https:',
        hostname: 'example.com',
        pathname: '/blog/seo-guide',
        title: 'Complete On-Page SEO Guide for Modern Websites',
      },
      meta: {
        title: 'Complete On-Page SEO Guide for Modern Websites',
        titles: ['Complete On-Page SEO Guide for Modern Websites'],
        titleLength: 48,
        description: 'Learn everything about on-page SEO including meta tags, headings, images, and structured data.',
        descriptions: ['Learn everything about on-page SEO including meta tags, headings, images, and structured data.'],
        descriptionLength: 95,
        keywords: ['seo', 'guide', 'meta'],
        canonical: 'https://example.com/blog/seo-guide',
        canonicals: [{ rawHref: 'https://example.com/blog/seo-guide', absoluteHref: 'https://example.com/blog/seo-guide', isRelative: false, matchesCurrentUrl: true }],
        robots: { isNoIndex: false, isNoFollow: false, isIndexable: true, summaryText: 'INDEX, FOLLOW' },
        lang: 'en',
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0',
        hreflangs: [{ hreflang: 'en', absoluteHref: 'https://example.com/blog/seo-guide' }],
      },
      headings: [
        { index: 0, level: 1, text: 'Complete On-Page SEO Guide', isEmpty: false, isSkippedLevel: false, selector: '#h1' },
        { index: 1, level: 2, text: '1. What is On-Page SEO?', isEmpty: false, isSkippedLevel: false, selector: '#h2-1' },
        { index: 2, level: 3, text: 'Meta Tags Overview', isEmpty: false, isSkippedLevel: false, selector: '#h3-1' },
      ],
      headingsCounts: { h1: 1, h2: 1, h3: 1, h4: 0, h5: 0, h6: 0, total: 3, emptyCount: 0, skippedCount: 0 },
      images: [
        {
          index: 0,
          src: '/images/seo-banner.jpg',
          absoluteSrc: 'https://example.com/images/seo-banner.jpg',
          filename: 'seo-banner.jpg',
          alt: 'SEO Banner Diagram',
          hasAlt: true,
          isEmptyAlt: false,
          title: 'SEO Banner',
          hasTitle: true,
          width: 800,
          height: 400,
          loading: 'lazy',
          selector: 'img:nth-of-type(1)',
        },
        {
          index: 1,
          src: '/images/icon.png',
          absoluteSrc: 'https://example.com/images/icon.png',
          filename: 'icon.png',
          alt: '',
          hasAlt: false,
          isEmptyAlt: false,
          title: '',
          hasTitle: false,
          width: 32,
          height: 32,
          loading: '',
          selector: 'img:nth-of-type(2)',
        },
      ],
      imagesCounts: { total: 2, missingAlt: 1, emptyAlt: 0, missingTitle: 1, lazyLoaded: 1 },
      links: [
        {
          index: 0,
          rawHref: '/about',
          absoluteHref: 'https://example.com/about',
          text: 'About Us',
          title: '',
          rel: '',
          relList: [],
          category: 'internal',
          isNoFollow: false,
          isSponsored: false,
          isUgc: false,
          occurrences: 1,
          selector: 'a:nth-of-type(1)',
        },
      ],
      linksCounts: { total: 1, unique: 1, internal: 1, external: 0, anchor: 0, mailto: 0, tel: 0, nofollow: 0, sponsored: 0, ugc: 0, emptyHref: 0, withoutTitle: 1 },
      social: {
        openGraph: {
          items: [{ property: 'og:title', content: 'Complete SEO Guide' }],
          counts: { 'og:title': 1 },
          hasOg: true,
          title: 'Complete SEO Guide',
          description: 'Guide to on-page SEO',
          image: 'https://example.com/og.jpg',
          url: 'https://example.com/blog/seo-guide',
        },
        twitter: {
          items: [{ name: 'twitter:card', content: 'summary_large_image' }],
          counts: { 'twitter:card': 1 },
          hasTwitter: true,
          card: 'summary_large_image',
          title: 'Complete SEO Guide',
          image: 'https://example.com/tw.jpg',
        },
        article: { items: [], hasArticle: false },
        facebook: { items: [], hasFacebook: false },
        imageSrc: { links: [], hasImageSrc: false },
      },
      structuredData: {
        jsonLd: {
          blocks: [
            {
              index: 0,
              valid: true,
              data: { '@context': 'https://schema.org', '@type': 'Article', headline: 'SEO Guide' },
              raw: '{\n  "@context": "https://schema.org",\n  "@type": "Article"\n}',
              types: ['Article'],
              primaryType: 'Article',
              hasContext: true,
              hasType: true,
            },
          ],
          total: 1,
          validCount: 1,
          invalidCount: 0,
          hasJsonLd: true,
        },
        microdata: { total: 0, types: [], hasMicrodata: false },
        rdfa: { total: 0, types: [], hasRdfa: false },
      },
    },
    issues: [
      {
        id: 'images-missing-alt',
        category: 'Images',
        severity: 'warning',
        title: 'Images missing ALT attribute',
        description: 'Found 1 image without alt attribute.',
        value: '1 of 2',
        relatedTab: 'images',
      },
      {
        id: 'title-optimal',
        category: 'Meta',
        severity: 'passed',
        title: 'Title length is in recommended range',
        description: 'Title length is 48 characters.',
        value: '48 characters',
        relatedTab: 'summary',
      },
    ],
    counts: { error: 0, warning: 1, passed: 1, info: 0, total: 2 },
  }),
}));

describe('App Component Integration', () => {
  it('renders header, tabs, and summary content', async () => {
    render(<App />);

    // Check header
    expect(await screen.findByText('META SEO Checker')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();

    // Check tabs
    expect(screen.getByRole('tab', { name: /Summary/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Headings/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Images/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Links/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Social/i })).toBeInTheDocument();

    // Check Summary content
    expect(screen.getByText('Complete On-Page SEO Guide for Modern Websites')).toBeInTheDocument();

    // Switch to Headings tab
    fireEvent.click(screen.getByRole('tab', { name: /Headings/i }));
    expect(await screen.findByText('1. What is On-Page SEO?')).toBeInTheDocument();

    // Switch to Images tab
    fireEvent.click(screen.getByRole('tab', { name: /Images/i }));
    expect(await screen.findByText('seo-banner.jpg')).toBeInTheDocument();

    // Switch to Links tab
    fireEvent.click(screen.getByRole('tab', { name: /Links/i }));
    expect(await screen.findByText('About Us')).toBeInTheDocument();

    // Switch to Social tab
    fireEvent.click(screen.getByRole('tab', { name: /Social/i }));
    expect(await screen.findByText('Open Graph Metadata')).toBeInTheDocument();
    expect(screen.getByText('og:title')).toBeInTheDocument();
    expect(screen.getByText('JSON-LD Blocks (1)')).toBeInTheDocument();
  });
});
