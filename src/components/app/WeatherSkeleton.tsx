export const WeatherSkeleton = ({ error }: { error?: string | null }) => (
  <div className="animate-pulse text-center landscape:text-right">
    {error || 'Cargando clima...'}
  </div>
);
