import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge.jsx';
import { SEO_THRESHOLDS } from '../../../seo/seoThresholds.js';
import { TABS } from '../../../shared/constants.js';
import './Summary.css';

export function Summary({ scanResult, issues, counts, onTabChange, onCopy }) {
  if (!scanResult) return null;

  const { page, meta, headingsCounts, imagesCounts, linksCounts, social, structuredData } = scanResult;

  const titleIssues = issues.filter(i => i.id.startsWith('title-'));
  const descIssues = issues.filter(i => i.id.startsWith('description-'));
  const canonicalIssues = issues.filter(i => i.id.startsWith('canonical-'));
  const robotsIssues = issues.filter(i => i.id.startsWith('robots-'));

  const nonPassedIssues = issues.filter(i => i.severity === 'error' || i.severity === 'warning');

  return (
    <div className="summary-section animate-fade-in">
      {/* 1. SEO Issues Banner */}
      {nonPassedIssues.length > 0 && (
        <div className="card issues-card">
          <div className="card-header">
            <span className="card-title">
              <Sparkles size={15} className="issues-spark-icon" />
              SEO Issues & Warnings ({nonPassedIssues.length})
            </span>
          </div>
          <div className="card-body issues-list">
            {nonPassedIssues.map((issue) => (
              <div
                key={issue.id}
                className={`issue-row issue-row-${issue.severity} ${issue.relatedTab ? 'issue-row-clickable' : ''}`}
                onClick={() => {
                  if (issue.relatedTab && onTabChange) {
                    onTabChange(issue.relatedTab, issue.filterId);
                  }
                }}
              >
                <div className="issue-row-icon">
                  {issue.severity === 'error' ? (
                    <AlertCircle size={14} className="issue-icon-error" />
                  ) : (
                    <AlertTriangle size={14} className="issue-icon-warning" />
                  )}
                </div>
                <div className="issue-row-content">
                  <div className="issue-row-title-wrap">
                    <span className="issue-row-title">{issue.title}</span>
                    {issue.value && <span className="issue-row-val">{issue.value}</span>}
                  </div>
                  <p className="issue-row-desc">{issue.description}</p>
                </div>
                {issue.relatedTab && (
                  <div className="issue-row-nav">
                    <span className="issue-nav-tab">{issue.relatedTab}</span>
                    <ChevronRight size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Primary Meta Overview Card */}
      <div className="card meta-overview-card">
        <div className="card-header">
          <span className="card-title">On-Page Meta Tags</span>
        </div>
        <div className="card-body meta-grid">
          {/* Title */}
          <div className="meta-item">
            <div className="meta-item-header">
              <div className="meta-item-label-group">
                <span className="meta-label">Title</span>
                <span className="meta-counter">
                  {meta.titleLength} characters
                  <span className="meta-subtle-range">
                    (recommended: {SEO_THRESHOLDS.title.minRecommended}–{SEO_THRESHOLDS.title.maxRecommended})
                  </span>
                </span>
              </div>
              <div className="meta-item-actions">
                {titleIssues.map(issue => (
                  <StatusBadge key={issue.id} status={issue.severity} text={issue.severity === 'passed' ? 'OK' : issue.title} size="sm" />
                ))}
                <CopyButton text={meta.title} label="Copy Title" onCopy={onCopy} />
              </div>
            </div>
            <div className="meta-value-box">
              {meta.title ? (
                <span className="meta-value-text">{meta.title}</span>
              ) : (
                <span className="meta-empty-text">No title tag found</span>
              )}
            </div>
            {meta.titles && meta.titles.length > 1 && (
              <div className="meta-duplicates-box">
                <span className="meta-duplicate-badge">Warning: {meta.titles.length} title tags found</span>
                {meta.titles.map((t, idx) => (
                  <div key={idx} className="meta-duplicate-item">
                    <span className="meta-duplicate-index">#{idx + 1}:</span> {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta Description */}
          <div className="meta-item">
            <div className="meta-item-header">
              <div className="meta-item-label-group">
                <span className="meta-label">Meta Description</span>
                <span className="meta-counter">
                  {meta.descriptionLength} characters
                  <span className="meta-subtle-range">
                    (recommended: {SEO_THRESHOLDS.description.minRecommended}–{SEO_THRESHOLDS.description.maxRecommended})
                  </span>
                </span>
              </div>
              <div className="meta-item-actions">
                {descIssues.map(issue => (
                  <StatusBadge key={issue.id} status={issue.severity} text={issue.severity === 'passed' ? 'OK' : issue.title} size="sm" />
                ))}
                <CopyButton text={meta.description} label="Copy Description" onCopy={onCopy} />
              </div>
            </div>
            <div className="meta-value-box">
              {meta.description ? (
                <span className="meta-value-text">{meta.description}</span>
              ) : (
                <span className="meta-empty-text">No meta description found</span>
              )}
            </div>
            {meta.descriptions && meta.descriptions.length > 1 && (
              <div className="meta-duplicates-box">
                <span className="meta-duplicate-badge">Warning: {meta.descriptions.length} meta descriptions found</span>
                {meta.descriptions.map((d, idx) => (
                  <div key={idx} className="meta-duplicate-item">
                    <span className="meta-duplicate-index">#{idx + 1}:</span> {d}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URL & Canonical Row */}
          <div className="meta-two-col">
            {/* URL */}
            <div className="meta-sub-item">
              <div className="meta-item-header">
                <span className="meta-label">Current URL</span>
                <CopyButton text={page.url} label="Copy URL" onCopy={onCopy} />
              </div>
              <div className="meta-value-box code-text">
                {page.url}
              </div>
            </div>

            {/* Canonical */}
            <div className="meta-sub-item">
              <div className="meta-item-header">
                <div className="meta-item-label-group">
                  <span className="meta-label">Canonical</span>
                  {canonicalIssues.map(issue => (
                    <StatusBadge key={issue.id} status={issue.severity} text={issue.severity === 'passed' ? 'Valid' : issue.title} size="sm" />
                  ))}
                </div>
                {meta.canonical && (
                  <CopyButton text={meta.canonical} label="Copy Canonical" onCopy={onCopy} />
                )}
              </div>
              <div className="meta-value-box code-text">
                {meta.canonical || <span className="meta-empty-text">Missing canonical link</span>}
              </div>
              {meta.canonicals && meta.canonicals.length > 1 && (
                <div className="meta-duplicates-box">
                  <span className="meta-duplicate-badge">Error: {meta.canonicals.length} canonical tags</span>
                  {meta.canonicals.map((c, idx) => (
                    <div key={idx} className="meta-duplicate-item">#{idx + 1}: {c.rawHref}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Robots & Meta Keywords */}
          <div className="meta-two-col">
            {/* Robots */}
            <div className="meta-sub-item">
              <div className="meta-item-header">
                <span className="meta-label">Robots</span>
                {robotsIssues.map(issue => (
                  <StatusBadge key={issue.id} status={issue.severity} text={issue.value || issue.title} size="sm" />
                ))}
              </div>
              <div className="meta-value-box">
                <span className="meta-value-text">{meta.robots.summaryText}</span>
              </div>
            </div>

            {/* Keywords */}
            <div className="meta-sub-item">
              <div className="meta-item-header">
                <span className="meta-label">Keywords</span>
                <span className="meta-counter">{meta.keywords.length} items</span>
              </div>
              <div className="meta-value-box">
                {meta.keywords.length > 0 ? (
                  <span className="meta-value-text">{meta.keywords.join(', ')}</span>
                ) : (
                  <span className="meta-empty-text">No meta keywords declared (Informational only)</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Info Row: Lang, Charset, Viewport, Hreflang */}
          <div className="meta-four-col">
            <div className="meta-mini-card">
              <span className="mini-card-label">Language</span>
              <span className="mini-card-value">{meta.lang || <span className="text-warn">Missing</span>}</span>
            </div>
            <div className="meta-mini-card">
              <span className="mini-card-label">Charset</span>
              <span className="mini-card-value">{meta.charset || <span className="text-warn">Missing</span>}</span>
            </div>
            <div className="meta-mini-card">
              <span className="mini-card-label">Viewport</span>
              <span className="mini-card-value" title={meta.viewport}>{meta.viewport ? 'Configured' : <span className="text-warn">Missing</span>}</span>
            </div>
            <div className="meta-mini-card">
              <span className="mini-card-label">Hreflang</span>
              <span className="mini-card-value">
                {meta.hreflangs?.length > 0 ? `${meta.hreflangs.length} tags` : 'None'}
              </span>
            </div>
          </div>

          {/* Optional Author / Publisher */}
          {(meta.author || meta.publisher) && (
            <div className="meta-two-col">
              {meta.author && (
                <div className="meta-mini-card">
                  <span className="mini-card-label">Author</span>
                  <span className="mini-card-value">{meta.author}</span>
                </div>
              )}
              {meta.publisher && (
                <div className="meta-mini-card">
                  <span className="mini-card-label">Publisher</span>
                  <span className="mini-card-value">{meta.publisher}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Summary Counters Grid */}
      <div className="card counters-card">
        <div className="card-header">
          <span className="card-title">Content & Social Counters</span>
        </div>
        <div className="card-body counters-grid">
          {/* Headings */}
          <div className="counter-item-box" onClick={() => onTabChange(TABS.HEADINGS)}>
            <div className="counter-box-header">
              <span className="counter-box-title">Headings</span>
              <ChevronRight size={13} className="counter-box-arrow" />
            </div>
            <div className="counter-stats-list">
              <div className="counter-stat-row">
                <span>H1</span>
                <span className={`counter-stat-val ${headingsCounts.h1 === 0 ? 'stat-error' : headingsCounts.h1 > 1 ? 'stat-warn' : 'stat-pass'}`}>
                  {headingsCounts.h1}
                </span>
              </div>
              <div className="counter-stat-row">
                <span>H2</span>
                <span className="counter-stat-val">{headingsCounts.h2}</span>
              </div>
              <div className="counter-stat-row">
                <span>H3</span>
                <span className="counter-stat-val">{headingsCounts.h3}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="counter-item-box" onClick={() => onTabChange(TABS.IMAGES)}>
            <div className="counter-box-header">
              <span className="counter-box-title">Images</span>
              <ChevronRight size={13} className="counter-box-arrow" />
            </div>
            <div className="counter-stats-list">
              <div className="counter-stat-row">
                <span>Total</span>
                <span className="counter-stat-val">{imagesCounts.total}</span>
              </div>
              <div className="counter-stat-row">
                <span>Missing ALT</span>
                <span className={`counter-stat-val ${imagesCounts.missingAlt > 0 ? 'stat-warn' : 'stat-pass'}`}>
                  {imagesCounts.missingAlt}
                </span>
              </div>
              <div className="counter-stat-row">
                <span>Lazy Loaded</span>
                <span className="counter-stat-val">{imagesCounts.lazyLoaded}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="counter-item-box" onClick={() => onTabChange(TABS.LINKS)}>
            <div className="counter-box-header">
              <span className="counter-box-title">Links</span>
              <ChevronRight size={13} className="counter-box-arrow" />
            </div>
            <div className="counter-stats-list">
              <div className="counter-stat-row">
                <span>Total</span>
                <span className="counter-stat-val">{linksCounts.total}</span>
              </div>
              <div className="counter-stat-row">
                <span>Unique</span>
                <span className="counter-stat-val">{linksCounts.unique}</span>
              </div>
              <div className="counter-stat-row">
                <span>Internal</span>
                <span className="counter-stat-val">{linksCounts.internal}</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="counter-item-box" onClick={() => onTabChange(TABS.SOCIAL)}>
            <div className="counter-box-header">
              <span className="counter-box-title">Social & Schema</span>
              <ChevronRight size={13} className="counter-box-arrow" />
            </div>
            <div className="counter-stats-list">
              <div className="counter-stat-row">
                <span>Open Graph</span>
                <span className={`counter-stat-val ${social.openGraph.hasOg ? 'stat-pass' : 'stat-neutral'}`}>
                  {social.openGraph.hasOg ? 'Detected' : 'None'}
                </span>
              </div>
              <div className="counter-stat-row">
                <span>Twitter Card</span>
                <span className={`counter-stat-val ${social.twitter.hasTwitter ? 'stat-pass' : 'stat-neutral'}`}>
                  {social.twitter.hasTwitter ? 'Detected' : 'None'}
                </span>
              </div>
              <div className="counter-stat-row">
                <span>JSON-LD</span>
                <span className={`counter-stat-val ${structuredData.jsonLd.total > 0 ? 'stat-pass' : 'stat-neutral'}`}>
                  {structuredData.jsonLd.total} {structuredData.jsonLd.total === 1 ? 'block' : 'blocks'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
