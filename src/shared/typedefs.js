/**
 * META SEO Checker — JSDoc Typedefs
 */

/**
 * @typedef {Object} SeoIssue
 * @property {string} id
 * @property {string} category
 * @property {"error"|"warning"|"info"|"passed"} severity
 * @property {string} title
 * @property {string} description
 * @property {string|number|null} [value]
 * @property {string} [relatedTab]
 * @property {string} [filterId]
 */

/**
 * @typedef {Object} HeadingItem
 * @property {number} level
 * @property {string} text
 * @property {string} selector
 * @property {boolean} isEmpty
 * @property {boolean} isSkippedLevel
 * @property {number} index
 */

/**
 * @typedef {Object} ImageItem
 * @property {string} src
 * @property {string} currentSrc
 * @property {string} srcset
 * @property {string} alt
 * @property {boolean} hasAlt
 * @property {boolean} isEmptyAlt
 * @property {string} title
 * @property {boolean} hasTitle
 * @property {number|null} width
 * @property {number|null} height
 * @property {number|null} naturalWidth
 * @property {number|null} naturalHeight
 * @property {string} loading
 * @property {string} decoding
 * @property {string} fetchpriority
 * @property {string} selector
 * @property {string} filename
 */

/**
 * @typedef {Object} LinkItem
 * @property {string} rawHref
 * @property {string} absoluteHref
 * @property {string} text
 * @property {string} title
 * @property {string} rel
 * @property {string[]} relList
 * @property {string} target
 * @property {string} download
 * @property {string} hreflang
 * @property {string} type
 * @property {string} selector
 * @property {"internal"|"external"|"anchor"|"mailto"|"tel"|"javascript"|"empty"|"other"} category
 * @property {boolean} isNoFollow
 * @property {boolean} isSponsored
 * @property {boolean} isUgc
 * @property {number} occurrences
 */

/**
 * @typedef {Object} PageScanResult
 * @property {Object} page
 * @property {string} page.url
 * @property {string} page.origin
 * @property {string} page.protocol
 * @property {string} page.hostname
 * @property {string} page.pathname
 * @property {Object} meta
 * @property {HeadingItem[]} headings
 * @property {ImageItem[]} images
 * @property {LinkItem[]} links
 * @property {Object} social
 * @property {Object} structuredData
 * @property {SeoIssue[]} issues
 * @property {Object} stats
 */

export {};
