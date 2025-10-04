'use client';

import { Menu } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';

interface HeaderProps {
  appVersion: string;
}

/**
 * Header component - Displays version and settings in a single row
 */
export const Header = ({ appVersion }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Version on the left */}
      <div className="flex items-center gap-3">
        <span className="text-3xl sm:text-4xl pt-1">v{appVersion}</span>
      </div>

      {/* Settings menu on the right */}
      <div className="-mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8">
        <SettingsPanel appVersion={appVersion} />
      </div>
    </div>
  );
};
