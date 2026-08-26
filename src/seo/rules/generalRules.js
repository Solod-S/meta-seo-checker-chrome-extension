import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateGeneralRules(scanResult) {
  const issues = [];
  const { meta } = scanResult;

  // 1. Lang
  if (!meta.lang) {
    issues.push({
      id: 'lang-missing',
      category: 'General',
      severity: SEVERITY.WARNING,
      title: 'HTML lang attribute is missing',
      description: 'The <html> tag does not define a "lang" attribute. Specifying language helps search engines and screen readers parse content properly.',
      value: 'Missing',
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'lang-present',
      category: 'General',
      severity: SEVERITY.PASSED,
      title: 'HTML lang attribute is defined',
      description: `Language is declared as "${meta.lang}".`,
      value: meta.lang,
      relatedTab: TABS.SUMMARY,
    });
  }

  // 2. Viewport
  if (!meta.viewport) {
    issues.push({
      id: 'viewport-missing',
      category: 'General',
      severity: SEVERITY.WARNING,
      title: 'Viewport meta tag is missing',
      description: 'The page lacks a <meta name="viewport"> tag. This is essential for responsive mobile rendering and mobile-first indexing.',
      value: 'Missing',
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'viewport-present',
      category: 'General',
      severity: SEVERITY.PASSED,
      title: 'Viewport meta tag is configured',
      description: 'Page includes a viewport configuration for mobile rendering.',
      value: meta.viewport,
      relatedTab: TABS.SUMMARY,
    });
  }

  // 3. Charset
  if (!meta.charset) {
    issues.push({
      id: 'charset-missing',
      category: 'General',
      severity: SEVERITY.WARNING,
      title: 'Character encoding declaration is missing',
      description: 'The document does not explicitly specify a charset meta tag (e.g. <meta charset="UTF-8">).',
      value: 'Missing',
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'charset-present',
      category: 'General',
      severity: SEVERITY.PASSED,
      title: 'Character encoding is defined',
      description: `Document charset is specified as ${meta.charset}.`,
      value: meta.charset,
      relatedTab: TABS.SUMMARY,
    });
  }

  // 4. Hreflang duplicates
  if (meta.hreflangs && meta.hreflangs.length > 0) {
    const seenLangs = new Set();
    let hasDuplicateHreflangs = false;
    meta.hreflangs.forEach(h => {
      if (seenLangs.has(h.hreflang.toLowerCase())) {
        hasDuplicateHreflangs = true;
      }
      seenLangs.add(h.hreflang.toLowerCase());
    });

    if (hasDuplicateHreflangs) {
      issues.push({
        id: 'hreflang-duplicates',
        category: 'General',
        severity: SEVERITY.WARNING,
        title: 'Duplicate hreflang entries detected',
        description: 'Multiple alternate link tags use the same language/region code.',
        value: `${meta.hreflangs.length} tags`,
        relatedTab: TABS.SUMMARY,
      });
    }
  }

  return issues;
}
