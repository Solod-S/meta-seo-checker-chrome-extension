import { SEVERITY } from './severity.js';
import { evaluateTitleRules } from './rules/titleRules.js';
import { evaluateDescriptionRules } from './rules/descriptionRules.js';
import { evaluateCanonicalRules } from './rules/canonicalRules.js';
import { evaluateRobotsRules } from './rules/robotsRules.js';
import { evaluateGeneralRules } from './rules/generalRules.js';
import { evaluateHeadingRules } from './rules/headingRules.js';
import { evaluateImageRules } from './rules/imageRules.js';
import { evaluateSocialRules } from './rules/socialRules.js';
import { evaluateStructuredDataRules } from './rules/structuredDataRules.js';

/**
 * Runs all SEO rules against the page scan result and returns a list of issues and summary counts.
 * @param {Object} scanResult
 * @returns {{ issues: Array, counts: { error: number, warning: number, passed: number, info: number, total: number } }}
 */
export function runSeoRules(scanResult) {
  if (!scanResult) {
    return {
      issues: [],
      counts: { error: 0, warning: 0, passed: 0, info: 0, total: 0 },
    };
  }

  const issues = [
    ...evaluateTitleRules(scanResult),
    ...evaluateDescriptionRules(scanResult),
    ...evaluateCanonicalRules(scanResult),
    ...evaluateRobotsRules(scanResult),
    ...evaluateGeneralRules(scanResult),
    ...evaluateHeadingRules(scanResult),
    ...evaluateImageRules(scanResult),
    ...evaluateSocialRules(scanResult),
    ...evaluateStructuredDataRules(scanResult),
  ];

  const counts = {
    error: 0,
    warning: 0,
    passed: 0,
    info: 0,
    total: issues.length,
  };

  issues.forEach(issue => {
    if (issue.severity === SEVERITY.ERROR) counts.error++;
    else if (issue.severity === SEVERITY.WARNING) counts.warning++;
    else if (issue.severity === SEVERITY.PASSED) counts.passed++;
    else if (issue.severity === SEVERITY.INFO) counts.info++;
  });

  return {
    issues,
    counts,
  };
}
