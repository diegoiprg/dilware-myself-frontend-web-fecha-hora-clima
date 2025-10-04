import { MapPin } from 'lucide-react';

/**
 * LocationDisplay component - Shows the current location with map pin icon
 * @param displayName - Human-readable location name
 */
export const LocationDisplay = ({ displayName }: { displayName?: string }) => {
  if (!displayName) {
    return (
      <div className="w-full landscape:w-1/2 flex items-center justify-center landscape:justify-start">
        <div className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground text-center landscape:text-left whitespace-nowrap">
          <div className="bg-white/20 rounded-full p-2">
            <MapPin className="size-5 sm:size-6 md:size-7 lg:size-8" />
          </div>
          <span>...</span>
        </div>
      </div>
    );
  }

  // Split displayName into parts: assuming format "City, Region, Country"
  const parts = displayName.split(', ');
  const city = parts[0] || '';
  const regionCountry = parts.slice(1).join(', ') || '';

  return (
    <div className="w-full landscape:w-1/2 flex flex-col items-center justify-center landscape:justify-start landscape:items-start">
      <div className="flex items-center gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground text-center landscape:text-left whitespace-nowrap">
        <div className="bg-white/20 rounded-full p-2">
          <MapPin className="size-5 sm:size-6 md:size-7 lg:size-8" />
        </div>
        <span>{city}</span>
      </div>
      {regionCountry && (
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground text-center landscape:text-left mt-1">
          {regionCountry}
        </div>
      )}
    </div>
  );
};
