/**
 * Hook for checking app version updates
 *
 * Periodically checks for new app versions and provides update status
 */

import { useState, useEffect, useCallback } from 'react';
import { APP_VERSION } from '@/lib/version';

export interface VersionCheckResult {
  currentVersion: string;
  latestVersion: string | null;
  hasUpdate: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

export interface VersionInfo {
  version: string;
  releaseDate: string;
  changelog?: string[];
}

/**
 * Hook to check for app version updates
 * @param checkInterval - Interval in milliseconds to check for updates (default: 30 minutes)
 * @param versionEndpoint - URL to fetch latest version info (optional)
 */
export function useVersionCheck(
  checkInterval: number = 30 * 60 * 1000, // 30 minutes
  versionEndpoint?: string
): VersionCheckResult & {
  checkForUpdates: () => Promise<void>;
  dismissUpdate: () => void;
} {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissedUpdate, setDismissedUpdate] = useState<string | null>(null);

  // Default endpoint - can be overridden
  const defaultEndpoint =
    versionEndpoint ||
    'https://api.github.com/repos/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/releases/latest';

  const checkForUpdates = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    setError(null);

    try {
      // For GitHub releases, we get the latest release
      const response = await fetch(defaultEndpoint, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch version info: ${response.status}`);
      }

      const releaseData = await response.json();

      // Extract version from tag_name (remove 'v' prefix if present)
      const latestVersionRaw = releaseData.tag_name || releaseData.version;
      const latestVersionClean = latestVersionRaw?.replace(/^v/, '') || null;

      setLatestVersion(latestVersionClean);
      setLastChecked(new Date());

      // Track version check in analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'version_check', {
          current_version: APP_VERSION,
          latest_version: latestVersionClean,
          has_update:
            latestVersionClean &&
            isNewerVersion(latestVersionClean, APP_VERSION),
        });
      }
    } catch (err) {
      console.warn('Failed to check for updates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');

      // Fallback: try to get version from package.json on the deployed site
      try {
        const packageResponse = await fetch('/package.json');
        if (packageResponse.ok) {
          const packageData = await packageResponse.json();
          const packageVersion = packageData.version;
          setLatestVersion(packageVersion);
          setLastChecked(new Date());
        }
      } catch (fallbackErr) {
        // Ignore fallback errors
      }
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, defaultEndpoint]);

  const dismissUpdate = useCallback(() => {
    if (latestVersion) {
      setDismissedUpdate(latestVersion);
    }
  }, [latestVersion]);

  // Check for updates on mount and periodically
  useEffect(() => {
    // Initial check
    checkForUpdates();

    // Set up periodic checks
    const interval = setInterval(checkForUpdates, checkInterval);

    return () => clearInterval(interval);
  }, [checkForUpdates, checkInterval]);

  const hasUpdate = latestVersion
    ? isNewerVersion(latestVersion, APP_VERSION) &&
      dismissedUpdate !== latestVersion
    : false;

  return {
    currentVersion: APP_VERSION,
    latestVersion,
    hasUpdate,
    isChecking,
    lastChecked,
    error,
    checkForUpdates,
    dismissUpdate,
  };
}

/**
 * Compare two version strings to determine if the first is newer
 * Supports semantic versioning (major.minor.patch)
 */
function isNewerVersion(version1: string, version2: string): boolean {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  // Pad shorter version with zeros
  while (v1Parts.length < v2Parts.length) v1Parts.push(0);
  while (v2Parts.length < v1Parts.length) v2Parts.push(0);

  for (let i = 0; i < v1Parts.length; i++) {
    if (v1Parts[i] > v2Parts[i]) return true;
    if (v1Parts[i] < v2Parts[i]) return false;
  }

  return false; // Versions are equal
}

/**
 * Get a user-friendly version status message
 */
export function getVersionStatusMessage(result: VersionCheckResult): string {
  if (result.error) {
    return `Error checking for updates: ${result.error}`;
  }

  if (result.isChecking) {
    return 'Checking for updates...';
  }

  if (result.hasUpdate) {
    return `New version ${result.latestVersion} available! Refresh to update.`;
  }

  if (result.latestVersion) {
    return `Up to date (v${result.currentVersion})`;
  }

  return 'Version status unknown';
}
