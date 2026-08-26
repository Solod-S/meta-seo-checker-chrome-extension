import { normalizeText, resolveUrl } from './normalize.js';

/**
 * Extracts Open Graph, Twitter, Facebook, Article, and Image_src metadata.
 * @param {Document} doc
 * @param {Location} loc
 * @returns {Object}
 */
export function extractSocial(doc = document, loc = window.location) {
  // All meta tags
  const metaTags = Array.from(doc.querySelectorAll('meta'));

  // 1. Open Graph
  const openGraphItems = [];
  const ogPropertyCounts = {};

  metaTags.forEach(meta => {
    const prop = (meta.getAttribute('property') || meta.getAttribute('name') || '').trim();
    if (prop.toLowerCase().startsWith('og:')) {
      const content = normalizeText(meta.getAttribute('content') || '');
      openGraphItems.push({ property: prop, content });
      const lowerProp = prop.toLowerCase();
      ogPropertyCounts[lowerProp] = (ogPropertyCounts[lowerProp] || 0) + 1;
    }
  });

  // Extract primary OG values for summary
  const ogTitle = openGraphItems.find(i => i.property.toLowerCase() === 'og:title')?.content || '';
  const ogDescription = openGraphItems.find(i => i.property.toLowerCase() === 'og:description')?.content || '';
  const ogImage = openGraphItems.find(i => i.property.toLowerCase() === 'og:image' || i.property.toLowerCase() === 'og:image:url')?.content || '';
  const ogUrl = openGraphItems.find(i => i.property.toLowerCase() === 'og:url')?.content || '';
  const ogType = openGraphItems.find(i => i.property.toLowerCase() === 'og:type')?.content || '';

  // 2. Article metadata
  const articleItems = [];
  metaTags.forEach(meta => {
    const prop = (meta.getAttribute('property') || meta.getAttribute('name') || '').trim();
    if (prop.toLowerCase().startsWith('article:')) {
      const content = normalizeText(meta.getAttribute('content') || '');
      articleItems.push({ property: prop, content });
    }
  });

  // 3. Facebook metadata
  const facebookItems = [];
  metaTags.forEach(meta => {
    const prop = (meta.getAttribute('property') || meta.getAttribute('name') || '').trim();
    if (prop.toLowerCase().startsWith('fb:')) {
      const content = normalizeText(meta.getAttribute('content') || '');
      facebookItems.push({ property: prop, content });
    }
  });

  // 4. Twitter / X metadata
  const twitterItems = [];
  const twitterPropertyCounts = {};

  metaTags.forEach(meta => {
    const prop = (meta.getAttribute('name') || meta.getAttribute('property') || '').trim();
    if (prop.toLowerCase().startsWith('twitter:')) {
      const content = normalizeText(meta.getAttribute('content') || '');
      twitterItems.push({ name: prop, content });
      const lowerProp = prop.toLowerCase();
      twitterPropertyCounts[lowerProp] = (twitterPropertyCounts[lowerProp] || 0) + 1;
    }
  });

  const twitterCard = twitterItems.find(i => i.name.toLowerCase() === 'twitter:card')?.content || '';
  const twitterTitle = twitterItems.find(i => i.name.toLowerCase() === 'twitter:title')?.content || '';
  const twitterDescription = twitterItems.find(i => i.name.toLowerCase() === 'twitter:description')?.content || '';
  const twitterImage = twitterItems.find(i => i.name.toLowerCase() === 'twitter:image')?.content || '';

  // 5. Image Source (<link rel="image_src">)
  const imageSrcElements = Array.from(doc.querySelectorAll('link[rel~="image_src" i]'));
  const imageSrcLinks = imageSrcElements.map(el => {
    const rawHref = el.getAttribute('href') || '';
    return {
      rawHref,
      absoluteHref: resolveUrl(rawHref, loc.href),
    };
  });

  return {
    openGraph: {
      items: openGraphItems,
      counts: ogPropertyCounts,
      hasOg: openGraphItems.length > 0,
      title: ogTitle,
      description: ogDescription,
      image: ogImage ? resolveUrl(ogImage, loc.href) : '',
      url: ogUrl,
      type: ogType,
    },
    article: {
      items: articleItems,
      hasArticle: articleItems.length > 0,
    },
    facebook: {
      items: facebookItems,
      hasFacebook: facebookItems.length > 0,
    },
    twitter: {
      items: twitterItems,
      counts: twitterPropertyCounts,
      hasTwitter: twitterItems.length > 0,
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      image: twitterImage ? resolveUrl(twitterImage, loc.href) : '',
    },
    imageSrc: {
      links: imageSrcLinks,
      hasImageSrc: imageSrcLinks.length > 0,
    },
  };
}
