import { useSettings } from '@/context/SettingsContext';

const formatTime = (
  date: Date,
  format: '12h' | '24h',
  showSeconds: boolean
): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  let timeString = '';

  if (format === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    timeString = `${String(hours).padStart(2, ' ')}:${minutes}`;
    if (showSeconds) {
      timeString += `:${seconds}`;
    }
    timeString += ` ${ampm}`;
  } else {
    timeString = `${String(hours).padStart(2, '0')}:${minutes}`;
    if (showSeconds) {
      timeString += `:${seconds}`;
    }
  }
  return timeString;
};

interface ClockProps {
  time: Date;
  onClick?: () => void;
  isFullscreenSupported?: boolean;
}

export const Clock = ({
  time,
  onClick,
  isFullscreenSupported = true,
}: ClockProps) => {
  const { timeFormat, showSeconds } = useSettings();
  const formattedTime = formatTime(time, timeFormat, showSeconds);

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center">
      <div
        onClick={isFullscreenSupported ? onClick : undefined}
        className={`font-code font-bold text-center text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[15rem] leading-none whitespace-nowrap tabular-nums overflow-hidden ${
          isFullscreenSupported ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {formattedTime}
      </div>
    </main>
  );
};
