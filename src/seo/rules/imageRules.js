import { SEVERITY } from '../severity.js';
import { TABS } from '../../shared/constants.js';

export function evaluateImageRules(scanResult) {
  const issues = [];
  const { imagesCounts, images } = scanResult;
  const total = imagesCounts ? imagesCounts.total : (images ? images.length : 0);
  const missingAlt = imagesCounts ? imagesCounts.missingAlt : 0;
  const emptyAlt = imagesCounts ? imagesCounts.emptyAlt : 0;

  if (total === 0) {
    issues.push({
      id: 'images-none',
      category: 'Images',
      severity: SEVERITY.INFO,
      title: 'No images on page',
      description: 'The page does not contain any <img> elements.',
      value: '0 images',
      relatedTab: TABS.IMAGES,
    });
    return issues;
  }

  if (missingAlt > 0) {
    issues.push({
      id: 'images-missing-alt',
      category: 'Images',
      severity: SEVERITY.WARNING,
      title: 'Images missing ALT attribute',
      description: `Found ${missingAlt} image(s) without an alt attribute. Alt attributes are critical for accessibility and image search indexing.`,
      value: `${missingAlt} of ${total}`,
      relatedTab: TABS.IMAGES,
      filterId: 'missing-alt',
    });
  } else {
    issues.push({
      id: 'images-all-alt',
      category: 'Images',
      severity: SEVERITY.PASSED,
      title: 'All images have ALT attribute',
      description: 'Every <img> on this page defines an alt attribute.',
      value: `${total} images`,
      relatedTab: TABS.IMAGES,
    });
  }

  if (emptyAlt > 0) {
    issues.push({
      id: 'images-empty-alt',
      category: 'Images',
      severity: SEVERITY.INFO,
      title: 'Images with empty ALT attribute (alt="")',
      description: `Found ${emptyAlt} image(s) with an empty alt attribute. If these images are purely decorative, this is valid for accessibility.`,
      value: `${emptyAlt} images`,
      relatedTab: TABS.IMAGES,
      filterId: 'empty-alt',
    });
  }

  return issues;
}
