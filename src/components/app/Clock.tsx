import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import {
  useIsAndroidTablet,
  useIsIPad,
  useIsDesktop,
} from '@/hooks/useIsAndroidTablet';

/**
 * Formats a Date object into a time string based on format preferences
 * @param date - Date object to format
 * @param format - Time format ('12h' or '24h')
 * @param showSeconds - Whether to include seconds in the display
 * @param showColons - Whether to show colons (for blinking effect)
 * @param blinkingColons - Whether colons should blink
 * @returns Formatted time string
 */
const formatTime = (
  date: Date,
  format: '12h' | '24h',
  showSeconds: boolean,
  showColons: boolean,
  blinkingColons: boolean
): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const colon = blinkingColons && !showColons ? ' ' : ':';
  let timeString = '';

  if (format === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    timeString = `${String(hours).padStart(2, ' ')}${colon}${minutes}`;
    if (showSeconds) {
      timeString += `${colon}${seconds}`;
    }
    timeString += ` ${ampm}`;
  } else {
    timeString = `${String(hours).padStart(2, '0')}${colon}${minutes}`;
    if (showSeconds) {
      timeString += `${colon}${seconds}`;
    }
  }
  return timeString;
};

interface ClockProps {
  time: Date;
  onClick?: () => void;
  isFullscreenSupported?: boolean;
}

/**
 * Clock component - Displays the current time in large, responsive text
 * Clicking toggles fullscreen mode if supported
 * @param time - Current time Date object
 * @param onClick - Handler for click events (fullscreen toggle)
 * @param isFullscreenSupported - Whether fullscreen API is available
 */
export const Clock = React.memo(
  ({ time, onClick, isFullscreenSupported = true }: ClockProps) => {
    const { timeFormat, showSeconds, blinkingColons } = useSettings();
    const isAndroidTablet = useIsAndroidTablet();
    const isIPad = useIsIPad();
    const isDesktop = useIsDesktop();
    const [isPortrait, setIsPortrait] = React.useState(
      window.innerHeight > window.innerWidth
    );
    const [showColons, setShowColons] = React.useState(true);
    const formattedTime = formatTime(
      time,
      timeFormat,
      showSeconds,
      showColons,
      blinkingColons
    );

    React.useEffect(() => {
      const handleResize = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle blinking colons effect
    React.useEffect(() => {
      if (!blinkingColons) {
        setShowColons(true);
        return;
      }

      const interval = setInterval(() => {
        setShowColons((prev) => !prev);
      }, 1000); // Blink every second

      return () => clearInterval(interval);
    }, [blinkingColons]);

    return (
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <div
          onClick={isFullscreenSupported ? onClick : undefined}
          className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 font-code font-bold text-center text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[15rem] dark:bg-transparent dark:backdrop-blur-none dark:rounded-none dark:p-0 ${
            isAndroidTablet
              ? isPortrait
                ? 'md:text-[16rem] lg:text-[18rem] xl:text-[20rem] 2xl:text-[23rem]'
                : 'md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[17rem]'
              : isIPad
              ? isPortrait
                ? 'md:text-[9.5rem] lg:text-[11.5rem] xl:text-[13.5rem] 2xl:text-[16.5rem]'
                : 'md:text-[11rem] lg:text-[13rem] xl:text-[15rem] 2xl:text-[18rem]'
              : isDesktop
              ? 'lg:text-[13rem] xl:text-[16rem] 2xl:text-[20rem]'
              : ''
          } leading-none whitespace-nowrap tabular-nums overflow-hidden ${
            isFullscreenSupported ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          {formattedTime}
        </div>
      </main>
    );
  }
);
