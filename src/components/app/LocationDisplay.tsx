export const LocationDisplay = ({ displayName }: { displayName?: string }) => (
  <div className="w-full landscape:w-1/2 flex items-center justify-center landscape:justify-start">
    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground text-center landscape:text-left whitespace-nowrap">
      {displayName || '...'}
    </div>
  </div>
);
