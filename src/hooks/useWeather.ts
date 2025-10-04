import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';

/**
 * Interface for weather data structure
 */
export interface WeatherData {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  uvIndex: number;
  weatherCode: number;
  rainProbability: number;
  airQuality: number;
}

/**
 * Custom hook to fetch and manage weather data
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns Object with weather data, loading state, and error
 */
export const useWeather = (latitude?: number, longitude?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refreshInterval } = useSettings();

  /**
   * Fetches weather data from WeatherAPI.com (primary) with Open-Meteo fallback
   */
  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) return;

    setLoading(true);
    setError(null);

    try {
      // Try WeatherAPI.com first (primary)
      try {
        const weatherApiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
        if (weatherApiKey) {
          const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=1&aqi=yes`
          );

          if (response.ok) {
            const data = await response.json();

            if (data?.current && data?.forecast?.forecastday?.[0]) {
              const current = data.current;
              const forecast = data.forecast.forecastday[0];

              const newWeather: WeatherData = {
                temperature: current.temp_c,
                minTemperature: forecast.day.mintemp_c,
                maxTemperature: forecast.day.maxtemp_c,
                humidity: current.humidity,
                uvIndex: current.uv,
                weatherCode: current.condition.code,
                rainProbability: forecast.day.daily_chance_of_rain,
                airQuality: current.air_quality?.['us-epa-index'] || 1,
              };
              setWeather(newWeather);
              return; // Success, no need for fallback
            }
          }
        }
      } catch (weatherApiError) {
        console.warn(
          'WeatherAPI.com failed, trying fallback:',
          weatherApiError
        );
      }

      // Fallback to Open-Meteo
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_WEATHER_API_BASE ||
          'https://api.open-meteo.com/v1/forecast'
        }?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
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
          rainProbability: data.current.precipitation_probability || 0,
          airQuality: 1, // Open-Meteo doesn't provide air quality, default to good
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

  const retry = () => {
    fetchWeather();
  };

  return { weather, error, loading, retry };
};
