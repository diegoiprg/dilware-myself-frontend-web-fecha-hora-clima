'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

/**
 * Temperature unit type
 */
export type TempUnit = 'C' | 'F';

/**
 * Time format type
 */
export type TimeFormat = '12h' | '24h';

/**
 * Settings interface for user preferences
 */
interface Settings {
  tempUnit: TempUnit;
  timeFormat: TimeFormat;
  showSeconds: boolean;
  refreshInterval: number; // weather refresh interval in minutes
  updateCheckInterval: number; // version update check interval in hours
}

/**
 * Settings context state including setters
 */
interface SettingsState extends Settings {
  setTempUnit: (unit: TempUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setShowSeconds: (show: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setUpdateCheckInterval: (interval: number) => void;
}

/**
 * Local storage key for settings persistence
 */
const SETTINGS_STORAGE_KEY = 'chronos-settings';

/**
 * Default settings values
 */
const defaultSettings: Settings = {
  tempUnit: 'C',
  timeFormat: '24h',
  showSeconds: true,
  refreshInterval: 10, // weather refresh interval in minutes
  updateCheckInterval: 1, // version update check interval in hours
};

/**
 * React context for settings state management
 */
const SettingsContext = createContext<SettingsState | undefined>(undefined);

/**
 * SettingsProvider component - Provides settings context to the app
 * Manages persistence to localStorage
 * @param children - Child components
 */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings((s) => ({ ...s, ...parsed }));
      }
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  }, [settings]);

  const setTempUnit = (unit: TempUnit) =>
    setSettings((s) => ({ ...s, tempUnit: unit }));
  const setTimeFormat = (format: TimeFormat) =>
    setSettings((s) => ({ ...s, timeFormat: format }));
  const setShowSeconds = (show: boolean) =>
    setSettings((s) => ({ ...s, showSeconds: show }));
  const setRefreshInterval = (interval: number) =>
    setSettings((s) => ({ ...s, refreshInterval: interval }));
  const setUpdateCheckInterval = (interval: number) =>
    setSettings((s) => ({ ...s, updateCheckInterval: interval }));

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTempUnit,
        setTimeFormat,
        setShowSeconds,
        setRefreshInterval,
        setUpdateCheckInterval,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Custom hook to access settings context
 * Must be used within a SettingsProvider
 * @returns Settings state and setters
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
