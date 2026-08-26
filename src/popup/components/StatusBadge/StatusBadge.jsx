import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import './StatusBadge.css';

export function StatusBadge({ status, text, count, size = 'md' }) {
  const getIcon = () => {
    switch (status) {
      case 'error':
        return <AlertCircle size={size === 'sm' ? 12 : 13} className="status-badge-icon" />;
      case 'warning':
        return <AlertTriangle size={size === 'sm' ? 12 : 13} className="status-badge-icon" />;
      case 'passed':
        return <CheckCircle2 size={size === 'sm' ? 12 : 13} className="status-badge-icon" />;
      case 'info':
        return <Info size={size === 'sm' ? 12 : 13} className="status-badge-icon" />;
      default:
        return null;
    }
  };

  return (
    <span className={`status-badge status-badge-${status} status-badge-${size}`}>
      {getIcon()}
      {text && <span className="status-badge-text">{text}</span>}
      {count !== undefined && <span className="status-badge-count">{count}</span>}
    </span>
  );
}
