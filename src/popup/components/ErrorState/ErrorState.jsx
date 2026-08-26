import React from 'react';
import { ShieldAlert, RefreshCw, AlertOctagon } from 'lucide-react';
import './ErrorState.css';

export function ErrorState({ isRestricted, error, onRetry }) {
  return (
    <div className="error-state-container">
      <div className="error-state-card">
        <div className="error-state-icon">
          {isRestricted ? <ShieldAlert size={36} /> : <AlertOctagon size={36} />}
        </div>
        <h2 className="error-state-title">
          {isRestricted ? 'Restricted Browser Page' : 'Analysis Failed'}
        </h2>
        <p className="error-state-message">
          {error || 'An unexpected error occurred while analyzing this page.'}
        </p>
        {!isRestricted && onRetry && (
          <button type="button" className="btn-primary error-retry-btn" onClick={onRetry}>
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
