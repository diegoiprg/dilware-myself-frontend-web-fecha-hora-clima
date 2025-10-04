import { MapPin } from 'lucide-react';

/**
 * LocationDisplay component - Shows the current location with map pin icon
 * @param displayName - Human-readable location name
 */
export const LocationDisplay = ({ displayName }: { displayName?: string }) => {
  if (!displayName) {
    return (
      <div className="w-full landscape:w-full flex flex-col justify-center landscape:justify-start">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground text-center landscape:text-left">
          ...
        </div>
        <div className="flex items-center justify-center landscape:justify-start gap-3 mt-1 mb-1">
          <div className="bg-white/20 rounded-full p-2">
            <MapPin className="size-5 sm:size-6 md:size-7 lg:size-8" />
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
            ...
          </span>
        </div>
      </div>
    );
  }

  // Split displayName into parts: assuming format "Street, District, City, Region, Country"
  const parts = displayName.split(', ');
  const addressDistrict = parts.slice(0, 2).filter(Boolean).join(', ') || '';
  const provinceDepartmentCountry =
    parts.slice(2).filter(Boolean).join(', ') || '';

  return (
    <div className="w-full landscape:w-full flex flex-col justify-center landscape:justify-start">
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground text-center landscape:text-left whitespace-normal">
        {addressDistrict}
      </div>
      <div className="flex items-center justify-center landscape:justify-start gap-3 mt-1 mb-1">
        <div className="bg-white/20 rounded-full p-2">
          <MapPin className="size-5 sm:size-6 md:size-7 lg:size-8" />
        </div>
        {provinceDepartmentCountry && (
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground whitespace-normal">
            {provinceDepartmentCountry}
          </span>
        )}
      </div>
    </div>
  );
};
