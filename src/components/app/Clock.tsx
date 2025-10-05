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
 * Clock component - Displays the current time in large text scaled with vmin for maximum visibility
 * Centered at 100% width, largest possible text for all screen sizes and orientations
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
          className={`font-code font-bold text-center w-full text-[15vmin] ${
            isAndroidTablet
              ? isPortrait
                ? 'text-[17vmin]'
                : 'text-[21vmin]'
              : isIPad
              ? isPortrait
                ? 'text-[17vmin]'
                : 'text-[20vmin]'
              : isDesktop
              ? 'lg:text-[17vmin] xl:text-[21vmin] 2xl:text-[21vmin] 3xl:text-[23vmin] 4xl:text-[23vmin]'
              : !isPortrait
              ? 'text-[17vmin]'
              : 'text-[16vmin]'
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
