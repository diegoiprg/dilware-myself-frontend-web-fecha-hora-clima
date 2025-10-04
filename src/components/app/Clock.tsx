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
 * Clock component - Displays the current time in large, responsive text filling the cell
 * Centered at 100% width, text sized to occupy maximum space without distortion
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
          className={`font-code font-bold text-center w-full text-[12rem] sm:text-[15rem] md:text-[18rem] lg:text-[22rem] xl:text-[28rem] 2xl:text-[35rem] ${
            isAndroidTablet
              ? isPortrait
                ? 'md:text-[25rem] lg:text-[28rem] xl:text-[33rem] 2xl:text-[40rem]'
                : 'md:text-[18rem] lg:text-[21rem] xl:text-[26rem] 2xl:text-[33rem]'
              : isIPad
              ? isPortrait
                ? 'md:text-[17rem] lg:text-[20rem] xl:text-[25rem] 2xl:text-[32rem]'
                : 'md:text-[19rem] lg:text-[22rem] xl:text-[27rem] 2xl:text-[34rem]'
              : isDesktop
              ? 'lg:text-[25rem] xl:text-[30rem] 2xl:text-[38rem]'
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
