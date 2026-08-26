import React, { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  FileJson, 
  ExternalLink, 
  AlertCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  Code,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge.jsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.jsx';
import { openExternalUrl, openGoogleRichResultsTest } from '../../../extension/openExternal.js';
import './Social.css';

export function Social({ scanResult, onCopy }) {
  const [expandedJsonBlocks, setExpandedJsonBlocks] = useState({ 0: true });

  if (!scanResult) return null;

  const { page, social = {}, structuredData = {} } = scanResult;
  const { openGraph = {}, twitter = {}, article = {}, facebook = {}, imageSrc = {} } = social;
  const { jsonLd = {}, microdata = {}, rdfa = {} } = structuredData;

  const toggleJsonBlock = (idx) => {
    setExpandedJsonBlocks(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="social-section animate-fade-in">
      {/* 1. Open Graph Card */}
      <div className="card social-card">
        <div className="card-header">
          <span className="card-title">
            <Share2 size={15} className="social-og-icon" />
            Open Graph Metadata
          </span>
          <div className="social-card-badges">
            {openGraph.hasOg ? (
              <StatusBadge status="passed" text={`${openGraph.items.length} tags`} size="sm" />
            ) : (
              <StatusBadge status="info" text="No OG Tags" size="sm" />
            )}
          </div>
        </div>

        <div className="card-body social-card-body">
          {!openGraph.hasOg ? (
            <div className="social-empty-msg">No Open Graph metadata detected on this page.</div>
          ) : (
            <div className="social-fields-grid">
              {/* OG Image Preview if present */}
              {openGraph.image && (
                <div className="social-preview-box">
                  <div className="social-preview-img-wrap">
                    <img
                      src={openGraph.image}
                      alt="OG Preview"
                      className="social-preview-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="social-preview-meta">
                    <span className="social-preview-label">og:image</span>
                    <span className="social-preview-url" title={openGraph.image}>{openGraph.image}</span>
                    <div className="social-preview-actions">
                      <CopyButton text={openGraph.image} label="Copy Image URL" onCopy={onCopy} />
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => openExternalUrl(openGraph.image)}
                      >
                        <ExternalLink size={12} />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* All OG Tags Table */}
              <div className="social-meta-table">
                {openGraph.items.map((item, idx) => {
                  const count = openGraph.counts[item.property.toLowerCase()] || 1;
                  return (
                    <div key={idx} className="social-meta-row">
                      <div className="social-meta-prop-col">
                        <span className="social-meta-prop">{item.property}</span>
                        {count > 1 && (
                          <span className="social-duplicate-tag" title="Multiple tags found for this property">
                            Duplicate
                          </span>
                        )}
                      </div>
                      <div className="social-meta-val-col">
                        <span className="social-meta-val">{item.content}</span>
                      </div>
                      <div className="social-meta-act-col">
                        <CopyButton text={item.content} label="Copy" variant="icon" onCopy={onCopy} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Twitter / X Cards */}
      <div className="card social-card">
        <div className="card-header">
          <span className="card-title">
            <Twitter size={15} className="social-twitter-icon" />
            Twitter / X Cards
          </span>
          <div className="social-card-badges">
            {twitter.hasTwitter ? (
              <StatusBadge status="passed" text={twitter.card || 'Detected'} size="sm" />
            ) : (
              <StatusBadge status="info" text="No Twitter Tags" size="sm" />
            )}
          </div>
        </div>

        <div className="card-body social-card-body">
          {!twitter.hasTwitter ? (
            <div className="social-empty-msg">No Twitter Card metadata detected.</div>
          ) : (
            <div className="social-fields-grid">
              {twitter.image && (
                <div className="social-preview-box">
                  <div className="social-preview-img-wrap">
                    <img
                      src={twitter.image}
                      alt="Twitter Card Preview"
                      className="social-preview-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="social-preview-meta">
                    <span className="social-preview-label">twitter:image</span>
                    <span className="social-preview-url" title={twitter.image}>{twitter.image}</span>
                    <div className="social-preview-actions">
                      <CopyButton text={twitter.image} label="Copy Image URL" onCopy={onCopy} />
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => openExternalUrl(twitter.image)}
                      >
                        <ExternalLink size={12} />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="social-meta-table">
                {twitter.items.map((item, idx) => {
                  const count = twitter.counts[item.name.toLowerCase()] || 1;
                  return (
                    <div key={idx} className="social-meta-row">
                      <div className="social-meta-prop-col">
                        <span className="social-meta-prop">{item.name}</span>
                        {count > 1 && (
                          <span className="social-duplicate-tag">Duplicate</span>
                        )}
                      </div>
                      <div className="social-meta-val-col">
                        <span className="social-meta-val">{item.content}</span>
                      </div>
                      <div className="social-meta-act-col">
                        <CopyButton text={item.content} label="Copy" variant="icon" onCopy={onCopy} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Structured Data (JSON-LD, Microdata, RDFa) */}
      <div className="card social-card">
        <div className="card-header">
          <span className="card-title">
            <FileJson size={15} className="social-json-icon" />
            Structured Data & Schema.org
          </span>
          <div className="social-card-badges">
            {page?.url && (
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => openGoogleRichResultsTest(page.url)}
                title="Test with Google Rich Results Tool"
              >
                <ExternalLink size={12} />
                <span>Google Rich Results</span>
              </button>
            )}
          </div>
        </div>

        <div className="card-body social-card-body">
          {/* JSON-LD Section */}
          <div className="schema-subsection">
            <div className="schema-sub-header">
              <span className="schema-sub-title">
                JSON-LD Blocks ({jsonLd.total || 0})
              </span>
            </div>

            {jsonLd.total === 0 ? (
              <div className="social-empty-msg">No JSON-LD structured data scripts found.</div>
            ) : (
              <div className="jsonld-blocks-list">
                {jsonLd.blocks.map((block) => {
                  const isExpanded = !!expandedJsonBlocks[block.index];
                  return (
                    <div key={block.index} className={`card jsonld-block-card ${!block.valid ? 'jsonld-invalid' : ''}`}>
                      <div
                        className="jsonld-block-header"
                        onClick={() => toggleJsonBlock(block.index)}
                      >
                        <div className="jsonld-header-left">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          <span className="jsonld-block-title">
                            Block #{block.index + 1}:
                          </span>
                          <span className="jsonld-block-types">
                            {block.types.length > 0 ? block.types.join(', ') : block.primaryType}
                          </span>
                        </div>

                        <div className="jsonld-header-right" onClick={(e) => e.stopPropagation()}>
                          {!block.valid ? (
                            <span className="badge badge-error">Syntax Error</span>
                          ) : (
                            <span className="badge badge-passed">Valid JSON</span>
                          )}
                          <CopyButton
                            text={block.raw}
                            label="Copy JSON"
                            variant="icon"
                            onCopy={onCopy}
                          />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="jsonld-block-body">
                          {!block.valid && (
                            <div className="jsonld-error-banner">
                              <AlertCircle size={13} />
                              <span>Parsing Error: {block.error}</span>
                            </div>
                          )}
                          <pre className="jsonld-code-view">
                            {block.valid ? JSON.stringify(block.data, null, 2) : block.raw}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Microdata Section */}
          <div className="schema-subsection">
            <div className="schema-sub-header">
              <span className="schema-sub-title">Microdata Items ({microdata.total || 0})</span>
            </div>
            {microdata.total === 0 ? (
              <div className="social-empty-msg">No Microdata Schema.org items found.</div>
            ) : (
              <div className="microdata-types-list">
                {microdata.types.map((type, idx) => (
                  <span key={idx} className="microdata-chip">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* RDFa Section */}
          {rdfa.hasRdfa && (
            <div className="schema-subsection">
              <div className="schema-sub-header">
                <span className="schema-sub-title">RDFa Elements ({rdfa.total})</span>
              </div>
              <div className="microdata-types-list">
                {rdfa.types.map((type, idx) => (
                  <span key={idx} className="microdata-chip">{type}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Article & Facebook & image_src cards (if present) */}
      {(article.hasArticle || facebook.hasFacebook || imageSrc.hasImageSrc) && (
        <div className="card social-card">
          <div className="card-header">
            <span className="card-title">Additional Social Tags</span>
          </div>
          <div className="card-body social-card-body">
            <div className="social-meta-table">
              {article.items.map((item, idx) => (
                <div key={`art-${idx}`} className="social-meta-row">
                  <div className="social-meta-prop-col">
                    <span className="social-meta-prop">{item.property}</span>
                  </div>
                  <div className="social-meta-val-col">
                    <span className="social-meta-val">{item.content}</span>
                  </div>
                  <div className="social-meta-act-col">
                    <CopyButton text={item.content} label="Copy" variant="icon" onCopy={onCopy} />
                  </div>
                </div>
              ))}

              {facebook.items.map((item, idx) => (
                <div key={`fb-${idx}`} className="social-meta-row">
                  <div className="social-meta-prop-col">
                    <span className="social-meta-prop">{item.property}</span>
                  </div>
                  <div className="social-meta-val-col">
                    <span className="social-meta-val">{item.content}</span>
                  </div>
                  <div className="social-meta-act-col">
                    <CopyButton text={item.content} label="Copy" variant="icon" onCopy={onCopy} />
                  </div>
                </div>
              ))}

              {imageSrc.links.map((link, idx) => (
                <div key={`imgsrc-${idx}`} className="social-meta-row">
                  <div className="social-meta-prop-col">
                    <span className="social-meta-prop">link rel="image_src"</span>
                  </div>
                  <div className="social-meta-val-col">
                    <span className="social-meta-val">{link.absoluteHref}</span>
                  </div>
                  <div className="social-meta-act-col">
                    <CopyButton text={link.absoluteHref} label="Copy" variant="icon" onCopy={onCopy} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
