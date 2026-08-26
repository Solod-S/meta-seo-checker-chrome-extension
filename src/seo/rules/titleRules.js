import { SEVERITY } from '../severity.js';
import { SEO_THRESHOLDS } from '../seoThresholds.js';
import { TABS } from '../../shared/constants.js';

export function evaluateTitleRules(scanResult) {
  const issues = [];
  const { meta } = scanResult;
  const title = meta.title || '';
  const len = meta.titleLength || 0;
  const titleCount = meta.titles ? meta.titles.length : (title ? 1 : 0);

  if (titleCount === 0 || !title) {
    issues.push({
      id: 'title-missing',
      category: 'Meta',
      severity: SEVERITY.ERROR,
      title: 'Title tag is missing or empty',
      description: 'The page does not have a <title> tag. A unique, descriptive title is crucial for search engines and user experience.',
      value: '0 characters',
      relatedTab: TABS.SUMMARY,
    });
    return issues;
  }

  if (titleCount > 1) {
    issues.push({
      id: 'title-multiple',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Multiple <title> tags detected',
      description: `Found ${titleCount} <title> tags in the document. Browsers and search engines might ignore subsequent tags.`,
      value: `${titleCount} tags`,
      relatedTab: TABS.SUMMARY,
    });
  }

  const { minRecommended, maxRecommended } = SEO_THRESHOLDS.title;

  if (len < minRecommended) {
    issues.push({
      id: 'title-short',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Title may be too short',
      description: `Title length is ${len} characters. The recommended range is ${minRecommended}–${maxRecommended} characters to fully utilize SERP space.`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  } else if (len > maxRecommended) {
    issues.push({
      id: 'title-long',
      category: 'Meta',
      severity: SEVERITY.WARNING,
      title: 'Title may be too long',
      description: `Title length is ${len} characters. Search engines might truncate titles longer than ~${maxRecommended} characters.`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  } else {
    issues.push({
      id: 'title-optimal',
      category: 'Meta',
      severity: SEVERITY.PASSED,
      title: 'Title length is in recommended range',
      description: `Title length is ${len} characters (recommended: ${minRecommended}–${maxRecommended}).`,
      value: `${len} characters`,
      relatedTab: TABS.SUMMARY,
    });
  }

  return issues;
}
