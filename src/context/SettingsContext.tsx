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
 * Date separator type
 */
export type DateSeparator = 'space' | 'dot' | 'slash' | 'dash';

/**
 * Month format type
 */
export type MonthFormat = 'full' | 'short' | 'numeric';

/**
 * Theme type
 */
export type Theme = 'light' | 'dark';

/**
 * Settings interface for user preferences
 */
interface Settings {
  // Date settings
  dateSeparator: DateSeparator;
  abbreviateDay: boolean;
  monthFormat: MonthFormat;

  // Time settings
  timeFormat: TimeFormat;
  showSeconds: boolean;

  // Weather settings
  tempUnit: TempUnit;
  refreshInterval: number; // weather refresh interval in minutes

  // General settings
  theme: Theme;
  updateCheckInterval: number; // version update check interval in minutes
}

/**
 * Settings context state including setters
 */
interface SettingsState extends Settings {
  // Date setters
  setDateSeparator: (separator: DateSeparator) => void;
  setAbbreviateDay: (abbreviate: boolean) => void;
  setMonthFormat: (format: MonthFormat) => void;

  // Time setters
  setTimeFormat: (format: TimeFormat) => void;
  setShowSeconds: (show: boolean) => void;

  // Weather setters
  setTempUnit: (unit: TempUnit) => void;
  setRefreshInterval: (interval: number) => void;

  // General setters
  setTheme: (theme: Theme) => void;
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
  // Date settings
  dateSeparator: 'space',
  abbreviateDay: false,
  monthFormat: 'full',

  // Time settings
  timeFormat: '24h',
  showSeconds: true,

  // Weather settings
  tempUnit: 'C',
  refreshInterval: 5, // weather refresh interval in minutes (5 min default)

  // General settings
  theme: 'dark',
  updateCheckInterval: 5, // version update check interval in minutes (5 min default)
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

  // Date setters
  const setDateSeparator = (separator: DateSeparator) =>
    setSettings((s) => ({ ...s, dateSeparator: separator }));
  const setAbbreviateDay = (abbreviate: boolean) =>
    setSettings((s) => ({ ...s, abbreviateDay: abbreviate }));
  const setMonthFormat = (format: MonthFormat) =>
    setSettings((s) => ({ ...s, monthFormat: format }));

  // Time setters
  const setTimeFormat = (format: TimeFormat) =>
    setSettings((s) => ({ ...s, timeFormat: format }));
  const setShowSeconds = (show: boolean) =>
    setSettings((s) => ({ ...s, showSeconds: show }));

  // Weather setters
  const setTempUnit = (unit: TempUnit) =>
    setSettings((s) => ({ ...s, tempUnit: unit }));
  const setRefreshInterval = (interval: number) =>
    setSettings((s) => ({ ...s, refreshInterval: interval }));

  // General setters
  const setTheme = (theme: Theme) =>
    setSettings((s) => ({ ...s, theme: theme }));
  const setUpdateCheckInterval = (interval: number) =>
    setSettings((s) => ({ ...s, updateCheckInterval: interval }));

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Date setters
        setDateSeparator,
        setAbbreviateDay,
        setMonthFormat,
        // Time setters
        setTimeFormat,
        setShowSeconds,
        // Weather setters
        setTempUnit,
        setRefreshInterval,
        // General setters
        setTheme,
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
