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
  ArrowUp,
  ArrowDown,
  CloudRainWind,
  Leaf,
  Wind,
} from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';
import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { WeatherSkeleton } from './WeatherSkeleton';
import { trackWeatherLocation } from '@/lib/analytics';

/**
 * Returns the appropriate weather icon based on the weather code
 * @param weatherCode - The weather code from the API
 * @param large - Whether to use the large icon size
 * @returns React node with the weather icon
 */
const getWeatherIcon = (
  weatherCode: number,
  large = false
): React.ReactNode => {
  const iconSize = large
    ? 'size-8 sm:size-10 md:size-12 lg:size-14'
    : 'size-4 sm:size-5 md:size-6 lg:size-7';
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

/**
 * Returns the localized weather description based on the weather code
 * @param weatherCode - The weather code from the API
 * @returns String description of the weather condition
 */
const getWeatherDescription = (weatherCode: number): string => {
  switch (weatherCode) {
    case 0:
      return 'Despejado';
    case 1:
      return 'Mayormente despejado';
    case 2:
      return 'Parcialmente nublado';
    case 3:
      return 'Nublado';
    case 45:
    case 48:
      return 'Niebla';
    case 51:
    case 53:
    case 55:
      return 'Llovizna';
    case 56:
    case 57:
      return 'Llovizna helada';
    case 61:
    case 63:
    case 65:
      return 'Lluvia';
    case 66:
    case 67:
      return 'Lluvia helada';
    case 71:
    case 73:
    case 75:
      return 'Nieve';
    case 77:
      return 'Granizo';
    case 80:
    case 81:
    case 82:
      return 'Lluvia intensa';
    case 85:
    case 86:
      return 'Nieve intensa';
    case 95:
    case 96:
    case 99:
      return 'Tormenta';
    default:
      return 'Desconocido';
  }
};

/**
 * Returns air quality description and color based on EPA index
 * @param aqi - Air Quality Index (1-6, EPA scale)
 * @returns Object with description and color
 */
const getAirQualityInfo = (aqi: number) => {
  switch (aqi) {
    case 1:
      return { description: 'Buena', color: 'text-green-500' };
    case 2:
      return { description: 'Moderada', color: 'text-yellow-500' };
    case 3:
      return { description: 'Mala', color: 'text-orange-500' };
    case 4:
      return { description: 'Muy mala', color: 'text-red-500' };
    case 5:
      return { description: 'Severa', color: 'text-purple-500' };
    case 6:
      return { description: 'Peligrosa', color: 'text-red-700' };
    default:
      return { description: 'Desconocida', color: 'text-gray-500' };
  }
};

/**
 * Returns UV index description and color based on UV value
 * @param uvIndex - UV Index value
 * @returns Object with description and color
 */
const getUVIndexInfo = (uvIndex: number) => {
  if (uvIndex <= 2) {
    return { description: 'Bajo', color: 'text-green-500' };
  } else if (uvIndex <= 5) {
    return { description: 'Moderado', color: 'text-yellow-500' };
  } else if (uvIndex <= 7) {
    return { description: 'Alto', color: 'text-orange-500' };
  } else if (uvIndex <= 10) {
    return { description: 'Muy alto', color: 'text-red-500' };
  } else {
    return { description: 'Extremo', color: 'text-purple-500' };
  }
};

/**
 * Formats temperature value with the specified unit
 * @param temp - Temperature value in Celsius
 * @param unit - Temperature unit ('C' or 'F')
 * @returns Formatted temperature string with degree symbol and unit
 */
const formatTemp = (temp: number, unit: 'C' | 'F'): string => {
  if (unit === 'F') {
    return `${Math.round(temp * 1.8 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

/**
 * WeatherDisplay component - Shows current weather information
 * Displays weather description, icon, temperature, and additional metrics
 * @param weather - Current weather data
 * @param loading - Whether weather data is loading
 * @param error - Error message if weather fetch failed
 */
export const WeatherDisplay = ({ weather, loading, error, onRetry }: Props) => {
  const { tempUnit } = useSettings();

  // Track successful weather data load
  useEffect(() => {
    if (weather && !loading && !error) {
      trackWeatherLocation.weatherDataLoad(true);
    }
  }, [weather, loading, error]);

  if (loading && !weather)
    return <WeatherSkeleton error={error} onRetry={onRetry} />;
  if (!weather) return <WeatherSkeleton error={error} onRetry={onRetry} />;

  const weatherIcon = getWeatherIcon(weather.weatherCode, true);
  const smallWeatherIcon = getWeatherIcon(weather.weatherCode);

  return (
    <div className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl overflow-hidden">
      <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 text-center">
        {/* Line 1: Weather description + icon + temperature */}
        <div className="flex items-center justify-center gap-3 font-bold">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {getWeatherDescription(weather.weatherCode)}
          </span>
          <div className="bg-white/20 dark:bg-transparent rounded-full p-1 dark:p-0">
            {weatherIcon}
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {formatTemp(weather.temperature, tempUnit)}
          </span>
        </div>

        {/* Line 2: MIN, MAX */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <ArrowDown className="size-4 sm:size-5 md:size-6 lg:size-7" />
            <span className="text-lg sm:text-xl md:text-2xl">
              {formatTemp(weather.minTemperature, tempUnit)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUp className="size-4 sm:size-5 md:size-6 lg:size-7" />
            <span className="text-lg sm:text-xl md:text-2xl">
              {formatTemp(weather.maxTemperature, tempUnit)}
            </span>
          </div>
        </div>

        {/* Line 2.5: humidity, precipitation */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <Droplets className="size-4 sm:size-5 md:size-6 lg:size-7" />
            <span className="text-lg sm:text-xl md:text-2xl">
              {Math.round(weather.humidity)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CloudRainWind className="size-4 sm:size-5 md:size-6 lg:size-7" />
            <span className="text-lg sm:text-xl md:text-2xl">
              {Math.round(weather.rainProbability)}%
            </span>
          </div>
        </div>

        {/* Line 3: UV index and air quality */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <Sun
              className={`size-4 sm:size-5 md:size-6 lg:size-7 ${
                getUVIndexInfo(weather.uvIndex).color
              }`}
            />
            <span
              className={`text-lg sm:text-xl md:text-2xl ${
                getUVIndexInfo(weather.uvIndex).color
              }`}
            >
              UV {Math.round(weather.uvIndex)} -{' '}
              {getUVIndexInfo(weather.uvIndex).description.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Leaf
              className={`size-4 sm:size-5 md:size-6 lg:size-7 ${
                getAirQualityInfo(weather.airQuality).color
              }`}
            />
            <span
              className={`text-lg sm:text-xl md:text-2xl ${
                getAirQualityInfo(weather.airQuality).color
              }`}
            >
              {getAirQualityInfo(weather.airQuality).description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
