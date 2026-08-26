import { SEVERITY } from '../severity.js';
import { SEO_THRESHOLDS } from '../seoThresholds.js';
import { TABS } from '../../shared/constants.js';

export function evaluateDescriptionRules(scanResult) {
  const issues = [];
  const { meta } = scanResult;
  const desc = meta.description || '';
  const len = meta.descriptionLength || 0;
  const descCount = meta.descriptions ? meta.descriptions.length : (desc ? 1 : 0);

  if (descCount === 0 || !desc) {
    issues.push({
      id: 'description-missing',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Meta description is missing',
      description: 'The page lacks a meta description. Adding a compelling description helps improve click-through rates from search results.',
      value: 'Missing',
      relatedTab: TABS.SUMMARY,
    });
    return issues;
  }

  if (descCount > 1) {
    issues.push({
      id: 'description-multiple',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Multiple meta descriptions found',
      description: `Found ${descCount} meta description tags. Only one should be declared per page.`,
      value: `${descCount} descriptions`,
      relatedTab: TABS.SUMMARY,
    });
  }

  const { minRecommended, maxRecommended } = SEO_THRESHOLDS.description;

  if (len < minRecommended) {
    issues.push({
      id: 'description-short',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Meta description may be too short',
      description: `Meta description length is ${len} characters. The recommended range is ${minRecommended}–${maxRecommended} characters.`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  } else if (len > maxRecommended) {
    issues.push({
      id: 'description-long',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Meta description may be too long',
      description: `Meta description length is ${len} characters. Search engines might truncate descriptions exceeding ~${maxRecommended} characters.`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'description-optimal',
      category: 'Meta',
      severity: SEVERITY.PASSED,
      title: 'Meta description length is in recommended range',
      description: `Meta description is ${len} characters (recommended: ${minRecommended}–${maxRecommended}).`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  }

  return issues;
}
