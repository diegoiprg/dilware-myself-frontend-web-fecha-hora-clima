import { Droplets, Sun, Thermometer, Cloud, SunDim, CloudSun, CloudRain, Snowflake, Zap, CloudFog, CloudDrizzle } from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';
import { useSettings } from '@/context/SettingsContext';
import { WeatherSkeleton } from './WeatherSkeleton';

const getWeatherIcon = (weatherCode: number): React.ReactNode => {
  const iconSize = 'size-12 sm:size-14 md:size-16';
  switch (weatherCode) {
    case 0: return <Sun className={iconSize} />;
    case 1: return <SunDim className={iconSize} />;
    case 2: return <CloudSun className={iconSize} />;
    case 3: return <Cloud className={iconSize} />;
    case 45: case 48: return <CloudFog className={iconSize} />;
    case 51: case 53: case 55: return <CloudDrizzle className={iconSize} />;
    case 56: case 57: return <CloudDrizzle className={iconSize} />;
    case 61: case 63: case 65: return <CloudRain className={iconSize} />;
    case 66: case 67: return <CloudRain className={iconSize} />;
    case 71: case 73: case 75: return <Snowflake className={iconSize} />;
    case 77: return <Snowflake className={iconSize} />;
    case 80: case 81: case 82: return <CloudRain className={iconSize} />;
    case 85: case 86: return <Snowflake className={iconSize} />;
    case 95: case 96: case 99: return <Zap className={iconSize} />;
    default: return <Thermometer className={iconSize} />;
  }
};

const formatTemp = (temp: number, unit: 'C' | 'F'): string => {
  if (unit === 'F') {
    return `${Math.round(temp * 1.8 + 32)}°`;
  }
  return `${Math.round(temp)}°`;
};


interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const WeatherDisplay = ({ weather, loading, error }: Props) => {
  const { tempUnit } = useSettings();

  if (loading && !weather) return <WeatherSkeleton error={error} />;
  if (!weather) return <WeatherSkeleton error={error} />;

  const weatherIcon = getWeatherIcon(weather.weatherCode);

  return (
    <div className="w-full landscape:w-auto text-4xl sm:text-5xl md:text-6xl">
      <div className="flex flex-col items-center landscape:items-end gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-3 font-bold">
          {weatherIcon}
          <span>{formatTemp(weather.temperature, tempUnit)}</span>
        </div>
        <div className="flex items-center gap-2 text-lg sm:gap-4 sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground">
          <div className="flex items-center gap-1 sm:gap-2">
            <Thermometer className="size-5 sm:size-6 md:size-7" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-bold">MIN:</span>
            <span>{formatTemp(weather.minTemperature, tempUnit)}</span>
          </div>
          |
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-bold">MAX:</span>
            <span>{formatTemp(weather.maxTemperature, tempUnit)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-lg sm:gap-4 sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground">
          <div className="flex items-center gap-1 sm:gap-2">
            <Droplets className="size-5 sm:size-6 md:size-7" />
            <span className="font-bold">HUM:</span>
            <span>{Math.round(weather.humidity)}%</span>
          </div>
          |
          <div className="flex items-center gap-1 sm:gap-2">
            <Sun className="size-5 sm:size-6 md:size-7" />
            <span className="font-bold">IUV:</span>
            <span>{Math.round(weather.uvIndex)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
