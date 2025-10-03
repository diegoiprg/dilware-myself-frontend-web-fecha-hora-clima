'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TempUnit = 'C' | 'F';
export type TimeFormat = '12h' | '24h';

interface Settings {
  tempUnit: TempUnit;
  timeFormat: TimeFormat;
  showSeconds: boolean;
}

interface SettingsState extends Settings {
  setTempUnit: (unit: TempUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setShowSeconds: (show: boolean) => void;
}

const SETTINGS_STORAGE_KEY = 'chronos-settings';

const defaultSettings: Settings = {
  tempUnit: 'C',
  timeFormat: '24h',
  showSeconds: true,
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  }, [settings]);

  const setTempUnit = (unit: TempUnit) => setSettings(s => ({ ...s, tempUnit: unit }));
  const setTimeFormat = (format: TimeFormat) => setSettings(s => ({ ...s, timeFormat: format }));
  const setShowSeconds = (show: boolean) => setSettings(s => ({ ...s, showSeconds: show }));

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTempUnit,
        setTimeFormat,
        setShowSeconds,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
