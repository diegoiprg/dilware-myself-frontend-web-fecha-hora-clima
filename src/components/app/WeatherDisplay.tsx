import {
  Droplets,
  Sun,
  Thermometer,
  Cloud,
  SunDim,
  CloudSun,
  CloudRain,
  Snowflake,
  Zap,
  CloudFog,
  CloudDrizzle,
} from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';
import { useSettings } from '@/context/SettingsContext';
import { WeatherSkeleton } from './WeatherSkeleton';

const getWeatherIcon = (weatherCode: number): React.ReactNode => {
  const iconSize = 'size-12 sm:size-14 md:size-16';
  switch (weatherCode) {
    case 0:
      return <Sun className={iconSize} />;
    case 1:
      return <SunDim className={iconSize} />;
    case 2:
      return <CloudSun className={iconSize} />;
    case 3:
      return <Cloud className={iconSize} />;
    case 45:
    case 48:
      return <CloudFog className={iconSize} />;
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle className={iconSize} />;
    case 56:
    case 57:
      return <CloudDrizzle className={iconSize} />;
    case 61:
    case 63:
    case 65:
      return <CloudRain className={iconSize} />;
    case 66:
    case 67:
      return <CloudRain className={iconSize} />;
    case 71:
    case 73:
    case 75:
      return <Snowflake className={iconSize} />;
    case 77:
      return <Snowflake className={iconSize} />;
    case 80:
    case 81:
    case 82:
      return <CloudRain className={iconSize} />;
    case 85:
    case 86:
      return <Snowflake className={iconSize} />;
    case 95:
    case 96:
    case 99:
      return <Zap className={iconSize} />;
    default:
      return <Thermometer className={iconSize} />;
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
    <div className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl overflow-hidden">
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 font-bold">
          <div className="bg-white/20 rounded-full p-2">{weatherIcon}</div>
          <span>{formatTemp(weather.temperature, tempUnit)}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gray-100/50 rounded-full px-3 py-1 flex items-center gap-1">
            <div className="bg-white/20 rounded-full p-1">
              <Thermometer className="size-4 sm:size-5 md:size-6 lg:size-7" />
            </div>
            <span className="font-bold text-sm">MIN</span>
            <span>{formatTemp(weather.minTemperature, tempUnit)}</span>
          </div>
          <div className="bg-gray-100/50 rounded-full px-3 py-1 flex items-center gap-1">
            <div className="bg-white/20 rounded-full p-1">
              <Thermometer className="size-4 sm:size-5 md:size-6 lg:size-7" />
            </div>
            <span className="font-bold text-sm">MAX</span>
            <span>{formatTemp(weather.maxTemperature, tempUnit)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-blue-100/50 rounded-full px-3 py-1 flex items-center gap-1">
            <div className="bg-white/20 rounded-full p-1">
              <Droplets className="size-4 sm:size-5 md:size-6 lg:size-7" />
            </div>
            <span className="font-bold text-sm">HUM</span>
            <span>{Math.round(weather.humidity)}%</span>
          </div>
          <div className="bg-yellow-100/50 rounded-full px-3 py-1 flex items-center gap-1">
            <div className="bg-white/20 rounded-full p-1">
              <Sun className="size-4 sm:size-5 md:size-6 lg:size-7" />
            </div>
            <span className="font-bold text-sm">IUV</span>
            <span>{Math.round(weather.uvIndex)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
