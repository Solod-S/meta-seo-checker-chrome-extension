import { normalizeText, resolveUrl } from './normalize.js';
import { generateSelector } from './selectorGenerator.js';

/**
 * Extracts and classifies all anchor links on the page.
 * @param {Document} doc
 * @param {Location} loc
 * @returns {Object}
 */
export function extractLinks(doc = document, loc = window.location) {
  const linkElements = Array.from(doc.querySelectorAll('a'));

  // First pass: build occurrences map
  const occurrencesMap = new Map();
  const rawItems = linkElements.map((el, index) => {
    const rawHref = el.getAttribute('href');
    const hasHref = rawHref !== null;
    const cleanRawHref = hasHref ? rawHref.trim() : '';
    const absoluteHref = cleanRawHref ? resolveUrl(cleanRawHref, loc.href) : '';
    const text = normalizeText(el.textContent || '');
    const title = normalizeText(el.getAttribute('title') || '');
    const rel = (el.getAttribute('rel') || '').toLowerCase();
    const relList = rel.split(/\s+/).filter(Boolean);
    const target = el.getAttribute('target') || '';
    const download = el.getAttribute('download') || '';
    const hreflang = el.getAttribute('hreflang') || '';
    const type = el.getAttribute('type') || '';
    const selector = generateSelector(el);

    // Classify link category
    let category = 'other';
    if (!hasHref || cleanRawHref === '') {
      category = 'empty';
    } else if (cleanRawHref.startsWith('#')) {
      category = 'anchor';
    } else if (cleanRawHref.toLowerCase().startsWith('mailto:')) {
      category = 'mailto';
    } else if (cleanRawHref.toLowerCase().startsWith('tel:')) {
      category = 'tel';
    } else if (cleanRawHref.toLowerCase().startsWith('javascript:')) {
      category = 'javascript';
    } else {
      try {
        const urlObj = new URL(absoluteHref);
        if (urlObj.origin === loc.origin) {
          category = 'internal';
        } else {
          category = 'external';
        }
      } catch {
        category = 'other';
      }
    }

    const isNoFollow = relList.includes('nofollow');
    const isSponsored = relList.includes('sponsored');
    const isUgc = relList.includes('ugc');
    const isNoOpener = relList.includes('noopener');
    const isNoReferrer = relList.includes('noreferrer');

    // Key for uniqueness
    const uniquenessKey = absoluteHref || cleanRawHref || `empty-${index}`;
    occurrencesMap.set(uniquenessKey, (occurrencesMap.get(uniquenessKey) || 0) + 1);

    return {
      index,
      rawHref: hasHref ? cleanRawHref : '',
      hasHref,
      absoluteHref,
      text,
      title,
      rel,
      relList,
      target,
      download,
      hreflang,
      type,
      selector,
      category,
      isNoFollow,
      isSponsored,
      isUgc,
      isNoOpener,
      isNoReferrer,
      uniquenessKey,
    };
  });

  const counts = {
    total: linkElements.length,
    unique: 0,
    internal: 0,
    external: 0,
    anchor: 0,
    mailto: 0,
    tel: 0,
    nofollow: 0,
    sponsored: 0,
    ugc: 0,
    emptyHref: 0,
    withoutTitle: 0,
  };

  const seenForUniqueCount = new Set();

  const items = rawItems.map(item => {
    const occurrences = occurrencesMap.get(item.uniquenessKey) || 1;

    if (!seenForUniqueCount.has(item.uniquenessKey)) {
      seenForUniqueCount.add(item.uniquenessKey);
      counts.unique++;
    }

    if (item.category === 'internal') counts.internal++;
    if (item.category === 'external') counts.external++;
    if (item.category === 'anchor') counts.anchor++;
    if (item.category === 'mailto') counts.mailto++;
    if (item.category === 'tel') counts.tel++;
    if (item.category === 'empty') counts.emptyHref++;

    if (item.isNoFollow) counts.nofollow++;
    if (item.isSponsored) counts.sponsored++;
    if (item.isUgc) counts.ugc++;

    if (!item.title) counts.withoutTitle++;

    const { uniquenessKey, ...cleanItem } = item;
    return {
      ...cleanItem,
      occurrences,
    };
  });

  return {
    items,
    counts,
  };
}
