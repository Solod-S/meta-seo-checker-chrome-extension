import { normalizeText } from './normalize.js';

/**
 * Recursively extracts @type from a parsed JSON-LD entity.
 * @param {any} item
 * @param {string[]} typesAccumulator
 */
function collectTypes(item, typesAccumulator) {
  if (!item || typeof item !== 'object') return;

  if (Array.isArray(item)) {
    item.forEach(sub => collectTypes(sub, typesAccumulator));
    return;
  }

  if (item['@type']) {
    if (Array.isArray(item['@type'])) {
      item['@type'].forEach(t => {
        if (typeof t === 'string') typesAccumulator.push(t);
      });
    } else if (typeof item['@type'] === 'string') {
      typesAccumulator.push(item['@type']);
    }
  }

  if (item['@graph'] && Array.isArray(item['@graph'])) {
    item['@graph'].forEach(sub => collectTypes(sub, typesAccumulator));
  }

  // Also check common nested properties like mainEntity, author, item, etc.
  Object.keys(item).forEach(key => {
    if (typeof item[key] === 'object' && item[key] !== null) {
      collectTypes(item[key], typesAccumulator);
    }
  });
}

/**
 * Extracts and analyzes structured data (JSON-LD, Microdata, RDFa).
 * @param {Document} doc
 * @returns {Object}
 */
export function extractStructuredData(doc = document) {
  // 1. JSON-LD
  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json" i]'));
  const jsonLdBlocks = jsonLdScripts.map((script, index) => {
    const raw = script.textContent || '';
    try {
      const data = JSON.parse(raw);
      const types = [];
      collectTypes(data, types);

      // Distinct types in order
      const uniqueTypes = Array.from(new Set(types));

      const hasContext = !!(data['@context'] || (data['@graph'] && data['@graph'].some(g => g['@context'])));
      const hasType = uniqueTypes.length > 0;

      return {
        index,
        valid: true,
        data,
        raw,
        types: uniqueTypes,
        primaryType: uniqueTypes[0] || 'Unknown',
        hasContext,
        hasType,
        error: null,
      };
    } catch (err) {
      return {
        index,
        valid: false,
        data: null,
        raw,
        types: [],
        primaryType: 'Invalid JSON',
        hasContext: false,
        hasType: false,
        error: err.message,
      };
    }
  });

  // 2. Microdata
  const microdataElements = Array.from(doc.querySelectorAll('[itemscope]'));
  const microdataItemtypes = [];

  microdataElements.forEach(el => {
    const itemtype = normalizeText(el.getAttribute('itemtype') || '');
    if (itemtype) {
      microdataItemtypes.push(itemtype);
    }
  });

  const uniqueMicrodataTypes = Array.from(new Set(microdataItemtypes));

  // 3. RDFa
  const rdfaElements = Array.from(doc.querySelectorAll('[typeof], [vocab], [property]'));
  const rdfaTypes = [];
  rdfaElements.forEach(el => {
    const typeOf = normalizeText(el.getAttribute('typeof') || '');
    if (typeOf) rdfaTypes.push(typeOf);
  });
  const uniqueRdfaTypes = Array.from(new Set(rdfaTypes));

  return {
    jsonLd: {
      blocks: jsonLdBlocks,
      total: jsonLdBlocks.length,
      validCount: jsonLdBlocks.filter(b => b.valid).length,
      invalidCount: jsonLdBlocks.filter(b => !b.valid).length,
      hasJsonLd: jsonLdBlocks.length > 0,
    },
    microdata: {
      total: microdataElements.length,
      types: uniqueMicrodataTypes,
      hasMicrodata: microdataElements.length > 0,
    },
    rdfa: {
      total: rdfaElements.length,
      types: uniqueRdfaTypes,
      hasRdfa: rdfaElements.length > 0,
    },
  };
}
