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
}

export const Clock = ({ time, onClick }: ClockProps) => {
  const { timeFormat, showSeconds } = useSettings();
  const formattedTime = formatTime(time, timeFormat, showSeconds);

  return (
    <main
      onClick={onClick}
      className="w-full flex-1 flex flex-col items-center justify-center cursor-pointer"
    >
      <div className="font-mono font-bold text-center text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem] 2xl:text-[18rem] leading-none whitespace-nowrap tabular-nums">
        {formattedTime}
      </div>
    </main>
  );
};
