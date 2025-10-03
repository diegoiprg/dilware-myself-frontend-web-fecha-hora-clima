'use client';

import { useRef } from 'react';
import { useDateTime } from '@/hooks/useDateTime';
import { useAppLocation } from '@/hooks/useAppLocation';
import { useWeather } from '@/hooks/useWeather';
import { Clock } from '@/components/app/Clock';
import { LoadingScreen } from '@/components/app/LoadingScreen';
import { SettingsPanel } from '@/components/app/SettingsPanel';
import { DateDisplay } from '@/components/app/DateDisplay';
import { LocationDisplay } from '@/components/app/LocationDisplay';
import { WeatherDisplay } from '@/components/app/WeatherDisplay';

// App version
const APP_VERSION = 'v1.3.8';

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
      className="bg-background text-foreground h-[100svh] w-screen select-none overflow-hidden"
    >
      <div className="h-full w-full max-w-[90%] mx-auto grid grid-rows-[1fr_1fr_3fr_1fr_1fr] landscape:grid-rows-[1fr_3fr_1fr] landscape:grid-cols-2 place-items-center p-4 sm:p-6 md:p-8">
        <div className="w-full flex items-center gap-4 justify-self-end landscape:col-start-2 landscape:row-start-1">
          <SettingsPanel appVersion={APP_VERSION} />
        </div>

        <div className="justify-self-start landscape:col-start-1 landscape:row-start-1 landscape:justify-self-start">
          <DateDisplay date={currentTime} />
        </div>

        <div className="w-full h-full flex items-center justify-center max-w-[90%] landscape:col-span-2 landscape:row-start-2">
          <Clock time={currentTime} onClick={handleFullscreen} />
        </div>

        <div className="landscape:col-start-1 landscape:row-start-3 landscape:justify-self-start landscape:self-end">
          <LocationDisplay displayName={location?.displayName} />
        </div>

        <div className="landscape:col-start-2 landscape:row-start-3 landscape:justify-self-end landscape:self-end">
          <WeatherDisplay
            weather={weather}
            loading={weatherLoading}
            error={weatherError || locationError}
          />
        </div>
      </div>
    </div>
  );
}
