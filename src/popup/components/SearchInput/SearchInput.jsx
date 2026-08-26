import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchInput.css';

export function SearchInput({ value, onChange, placeholder = 'Search...', ariaLabel = 'Search' }) {
  return (
    <div className="search-input-wrapper">
      <Search size={13} className="search-input-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
