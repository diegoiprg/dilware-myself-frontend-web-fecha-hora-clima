'use client';

import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { useVersionCheck } from '@/hooks/useVersionCheck';

interface HeaderProps {
  appVersion: string;
}

/**
 * Header component - Displays settings and version information in organized rows
 */
export const Header = ({ appVersion }: HeaderProps) => {
  const { hasUpdate, isChecking, checkForUpdates } = useVersionCheck();

  const getUpdateIcon = () => {
    if (isChecking) {
      return (
        <RefreshCw className="size-6 sm:size-8 animate-spin text-blue-500" />
      );
    }
    if (hasUpdate) {
      return (
        <AlertTriangle
          className="size-6 sm:size-8 text-orange-500 cursor-pointer hover:text-orange-600 transition-colors"
          onClick={checkForUpdates}
        />
      );
    }
    return <CheckCircle className="size-6 sm:size-8 text-green-500" />;
  };

  return (
    <>
      {/* Portrait: Settings in first row, Version in second row */}
      <div className="flex justify-end landscape:hidden -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8">
        <SettingsPanel appVersion={appVersion} />
      </div>

      <div className="flex items-center justify-center gap-3 landscape:hidden">
        <div className="bg-white/20 rounded-full p-2">{getUpdateIcon()}</div>
        <span className="text-3xl sm:text-4xl pt-1">v{appVersion}</span>
      </div>

      {/* Landscape: Version 50% left, Settings 50% right in first row */}
      <div className="hidden landscape:flex landscape:col-start-1 landscape:row-start-1 landscape:justify-self-start landscape:text-left landscape:w-full landscape:items-center landscape:gap-3">
        <div className="bg-white/20 rounded-full p-2">{getUpdateIcon()}</div>
        <span className="text-3xl sm:text-4xl pt-1">v{appVersion}</span>
      </div>

      <div className="hidden landscape:flex landscape:col-start-2 landscape:row-start-1 landscape:justify-self-end landscape:-mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8">
        <SettingsPanel appVersion={appVersion} />
      </div>
    </>
  );
};
