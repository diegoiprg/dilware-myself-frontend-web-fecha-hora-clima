'use client';

import { useRef, useEffect } from 'react';
import { useDateTime } from '@/hooks/useDateTime';
import { useAppLocation } from '@/hooks/useAppLocation';
import { useWeather } from '@/hooks/useWeather';
import { AppHeader } from '@/components/app/AppHeader';
import { Clock } from '@/components/app/Clock';
import { AppFooter } from '@/components/app/AppFooter';
import { LoadingScreen } from '@/components/app/LoadingScreen';
import { SettingsPanel } from '@/components/app/SettingsPanel';

// App version
const APP_VERSION = 'v1.3.1';

export default function ChronosViewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTime = useDateTime();
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

  // Screen Wake Lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error(`Wake Lock failed: ${err}`);
        }
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!currentTime || locationLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      ref={containerRef}
      onClick={handleFullscreen}
      className="bg-background text-foreground h-[100svh] w-screen cursor-pointer select-none overflow-hidden
                 flex flex-col p-4 sm:p-6 md:p-8"
      aria-label="Clock and weather display. Click to toggle fullscreen."
      role="button"
      tabIndex={0}
    >
      <SettingsPanel />
      <AppHeader date={currentTime} />
      <Clock time={currentTime} />
      <AppFooter
        locationDisplayName={location?.displayName}
        weather={weather}
        weatherLoading={weatherLoading}
        weatherError={weatherError}
        locationError={locationError}
      />
      <div className="absolute bottom-4 left-4 text-base text-muted-foreground/50 font-code">
        {APP_VERSION}
      </div>
    </div>
  );
}
