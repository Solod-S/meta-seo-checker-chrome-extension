/**
 * Generates a unique, stable CSS selector or DOM path for a given element.
 * @param {Element} el
 * @returns {string}
 */
export function generateSelector(el) {
  if (!el || el.nodeType !== 1) return '';

  const doc = el.ownerDocument || (typeof document !== 'undefined' ? document : null);
  if (!doc) return '';

  const escapeCss = (str) => {
    if (typeof CSS !== 'undefined' && CSS.escape) {
      return CSS.escape(str);
    }
    return str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  };

  // 1. Unique ID
  if (el.id && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(el.id)) {
    const selector = `#${escapeCss(el.id)}`;
    try {
      if (doc.querySelectorAll(selector).length === 1) {
        return selector;
      }
    } catch {
      // Fallback
    }
  }

  // 2. Stable attributes like name or data-testid
  const testId = el.getAttribute('data-testid');
  if (testId) {
    const selector = `${el.tagName.toLowerCase()}[data-testid="${testId}"]`;
    try {
      if (doc.querySelectorAll(selector).length === 1) {
        return selector;
      }
    } catch {
      // Fallback
    }
  }

  // 3. Build unique hierarchical path with :nth-of-type
  const path = [];
  let current = el;

  while (current && current.nodeType === 1 && current !== doc.documentElement) {
    const tagName = current.tagName.toLowerCase();
    
    if (current.id && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(current.id)) {
      const idSelector = `#${escapeCss(current.id)}`;
      try {
        if (doc.querySelectorAll(idSelector).length === 1) {
          path.unshift(idSelector);
          break;
        }
      } catch {
        // Continue building path
      }
    }

    let siblingIndex = 1;
    let sibling = current.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === current.tagName) {
        siblingIndex++;
      }
      sibling = sibling.previousElementSibling;
    }

    path.unshift(`${tagName}:nth-of-type(${siblingIndex})`);
    current = current.parentElement;
  }

  if (current === doc.documentElement) {
    path.unshift('html');
  }

  return path.join(' > ');
}
