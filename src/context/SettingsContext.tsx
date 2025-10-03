'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type TempUnit = 'C' | 'F';
export type TimeFormat = '12h' | '24h';

interface SettingsState {
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
  showSeconds: boolean;
  setShowSeconds: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');
  const [showSeconds, setShowSeconds] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        tempUnit,
        setTempUnit,
        timeFormat,
        setTimeFormat,
        showSeconds,
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
