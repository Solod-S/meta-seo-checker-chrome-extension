import React, { useState, useMemo } from 'react';
import { ExternalLink, Link2, Eye } from 'lucide-react';
import { SearchInput } from '../../components/SearchInput/SearchInput.jsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.jsx';
import { truncateUrl } from '../../utils/formatUrl.js';
import { openExternalUrl } from '../../../extension/openExternal.js';
import './Links.css';

const PAGE_SIZE = 40;

export function Links({ scanResult, onHighlight, onCopy }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { links = [], linksCounts = {} } = scanResult || {};

  const filteredLinks = useMemo(() => {
    return links.filter(l => {
      // 1. Filter condition
      if (filter === 'internal' && l.category !== 'internal') return false;
      if (filter === 'external' && l.category !== 'external') return false;
      if (filter === 'nofollow' && !l.isNoFollow) return false;
      if (filter === 'sponsored' && !l.isSponsored) return false;
      if (filter === 'ugc' && !l.isUgc) return false;
      if (filter === 'anchor' && l.category !== 'anchor') return false;
      if (filter === 'empty' && l.category !== 'empty') return false;
      if (filter === 'mailto' && l.category !== 'mailto') return false;
      if (filter === 'tel' && l.category !== 'tel') return false;

      // 2. Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchHref = (l.absoluteHref || l.rawHref || '').toLowerCase().includes(query);
        const matchText = (l.text || '').toLowerCase().includes(query);
        const matchTitle = (l.title || '').toLowerCase().includes(query);
        const matchRel = (l.rel || '').toLowerCase().includes(query);
        return matchHref || matchText || matchTitle || matchRel;
      }

      return true;
    });
  }, [links, filter, search]);

  const totalPages = Math.ceil(filteredLinks.length / PAGE_SIZE) || 1;
  const paginatedLinks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLinks.slice(start, start + PAGE_SIZE);
  }, [filteredLinks, page]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="links-section animate-fade-in">
      {/* 1. Summary & Filters Bar */}
      <div className="card links-counters-card">
        <div className="links-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span>All</span>
            <span className="chip-count">{linksCounts.total || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'internal' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('internal')}
          >
            <span>Internal</span>
            <span className="chip-count">{linksCounts.internal || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'external' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('external')}
          >
            <span>External</span>
            <span className="chip-count">{linksCounts.external || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'nofollow' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('nofollow')}
          >
            <span>NoFollow</span>
            <span className="chip-count">{linksCounts.nofollow || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'sponsored' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('sponsored')}
          >
            <span>Sponsored</span>
            <span className="chip-count">{linksCounts.sponsored || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'ugc' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('ugc')}
          >
            <span>UGC</span>
            <span className="chip-count">{linksCounts.ugc || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'anchor' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('anchor')}
          >
            <span>Anchors</span>
            <span className="chip-count">{linksCounts.anchor || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'empty' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('empty')}
          >
            <span>Empty</span>
            <span className={`chip-count ${linksCounts.emptyHref > 0 ? 'chip-count-warn' : ''}`}>
              {linksCounts.emptyHref || 0}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Search Toolbar */}
      <div className="links-toolbar">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Filter links by anchor text, URL, rel, or title..."
        />
      </div>

      {/* 3. Links List */}
      {filteredLinks.length === 0 ? (
        <EmptyState
          icon={Link2}
          title={search || filter !== 'all' ? 'No matching links' : 'No links found'}
          description={
            search || filter !== 'all'
              ? 'Try modifying your search query or filter.'
              : 'The inspected page does not contain any <a> links.'
          }
        />
      ) : (
        <div className="links-list">
          {paginatedLinks.map((link) => (
            <div key={link.index} className="card link-card-item">
              <div className="link-item-top">
                <div className="link-anchor-wrap">
                  <span className="link-anchor-label">Anchor:</span>
                  <span className={`link-anchor-text ${!link.text ? 'text-missing-anchor' : ''}`}>
                    {link.text || '(Empty Anchor)'}
                  </span>
                </div>

                <div className="link-badges-group">
                  <span className={`link-category-badge link-category-${link.category}`}>
                    {link.category}
                  </span>

                  {link.occurrences > 1 && (
                    <span className="link-occurrences-badge" title="Number of identical links on page">
                      ×{link.occurrences}
                    </span>
                  )}

                  {link.isNoFollow && <span className="link-rel-badge">nofollow</span>}
                  {link.isSponsored && <span className="link-rel-badge">sponsored</span>}
                  {link.isUgc && <span className="link-rel-badge">ugc</span>}
                </div>
              </div>

              {/* URL row */}
              <div className="link-url-row">
                <span className="link-url-text" title={link.absoluteHref || link.rawHref}>
                  {link.absoluteHref || link.rawHref || <span className="text-warn">Empty href</span>}
                </span>
              </div>

              {/* Title & Target if available */}
              {(link.title || link.target) && (
                <div className="link-extra-row">
                  {link.title && (
                    <span className="link-extra-item">
                      <strong>Title:</strong> {link.title}
                    </span>
                  )}
                  {link.target && (
                    <span className="link-extra-item">
                      <strong>Target:</strong> {link.target}
                    </span>
                  )}
                </div>
              )}

              {/* Actions row */}
              <div className="link-actions-row">
                {link.absoluteHref && (
                  <CopyButton
                    text={link.absoluteHref}
                    label="Copy URL"
                    onCopy={onCopy}
                  />
                )}
                {link.text && (
                  <CopyButton
                    text={link.text}
                    label="Copy Anchor"
                    onCopy={onCopy}
                  />
                )}
                {link.absoluteHref && link.category !== 'empty' && link.category !== 'javascript' && (
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => openExternalUrl(link.absoluteHref)}
                    title="Open link in new tab"
                  >
                    <ExternalLink size={12} />
                    <span>Open</span>
                  </button>
                )}
                {link.selector && (
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => onHighlight(link.selector, `Link (${link.text || 'anchor'})`)}
                    title="Highlight link on page"
                  >
                    <Eye size={12} />
                    <span>Highlight</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Page {page} of {totalPages} ({filteredLinks.length} links)
              </span>
              <div className="pagination-buttons">
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
