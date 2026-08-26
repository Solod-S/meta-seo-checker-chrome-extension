import React from 'react';
import { Check } from 'lucide-react';
import './Toast.css';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast-content">
        <Check size={14} className="toast-icon" />
        <span>{message}</span>
      </div>
    </div>
  );
}
