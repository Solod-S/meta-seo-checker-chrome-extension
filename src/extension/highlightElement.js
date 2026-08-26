/**
 * Injected function that highlights an element on the page.
 * @param {string} selector
 * @returns {{ success: boolean, message?: string }}
 */
function inPageHighlighter(selector) {
  if (!selector) return { success: false, message: 'No selector provided.' };

  let el = null;
  try {
    el = document.querySelector(selector);
  } catch {
    return { success: false, message: 'Invalid selector.' };
  }

  if (!el) {
    return { success: false, message: 'Element is no longer available. Refresh the scan.' };
  }

  // Scroll into view
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  } catch {
    el.scrollIntoView(true);
  }

  // Save original styles
  const originalOutline = el.style.outline;
  const originalOutlineOffset = el.style.outlineOffset;
  const originalTransition = el.style.transition;
  const originalBoxShadow = el.style.boxShadow;

  // Apply highlight styles
  el.style.transition = 'outline 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
  el.style.outline = '3px solid #f59e0b';
  el.style.outlineOffset = '3px';
  el.style.boxShadow = '0 0 0 6px rgba(245, 158, 11, 0.25)';

  // Remove highlight after 2.5 seconds
  setTimeout(() => {
    try {
      el.style.outline = originalOutline;
      el.style.outlineOffset = originalOutlineOffset;
      el.style.boxShadow = originalBoxShadow;
      el.style.transition = originalTransition;
    } catch {
      // Element might be detached
    }
  }, 2500);

  return { success: true };
}

/**
 * Highlights a DOM element on the active tab by selector.
 * @param {string} selector
 * @param {number} [tabId]
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function highlightElement(selector, tabId) {
  if (!selector) {
    return { success: false, message: 'Selector is required for highlighting.' };
  }

  if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.scripting) {
    // Development fallback
    const result = inPageHighlighter(selector);
    return result;
  }

  try {
    let targetTabId = tabId;
    if (!targetTabId) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0) {
        return { success: false, message: 'Active tab not found.' };
      }
      targetTabId = tabs[0].id;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      func: inPageHighlighter,
      args: [selector],
    });

    if (results && results[0] && results[0].result) {
      return results[0].result;
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Failed to highlight element.',
    };
  }
}
