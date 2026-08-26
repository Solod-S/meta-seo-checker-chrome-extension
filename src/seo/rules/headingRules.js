import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateHeadingRules(scanResult) {
  const issues = [];
  const { headingsCounts, headings } = scanResult;
  const h1Count = headingsCounts ? headingsCounts.h1 : 0;
  const emptyCount = headingsCounts ? headingsCounts.emptyCount : 0;
  const skippedCount = headingsCounts ? headingsCounts.skippedCount : 0;

  // 1. H1 count
  if (h1Count === 0) {
    issues.push({
      id: 'heading-h1-missing',
      category: 'Headings',
      severity: SEVERITY.ERROR,
      title: 'H1 heading is missing',
      description: 'The page has no <h1> tag. A single descriptive <h1> is vital for indicating the primary subject of the page.',
      value: '0 found',
      relatedTab: TABS.HEADINGS,
    });
  } else if (h1Count > 1) {
    issues.push({
      id: 'heading-h1-multiple',
      category: 'Headings',
      severity: SEVERITY.WARNING,
      title: 'Multiple H1 headings detected',
      description: `Found ${h1Count} <h1> headings. While HTML5 allows multiple H1s, best practice is to have a single <h1> representing the main topic.`,
      value: `${h1Count} found`,
      relatedTab: TABS.HEADINGS,
    });
  } else {
    issues.push({
      id: 'heading-h1-single',
      category: 'Headings',
      severity: SEVERITY.PASSED,
      title: 'Single H1 heading present',
      description: 'Page has exactly one <h1> heading.',
      value: headings.find(h => h.level === 1)?.text || '1 found',
      relatedTab: TABS.HEADINGS,
    });
  }

  // 2. Empty headings
  if (emptyCount > 0) {
    issues.push({
      id: 'heading-empty',
      category: 'Headings',
      severity: SEVERITY.WARNING,
      title: 'Empty heading tags found',
      description: `Found ${emptyCount} heading tag(s) with no text content. Empty headings provide no value to users or search engines.`,
      value: `${emptyCount} empty`,
      relatedTab: TABS.HEADINGS,
    });
  }

  // 3. Skipped levels
  if (skippedCount > 0) {
    issues.push({
      id: 'heading-skipped',
      category: 'Headings',
      severity: SEVERITY.WARNING,
      title: 'Heading hierarchy levels skipped',
      description: `Detected ${skippedCount} instance(s) where heading levels are skipped (e.g. H1 jumping directly to H3). Following sequential hierarchy improves document structure.`,
      value: `${skippedCount} skipped`,
      relatedTab: TABS.HEADINGS,
    });
  }

  return issues;
}
