/**
 * WeatherSkeleton component - Shows loading or error state for weather data
 * @param error - Error message to display, or loading text if none
 */
export const WeatherSkeleton = ({ error }: { error?: string | null }) => (
  <div className="animate-pulse text-center landscape:text-right">
    {error || 'Cargando clima...'}
  </div>
);
