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

const APP_VERSION = 'v1.0.0';

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
      return <Sun className="size-8 sm:size-10 md:size-12" />; // Clear sky
    case 1:
      return <SunDim className="size-8 sm:size-10 md:size-12" />; // Mainly clear
    case 2:
      return <CloudSun className="size-8 sm:size-10 md:size-12" />; // Partly cloudy
    case 3:
      return <Cloud className="size-8 sm:size-10 md:size-12" />; // Overcast
    case 45:
    case 48:
      return <CloudFog className="size-8 sm:size-10 md:size-12" />; // Fog
    case 51:
    case 53:
    case 55:
      return <CloudDrizzle className="size-8 sm:size-10 md:size-12" />; // Drizzle
    case 56:
    case 57:
      return <CloudDrizzle className="size-8 sm:size-10 md:size-12" />; // Freezing Drizzle
    case 61:
    case 63:
    case 65:
      return <CloudRain className="size-8 sm:size-10 md:size-12" />; // Rain
    case 66:
    case 67:
      return <CloudRain className="size-8 sm:size-10 md:size-12" />; // Freezing Rain
    case 71:
    case 73:
    case 75:
      return <Snowflake className="size-8 sm:size-10 md:size-12" />; // Snow fall
    case 77:
      return <Snowflake className="size-8 sm:size-10 md:size-12" />; // Snow grains
    case 80:
    case 81:
    case 82:
      return <CloudRain className="size-8 sm:size-10 md:size-12" />; // Rain showers
    case 85:
    case 86:
      return <Snowflake className="size-8 sm:size-10 md:size-12" />; // Snow showers
    case 95:
    case 96:
    case 99:
      return <Zap className="size-8 sm:size-10 md:size-12" />; // Thunderstorm
    default:
      return <Thermometer className="size-8 sm:size-10 md:size-12" />;
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

// Helper for making network requests. Uses fetch if available, otherwise falls back to XMLHttpRequest.
const makeRequest = (
  url: string,
  onSuccess: (data: any) => void,
  onError: () => void
) => {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    // Modern browsers: use fetch
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => onSuccess(data))
      .catch(() => onError());
  } else {
    // Older browsers: use XMLHttpRequest
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
  }
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
      if (
        wakeLockRef.current !== null &&
        document.visibilityState === 'visible'
      ) {
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
    const fetchWeatherData = (lat: number, lon: number) => {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      makeRequest(
        weatherUrl,
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

      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;
      makeRequest(
        geocodeUrl,
        (data) => {
          if (data && data.results && data.results[0]) {
            const result = data.results[0];
            const locationParts = [
              result.admin3,
              result.admin2,
              result.country,
            ].filter(Boolean);
            setLocation(
              locationParts.length > 0
                ? locationParts.join(', ')
                : 'Ubicación desconocida'
            );
          } else {
            setLocation('Ubicación desconocida');
          }
        },
        () => setLocation('Ubicación desconocida')
      );
    };

    const fetchFromIp = () => {
      const url = 'https://ipapi.co/json/';
      makeRequest(
        url,
        (data) => {
          if (data.latitude && data.longitude) {
            fetchWeatherData(data.latitude, data.longitude);
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

    const getLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.warn(`Geolocation error (${error.code}): ${error.message}`);
            fetchFromIp();
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        fetchFromIp();
      }
    };

    if (typeof window !== 'undefined') {
      getLocation();
    }
  }, []);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIphone =
      /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIphone) {
      // iOS on iPhone doesn't support true fullscreen from a web app.
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
      <div className="w-full text-center landscape:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl flex items-center justify-center landscape:justify-start gap-2">
        <CalendarDays className="inline-block size-5 sm:size-6 md:size-7 lg:size-8" />
        <span className="pt-1">{formattedDate}</span>
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="font-headline font-bold text-center text-[18vw] leading-none sm:text-[15vw] landscape:text-[25vh] whitespace-nowrap w-[95%]">
          {formattedTime}
        </div>
      </div>

      <div className="w-full flex flex-col landscape:flex-row justify-between items-center gap-2 landscape:gap-8">
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground w-full landscape:w-auto text-center landscape:text-left flex-shrink-0 landscape:flex-1 relative">
          {location ? (
            <span>{location}</span>
          ) : (
            <div className="animate-pulse w-full h-8 bg-muted rounded-md" />
          )}
          <span className="absolute left-0 bottom-full landscape:bottom-auto landscape:top-full opacity-50 text-xs">
            {APP_VERSION}
          </span>
        </div>

        <div className="w-full landscape:w-auto text-3xl sm:text-4xl md:text-5xl landscape:flex-none">
          {weather ? (
            <div className="flex flex-col items-center landscape:items-end gap-1 sm:gap-2">
              <div className="flex items-center gap-3 font-bold text-2xl sm:text-3xl md:text-4xl">
                {weatherIcon}
                <span>{weather.temperature}</span>
              </div>
              <div className="flex items-center justify-center landscape:justify-end gap-3 text-sm sm:text-base md:text-lg text-muted-foreground w-full">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Thermometer className="size-4 sm:size-5 md:size-6" />
                  <span>{weather.minTemperature}</span>
                  <span className="mx-1">|</span>
                  <span>{weather.maxTemperature}</span>
                </div>
              </div>
              <div className="flex items-center justify-center landscape:justify-end gap-3 text-sm sm:text-base md:text-lg text-muted-foreground w-full">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Droplets className="size-4 sm:size-5 md:size-6" />
                  <span>{weather.humidity}</span>
                </div>
                <span className="mx-1">|</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Sun className="size-4 sm:size-5 md:size-6" />
                  <span>{weather.uvIndex}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse text-center landscape:text-right text-lg sm:text-xl">
              {error || 'Cargando clima...'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
