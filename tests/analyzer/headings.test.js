import { describe, it, expect } from 'vitest';
import { extractHeadings } from '../../src/analyzer/extractHeadings.js';
import { JSDOM } from 'jsdom';

describe('extractHeadings', () => {
  it('extracts headings in DOM order and computes counts', () => {
    const html = `
      <div>
        <h1 id="main-h1">Main Heading</h1>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h2>Section 2</h2>
        <h4>Skipped Subsection 2.1</h4>
        <h2></h2>
      </div>
    `;

    const dom = new JSDOM(html);
    const { items, counts } = extractHeadings(dom.window.document);

    expect(counts.total).toBe(6);
    expect(counts.h1).toBe(1);
    expect(counts.h2).toBe(3);
    expect(counts.h3).toBe(1);
    expect(counts.h4).toBe(1);
    expect(counts.emptyCount).toBe(1);
    expect(counts.skippedCount).toBe(1); // H2 -> H4 skips H3

    expect(items[0].level).toBe(1);
    expect(items[0].text).toBe('Main Heading');
    expect(items[0].selector).toBe('#main-h1');
    expect(items[0].isEmpty).toBe(false);

    expect(items[4].level).toBe(4);
    expect(items[4].isSkippedLevel).toBe(true);

    expect(items[5].isEmpty).toBe(true);
  });
});
