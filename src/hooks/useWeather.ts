import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export interface WeatherData {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  uvIndex: number;
  weatherCode: number;
}

interface WeatherCache {
  timestamp: number;
  data: WeatherData;
}

export const useWeather = (latitude?: number, longitude?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = `weather-${latitude.toFixed(3)}-${longitude.toFixed(3)}`;
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached) as WeatherCache;
          if (Date.now() - timestamp < CACHE_DURATION) {
            setWeather(data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        if (!response.ok) throw new Error('Weather response not OK');
        const data = await response.json();

        if (data?.current && data?.daily) {
          const newWeather: WeatherData = {
            temperature: data.current.temperature_2m,
            minTemperature: data.daily.temperature_2m_min[0],
            maxTemperature: data.daily.temperature_2m_max[0],
            humidity: data.current.relative_humidity_2m,
            uvIndex: data.current.uv_index,
            weatherCode: data.current.weather_code,
          };
          setWeather(newWeather);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), data: newWeather })
          );
        } else {
          throw new Error('Invalid weather data structure');
        }
      } catch (err) {
        let errorMessage = 'Temp. N/A';
        if (err instanceof Error) {
          errorMessage = `${errorMessage}: ${err.message}`;
        }
        setError(errorMessage);
        toast({
          title: 'Error al obtener el clima',
          description: err instanceof Error ? err.message : 'Error desconocido',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, toast]);

  return { weather, error, loading };
};
