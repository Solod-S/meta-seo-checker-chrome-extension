import { analyzePage } from '../analyzer/analyzePage.js';
import { runSeoRules } from '../seo/seoRulesEngine.js';
import { RESTRICTED_URL_PATTERNS, RESTRICTED_HOSTS, RESTRICTED_PAGE_MESSAGE } from '../shared/constants.js';

/**
 * Checks if a given URL cannot be inspected by Chrome Extensions.
 * @param {string} url
 * @returns {boolean}
 */
export function isRestrictedUrl(url) {
  if (!url || typeof url !== 'string') return true;

  const lower = url.toLowerCase();
  for (const pattern of RESTRICTED_URL_PATTERNS) {
    if (lower.startsWith(pattern)) return true;
  }

  try {
    const parsed = new URL(url);
    if (RESTRICTED_HOSTS.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) {
      return true;
    }
  } catch {
    return true;
  }

  return false;
}

/**
 * In-page runner function for chrome.scripting.executeScript.
 * Note: must bundle analyzer or execute as inline function.
 */
function inPageScanner() {
  // Helper functions inside inPageScanner to be fully self-contained if injected
  function norm(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  function resUrl(urlStr, base = window.location.href) {
    if (!urlStr) return '';
    try { return new URL(urlStr, base).href; } catch { return urlStr; }
  }

  function getFilename(urlStr) {
    if (!urlStr) return '';
    try {
      const p = new URL(urlStr, window.location.href).pathname.split('/').filter(Boolean);
      return p[p.length - 1] || urlStr;
    } catch {
      const p = urlStr.split('/').filter(Boolean);
      return p[p.length - 1] || urlStr;
    }
  }

  function genSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    const doc = el.ownerDocument || document;
    const escapeCss = (str) => {
      if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(str);
      return str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    };
    if (el.id && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(el.id)) {
      const sel = `#${escapeCss(el.id)}`;
      try { if (doc.querySelectorAll(sel).length === 1) return sel; } catch {}
    }
    const testId = el.getAttribute('data-testid');
    if (testId) {
      const sel = `${el.tagName.toLowerCase()}[data-testid="${testId}"]`;
      try { if (doc.querySelectorAll(sel).length === 1) return sel; } catch {}
    }
    const path = [];
    let current = el;
    while (current && current.nodeType === 1 && current !== doc.documentElement) {
      const tag = current.tagName.toLowerCase();
      if (current.id && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(current.id)) {
        const idSel = `#${escapeCss(current.id)}`;
        try {
          if (doc.querySelectorAll(idSel).length === 1) {
            path.unshift(idSel);
            break;
          }
        } catch {}
      }
      let idx = 1;
      let prev = current.previousElementSibling;
      while (prev) {
        if (prev.tagName === current.tagName) idx++;
        prev = prev.previousElementSibling;
      }
      path.unshift(`${tag}:nth-of-type(${idx})`);
      current = current.parentElement;
    }
    if (current === doc.documentElement) path.unshift('html');
    return path.join(' > ');
  }

  // 1. Meta
  const titleElements = Array.from(document.querySelectorAll('title'));
  const titles = titleElements.map(el => norm(el.textContent));
  const mainTitle = titles.length > 0 ? titles[0] : norm(document.title || '');

  const descEls = Array.from(document.querySelectorAll('meta[name="description" i]'));
  const descriptions = descEls.map(el => norm(el.getAttribute('content') || ''));
  const mainDesc = descriptions.length > 0 ? descriptions[0] : '';

  const kwEls = Array.from(document.querySelectorAll('meta[name="keywords" i]'));
  const keywords = kwEls.map(el => el.getAttribute('content') || '').join(',').split(',').map(norm).filter(Boolean);

  const canonEls = Array.from(document.querySelectorAll('link[rel~="canonical" i]'));
  const canonicals = canonEls.map(el => {
    const rawHref = el.getAttribute('href') || '';
    const absoluteHref = resUrl(rawHref, window.location.href);
    return {
      rawHref,
      absoluteHref,
      isRelative: rawHref !== '' && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(rawHref),
      matchesCurrentUrl: absoluteHref.split('#')[0] === window.location.href.split('#')[0],
    };
  });
  const mainCanonical = canonicals.length > 0 ? canonicals[0].absoluteHref : '';

  const robotsEls = Array.from(document.querySelectorAll('meta[name="robots" i], meta[name="googlebot" i]'));
  const robotsDirectives = new Set();
  const rawRobotsEntries = [];
  robotsEls.forEach(el => {
    const name = el.getAttribute('name') || '';
    const content = el.getAttribute('content') || '';
    rawRobotsEntries.push({ name, content });
    content.split(',').forEach(p => {
      const d = p.trim().toLowerCase();
      if (d) robotsDirectives.add(d);
    });
  });
  const isNoIndex = robotsDirectives.has('noindex');
  const isNoFollow = robotsDirectives.has('nofollow');

  const authorEl = document.querySelector('meta[name="author" i], meta[property="article:author" i]');
  const author = authorEl ? norm(authorEl.getAttribute('content') || '') : '';
  const pubEl = document.querySelector('meta[name="publisher" i], meta[property="article:publisher" i]');
  const publisher = pubEl ? norm(pubEl.getAttribute('content') || '') : '';

  const lang = norm(document.documentElement ? document.documentElement.getAttribute('lang') || '' : '');
  const charsetEl = document.querySelector('meta[charset]');
  let charset = charsetEl ? charsetEl.getAttribute('charset') || '' : '';
  if (!charset) {
    const httpEquiv = document.querySelector('meta[http-equiv="Content-Type" i]');
    if (httpEquiv) {
      const match = (httpEquiv.getAttribute('content') || '').match(/charset=([^;]+)/i);
      if (match) charset = match[1].trim();
    }
  }
  if (!charset && document.characterSet) charset = document.characterSet;

  const vpEls = Array.from(document.querySelectorAll('meta[name="viewport" i]'));
  const viewports = vpEls.map(el => norm(el.getAttribute('content') || ''));
  const mainViewport = viewports.length > 0 ? viewports[0] : '';

  const hrefEls = Array.from(document.querySelectorAll('link[rel~="alternate" i][hreflang]'));
  const hreflangs = hrefEls.map(el => ({
    hreflang: norm(el.getAttribute('hreflang') || ''),
    rawHref: el.getAttribute('href') || '',
    absoluteHref: resUrl(el.getAttribute('href') || '', window.location.href),
  }));

  const meta = {
    title: mainTitle,
    titles,
    titleLength: mainTitle.length,
    description: mainDesc,
    descriptions,
    descriptionLength: mainDesc.length,
    keywords,
    canonical: mainCanonical,
    canonicals,
    robots: {
      directives: Array.from(robotsDirectives),
      entries: rawRobotsEntries,
      isNoIndex,
      isNoFollow,
      isIndexable: !isNoIndex,
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

  // 2. Headings
  const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingsCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, total: headingElements.length, emptyCount: 0, skippedCount: 0 };
  let prevLevel = 0;
  const headings = headingElements.map((el, idx) => {
    const level = parseInt(el.tagName.substring(1), 10);
    const text = norm(el.textContent || '');
    const isEmpty = text.length === 0;
    const selector = genSelector(el);
    let isSkipped = false;
    if (prevLevel > 0 && level > prevLevel + 1) {
      isSkipped = true;
      headingsCounts.skippedCount++;
    }
    if (level >= 1 && level <= 6) headingsCounts[`h${level}`]++;
    if (isEmpty) headingsCounts.emptyCount++;
    prevLevel = level;
    return { index: idx, level, text, isEmpty, isSkippedLevel: isSkipped, selector };
  });

  // 3. Images
  const imgEls = Array.from(document.querySelectorAll('img'));
  const imagesCounts = { total: imgEls.length, missingAlt: 0, emptyAlt: 0, missingTitle: 0, lazyLoaded: 0 };
  const images = imgEls.map((el, idx) => {
    const rawSrc = el.getAttribute('src') || '';
    const currentSrc = el.currentSrc || '';
    const srcset = el.getAttribute('srcset') || '';
    const absoluteSrc = resUrl(rawSrc || currentSrc, window.location.href);
    const filename = getFilename(absoluteSrc || rawSrc);

    const altAttr = el.getAttribute('alt');
    const hasAlt = altAttr !== null;
    const altText = hasAlt ? norm(altAttr) : '';
    const isEmptyAlt = hasAlt && altText.length === 0;
    if (!hasAlt) imagesCounts.missingAlt++;
    else if (isEmptyAlt) imagesCounts.emptyAlt++;

    const titleAttr = el.getAttribute('title');
    const hasTitle = titleAttr !== null && norm(titleAttr).length > 0;
    const titleText = hasTitle ? norm(titleAttr) : '';
    if (!hasTitle) imagesCounts.missingTitle++;

    const widthAttr = el.getAttribute('width');
    const heightAttr = el.getAttribute('height');
    const width = widthAttr ? parseInt(widthAttr, 10) || null : null;
    const height = heightAttr ? parseInt(heightAttr, 10) || null : null;
    const loading = (el.getAttribute('loading') || '').toLowerCase();
    if (loading === 'lazy') imagesCounts.lazyLoaded++;

    return {
      index: idx,
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
      naturalWidth: el.naturalWidth || null,
      naturalHeight: el.naturalHeight || null,
      loading,
      decoding: (el.getAttribute('decoding') || '').toLowerCase(),
      fetchpriority: (el.getAttribute('fetchpriority') || '').toLowerCase(),
      selector: genSelector(el),
    };
  });

  // 4. Links
  const aEls = Array.from(document.querySelectorAll('a'));
  const occMap = new Map();
  const rawLinks = aEls.map((el, idx) => {
    const rawHref = el.getAttribute('href');
    const hasHref = rawHref !== null;
    const cleanRaw = hasHref ? rawHref.trim() : '';
    const absoluteHref = cleanRaw ? resUrl(cleanRaw, window.location.href) : '';
    const text = norm(el.textContent || '');
    const title = norm(el.getAttribute('title') || '');
    const rel = (el.getAttribute('rel') || '').toLowerCase();
    const relList = rel.split(/\s+/).filter(Boolean);

    let category = 'other';
    if (!hasHref || cleanRaw === '') category = 'empty';
    else if (cleanRaw.startsWith('#')) category = 'anchor';
    else if (cleanRaw.toLowerCase().startsWith('mailto:')) category = 'mailto';
    else if (cleanRaw.toLowerCase().startsWith('tel:')) category = 'tel';
    else if (cleanRaw.toLowerCase().startsWith('javascript:')) category = 'javascript';
    else {
      try {
        category = new URL(absoluteHref).origin === window.location.origin ? 'internal' : 'external';
      } catch {
        category = 'other';
      }
    }

    const key = absoluteHref || cleanRaw || `empty-${idx}`;
    occMap.set(key, (occMap.get(key) || 0) + 1);

    return {
      index: idx,
      rawHref: hasHref ? cleanRaw : '',
      hasHref,
      absoluteHref,
      text,
      title,
      rel,
      relList,
      target: el.getAttribute('target') || '',
      download: el.getAttribute('download') || '',
      hreflang: el.getAttribute('hreflang') || '',
      type: el.getAttribute('type') || '',
      selector: genSelector(el),
      category,
      isNoFollow: relList.includes('nofollow'),
      isSponsored: relList.includes('sponsored'),
      isUgc: relList.includes('ugc'),
      isNoOpener: relList.includes('noopener'),
      isNoReferrer: relList.includes('noreferrer'),
      key,
    };
  });

  const linksCounts = { total: aEls.length, unique: 0, internal: 0, external: 0, anchor: 0, mailto: 0, tel: 0, nofollow: 0, sponsored: 0, ugc: 0, emptyHref: 0, withoutTitle: 0 };
  const seenKeys = new Set();
  const links = rawLinks.map(l => {
    if (!seenKeys.has(l.key)) {
      seenKeys.add(l.key);
      linksCounts.unique++;
    }
    if (l.category === 'internal') linksCounts.internal++;
    if (l.category === 'external') linksCounts.external++;
    if (l.category === 'anchor') linksCounts.anchor++;
    if (l.category === 'mailto') linksCounts.mailto++;
    if (l.category === 'tel') linksCounts.tel++;
    if (l.category === 'empty') linksCounts.emptyHref++;
    if (l.isNoFollow) linksCounts.nofollow++;
    if (l.isSponsored) linksCounts.sponsored++;
    if (l.isUgc) linksCounts.ugc++;
    if (!l.title) linksCounts.withoutTitle++;
    const { key, ...cleanL } = l;
    return { ...cleanL, occurrences: occMap.get(l.key) || 1 };
  });

  // 5. Social
  const allMetas = Array.from(document.querySelectorAll('meta'));
  const ogItems = [];
  const ogCounts = {};
  allMetas.forEach(m => {
    const prop = (m.getAttribute('property') || m.getAttribute('name') || '').trim();
    if (prop.toLowerCase().startsWith('og:')) {
      const content = norm(m.getAttribute('content') || '');
      ogItems.push({ property: prop, content });
      const k = prop.toLowerCase();
      ogCounts[k] = (ogCounts[k] || 0) + 1;
    }
  });

  const articleItems = [];
  const fbItems = [];
  const twItems = [];
  const twCounts = {};
  allMetas.forEach(m => {
    const prop = (m.getAttribute('property') || m.getAttribute('name') || '').trim();
    const c = norm(m.getAttribute('content') || '');
    if (prop.toLowerCase().startsWith('article:')) articleItems.push({ property: prop, content: c });
    if (prop.toLowerCase().startsWith('fb:')) fbItems.push({ property: prop, content: c });
    if (prop.toLowerCase().startsWith('twitter:')) {
      twItems.push({ name: prop, content: c });
      const k = prop.toLowerCase();
      twCounts[k] = (twCounts[k] || 0) + 1;
    }
  });

  const imgLinks = Array.from(document.querySelectorAll('link[rel~="image_src" i]')).map(el => ({
    rawHref: el.getAttribute('href') || '',
    absoluteHref: resUrl(el.getAttribute('href') || '', window.location.href),
  }));

  const ogImg = ogItems.find(i => i.property.toLowerCase() === 'og:image' || i.property.toLowerCase() === 'og:image:url')?.content || '';
  const twImg = twItems.find(i => i.name.toLowerCase() === 'twitter:image')?.content || '';

  const social = {
    openGraph: {
      items: ogItems,
      counts: ogCounts,
      hasOg: ogItems.length > 0,
      title: ogItems.find(i => i.property.toLowerCase() === 'og:title')?.content || '',
      description: ogItems.find(i => i.property.toLowerCase() === 'og:description')?.content || '',
      image: ogImg ? resUrl(ogImg, window.location.href) : '',
      url: ogItems.find(i => i.property.toLowerCase() === 'og:url')?.content || '',
      type: ogItems.find(i => i.property.toLowerCase() === 'og:type')?.content || '',
    },
    article: { items: articleItems, hasArticle: articleItems.length > 0 },
    facebook: { items: fbItems, hasFacebook: fbItems.length > 0 },
    twitter: {
      items: twItems,
      counts: twCounts,
      hasTwitter: twItems.length > 0,
      card: twItems.find(i => i.name.toLowerCase() === 'twitter:card')?.content || '',
      title: twItems.find(i => i.name.toLowerCase() === 'twitter:title')?.content || '',
      description: twItems.find(i => i.name.toLowerCase() === 'twitter:description')?.content || '',
      image: twImg ? resUrl(twImg, window.location.href) : '',
    },
    imageSrc: { links: imgLinks, hasImageSrc: imgLinks.length > 0 },
  };

  // 6. Structured data
  function collectLdTypes(item, arr) {
    if (!item || typeof item !== 'object') return;
    if (Array.isArray(item)) { item.forEach(sub => collectLdTypes(sub, arr)); return; }
    if (item['@type']) {
      if (Array.isArray(item['@type'])) item['@type'].forEach(t => { if (typeof t === 'string') arr.push(t); });
      else if (typeof item['@type'] === 'string') arr.push(item['@type']);
    }
    if (item['@graph'] && Array.isArray(item['@graph'])) item['@graph'].forEach(sub => collectLdTypes(sub, arr));
    Object.keys(item).forEach(k => {
      if (typeof item[k] === 'object' && item[k] !== null) collectLdTypes(item[k], arr);
    });
  }

  const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json" i]'));
  const ldBlocks = ldScripts.map((s, idx) => {
    const raw = s.textContent || '';
    try {
      const data = JSON.parse(raw);
      const types = [];
      collectLdTypes(data, types);
      const uniqueTypes = Array.from(new Set(types));
      const hasCtx = !!(data['@context'] || (data['@graph'] && data['@graph'].some(g => g['@context'])));
      return {
        index: idx,
        valid: true,
        data,
        raw,
        types: uniqueTypes,
        primaryType: uniqueTypes[0] || 'Unknown',
        hasContext: hasCtx,
        hasType: uniqueTypes.length > 0,
        error: null,
      };
    } catch (e) {
      return {
        index: idx,
        valid: false,
        data: null,
        raw,
        types: [],
        primaryType: 'Invalid JSON',
        hasContext: false,
        hasType: false,
        error: e.message,
      };
    }
  });

  const microdataEls = Array.from(document.querySelectorAll('[itemscope]'));
  const microdataTypes = Array.from(new Set(microdataEls.map(el => norm(el.getAttribute('itemtype') || '')).filter(Boolean)));

  const rdfaEls = Array.from(document.querySelectorAll('[typeof], [vocab], [property]'));
  const rdfaTypes = Array.from(new Set(rdfaEls.map(el => norm(el.getAttribute('typeof') || '')).filter(Boolean)));

  const structuredData = {
    jsonLd: {
      blocks: ldBlocks,
      total: ldBlocks.length,
      validCount: ldBlocks.filter(b => b.valid).length,
      invalidCount: ldBlocks.filter(b => !b.valid).length,
      hasJsonLd: ldBlocks.length > 0,
    },
    microdata: {
      total: microdataEls.length,
      types: microdataTypes,
      hasMicrodata: microdataEls.length > 0,
    },
    rdfa: {
      total: rdfaEls.length,
      types: rdfaTypes,
      hasRdfa: rdfaEls.length > 0,
    },
  };

  return {
    page: {
      url: window.location.href,
      origin: window.location.origin,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      title: mainTitle,
    },
    meta,
    headings,
    headingsCounts,
    images,
    imagesCounts,
    links,
    linksCounts,
    social,
    structuredData,
    stats: {
      h1Count: headingsCounts.h1,
      h2Count: headingsCounts.h2,
      h3Count: headingsCounts.h3,
      totalHeadings: headingsCounts.total,
      totalImages: imagesCounts.total,
      missingAltImages: imagesCounts.missingAlt,
      emptyAltImages: imagesCounts.emptyAlt,
      totalLinks: linksCounts.total,
      uniqueLinks: linksCounts.unique,
      internalLinks: linksCounts.internal,
      externalLinks: linksCounts.external,
      hasOg: social.openGraph.hasOg,
      hasTwitter: social.twitter.hasTwitter,
      jsonLdBlocksCount: structuredData.jsonLd.total,
      hasMicrodata: structuredData.microdata.hasMicrodata,
    },
    scannedAt: new Date().toISOString(),
  };
}

/**
 * Scans the currently active tab using chrome.tabs and chrome.scripting.
 * @returns {Promise<{ success: boolean, data?: Object, issues?: Array, counts?: Object, isRestricted?: boolean, error?: string }>}
 */
export async function scanActiveTab() {
  if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.scripting) {
    // Development or fallback environment
    try {
      const localResult = analyzePage(document, window.location);
      const { issues, counts } = runSeoRules(localResult);
      return {
        success: true,
        data: localResult,
        issues,
        counts,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) {
      return {
        success: false,
        error: 'No active browser tab found.',
      };
    }

    const activeTab = tabs[0];
    const tabUrl = activeTab.url || '';

    if (isRestrictedUrl(tabUrl)) {
      return {
        success: false,
        isRestricted: true,
        error: RESTRICTED_PAGE_MESSAGE,
      };
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: inPageScanner,
    });

    if (!results || !results[0] || !results[0].result) {
      return {
        success: false,
        error: 'Could not extract page data from the active tab.',
      };
    }

    const scanResult = results[0].result;
    const { issues, counts } = runSeoRules(scanResult);

    return {
      success: true,
      data: scanResult,
      issues,
      counts,
      tabId: activeTab.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'An error occurred while analyzing the page.',
    };
  }
}
