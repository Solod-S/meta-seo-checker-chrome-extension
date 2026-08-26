import React from 'react';
import { RefreshCw, FileText, Globe, Search } from 'lucide-react';
import { getHostname, truncateUrl } from '../../utils/formatUrl.js';
import { StatusBadge } from '../StatusBadge/StatusBadge.jsx';
import './Header.css';

export function Header({
  pageUrl,
  counts,
  loading,
  onRefresh,
  onCopyReport,
  onTabChange,
}) {
  const hostname = getHostname(pageUrl) || 'Inspecting Page';

  return (
    <header className="popup-header">
      <div className="header-top-row">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <Search size={16} className="brand-search-icon" />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">META SEO Checker</h1>
            <div className="brand-url" title={pageUrl}>
              <Globe size={11} className="url-globe-icon" />
              <span className="url-hostname">{hostname}</span>
              {pageUrl && (
                <span className="url-full-subtle">
                  ({truncateUrl(pageUrl, 32)})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-secondary btn-sm header-action-btn"
            onClick={onCopyReport}
            title="Copy structured SEO Markdown report"
            aria-label="Copy SEO Report"
          >
            <FileText size={13} />
            <span>Copy Report</span>
          </button>

          <button
            type="button"
            className={`btn-primary btn-sm header-action-btn ${loading ? 'btn-loading' : ''}`}
            onClick={onRefresh}
            disabled={loading}
            title="Refresh on-page scan"
            aria-label="Refresh Scan"
          >
            <RefreshCw size={13} className={loading ? 'spin-animation' : ''} />
            <span>{loading ? 'Scanning…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {counts && counts.total > 0 && (
        <div className="header-stats-row">
          <button
            type="button"
            className="stat-badge-btn"
            onClick={() => onTabChange && onTabChange('summary')}
            title="View SEO summary"
          >
            <StatusBadge status="error" count={counts.error} text="Errors" size="sm" />
          </button>
          <button
            type="button"
            className="stat-badge-btn"
            onClick={() => onTabChange && onTabChange('summary')}
            title="View SEO summary"
          >
            <StatusBadge status="warning" count={counts.warning} text="Warnings" size="sm" />
          </button>
          <button
            type="button"
            className="stat-badge-btn"
            onClick={() => onTabChange && onTabChange('summary')}
            title="View SEO summary"
          >
            <StatusBadge status="passed" count={counts.passed} text="Passed" size="sm" />
          </button>
        </div>
      )}
    </header>
  );
}
