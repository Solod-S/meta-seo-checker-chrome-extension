import React, { useState, useCallback } from 'react';
import { Header } from './components/Header/Header.jsx';
import { Tabs } from './components/Tabs/Tabs.jsx';
import { Toast } from './components/Toast/Toast.jsx';
import { ErrorState } from './components/ErrorState/ErrorState.jsx';
import { Summary } from './sections/Summary/Summary.jsx';
import { Headings } from './sections/Headings/Headings.jsx';
import { Images } from './sections/Images/Images.jsx';
import { Links } from './sections/Links/Links.jsx';
import { Social } from './sections/Social/Social.jsx';
import { usePageScan } from './hooks/usePageScan.js';
import { useClipboard } from './hooks/useClipboard.js';
import { useHighlight } from './hooks/useHighlight.js';
import { generateSeoReport } from './utils/report.js';
import { TABS } from '../shared/constants.js';

export function App() {
  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);
  const [imagesInitialFilter, setImagesInitialFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  }, []);

  const {
    loading,
    scanResult,
    issues,
    counts,
    isRestricted,
    error,
    tabId,
    refreshScan,
  } = usePageScan();

  const { copyToClipboard } = useClipboard(showToast);
  const { triggerHighlight } = useHighlight(tabId, showToast);

  const handleTabChange = useCallback((tabIdTarget, filterId) => {
    setActiveTab(tabIdTarget);
    if (tabIdTarget === TABS.IMAGES && filterId) {
      setImagesInitialFilter(filterId);
    }
  }, []);

  const handleCopyReport = useCallback(() => {
    if (!scanResult) return;
    const reportText = generateSeoReport(scanResult, issues, counts);
    copyToClipboard(reportText, 'SEO Report copied to clipboard!');
  }, [scanResult, issues, counts, copyToClipboard]);

  return (
    <div className="popup-container">
      <Header
        pageUrl={scanResult?.page?.url || ''}
        counts={counts}
        loading={loading}
        onRefresh={refreshScan}
        onCopyReport={handleCopyReport}
        onTabChange={handleTabChange}
      />

      <Tabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        scanResult={scanResult}
      />

      <main className="popup-main" id={`section-${activeTab}`}>
        {loading && !scanResult ? (
          <div className="card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spin-animation" style={{ display: 'inline-block', marginBottom: '8px' }}>
              ⏳
            </div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
              Analyzing active page…
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Extracting meta tags, headings, images, links and structured data locally
            </div>
          </div>
        ) : error && !scanResult ? (
          <ErrorState
            isRestricted={isRestricted}
            error={error}
            onRetry={refreshScan}
          />
        ) : scanResult ? (
          <>
            {activeTab === TABS.SUMMARY && (
              <Summary
                scanResult={scanResult}
                issues={issues}
                counts={counts}
                onTabChange={handleTabChange}
                onCopy={copyToClipboard}
              />
            )}

            {activeTab === TABS.HEADINGS && (
              <Headings
                scanResult={scanResult}
                onHighlight={triggerHighlight}
                onCopy={copyToClipboard}
              />
            )}

            {activeTab === TABS.IMAGES && (
              <Images
                scanResult={scanResult}
                initialFilter={imagesInitialFilter}
                onHighlight={triggerHighlight}
                onCopy={copyToClipboard}
              />
            )}

            {activeTab === TABS.LINKS && (
              <Links
                scanResult={scanResult}
                onHighlight={triggerHighlight}
                onCopy={copyToClipboard}
              />
            )}

            {activeTab === TABS.SOCIAL && (
              <Social
                scanResult={scanResult}
                onCopy={copyToClipboard}
              />
            )}
          </>
        ) : null}
      </main>

      <Toast message={toastMessage} />
    </div>
  );
}
