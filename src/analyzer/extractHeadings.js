import { normalizeText } from './normalize.js';
import { generateSelector } from './selectorGenerator.js';

/**
 * Extracts and analyzes all heading elements on the page.
 * @param {Document} doc
 * @returns {Object}
 */
export function extractHeadings(doc = document) {
  const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  const counts = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
    total: headingElements.length,
    emptyCount: 0,
    skippedCount: 0,
  };

  let previousLevel = 0;
  const items = headingElements.map((el, index) => {
    const level = parseInt(el.tagName.substring(1), 10);
    const text = normalizeText(el.textContent || '');
    const isEmpty = text.length === 0;
    const selector = generateSelector(el);

    // Level skip check (e.g., H1 -> H3, H2 -> H4)
    let isSkippedLevel = false;
    if (previousLevel > 0 && level > previousLevel + 1) {
      isSkippedLevel = true;
      counts.skippedCount++;
    }

    if (level >= 1 && level <= 6) {
      counts[`h${level}`]++;
    }

    if (isEmpty) {
      counts.emptyCount++;
    }

    previousLevel = level;

    return {
      index,
      level,
      text,
      isEmpty,
      isSkippedLevel,
      selector,
    };
  });

  return {
    items,
    counts,
  };
}
