/**
 * Opens a URL in a new browser tab.
 * @param {string} url
 */
export function openExternalUrl(url) {
  if (!url) return;

  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Opens the Google Rich Results Test tool for a given page URL.
 * @param {string} pageUrl
 */
export function openGoogleRichResultsTest(pageUrl) {
  if (!pageUrl) return;
  const testUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(pageUrl)}`;
  openExternalUrl(testUrl);
}
