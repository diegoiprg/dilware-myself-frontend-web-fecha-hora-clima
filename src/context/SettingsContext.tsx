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
 * Day format type
 */
export type DayFormat = 'full' | 'short';

/**
 * Month format type
 */
export type MonthFormat = 'full' | 'short';

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
  dayFormat: DayFormat;
  monthFormat: MonthFormat;

  // Time settings
  timeFormat: TimeFormat;
  showSeconds: boolean;
  blinkingColons: boolean;

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
  setDayFormat: (format: DayFormat) => void;
  setMonthFormat: (format: MonthFormat) => void;

  // Time setters
  setTimeFormat: (format: TimeFormat) => void;
  setShowSeconds: (show: boolean) => void;
  setBlinkingColons: (blinking: boolean) => void;

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
  dayFormat: 'full',
  monthFormat: 'full',

  // Time settings
  timeFormat: '24h',
  showSeconds: true,
  blinkingColons: false,

  // Weather settings
  tempUnit: 'C',
  refreshInterval: 1, // weather refresh interval in minutes (1 min default)

  // General settings
  theme: 'dark',
  updateCheckInterval: 1, // version update check interval in minutes (1 min default)
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
  const setDayFormat = (format: DayFormat) =>
    setSettings((s) => ({ ...s, dayFormat: format }));
  const setMonthFormat = (format: MonthFormat) =>
    setSettings((s) => ({ ...s, monthFormat: format }));

  // Time setters
  const setTimeFormat = (format: TimeFormat) =>
    setSettings((s) => ({ ...s, timeFormat: format }));
  const setShowSeconds = (show: boolean) =>
    setSettings((s) => ({ ...s, showSeconds: show }));
  const setBlinkingColons = (blinking: boolean) =>
    setSettings((s) => ({ ...s, blinkingColons: blinking }));

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
        setDayFormat,
        setMonthFormat,
        // Time setters
        setTimeFormat,
        setShowSeconds,
        setBlinkingColons,
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
