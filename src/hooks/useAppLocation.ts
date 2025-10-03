import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export interface LocationData {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface LocationCache {
  timestamp: number;
  data: LocationData;
}

export const useAppLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const cacheKey = 'user-location';

    const fetchLocationName = async (lat: number, lon: number): Promise<string> => {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
        );
        if (!response.ok) throw new Error('Reverse geocode response not OK');
        const data = await response.json();

        if (data) {
          const parts: { [key: string]: string } = {};
          const street = data.localityInfo?.informative?.find((i: any) => i.description === 'street')?.name;
          if (street) parts.street = street;
          if (data.locality) parts.locality = data.locality;
          if (data.city) parts.city = data.city;
          if (data.principalSubdivision) parts.subdivision = data.principalSubdivision;
          if (data.countryName) parts.country = data.countryName;

          const finalParts = [parts.street, parts.locality, parts.city, parts.subdivision, parts.country]
            .filter((value, index, self) => value && self.indexOf(value) === index);

          if (finalParts.length > 0) return finalParts.join(', ');
        }
        throw new Error('No location parts found');
    };

    const getLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached) as LocationCache;
          if (Date.now() - timestamp < CACHE_DURATION) {
            setLocation(data);
            setLoading(false);
            return;
          }
        }

        const getPosition = (): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
                if (!('geolocation' in navigator)) return reject(new Error('Geolocation not supported'));
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
        } catch (geoError) {
            toast({ title: 'No se pudo usar la geolocalización.', description: 'Usando ubicación por IP como alternativa.', variant: 'default' });
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('IP API response not OK');
            const data = await response.json();
            if (!data.latitude || !data.longitude) throw new Error('IP API did not return coordinates');
            
            const displayName = [data.city, data.region, data.country_name].filter(Boolean).join(', ') || 'Ubicación desconocida';
            newLocation = { latitude: data.latitude, longitude: data.longitude, displayName };
        }
        
        setLocation(newLocation);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: newLocation }));

      } catch (err) {
        let errorMessage = 'Location N/A';
        if (err instanceof Error) {
          errorMessage = err.message;
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
    };

    getLocation();
  }, [toast]);

  return { location, error, loading };
};
