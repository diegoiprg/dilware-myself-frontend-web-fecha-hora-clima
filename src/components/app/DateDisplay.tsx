'use client';

import { CalendarDays } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

/**
 * Spanish month names and abbreviations for date formatting
 */
const MONTHS_ES = {
  full: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  short: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  numeric: [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ],
};

/**
 * Formats a Date object into a localized Spanish date string based on user settings
 * @param date - Date object to format
 * @param settings - User date formatting settings
 * @returns Formatted date string in Spanish
 */
const formatDate = (
  date: Date,
  dateSeparator: string,
  abbreviateDay: boolean,
  monthFormat: string
): string => {
  // Get day name
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    date
  );
  const formattedDayName = abbreviateDay
    ? dayName.charAt(0).toUpperCase() + dayName.slice(1, 4)
    : dayName.charAt(0).toUpperCase() + dayName.slice(1);

  // Get day, month, year
  const day = String(date.getDate()).padStart(2, '0');
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Get month based on format
  const monthValue =
    MONTHS_ES[monthFormat as keyof typeof MONTHS_ES][monthIndex];

  // Apply separator
  let separator = ' ';
  switch (dateSeparator) {
    case 'dot':
      separator = '.';
      break;
    case 'slash':
      separator = '/';
      break;
    case 'dash':
      separator = '-';
      break;
    case 'space':
    default:
      separator = ' ';
      break;
  }

  return `${formattedDayName}${separator}${day}${separator}${monthValue}${separator}${year}`;
};

/**
 * DateDisplay component - Shows the current date with calendar icon
 * @param date - Date object to display
 */
export const DateDisplay = ({ date }: { date: Date }) => {
  const { dateSeparator, abbreviateDay, monthFormat } = useSettings();
  const formattedDate = formatDate(
    date,
    dateSeparator,
    abbreviateDay,
    monthFormat
  );

  return (
    <div className="text-3xl sm:text-4xl flex items-center gap-3">
      <div className="bg-white/20 rounded-full p-2">
        <CalendarDays className="size-6 sm:size-8" />
      </div>
      <span className="pt-1 font-bold">{formattedDate}</span>
    </div>
  );
};
