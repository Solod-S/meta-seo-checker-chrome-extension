import { useState, useCallback } from 'react';

/**
 * Hook for copying text to clipboard with feedback toast.
 * @param {Function} [showToast]
 * @returns {{ copyToClipboard: (text: string, label?: string) => Promise<boolean>, copiedText: string|null }}
 */
export function useClipboard(showToast) {
  const [copiedText, setCopiedText] = useState(null);

  const copyToClipboard = useCallback(async (text, label = 'Copied to clipboard') => {
    if (!text && text !== '') return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback using textarea
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }

      setCopiedText(text);
      if (showToast) {
        showToast(label);
      }
      return true;
    } catch {
      if (showToast) {
        showToast('Failed to copy to clipboard');
      }
      return false;
    }
  }, [showToast]);

  return { copyToClipboard, copiedText };
}
