import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateCanonicalRules(scanResult) {
  const issues = [];
  const { meta } = scanResult;
  const canonicals = meta.canonicals || [];

  if (canonicals.length === 0) {
    issues.push({
      id: 'canonical-missing',
      category: 'Indexing',
      severity: SEVERITY.WARNING,
      title: 'Canonical tag is missing',
      description: 'Specifying a canonical URL helps prevent duplicate content issues across URL variations.',
      value: 'Missing',
      relatedTab: TABS.SUMMARY,
    });
    return issues;
  }

  if (canonicals.length > 1) {
    issues.push({
      id: 'canonical-multiple',
      category: 'Indexing',
      severity: SEVERITY.ERROR,
      title: 'Multiple canonical tags found',
      description: `Found ${canonicals.length} canonical link tags. Having multiple canonical tags can confuse search engines.`,
      value: `${canonicals.length} tags`,
      relatedTab: TABS.SUMMARY,
    });
  }

  const first = canonicals[0];
  if (first.isRelative) {
    issues.push({
      id: 'canonical-relative',
      category: 'Indexing',
      severity: SEVERITY.WARNING,
      title: 'Canonical URL is relative',
      description: 'It is strongly recommended to use absolute URLs (including protocol and domain) in canonical tags.',
      value: first.rawHref,
      relatedTab: TABS.SUMMARY,
    });
  }

  if (!first.matchesCurrentUrl) {
    issues.push({
      id: 'canonical-differs',
      category: 'Indexing',
      severity: SEVERITY.INFO,
      title: 'Canonical differs from current URL',
      description: 'The canonical tag points to a different URL than the active page. This indicates this page may be an alternate or non-canonical version.',
      value: first.absoluteHref,
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'canonical-self',
      category: 'Indexing',
      severity: SEVERITY.PASSED,
      title: 'Self-referencing canonical tag present',
      description: 'The canonical URL correctly matches the current page URL.',
      value: first.absoluteHref,
      relatedTab: TABS.SUMMARY,
    });
  }

  return issues;
}
