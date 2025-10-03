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
 * - Row 1: Settings panel (top right)
 * - Row 2: Date display (left aligned)
 * - Row 3: Clock (centered, largest element)
 * - Row 4: Location display (centered)
 * - Row 5: Weather display (centered)
 *
 * Layout Structure (Landscape):
 * - Row 1: Date (left) and Settings (right)
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
import { SettingsPanel } from '@/components/app/SettingsPanel';
import { DateDisplay } from '@/components/app/DateDisplay';
import { LocationDisplay } from '@/components/app/LocationDisplay';
import { WeatherDisplay } from '@/components/app/WeatherDisplay';

// App version - displayed in the settings panel
const APP_VERSION = 'v1.6.7';

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
    } else {
      // Enter fullscreen mode - wake lock will be requested via the useEffect
      mainContainer.requestFullscreen().catch(() => {});
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
      {/* Grid container with responsive layout: 5 rows portrait, 3 rows landscape */}
      <div
        className={`h-full w-full max-w-none mx-auto grid ${
          weather || weatherLoading
            ? 'grid-rows-[1fr_1fr_3fr_1fr_1fr]'
            : 'grid-rows-[1fr_1fr_3fr_2fr]'
        } landscape:grid-rows-[1fr_3fr_1fr] landscape:grid-cols-2 place-items-center p-2 sm:p-4 md:p-6 lg:p-8`}
      >
        <div className="flex items-center gap-4 justify-self-center landscape:col-start-2 landscape:row-start-1 landscape:justify-self-end">
          <SettingsPanel appVersion={APP_VERSION} />
        </div>

        <div className="justify-self-center landscape:col-start-1 landscape:row-start-1 landscape:justify-self-start">
          <DateDisplay date={currentTime} />
        </div>

        <div className="w-full h-full flex items-center justify-center max-w-[90%] landscape:col-span-2 landscape:row-start-2">
          <Clock
            time={currentTime}
            onClick={handleFullscreen}
            isFullscreenSupported={isFullscreenSupported}
          />
        </div>

        <div
          className={`landscape:col-start-1 landscape:row-start-3 landscape:self-end ${
            !(weather || weatherLoading)
              ? 'landscape:col-span-2 landscape:justify-self-center'
              : 'landscape:justify-self-start'
          }`}
        >
          <LocationDisplay displayName={location?.displayName} />
        </div>

        {(weather || weatherLoading) && (
          <div className="justify-self-center landscape:col-start-2 landscape:row-start-3 landscape:justify-self-end landscape:self-end">
            <WeatherDisplay
              weather={weather}
              loading={weatherLoading}
              error={weatherError || locationError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
