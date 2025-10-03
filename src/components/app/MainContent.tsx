'use client';

import { useRef } from 'react';
import { useDateTime } from '@/hooks/useDateTime';
import { useAppLocation } from '@/hooks/useAppLocation';
import { useWeather } from '@/hooks/useWeather';
import { AppHeader } from '@/components/app/AppHeader';
import { Clock } from '@/components/app/Clock';
import { AppFooter } from '@/components/app/AppFooter';
import { LoadingScreen } from '@/components/app/LoadingScreen';
import { SettingsPanel } from '@/components/app/SettingsPanel';

// App version
const APP_VERSION = 'v1.3.5';

export default function MainContent() {
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

  const handleFullscreen = () => {
    const mainContainer = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mainContainer.requestFullscreen().catch(() => {});
    }
  };

  if (!currentTime || locationLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      ref={containerRef}
      className="bg-background text-foreground h-[100svh] w-screen select-none overflow-hidden
                 flex flex-col p-4 sm:p-6 md:p-8"
      aria-label="Clock and weather display"
      role="button"
      tabIndex={0}
    >
      <SettingsPanel appVersion={APP_VERSION} />
      <AppHeader date={currentTime} />
      <Clock time={currentTime} onClick={handleFullscreen} />
      <AppFooter
        locationDisplayName={location?.displayName}
        weather={weather}
        weatherLoading={weatherLoading}
        weatherError={weatherError}
        locationError={locationError}
      />
    </div>
  );
}
