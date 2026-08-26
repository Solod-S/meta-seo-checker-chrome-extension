import React, { useState, useMemo } from 'react';
import { Eye, Copy, AlertTriangle, AlertCircle, Heading as HeadingIcon } from 'lucide-react';
import { SearchInput } from '../../components/SearchInput/SearchInput.jsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.jsx';
import './Headings.css';

export function Headings({ scanResult, onHighlight, onCopy }) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const { headings = [], headingsCounts = {} } = scanResult || {};

  const filteredHeadings = useMemo(() => {
    return headings.filter(h => {
      if (levelFilter !== 'all' && h.level !== parseInt(levelFilter, 10)) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        return h.text.toLowerCase().includes(query) || `h${h.level}`.includes(query);
      }
      return true;
    });
  }, [headings, levelFilter, search]);

  return (
    <div className="headings-section animate-fade-in">
      {/* 1. Top Level Counters Bar */}
      <div className="card headings-counters-card">
        <div className="headings-level-chips">
          <button
            type="button"
            className={`level-chip ${levelFilter === 'all' ? 'level-chip-active' : ''}`}
            onClick={() => setLevelFilter('all')}
          >
            <span>All</span>
            <span className="chip-count">{headingsCounts.total || 0}</span>
          </button>

          {[1, 2, 3, 4, 5, 6].map(lvl => (
            <button
              key={lvl}
              type="button"
              className={`level-chip level-chip-h${lvl} ${levelFilter === String(lvl) ? 'level-chip-active' : ''}`}
              onClick={() => setLevelFilter(levelFilter === String(lvl) ? 'all' : String(lvl))}
            >
              <span>H{lvl}</span>
              <span className={`chip-count ${lvl === 1 && headingsCounts.h1 === 0 ? 'chip-count-warn' : ''}`}>
                {headingsCounts[`h${lvl}`] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search Controls */}
      <div className="headings-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filter headings by text or tag..."
        />
      </div>

      {/* 3. Headings List with Hierarchy Indentation */}
      {filteredHeadings.length === 0 ? (
        <EmptyState
          icon={HeadingIcon}
          title={search || levelFilter !== 'all' ? 'No matching headings' : 'No headings found'}
          description={
            search || levelFilter !== 'all'
              ? 'Try modifying your search query or filter.'
              : 'The page does not contain any H1–H6 heading elements.'
          }
        />
      ) : (
        <div className="card headings-list-card">
          <div className="card-header">
            <span className="card-title">
              Heading Hierarchy ({filteredHeadings.length} {filteredHeadings.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <div className="card-body headings-items-body">
            {filteredHeadings.map((heading) => {
              const indentLevel = Math.max(0, heading.level - 1);
              return (
                <div
                  key={heading.index}
                  className={`heading-item-row heading-level-${heading.level} ${heading.isEmpty ? 'heading-empty' : ''}`}
                  style={{ paddingLeft: `${indentLevel * 18 + 12}px` }}
                >
                  <div className="heading-tag-badge">
                    H{heading.level}
                  </div>

                  <div className="heading-content-wrap">
                    {heading.isEmpty ? (
                      <span className="heading-empty-label">
                        <AlertTriangle size={12} />
                        (Empty heading tag)
                      </span>
                    ) : (
                      <span className="heading-text">{heading.text}</span>
                    )}

                    {heading.isSkippedLevel && (
                      <span className="heading-warning-badge" title="Heading hierarchy level skipped">
                        <AlertCircle size={11} />
                        Skipped Level
                      </span>
                    )}
                  </div>

                  <div className="heading-actions">
                    {!heading.isEmpty && (
                      <CopyButton
                        text={heading.text}
                        label="Copy"
                        variant="icon"
                        onCopy={onCopy}
                      />
                    )}
                    {heading.selector && (
                      <button
                        type="button"
                        className="btn-icon heading-highlight-btn"
                        onClick={() => onHighlight(heading.selector, `H${heading.level}`)}
                        title="Highlight on page"
                        aria-label="Highlight on page"
                      >
                        <Eye size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
