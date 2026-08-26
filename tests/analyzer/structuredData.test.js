import { describe, it, expect } from 'vitest';
import { extractStructuredData } from '../../src/analyzer/extractStructuredData.js';
import { JSDOM } from 'jsdom';

describe('extractStructuredData', () => {
  it('parses valid JSON-LD with @type and @graph and handles invalid syntax gracefully', () => {
    const html = `
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Sample Headline",
            "author": {
              "@type": "Person",
              "name": "Jane"
            }
          }
        </script>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "BreadcrumbList" },
              { "@type": "Organization" }
            ]
          }
        </script>
        <script type="application/ld+json">
          { INVALID JSON SYNTAX HERE }
        </script>
      </head>
      <body>
        <div itemscope itemtype="https://schema.org/Product">
          <span itemprop="name">Widget</span>
        </div>
      </body>
    `;

    const dom = new JSDOM(html);
    const { jsonLd, microdata } = extractStructuredData(dom.window.document);

    expect(jsonLd.total).toBe(3);
    expect(jsonLd.validCount).toBe(2);
    expect(jsonLd.invalidCount).toBe(1);

    expect(jsonLd.blocks[0].valid).toBe(true);
    expect(jsonLd.blocks[0].types).toContain('Article');
    expect(jsonLd.blocks[0].types).toContain('Person');
    expect(jsonLd.blocks[0].hasContext).toBe(true);

    expect(jsonLd.blocks[1].valid).toBe(true);
    expect(jsonLd.blocks[1].types).toContain('BreadcrumbList');
    expect(jsonLd.blocks[1].types).toContain('Organization');

    expect(jsonLd.blocks[2].valid).toBe(false);
    expect(jsonLd.blocks[2].error).toBeDefined();

    expect(microdata.hasMicrodata).toBe(true);
    expect(microdata.types).toContain('https://schema.org/Product');
  });
});
