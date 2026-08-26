import { normalizeText, resolveUrl, extractFilename } from './normalize.js';
import { generateSelector } from './selectorGenerator.js';

/**
 * Extracts and analyzes all image elements on the page.
 * @param {Document} doc
 * @param {Location} loc
 * @returns {Object}
 */
export function extractImages(doc = document, loc = window.location) {
  const imageElements = Array.from(doc.querySelectorAll('img'));

  const counts = {
    total: imageElements.length,
    missingAlt: 0,
    emptyAlt: 0,
    missingTitle: 0,
    lazyLoaded: 0,
  };

  const items = imageElements.map((el, index) => {
    const rawSrc = el.getAttribute('src') || '';
    const currentSrc = el.currentSrc || '';
    const srcset = el.getAttribute('srcset') || '';
    const absoluteSrc = resolveUrl(rawSrc || currentSrc, loc.href);
    const filename = extractFilename(absoluteSrc || rawSrc);

    // Alt attribute handling
    const altAttr = el.getAttribute('alt');
    const hasAlt = altAttr !== null;
    const altText = hasAlt ? normalizeText(altAttr) : '';
    const isEmptyAlt = hasAlt && altText.length === 0;

    if (!hasAlt) {
      counts.missingAlt++;
    } else if (isEmptyAlt) {
      counts.emptyAlt++;
    }

    // Title attribute handling
    const titleAttr = el.getAttribute('title');
    const hasTitle = titleAttr !== null && normalizeText(titleAttr).length > 0;
    const titleText = hasTitle ? normalizeText(titleAttr) : '';

    if (!hasTitle) {
      counts.missingTitle++;
    }

    // Dimensions
    const widthAttr = el.getAttribute('width');
    const heightAttr = el.getAttribute('height');
    const width = widthAttr ? parseInt(widthAttr, 10) || null : null;
    const height = heightAttr ? parseInt(heightAttr, 10) || null : null;
    const naturalWidth = el.naturalWidth || null;
    const naturalHeight = el.naturalHeight || null;

    // Loading & other attributes
    const loading = (el.getAttribute('loading') || '').toLowerCase();
    const decoding = (el.getAttribute('decoding') || '').toLowerCase();
    const fetchpriority = (el.getAttribute('fetchpriority') || '').toLowerCase();

    if (loading === 'lazy') {
      counts.lazyLoaded++;
    }

    const selector = generateSelector(el);

    return {
      index,
      src: rawSrc,
      currentSrc,
      srcset,
      absoluteSrc,
      filename,
      alt: altText,
      hasAlt,
      isEmptyAlt,
      title: titleText,
      hasTitle,
      width,
      height,
      naturalWidth,
      naturalHeight,
      loading,
      decoding,
      fetchpriority,
      selector,
    };
  });

  return {
    items,
    counts,
  };
}
