import { useState, useEffect, useCallback } from 'react';
import { scanActiveTab } from '../../extension/scanActiveTab.js';

/**
 * Hook for managing active tab scan lifecycle.
 */
export function usePageScan() {
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [issues, setIssues] = useState([]);
  const [counts, setCounts] = useState({ error: 0, warning: 0, passed: 0, info: 0, total: 0 });
  const [isRestricted, setIsRestricted] = useState(false);
  const [error, setError] = useState(null);
  const [tabId, setTabId] = useState(null);

  const runScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsRestricted(false);

    try {
      const response = await scanActiveTab();
      if (!response.success) {
        if (response.isRestricted) {
          setIsRestricted(true);
        }
        setError(response.error || 'Failed to analyze active page.');
        setScanResult(null);
      } else {
        setScanResult(response.data);
        setIssues(response.issues || []);
        setCounts(response.counts || { error: 0, warning: 0, passed: 0, info: 0, total: 0 });
        if (response.tabId) {
          setTabId(response.tabId);
        }
      }
    } catch (err) {
      setError(err.message || 'Unexpected error while analyzing page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runScan();
  }, [runScan]);

  return {
    loading,
    scanResult,
    issues,
    counts,
    isRestricted,
    error,
    tabId,
    refreshScan: runScan,
  };
}
