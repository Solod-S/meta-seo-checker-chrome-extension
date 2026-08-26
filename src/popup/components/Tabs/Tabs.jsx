import React from 'react';
import { LayoutDashboard, Heading, Image, Link2, Share2 } from 'lucide-react';
import { TABS } from '../../../shared/constants.js';
import './Tabs.css';

export function Tabs({ activeTab, onTabChange, scanResult }) {
  const tabs = [
    {
      id: TABS.SUMMARY,
      label: 'Summary',
      icon: LayoutDashboard,
    },
    {
      id: TABS.HEADINGS,
      label: 'Headings',
      icon: Heading,
      badge: scanResult?.headingsCounts?.total !== undefined ? scanResult.headingsCounts.total : null,
    },
    {
      id: TABS.IMAGES,
      label: 'Images',
      icon: Image,
      badge: scanResult?.imagesCounts?.total !== undefined ? scanResult.imagesCounts.total : null,
      warnBadge: scanResult?.imagesCounts?.missingAlt > 0,
    },
    {
      id: TABS.LINKS,
      label: 'Links',
      icon: Link2,
      badge: scanResult?.linksCounts?.total !== undefined ? scanResult.linksCounts.total : null,
    },
    {
      id: TABS.SOCIAL,
      label: 'Social',
      icon: Share2,
      badge: scanResult?.structuredData?.jsonLd?.total ? `${scanResult.structuredData.jsonLd.total} LD` : null,
    },
  ];

  return (
    <nav className="tabs-nav" role="tablist" aria-label="SEO Sections">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`section-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`tab-item ${isActive ? 'tab-item-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={14} className="tab-icon" />
            <span className="tab-label">{tab.label}</span>
            {tab.badge !== null && tab.badge !== undefined && (
              <span className={`tab-badge ${tab.warnBadge ? 'tab-badge-warn' : ''}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
