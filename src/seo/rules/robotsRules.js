import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateRobotsRules(scanResult) {
  const issues = [];
  const { meta } = scanResult;
  const robots = meta.robots || { directives: [], isNoIndex: false, isNoFollow: false, isIndexable: true };

  if (robots.isNoIndex) {
    issues.push({
      id: 'robots-noindex',
      category: 'Indexing',
      severity: SEVERITY.WARNING,
      title: 'Page has NOINDEX directive',
      description: 'The page contains a "noindex" robots meta directive, preventing search engines from indexing this page in search results.',
      value: 'NOINDEX',
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'robots-indexable',
      category: 'Indexing',
      severity: SEVERITY.PASSED,
      title: 'Page is indexable by search engines',
      description: 'No "noindex" robots directive detected on this page.',
      value: robots.summaryText || 'INDEX, FOLLOW',
      relatedTab: TABS.SUMMARY,
    });
  }

  if (robots.isNoFollow) {
    issues.push({
      id: 'robots-nofollow',
      category: 'Indexing',
      severity: SEVERITY.WARNING,
      title: 'Page has NOFOLLOW directive',
      description: 'The page contains a "nofollow" robots meta directive, instructing search engines not to follow any outbound links on this page.',
      value: 'NOFOLLOW',
      relatedTab: TABS.SUMMARY,
    });
  }

  return issues;
}
