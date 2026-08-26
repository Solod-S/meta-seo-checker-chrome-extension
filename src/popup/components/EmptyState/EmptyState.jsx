import React from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({ icon: Icon = Inbox, title = 'No items found', description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={24} />
      </div>
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-description">{description}</div>}
    </div>
  );
}
