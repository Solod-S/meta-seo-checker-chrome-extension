import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateStructuredDataRules(scanResult) {
  const issues = [];
  const { structuredData } = scanResult;
  const jsonLd = structuredData ? structuredData.jsonLd : null;
  const microdata = structuredData ? structuredData.microdata : null;

  if (!jsonLd || jsonLd.total === 0) {
    if (!microdata || microdata.total === 0) {
      issues.push({
        id: 'structured-data-none',
        category: 'Structured Data',
        severity: SEVERITY.INFO,
        title: 'No structured data detected',
        description: 'No JSON-LD or Microdata Schema.org markup found on this page.',
        value: 'None',
        relatedTab: TABS.SOCIAL,
      });
    }
  } else {
    // 1. Invalid JSON blocks
    if (jsonLd.invalidCount > 0) {
      issues.push({
        id: 'jsonld-invalid-syntax',
        category: 'Structured Data',
        severity: SEVERITY.ERROR,
        title: 'JSON-LD syntax error detected',
        description: `Found ${jsonLd.invalidCount} JSON-LD script block(s) with invalid JSON syntax. Search engines cannot parse malformed structured data.`,
        value: `${jsonLd.invalidCount} invalid`,
        relatedTab: TABS.SOCIAL,
      });
    }

    // 2. Missing @context or @type
    const validBlocks = jsonLd.blocks.filter(b => b.valid);
    const missingContextBlocks = validBlocks.filter(b => !b.hasContext);
    const missingTypeBlocks = validBlocks.filter(b => !b.hasType);

    if (missingContextBlocks.length > 0) {
      issues.push({
        id: 'jsonld-missing-context',
        category: 'Structured Data',
        severity: SEVERITY.WARNING,
        title: 'JSON-LD missing @context',
        description: 'One or more JSON-LD blocks do not declare a Schema.org @context.',
        value: `${missingContextBlocks.length} block(s)`,
        relatedTab: TABS.SOCIAL,
      });
    }

    if (missingTypeBlocks.length > 0) {
      issues.push({
        id: 'jsonld-missing-type',
        category: 'Structured Data',
        severity: SEVERITY.WARNING,
        title: 'JSON-LD missing @type',
        description: 'One or more JSON-LD blocks do not declare an entity @type.',
        value: `${missingTypeBlocks.length} block(s)`,
        relatedTab: TABS.SOCIAL,
      });
    }

    if (jsonLd.validCount > 0 && missingContextBlocks.length === 0 && missingTypeBlocks.length === 0 && jsonLd.invalidCount === 0) {
      const typesList = validBlocks.flatMap(b => b.types).join(', ') || 'Schema.org types';
      issues.push({
        id: 'jsonld-valid',
        category: 'Structured Data',
        severity: SEVERITY.PASSED,
        title: 'Valid JSON-LD structured data detected',
        description: `Found ${jsonLd.validCount} valid JSON-LD schema block(s): ${typesList}.`,
        value: `${jsonLd.validCount} block(s)`,
        relatedTab: TABS.SOCIAL,
      });
    }
  }

  return issues;
}
