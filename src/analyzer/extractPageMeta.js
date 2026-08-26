import { normalizeText, resolveUrl } from './normalize.js';

/**
 * Extracts page meta information.
 * @param {Document} doc
 * @param {Location} loc
 * @returns {Object}
 */
export function extractPageMeta(doc = document, loc = window.location) {
  // Title tags
  const titleElements = Array.from(doc.querySelectorAll('title'));
  const titles = titleElements.map(el => normalizeText(el.textContent));
  const mainTitle = titles.length > 0 ? titles[0] : normalizeText(doc.title || '');

  // Meta Description
  const descriptionElements = Array.from(doc.querySelectorAll('meta[name="description" i]'));
  const descriptions = descriptionElements.map(el => normalizeText(el.getAttribute('content') || ''));
  const mainDescription = descriptions.length > 0 ? descriptions[0] : '';

  // Meta Keywords
  const keywordElements = Array.from(doc.querySelectorAll('meta[name="keywords" i]'));
  const rawKeywords = keywordElements.map(el => el.getAttribute('content') || '').join(',');
  const keywordsList = rawKeywords
    .split(',')
    .map(k => normalizeText(k))
    .filter(Boolean);

  // Canonical tags
  const canonicalElements = Array.from(doc.querySelectorAll('link[rel~="canonical" i]'));
  const canonicals = canonicalElements.map(el => {
    const rawHref = el.getAttribute('href') || '';
    const absoluteHref = resolveUrl(rawHref, loc.href);
    const isRelative = rawHref !== '' && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(rawHref);
    const matchesCurrentUrl = absoluteHref.split('#')[0] === loc.href.split('#')[0];
    return {
      rawHref,
      absoluteHref,
      isRelative,
      matchesCurrentUrl,
    };
  });
  const mainCanonical = canonicals.length > 0 ? canonicals[0].absoluteHref : '';

  // Robots & Googlebot
  const robotsElements = Array.from(doc.querySelectorAll('meta[name="robots" i], meta[name="googlebot" i]'));
  const robotsDirectives = new Set();
  const rawRobotsEntries = [];

  robotsElements.forEach(el => {
    const name = el.getAttribute('name') || '';
    const content = el.getAttribute('content') || '';
    rawRobotsEntries.push({ name, content });
    content.split(',').forEach(part => {
      const directive = part.trim().toLowerCase();
      if (directive) {
        robotsDirectives.add(directive);
      }
    });
  });

  const isNoIndex = robotsDirectives.has('noindex');
  const isNoFollow = robotsDirectives.has('nofollow');
  const isIndexable = !isNoIndex;

  // Author & Publisher
  const authorEl = doc.querySelector('meta[name="author" i], meta[property="article:author" i]');
  const author = authorEl ? normalizeText(authorEl.getAttribute('content') || '') : '';

  const publisherEl = doc.querySelector('meta[name="publisher" i], meta[property="article:publisher" i]');
  const publisher = publisherEl ? normalizeText(publisherEl.getAttribute('content') || '') : '';

  // Lang
  const lang = normalizeText(doc.documentElement ? doc.documentElement.getAttribute('lang') || '' : '');

  // Charset
  const charsetEl = doc.querySelector('meta[charset]');
  let charset = charsetEl ? charsetEl.getAttribute('charset') || '' : '';
  if (!charset) {
    const httpEquivCharset = doc.querySelector('meta[http-equiv="Content-Type" i]');
    if (httpEquivCharset) {
      const match = (httpEquivCharset.getAttribute('content') || '').match(/charset=([^;]+)/i);
      if (match) charset = match[1].trim();
    }
  }
  if (!charset && doc.characterSet) {
    charset = doc.characterSet;
  }

  // Viewport
  const viewportElements = Array.from(doc.querySelectorAll('meta[name="viewport" i]'));
  const viewports = viewportElements.map(el => normalizeText(el.getAttribute('content') || ''));
  const mainViewport = viewports.length > 0 ? viewports[0] : '';

  // Hreflang
  const hreflangElements = Array.from(doc.querySelectorAll('link[rel~="alternate" i][hreflang]'));
  const hreflangs = hreflangElements.map(el => {
    const langCode = normalizeText(el.getAttribute('hreflang') || '');
    const rawHref = el.getAttribute('href') || '';
    const absoluteHref = resolveUrl(rawHref, loc.href);
    return {
      hreflang: langCode,
      rawHref,
      absoluteHref,
    };
  });

  return {
    title: mainTitle,
    titles,
    titleLength: mainTitle.length,
    description: mainDescription,
    descriptions,
    descriptionLength: mainDescription.length,
    keywords: keywordsList,
    canonical: mainCanonical,
    canonicals,
    robots: {
      directives: Array.from(robotsDirectives),
      entries: rawRobotsEntries,
      isNoIndex,
      isNoFollow,
      isIndexable,
      summaryText: isNoIndex ? 'NOINDEX detected' : (robotsDirectives.size > 0 ? Array.from(robotsDirectives).join(', ').toUpperCase() : 'INDEX, FOLLOW (default)'),
    },
    author,
    publisher,
    lang,
    charset: charset ? charset.toUpperCase() : '',
    viewport: mainViewport,
    viewports,
    hreflangs,
  };
}
