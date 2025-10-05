/**
 * MainContent Component
 *
 * This is the main component of the Personal Dashboard application.
 * It renders a full-screen layout displaying the current time, date, location, and weather.
 * The layout adapts between portrait and landscape orientations using CSS Grid.
 *
 * Key Features:
 * - Responsive grid layout with 5 rows in portrait, 3 rows in landscape
 * - Fullscreen mode with screen wake lock to prevent screen timeout
 * - Real-time updates for time, location, and weather data
 * - Settings panel for user customization
 *
 * Layout Structure (Vertical division into 1/4, 2/4, 1/4):
 * - Top section (1/4): Menu (line 1) and Date (line 2)
 * - Middle section (2/4): Clock (large text filling space)
 * - Bottom section (1/4): Location and Weather (side by side in landscape)
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { useDateTime } from '@/hooks/useDateTime';
import { useAppLocation } from '@/hooks/useAppLocation';
import { useWeather } from '@/hooks/useWeather';
import { Clock } from '@/components/app/Clock';
import { LoadingScreen } from '@/components/app/LoadingScreen';
import { Header } from '@/components/app/Header';
import { DateDisplay } from '@/components/app/DateDisplay';
import { LocationDisplay } from '@/components/app/LocationDisplay';
import { WeatherDisplay } from '@/components/app/WeatherDisplay';
import { APP_VERSION } from '@/lib/version';
import {
  trackUserInteraction,
  trackWeatherLocation,
  trackAppUsage,
} from '@/lib/analytics';

/**
 * MainContent - The root component for the dashboard
 *
 * Manages the overall layout and state for the application, including:
 * - Time and date display
 * - Location and weather data
 * - Fullscreen mode with wake lock
 * - Settings panel
 */
export default function MainContent() {
  // Reference to the main container for potential DOM manipulation
  const containerRef = useRef<HTMLDivElement>(null);

  // State for managing screen wake lock in fullscreen mode
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  // Check for API support
  const isFullscreenSupported =
    typeof document !== 'undefined' && !!document.fullscreenEnabled;
  const isWakeLockSupported =
    typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  // Custom hooks for data fetching
  const currentTime = useDateTime();

  // Effect to manage screen wake lock during fullscreen mode
  // Only active if Wake Lock API is supported
  useEffect(() => {
    if (!isWakeLockSupported) return;

    const handleFullscreenChange = async () => {
      if (document.fullscreenElement) {
        // Entered fullscreen, request wake lock to keep screen on
        try {
          const wl = await navigator.wakeLock.request('screen');
          setWakeLock(wl);
        } catch (err) {
          console.error('Wake lock request failed', err);
        }
      } else {
        // Exited fullscreen, release wake lock
        if (wakeLock) {
          wakeLock.release();
          setWakeLock(null);
        }
      }
    };

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup: remove listener and release wake lock on unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock, isWakeLockSupported]);
  const {
    location,
    error: locationError,
    loading: locationLoading,
  } = useAppLocation();
  const {
    weather,
    error: weatherError,
    loading: weatherLoading,
    retry: retryWeather,
  } = useWeather(location?.latitude, location?.longitude);

  /**
   * Toggles fullscreen mode for the application
   * Only works if Fullscreen API is supported
   * When entering fullscreen, the wake lock effect will automatically engage if supported
   */
  const handleFullscreen = () => {
    if (!isFullscreenSupported) return;

    const mainContainer = document.documentElement;
    if (document.fullscreenElement) {
      // Exit fullscreen mode
      document.exitFullscreen();
      trackUserInteraction.fullscreenToggle('exit');
    } else {
      // Enter fullscreen mode - wake lock will be requested via the useEffect
      mainContainer.requestFullscreen().catch(() => {});
      trackUserInteraction.fullscreenToggle('enter');
    }
  };

  // Show loading screen while initial data is being fetched
  if (!currentTime || locationLoading) {
    return <LoadingScreen />;
  }

  return (
    // Main container with fullscreen dimensions and background
    <div
      ref={containerRef}
      className="bg-background text-foreground h-screen w-screen select-none overflow-hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]"
    >
      {/* Layout divided vertically into 1/4, 2/4, 1/4 */}
      <div className="h-full w-full flex flex-col">
        {/* Top section - 1/4 height: Menu and Date */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex items-center justify-center">
            <Header appVersion={APP_VERSION} />
          </div>
          <div className="flex items-center justify-center">
            <DateDisplay date={currentTime} />
          </div>
        </div>

        {/* Middle section - 2/4 height: Clock */}
        <div className="flex-[2] flex items-center justify-center">
          <Clock
            time={currentTime}
            onClick={handleFullscreen}
            isFullscreenSupported={isFullscreenSupported}
          />
        </div>

        {/* Bottom section - 1/4 height: Location and Weather */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex items-center justify-center gap-4 landscape:flex-row">
            <LocationDisplay displayName={location?.displayName} />
            {(weather || weatherLoading) && (
              <WeatherDisplay
                weather={weather}
                loading={weatherLoading}
                error={weatherError || locationError}
                onRetry={retryWeather}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
