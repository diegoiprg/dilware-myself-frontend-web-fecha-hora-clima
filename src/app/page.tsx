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
  switch (weatherCode) {
    case 0:
      return <Sun className="size-12 sm:size-14 md:size-16" />; // Clear sky
    case 1:
      return <SunDim className="size-12 sm:size-14 md:size-16" />; // Mainly clear
    case 2:
      return <CloudSun className="size-12 sm:size-14 md:size-16" />; // Partly cloudy
    case 3:
      return <Cloud className="size-12 sm:size-14 md:size-16" />; // Overcast
    case 45:
    case 48:
      return <CloudFog className="size-12 sm:size-14 md:size-16" />; // Fog
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle className="size-12 sm:size-14 md:size-16" />; // Drizzle
    case 56:
    case 57:
      return <CloudDrizzle className="size-12 sm:size-14 md:size-16" />; // Freezing Drizzle
    case 61:
    case 63:
    case 65:
      return <CloudRain className="size-12 sm:size-14 md:size-16" />; // Rain
    case 66:
    case 67:
      return <CloudRain className="size-12 sm:size-14 md:size-16" />; // Freezing Rain
    case 71:
    case 73:
    case 75:
      return <Snowflake className="size-12 sm:size-14 md:size-16" />; // Snow fall
    case 77:
      return <Snowflake className="size-12 sm:size-14 md:size-16" />; // Snow grains
    case 80:
    case 81:
    case 82:
      return <CloudRain className="size-12 sm:size-14 md:size-16" />; // Rain showers
    case 85:
    case 86:
      return <Snowflake className="size-12 sm:size-14 md:size-16" />; // Snow showers
    case 95:
    case 96:
    case 99:
      return <Zap className="size-12 sm:size-14 md:size-16" />; // Thunderstorm
    default:
      return <Thermometer className="size-12 sm:size-14 md:size-16" />;
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

// Helper for making network requests with XMLHttpRequest for older browser compatibility
const makeRequest = (
  url: string,
  onSuccess: (data: any) => void,
  onError: () => void
) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          onSuccess(data);
        } catch (e) {
          onError();
        }
      } else {
        onError();
      }
    }
  };
  xhr.onerror = function () {
    onError();
  };
  xhr.send();
};

export default function ChronosViewPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Screen Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Screen Wake Lock is active.');
          wakeLockRef.current.addEventListener('release', () => {
            console.log('Screen Wake Lock was released.');
          });
        } catch (err: any) {
          console.error(`${err.name}, ${err.message}`);
        }
      } else {
        console.warn('Screen Wake Lock API not supported.');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      makeRequest(
        url,
        (data) => {
          if (data && data.current && data.daily) {
            setWeather({
              temperature: `${Math.round(data.current.temperature_2m)}°C`,
              minTemperature: `${Math.round(
                data.daily.temperature_2m_min[0]
              )}°`,
              maxTemperature: `${Math.round(
                data.daily.temperature_2m_max[0]
              )}°`,
              humidity: `${data.current.relative_humidity_2m}%`,
              uvIndex: `${Math.round(data.current.uv_index)}`,
              weatherCode: data.current.weather_code,
            });
          } else {
            setError('Temp. N/A');
          }
        },
        () => setError('Temp. N/A')
      );
    };

    const fetchLocationName = (
      lat: number,
      lon: number,
      fallback: () => void
    ) => {
      const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;
      makeRequest(
        url,
        (data) => {
          const locationParts = [
            data.results?.[0]?.admin3,
            data.results?.[0]?.admin2,
            data.results?.[0]?.country,
          ].filter(Boolean);

          if (locationParts.length > 0) {
            setLocation(locationParts.join(', '));
            fetchWeather(lat, lon); // Fetch weather after getting location name
          } else {
            fallback(); // Fallback if reverse geocoding gives no results
          }
        },
        fallback
      );
    };

    const fetchFromIp = () => {
      const url = 'https://ipapi.co/json/';
      makeRequest(
        url,
        (data) => {
          if (data.latitude && data.longitude) {
            fetchWeather(data.latitude, data.longitude);
            const locationParts = [
              data.city,
              data.region,
              data.country_name,
            ].filter(Boolean);
            setLocation(locationParts.join(', ') || 'Ubicación desconocida');
          } else {
            setError('Location N/A');
            setLocation('Ubicación desconocida');
          }
        },
        () => {
          setError('Location N/A');
          setLocation('Ubicación desconocida');
        }
      );
    };

    const getLocationAndFetchData = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchLocationName(
              position.coords.latitude,
              position.coords.longitude,
              fetchFromIp
            );
          },
          fetchFromIp,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        fetchFromIp();
      }
    };

    if (typeof window !== 'undefined') {
      getLocationAndFetchData();
    }
  }, []);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIos) {
      // iOS doesn't support true fullscreen from a web app.
      // We scroll to the top to hide the address bar as much as possible.
      window.scrollTo(0, 0);
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
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
    <main
      ref={containerRef}
      onClick={handleFullscreen}
      className="bg-background text-foreground h-[100svh] w-screen cursor-pointer select-none overflow-hidden
                 flex flex-col items-center justify-between p-4 sm:p-6 md:p-8"
      aria-label="Clock and weather display. Click to toggle fullscreen."
      role="button"
      tabIndex={0}
    >
      <div className="w-full text-center landscape:text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl flex items-center justify-center landscape:justify-start gap-2">
        <CalendarDays className="inline-block size-6 sm:size-7 md:size-8 lg:size-9" />
        <span className="pt-1">{formattedDate}</span>
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="font-headline font-bold text-center text-[18vw] leading-none sm:text-[15vw] landscape:text-[25vh] whitespace-nowrap w-[95%]">
          {formattedTime}
        </div>
      </div>

      <div className="w-full flex flex-col-reverse landscape:flex-row justify-between items-center gap-4 landscape:gap-8">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground w-full landscape:w-auto text-center landscape:text-left flex-shrink-0 landscape:flex-1">
          {location ? (
            <span>{location}</span>
          ) : (
            <div className="animate-pulse w-full h-8 bg-muted rounded-md" />
          )}
        </div>

        <div className="w-full landscape:w-auto text-3xl sm:text-4xl md:text-5xl landscape:flex-none">
          {weather ? (
            <div className="flex flex-col items-center landscape:items-end gap-2 sm:gap-3">
              <div className="flex items-center gap-3 font-bold">
                {weatherIcon}
                <span>{weather.temperature}</span>
              </div>
              <div className="flex items-center justify-center landscape:justify-end gap-3 text-lg sm:text-xl md:text-2xl text-muted-foreground w-full">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-5 sm:size-6 md:size-7" />
                  <span>{weather.minTemperature}</span>
                  <span className="mx-1">|</span>
                  <span>{weather.maxTemperature}</span>
                </div>
              </div>
              <div className="flex items-center justify-center landscape:justify-end gap-3 text-lg sm:text-xl md:text-2xl text-muted-foreground w-full">
                <div className="flex items-center gap-2">
                  <Droplets className="size-5 sm:size-6 md:size-7" />
                  <span>{weather.humidity}</span>
                </div>
                <span className="mx-1">|</span>
                <div className="flex items-center gap-2">
                  <Sun className="size-5 sm:size-6 md:size-7" />
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
      </div>
    </main>
  );
}
