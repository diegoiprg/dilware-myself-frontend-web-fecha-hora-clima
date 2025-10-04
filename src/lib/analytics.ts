/**
 * Google Analytics 4 tracking utilities
 */

// GA4 Measurement ID - Replace with your actual GA4 ID
const GA_MEASUREMENT_ID = 'G-FF81FMV5GT';

/**
 * Check if GA is available
 */
export const isGAReady = (): boolean => {
  return typeof window !== 'undefined' && window.gtag !== undefined;
};

/**
 * Send GA4 event
 */
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
): void => {
  if (!isGAReady()) return;

  window.gtag('event', eventName, {
    ...parameters,
    app_version: 'v1.7.1',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Set custom dimensions
 */
export const setCustomDimensions = (dimensions: Record<string, any>): void => {
  if (!isGAReady()) return;

  Object.entries(dimensions).forEach(([key, value]) => {
    window.gtag('config', GA_MEASUREMENT_ID, {
      [key]: value,
    });
  });
};

/**
 * Track page view
 */
export const trackPageView = (pagePath: string): void => {
  if (!isGAReady()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
  });
};

/**
 * Track user interactions
 */
export const trackUserInteraction = {
  fullscreenToggle: (action: 'enter' | 'exit') =>
    trackEvent('fullscreen_toggle', { action }),

  settingsPanelOpen: () => trackEvent('settings_panel_open'),

  temperatureUnitChange: (unit: 'C' | 'F') =>
    trackEvent('temperature_unit_change', { unit }),

  timeFormatChange: (format: '12h' | '24h') =>
    trackEvent('time_format_change', { format }),

  secondsToggle: (enabled: boolean) =>
    trackEvent('seconds_toggle', { enabled }),

  refreshIntervalChange: (interval: number) =>
    trackEvent('refresh_interval_change', { interval_minutes: interval }),
};

/**
 * Track weather and location events
 */
export const trackWeatherLocation = {
  weatherDataLoad: (success: boolean) =>
    trackEvent('weather_data_load', { success }),

  weatherError: (errorType: string) =>
    trackEvent('weather_error', { error_type: errorType }),

  locationGeolocationSuccess: () => trackEvent('location_geolocation_success'),

  locationIPFallback: () => trackEvent('location_ip_fallback'),

  locationError: (errorType: string) =>
    trackEvent('location_error', { error_type: errorType }),
};

/**
 * Track app usage events
 */
export const trackAppUsage = {
  appVersionView: () => trackEvent('app_version_view'),

  orientationChange: (orientation: 'portrait' | 'landscape') =>
    trackEvent('orientation_change', { orientation }),

  deviceType: (type: 'mobile' | 'tablet' | 'desktop') =>
    trackEvent('device_type', { device_type: type }),
};

/**
 * Track errors
 */
export const trackError = (error: Error, context: string): void => {
  trackEvent('javascript_error', {
    error_message: error.message,
    error_stack: error.stack,
    context,
  });
};

/**
 * Initialize GA with custom dimensions
 */
export const initializeAnalytics = (): void => {
  if (!isGAReady()) return;

  // Set initial custom dimensions
  const dimensions = {
    app_version: 'v1.8.0',
    device_category: getDeviceCategory(),
    orientation:
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
  };

  setCustomDimensions(dimensions);

  // Track device type
  trackAppUsage.deviceType(getDeviceCategory());
};

/**
 * Get device category
 */
const getDeviceCategory = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
