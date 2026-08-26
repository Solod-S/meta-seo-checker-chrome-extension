import React, { useState, useMemo } from 'react';
import { Eye, ExternalLink, Image as ImageIcon, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { SearchInput } from '../../components/SearchInput/SearchInput.jsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.jsx';
import { truncateUrl } from '../../utils/formatUrl.js';
import { openExternalUrl } from '../../../extension/openExternal.js';
import './Images.css';

const PAGE_SIZE = 30;

export function Images({ scanResult, initialFilter = 'all', onHighlight, onCopy }) {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { images = [], imagesCounts = {} } = scanResult || {};

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      // 1. Filter condition
      if (filter === 'missing-alt' && img.hasAlt) return false;
      if (filter === 'empty-alt' && (!img.hasAlt || !img.isEmptyAlt)) return false;
      if (filter === 'missing-title' && img.hasTitle) return false;
      if (filter === 'lazy' && img.loading !== 'lazy') return false;

      // 2. Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchSrc = (img.absoluteSrc || img.src || '').toLowerCase().includes(query);
        const matchAlt = (img.alt || '').toLowerCase().includes(query);
        const matchFilename = (img.filename || '').toLowerCase().includes(query);
        const matchTitle = (img.title || '').toLowerCase().includes(query);
        return matchSrc || matchAlt || matchFilename || matchTitle;
      }

      return true;
    });
  }, [images, filter, search]);

  const totalPages = Math.ceil(filteredImages.length / PAGE_SIZE) || 1;
  const paginatedImages = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredImages.slice(start, start + PAGE_SIZE);
  }, [filteredImages, page]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="images-section animate-fade-in">
      {/* 1. Top Counters & Quick Filters */}
      <div className="card images-counters-card">
        <div className="images-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span>All</span>
            <span className="chip-count">{imagesCounts.total || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'missing-alt' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('missing-alt')}
          >
            <span>Missing ALT</span>
            <span className={`chip-count ${imagesCounts.missingAlt > 0 ? 'chip-count-warn' : ''}`}>
              {imagesCounts.missingAlt || 0}
            </span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'empty-alt' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('empty-alt')}
          >
            <span>Empty ALT</span>
            <span className="chip-count">{imagesCounts.emptyAlt || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'missing-title' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('missing-title')}
          >
            <span>Missing Title</span>
            <span className="chip-count">{imagesCounts.missingTitle || 0}</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filter === 'lazy' ? 'filter-chip-active' : ''}`}
            onClick={() => handleFilterChange('lazy')}
          >
            <span>Lazy Loaded</span>
            <span className="chip-count">{imagesCounts.lazyLoaded || 0}</span>
          </button>
        </div>
      </div>

      {/* 2. Search Box */}
      <div className="images-toolbar">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Filter images by filename, ALT or URL..."
        />
      </div>

      {/* 3. Images List */}
      {filteredImages.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={search || filter !== 'all' ? 'No matching images' : 'No images found'}
          description={
            search || filter !== 'all'
              ? 'Try adjusting your search query or filter.'
              : 'The inspected page does not contain any <img> tags.'
          }
        />
      ) : (
        <div className="images-list">
          {paginatedImages.map((img) => (
            <div key={img.index} className="card image-card-item">
              {/* Thumbnail & Preview */}
              <div className="image-thumb-col">
                {img.absoluteSrc ? (
                  <img
                    src={img.absoluteSrc}
                    alt={img.alt || 'Preview'}
                    className="image-thumb-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="image-thumb-fallback" style={{ display: img.absoluteSrc ? 'none' : 'flex' }}>
                  <ImageIcon size={20} />
                </div>
              </div>

              {/* Details Column */}
              <div className="image-info-col">
                <div className="image-info-top">
                  <span className="image-filename" title={img.filename}>
                    {img.filename}
                  </span>
                  <div className="image-badges-row">
                    {!img.hasAlt ? (
                      <span className="img-badge img-badge-error">
                        <AlertCircle size={11} /> Missing ALT
                      </span>
                    ) : img.isEmptyAlt ? (
                      <span className="img-badge img-badge-neutral" title="Decorative image (alt='')">
                        Empty ALT
                      </span>
                    ) : (
                      <span className="img-badge img-badge-passed">
                        <Check size={11} /> ALT OK
                      </span>
                    )}

                    {img.loading === 'lazy' && (
                      <span className="img-badge img-badge-info">Lazy</span>
                    )}
                  </div>
                </div>

                {/* ALT text display */}
                <div className="image-field-row">
                  <span className="image-field-label">ALT:</span>
                  <span className={`image-field-value ${!img.hasAlt ? 'text-missing' : ''}`}>
                    {img.hasAlt ? (img.isEmptyAlt ? '"" (Empty)' : img.alt) : 'Missing'}
                  </span>
                </div>

                {/* Dimensions & URL */}
                <div className="image-meta-sub-row">
                  <span className="image-dimensions">
                    {img.width || img.naturalWidth || '—'} × {img.height || img.naturalHeight || '—'} px
                  </span>
                  <span className="image-url-subtle" title={img.absoluteSrc || img.src}>
                    {truncateUrl(img.absoluteSrc || img.src, 40)}
                  </span>
                </div>

                {/* Actions Row */}
                <div className="image-actions-row">
                  <CopyButton
                    text={img.absoluteSrc || img.src}
                    label="Copy URL"
                    onCopy={onCopy}
                  />
                  {img.hasAlt && !img.isEmptyAlt && (
                    <CopyButton
                      text={img.alt}
                      label="Copy ALT"
                      onCopy={onCopy}
                    />
                  )}
                  {img.absoluteSrc && (
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => openExternalUrl(img.absoluteSrc)}
                      title="Open image in new tab"
                    >
                      <ExternalLink size={12} />
                      <span>Open</span>
                    </button>
                  )}
                  {img.selector && (
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => onHighlight(img.selector, `Image (${img.filename})`)}
                      title="Highlight image on page"
                    >
                      <Eye size={12} />
                      <span>Highlight</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination controls for large image sets */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Page {page} of {totalPages} ({filteredImages.length} images)
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
