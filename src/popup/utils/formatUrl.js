/**
 * URL formatting helpers
 */

/**
 * Extracts a friendly hostname from a URL.
 * @param {string} urlStr
 * @returns {string}
 */
export function getHostname(urlStr) {
  if (!urlStr) return '';
  try {
    return new URL(urlStr).hostname;
  } catch {
    return urlStr;
  }
}

/**
 * Truncates a URL in the middle if it exceeds maxLength.
 * @param {string} urlStr
 * @param {number} [maxLength=50]
 * @returns {string}
 */
export function truncateUrl(urlStr, maxLength = 50) {
  if (!urlStr || urlStr.length <= maxLength) return urlStr;
  const partLength = Math.floor((maxLength - 3) / 2);
  return `${urlStr.substring(0, partLength)}...${urlStr.substring(urlStr.length - partLength)}`;
}
