/**
 * META SEO Checker — Shared Constants
 */

export const TABS = {
  SUMMARY: 'summary',
  HEADINGS: 'headings',
  IMAGES: 'images',
  LINKS: 'links',
  SOCIAL: 'social',
};

export const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  PASSED: 'passed',
};

export const RESTRICTED_URL_PATTERNS = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'brave://',
  'opera://',
  'about:',
  'devtools://',
  'chrome-search://',
  'view-source:',
];

export const RESTRICTED_HOSTS = [
  'chromewebstore.google.com',
  'chrome.google.com',
];

export const RESTRICTED_PAGE_MESSAGE = 
  'This page cannot be analyzed by Chrome extensions. Open a regular http/https page and try again.';
