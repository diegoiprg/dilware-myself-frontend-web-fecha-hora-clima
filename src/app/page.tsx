'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
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

// App version
const APP_VERSION = 'v1.2.3';

// Spanish month abbreviations
const MONTHS_ES = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];

/**
 * Formats a Date object into a string like 'Jueves, 02 OCT 2025'.
 * @param date The date to format.
 * @returns The formatted date string.
 */
const formatDate = (date: Date): string => {
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    date
  );
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAbbr = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();

  return `${capitalizedDayName}, ${day} ${monthAbbr} ${year}`;
};

/**
 * Formats a Date object into a 24-hour time string 'HH:mm:ss'.
 * @param date The date to format.
 * @returns The formatted time string.
 */
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const getWeatherIcon = (weatherCode: number): React.ReactNode => {
  const iconSize = 'size-12 sm:size-14 md:size-16';
  switch (weatherCode) {
    case 0:
      return <Sun className={iconSize} />; // Clear sky
    case 1:
      return <SunDim className={iconSize} />; // Mainly clear
    case 2:
      return <CloudSun className={iconSize} />; // Partly cloudy
    case 3:
      return <Cloud className={iconSize} />; // Overcast
    case 45:
    case 48:
      return <CloudFog className={iconSize} />; // Fog
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle className={iconSize} />; // Drizzle
    case 56:
    case 57:
      return <CloudDrizzle className={iconSize} />; // Freezing Drizzle
    case 61:
    case 63:
    case 65:
      return <CloudRain className={iconSize} />; // Rain
    case 66:
    case 67:
      return <CloudRain className={iconSize} />; // Freezing Rain
    case 71:
    case 73:
    case 75:
      return <Snowflake className={iconSize} />; // Snow fall
    case 77:
      return <Snowflake className={iconSize} />; // Snow grains
    case 80:
    case 81:
    case 82:
      return <CloudRain className={iconSize} />; // Rain showers
    case 85:
    case 86:
      return <Snowflake className={iconSize} />; // Snow showers
    case 95:
    case 96:
    case 99:
      return <Zap className={iconSize} />; // Thunderstorm
    default:
      return <Thermometer className={iconSize} />;
  }
};

type Weather = {
  temperature: string;
  minTemperature: string;
  maxTemperature: string;
  humidity: string;
  uvIndex: string;
  weatherCode: number;
};

export default function ChronosViewPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        if (!response.ok) throw new Error('Weather response not OK');
        const data = await response.json();

        if (data?.current && data?.daily) {
          setWeather({
            temperature: `${Math.round(data.current.temperature_2m)}°C`,
            minTemperature: `${Math.round(data.daily.temperature_2m_min[0])}°`,
            maxTemperature: `${Math.round(data.daily.temperature_2m_max[0])}°`,
            humidity: `${data.current.relative_humidity_2m}%`,
            uvIndex: `${Math.round(data.current.uv_index)}`,
            weatherCode: data.current.weather_code,
          });
        } else {
          setError('Temp. N/A');
        }
      } catch {
        setError('Temp. N/A');
      }
    };

    const fetchLocationName = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
        );
        if (!response.ok) throw new Error('Reverse geocode response not OK');
        const data = await response.json();

        if (data) {
          const parts: { [key: string]: string } = {};

          // Street or most specific administrative level
          const street = data.localityInfo?.informative?.find(
            (i: any) => i.description === 'street'
          )?.name;
          if (street) parts.street = street;

          // Locality / Neighbourhood / District
          if (data.locality) parts.locality = data.locality;

          // City
          if (data.city) parts.city = data.city;

          // Province / State
          if (data.principalSubdivision)
            parts.subdivision = data.principalSubdivision;

          // Country
          if (data.countryName) parts.country = data.countryName;

          // Construct the final string with unique parts
          const finalParts = [
            parts.street,
            parts.locality,
            parts.city,
            parts.subdivision,
            parts.country,
          ].filter(
            (value, index, self) => value && self.indexOf(value) === index
          );

          if (finalParts.length > 0) {
            setLocation(finalParts.join(', '));
          } else {
            throw new Error('No location parts found after processing');
          }
        } else {
          throw new Error('No location name data in response');
        }
      } catch {
        // Fallback to ipapi.co if the primary service fails
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) throw new Error('IP API response not OK');
          const data = await response.json();
          const locationParts = [
            data.city,
            data.region,
            data.country_name,
          ].filter(Boolean);
          setLocation(locationParts.join(', ') || 'Ubicación desconocida');
        } catch {
          setLocation('Ubicación desconocida');
        }
      }
    };

    const fetchFromIp = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP API response not OK');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          fetchWeather(data.latitude, data.longitude);
          fetchLocationName(data.latitude, data.longitude);
        } else {
          setError('Location N/A');
          setLocation('Ubicación desconocida');
        }
      } catch {
        setError('Location N/A');
        setLocation('Ubicación desconocida');
      }
    };

    const getLocationAndFetchData = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
            fetchLocationName(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          fetchFromIp,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      } else {
        fetchFromIp();
      }
    };

    if (typeof window !== 'undefined') {
      getLocationAndFetchData();
    }
  }, []);

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

  if (!currentTime) {
    return (
      <main className="bg-background text-foreground h-[100svh] w-screen flex items-center justify-center">
        <div className="font-headline text-2xl animate-pulse">Loading...</div>
      </main>
    );
  }

  const formattedDate = formatDate(currentTime);
  const formattedTime = formatTime(currentTime);
  const weatherIcon = weather ? getWeatherIcon(weather.weatherCode) : null;

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
      <header className="w-full flex justify-center landscape:justify-start">
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex items-center gap-3">
          <CalendarDays className="size-8 sm:size-10 md:size-12 lg:size-14" />
          <span className="pt-1">{formattedDate}</span>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="font-headline font-bold text-center text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem] 2xl:text-[18rem] leading-none whitespace-nowrap">
          {formattedTime}
        </div>
      </main>

      <footer className="w-full flex flex-col landscape:flex-row justify-between items-center gap-4 landscape:gap-8">
        <div className="w-full landscape:w-1/2 flex items-center justify-center landscape:justify-start">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground text-center landscape:text-left">
            {location || '...'}
          </div>
        </div>

        <div className="w-full landscape:w-auto text-4xl sm:text-5xl md:text-6xl">
          {weather ? (
            <div className="flex flex-col items-center landscape:items-end gap-2 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-3 font-bold">
                {weatherIcon}
                <span>{weather.temperature}</span>
              </div>
              <div className="flex items-center gap-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-6 sm:size-7 md:size-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">MIN:</span>
                  <span>{weather.minTemperature}</span>
                </div>
                |
                <div className="flex items-center gap-2">
                  <span className="font-bold">MAX:</span>
                  <span>{weather.maxTemperature}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Droplets className="size-6 sm:size-7 md:size-8" />
                  <span className="font-bold">HUM:</span>
                  <span>{weather.humidity}</span>
                </div>
                |
                <div className="flex items-center gap-2">
                  <Sun className="size-6 sm:size-7 md:size-8" />
                  <span className="font-bold">IUV:</span>
                  <span>{weather.uvIndex}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse text-center landscape:text-right">
              {error || 'Cargando clima...'}
            </div>
          )}
        </div>
      </footer>
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground/50 font-code">
        {APP_VERSION}
      </div>
    </div>
  );
}
