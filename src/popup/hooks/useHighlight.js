import { useCallback } from 'react';
import { highlightElement } from '../../extension/highlightElement.js';

/**
 * Hook for highlighting elements on the inspected page.
 * @param {number} [tabId]
 * @param {Function} [showToast]
 */
export function useHighlight(tabId, showToast) {
  const triggerHighlight = useCallback(async (selector, name = 'Element') => {
    if (!selector) {
      if (showToast) showToast('No selector found for this element');
      return;
    }

    const result = await highlightElement(selector, tabId);
    if (!result.success) {
      if (showToast) {
        showToast(result.message || 'Element is no longer available. Refresh the scan.');
      }
    } else {
      if (showToast) {
        showToast(`Highlighted ${name} on page`);
      }
    }
  }, [tabId, showToast]);

  return { triggerHighlight };
}
