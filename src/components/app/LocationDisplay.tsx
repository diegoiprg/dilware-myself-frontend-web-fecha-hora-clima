import { MapPin } from 'lucide-react';

export const LocationDisplay = ({ displayName }: { displayName?: string }) => (
  <div className="w-full landscape:w-1/2 flex items-center justify-center landscape:justify-start">
    <div className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground text-center landscape:text-left whitespace-nowrap">
      <div className="bg-white/20 rounded-full p-2">
        <MapPin className="size-6 sm:size-7 md:size-8 lg:size-9" />
      </div>
      <span>{displayName || '...'}</span>
    </div>
  </div>
);
