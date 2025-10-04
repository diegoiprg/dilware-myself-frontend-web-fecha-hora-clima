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
 * Layout Structure (Portrait):
 * - Row 1: Date (left) and Version/Menu (right)
 * - Row 2: Clock (centered, largest element)
 * - Row 3: Location (centered)
 * - Row 4: Weather (centered)
 *
 * Layout Structure (Landscape):
 * - Row 1: Date (left column) and Version/Menu (right column)
 * - Row 2: Clock (spans full width)
 * - Row 3: Location (left) and Weather (right)
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
      {/* Grid container with responsive layout: 4 rows portrait, 4 rows landscape */}
      <div
        className={`h-full w-full max-w-none mx-auto grid grid-rows-[1fr_1fr_3fr_1fr] landscape:grid-rows-[1fr_1fr_3fr_1fr] landscape:grid-cols-2 place-items-center p-2 sm:p-4 md:p-6 lg:p-8`}
      >
        {/* Row 1: Date (left) and Version+Menu (right) */}
        <div className="flex w-full items-center landscape:grid landscape:grid-cols-2 landscape:gap-4">
          {/* Date - left aligned in portrait, left column in landscape */}
          <div className="flex-1 text-left landscape:col-start-1 landscape:flex landscape:justify-start">
            <DateDisplay date={currentTime} />
          </div>

          {/* Version + Menu - right aligned in portrait, right column in landscape */}
          <div className="flex items-center justify-end gap-2 min-w-0 ml-auto landscape:ml-0 landscape:col-start-2 landscape:justify-end">
            <a
              href="https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl sm:text-3xl text-muted-foreground/50 font-code hover:text-muted-foreground transition-colors whitespace-nowrap"
            >
              {APP_VERSION}
            </a>
            <Header appVersion={APP_VERSION} />
          </div>
        </div>

        {/* Row 2: Clock - spans full width, centered */}
        <div className="w-full h-full flex items-center justify-center landscape:col-span-2 landscape:row-start-2">
          <Clock
            time={currentTime}
            onClick={handleFullscreen}
            isFullscreenSupported={isFullscreenSupported}
          />
        </div>

        {/* Row 3: Location (centered, 100% width) and Weather (50% right) */}
        <div className="flex w-full items-center landscape:col-span-2 landscape:row-start-3">
          {/* Location - centered, 100% width with flexible text */}
          <div className="w-full text-center landscape:flex-1 landscape:justify-center">
            <LocationDisplay displayName={location?.displayName} />
          </div>

          {/* Weather - 50% right, aligned right */}
          {(weather || weatherLoading) && (
            <div className="flex-1 text-right landscape:justify-end">
              <WeatherDisplay
                weather={weather}
                loading={weatherLoading}
                error={weatherError || locationError}
                onRetry={retryWeather}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
