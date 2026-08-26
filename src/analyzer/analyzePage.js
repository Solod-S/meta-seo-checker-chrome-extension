import { extractPageMeta } from './extractPageMeta.js';
import { extractHeadings } from './extractHeadings.js';
import { extractImages } from './extractImages.js';
import { extractLinks } from './extractLinks.js';
import { extractSocial } from './extractSocial.js';
import { extractStructuredData } from './extractStructuredData.js';

/**
 * Runs all extractors on the document and returns a plain serializable result.
 * @param {Document} [doc=document]
 * @param {Location} [loc=window.location]
 * @returns {Object}
 */
export function analyzePage(doc = document, loc = window.location) {
  const meta = extractPageMeta(doc, loc);
  const headings = extractHeadings(doc);
  const images = extractImages(doc, loc);
  const links = extractLinks(doc, loc);
  const social = extractSocial(doc, loc);
  const structuredData = extractStructuredData(doc);

  const page = {
    url: loc.href,
    origin: loc.origin,
    protocol: loc.protocol,
    hostname: loc.hostname,
    pathname: loc.pathname,
    title: meta.title,
  };

  const stats = {
    h1Count: headings.counts.h1,
    h2Count: headings.counts.h2,
    h3Count: headings.counts.h3,
    totalHeadings: headings.counts.total,
    totalImages: images.counts.total,
    missingAltImages: images.counts.missingAlt,
    emptyAltImages: images.counts.emptyAlt,
    totalLinks: links.counts.total,
    uniqueLinks: links.counts.unique,
    internalLinks: links.counts.internal,
    externalLinks: links.counts.external,
    hasOg: social.openGraph.hasOg,
    hasTwitter: social.twitter.hasTwitter,
    jsonLdBlocksCount: structuredData.jsonLd.total,
    hasMicrodata: structuredData.microdata.hasMicrodata,
  };

  return {
    page,
    meta,
    headings: headings.items,
    headingsCounts: headings.counts,
    images: images.items,
    imagesCounts: images.counts,
    links: links.items,
    linksCounts: links.counts,
    social,
    structuredData,
    stats,
    scannedAt: new Date().toISOString(),
  };
}
