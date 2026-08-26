/**
 * Normalization utilities for analyzer
 */

/**
 * Normalizes text content by trimming and collapsing consecutive whitespace.
 * @param {string} str
 * @returns {string}
 */
export function normalizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Resolves a relative or absolute URL string against base URL.
 * @param {string} urlStr
 * @param {string} [baseUrl]
 * @returns {string}
 */
export function resolveUrl(urlStr, baseUrl = window.location.href) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    return new URL(urlStr, baseUrl).href;
  } catch {
    return urlStr;
  }
}

/**
 * Extracts filename or last segment from a URL.
 * @param {string} urlStr
 * @returns {string}
 */
export function extractFilename(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    const parsed = new URL(urlStr, window.location.href);
    const pathname = parsed.pathname;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
    return parsed.hostname || urlStr;
  } catch {
    const parts = urlStr.split('/').filter(Boolean);
    return parts[parts.length - 1] || urlStr;
  }
}
