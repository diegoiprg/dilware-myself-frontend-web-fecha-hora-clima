import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';
import { trackWeatherLocation } from '@/lib/analytics';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Interface for location data structure
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface LocationCache {
  timestamp: number;
  data: LocationData;
}

/**
 * Custom hook to fetch and manage user location data
 * Uses geolocation API with fallback to IP-based location
 * Includes caching to reduce API calls
 * @returns Object with location data, loading state, and error
 */
export const useAppLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refreshInterval } = useSettings();

  /**
   * Fetches human-readable location name from coordinates using reverse geocoding
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Promise resolving to display name string
   */
  const fetchLocationName = useCallback(
    async (lat: number, lon: number): Promise<string> => {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
      );
      if (!response.ok) throw new Error('Reverse geocode response not OK');
      const data = await response.json();

      if (data) {
        const parts: { [key: string]: string } = {};
        const street = data.localityInfo?.informative?.find(
          (i: any) => i.description === 'street'
        )?.name;
        if (street) parts.street = street;
        if (data.locality) parts.locality = data.locality;
        if (data.city) parts.city = data.city;
        if (data.principalSubdivision)
          parts.subdivision = data.principalSubdivision;
        if (data.countryName) parts.country = data.countryName;

        const finalParts = [
          parts.street,
          parts.locality,
          parts.city,
          parts.subdivision,
          parts.country,
        ].filter(
          (value, index, self) => value && self.indexOf(value) === index
        );

        if (finalParts.length > 0) return finalParts.join(', ');
      }
      throw new Error('No location parts found');
    },
    []
  );

  /**
   * Gets user location using geolocation API, with fallback to IP-based location
   * Uses caching to avoid repeated API calls
   * @param force - Force refresh ignoring cache
   */
  const getLocation = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);

      const cacheKey = 'user-location';

      try {
        if (!force) {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const { timestamp, data } = JSON.parse(cached) as LocationCache;
            if (Date.now() - timestamp < CACHE_DURATION) {
              setLocation(data);
              setLoading(false);
              return;
            }
          }
        }

        const getPosition = (): Promise<GeolocationPosition> => {
          return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator))
              return reject(new Error('Geolocation not supported'));
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            });
          });
        };

        let newLocation: LocationData;

        try {
          const position = await getPosition();
          const { latitude, longitude } = position.coords;
          const displayName = await fetchLocationName(latitude, longitude);
          newLocation = { latitude, longitude, displayName };
          trackWeatherLocation.locationGeolocationSuccess();
        } catch (geoError) {
          toast({
            title: 'No se pudo usar la geolocalización.',
            description: 'Usando ubicación por IP como alternativa.',
            variant: 'default',
          });
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) throw new Error('IP API response not OK');
          const data = await response.json();
          if (!data.latitude || !data.longitude)
            throw new Error('IP API did not return coordinates');

          const displayName =
            [data.city, data.region, data.country_name]
              .filter(Boolean)
              .join(', ') || 'Ubicación desconocida';
          newLocation = {
            latitude: data.latitude,
            longitude: data.longitude,
            displayName,
          };
          trackWeatherLocation.locationIPFallback();
        }

        setLocation(newLocation);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: newLocation })
        );
      } catch (err) {
        let errorMessage = 'Location N/A';
        if (err instanceof Error) {
          errorMessage = err.message;
          trackWeatherLocation.locationError(errorMessage);
        }
        setError(errorMessage);
        toast({
          title: 'Error al obtener la ubicación',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, fetchLocationName]
  );

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        getLocation(true); // Force refresh, ignoring cache
      }, refreshInterval * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, getLocation]);

  return { location, error, loading };
};
