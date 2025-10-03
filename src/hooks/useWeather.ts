import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';

export interface WeatherData {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  uvIndex: number;
  weatherCode: number;
}

export const useWeather = (latitude?: number, longitude?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refreshInterval } = useSettings();

  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) return;

    setLoading(true);
    setError(null);

    try {
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
  }, [latitude, longitude, toast]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchWeather(); // Refresh from API
      }, refreshInterval * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchWeather]);

  return { weather, error, loading };
};
