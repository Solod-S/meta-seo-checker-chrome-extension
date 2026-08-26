/**
 * Text utility functions
 */

/**
 * Truncates string to max length with ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max = 80) {
  if (!str || str.length <= max) return str;
  return `${str.substring(0, max)}...`;
}

/**
 * Simple plural helper.
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function plural(count, singular, plural) {
  return count === 1 ? singular : plural;
}
