import { LocationDisplay } from './LocationDisplay';
import { WeatherDisplay } from './WeatherDisplay';
import type { WeatherData } from '@/hooks/useWeather';

interface Props {
  locationDisplayName?: string;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  locationError: string | null;
  appVersion: string;
}

export const AppFooter = ({ locationDisplayName, weather, weatherLoading, weatherError, locationError, appVersion }: Props) => (
  <footer className="w-full flex flex-col landscape:flex-row justify-between items-center gap-4 landscape:gap-8">
    <div className="flex flex-col items-start">
      <LocationDisplay displayName={locationDisplayName} />
      <div className="text-lg text-muted-foreground/50 font-code">
        {appVersion}
      </div>
    </div>
    <WeatherDisplay weather={weather} loading={weatherLoading} error={weatherError || locationError} />
  </footer>
);
