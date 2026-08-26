import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateSocialRules(scanResult) {
  const issues = [];
  const { social } = scanResult;
  const og = social ? social.openGraph : null;
  const twitter = social ? social.twitter : null;

  // 1. Open Graph Rules
  if (!og || !og.hasOg) {
    issues.push({
      id: 'og-missing',
      category: 'Social',
      severity: SEVERITY.INFO,
      title: 'Open Graph metadata is missing',
      description: 'The page has no Open Graph tags. Adding og:title, og:image, and og:description optimizes previews when shared on social networks.',
      value: 'None detected',
      relatedTab: TABS.SOCIAL,
    });
  } else {
    // Check specific essential OG tags
    const missingOgProps = [];
    if (!og.title) missingOgProps.push('og:title');
    if (!og.description) missingOgProps.push('og:description');
    if (!og.image) missingOgProps.push('og:image');
    if (!og.url) missingOgProps.push('og:url');

    if (missingOgProps.length > 0) {
      issues.push({
        id: 'og-incomplete',
        category: 'Social',
        severity: SEVERITY.WARNING,
        title: 'Open Graph is missing essential properties',
        description: `Missing: ${missingOgProps.join(', ')}. Complete Open Graph tags ensure rich link previews on Facebook, LinkedIn, etc.`,
        value: `Missing ${missingOgProps.length} tags`,
        relatedTab: TABS.SOCIAL,
      });
    } else {
      issues.push({
        id: 'og-complete',
        category: 'Social',
        severity: SEVERITY.PASSED,
        title: 'Essential Open Graph tags configured',
        description: 'og:title, og:description, og:image, and og:url are present.',
        value: `${og.items.length} OG tags`,
        relatedTab: TABS.SOCIAL,
      });
    }

    // Check duplicate OG keys
    if (og.counts) {
      const duplicateProps = Object.keys(og.counts).filter(k => og.counts[k] > 1);
      if (duplicateProps.length > 0) {
        issues.push({
          id: 'og-duplicates',
          category: 'Social',
          severity: SEVERITY.WARNING,
          title: 'Duplicate Open Graph properties found',
          description: `Duplicate declarations found for: ${duplicateProps.join(', ')}. Social crawlers may pick an unintended value.`,
          value: `${duplicateProps.length} duplicates`,
          relatedTab: TABS.SOCIAL,
        });
      }
    }
  }

  // 2. Twitter / X Rules
  if (!twitter || !twitter.hasTwitter) {
    issues.push({
      id: 'twitter-missing',
      category: 'Social',
      severity: SEVERITY.INFO,
      title: 'Twitter Card metadata is missing',
      description: 'No Twitter Card tags found. Defining twitter:card, twitter:title, and twitter:image enhances shares on X/Twitter.',
      value: 'None detected',
      relatedTab: TABS.SOCIAL,
    });
  } else {
    if (!twitter.card) {
      issues.push({
        id: 'twitter-card-missing',
        category: 'Social',
        severity: SEVERITY.WARNING,
        title: 'twitter:card tag is missing',
        description: 'A twitter:card type (e.g. summary or summary_large_image) must be specified for Twitter cards to render.',
        value: 'Missing',
        relatedTab: TABS.SOCIAL,
      });
    } else {
      issues.push({
        id: 'twitter-configured',
        category: 'Social',
        severity: SEVERITY.PASSED,
        title: 'Twitter Card metadata is present',
        description: `Twitter card type: "${twitter.card}".`,
        value: twitter.card,
        relatedTab: TABS.SOCIAL,
      });
    }

    if (twitter.counts) {
      const duplicateProps = Object.keys(twitter.counts).filter(k => twitter.counts[k] > 1);
      if (duplicateProps.length > 0) {
        issues.push({
          id: 'twitter-duplicates',
          category: 'Social',
          severity: SEVERITY.WARNING,
          title: 'Duplicate Twitter Card properties found',
          description: `Duplicate declarations found for: ${duplicateProps.join(', ')}.`,
          value: `${duplicateProps.length} duplicates`,
          relatedTab: TABS.SOCIAL,
        });
      }
    }
  }

  return issues;
}
