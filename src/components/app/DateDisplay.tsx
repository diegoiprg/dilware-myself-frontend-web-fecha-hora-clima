'use client';

import { CalendarDays } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

/**
 * Spanish month names and abbreviations for date formatting
 */
const MONTHS_ES = {
  full: [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ],
  short: [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
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
  dayFormat: string,
  monthFormat: string,
  yearFormat: string
): string => {
  // Get day name
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    date
  );
  const formattedDayName =
    dayFormat === 'short'
      ? dayName.charAt(0).toUpperCase() + dayName.slice(1, 3) // Exactly 3 characters
      : dayName.charAt(0).toUpperCase() + dayName.slice(1);

  // Get day, month, year
  const day = String(date.getDate()).padStart(2, '0');
  const monthIndex = date.getMonth();
  const fullYear = date.getFullYear();
  const year =
    yearFormat === 'short' ? String(fullYear).slice(-2) : String(fullYear);

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

  return `${formattedDayName}, ${day}${separator}${monthValue}${separator}${year}`;
};

/**
 * DateDisplay component - Shows the current date with calendar icon
 * @param date - Date object to display
 */
export const DateDisplay = ({ date }: { date: Date }) => {
  const { dateSeparator, dayFormat, monthFormat, yearFormat } = useSettings();
  const formattedDate = formatDate(
    date,
    dateSeparator,
    dayFormat,
    monthFormat,
    yearFormat
  );

  return (
    <div className="text-3xl sm:text-4xl flex items-center gap-3">
      <div className="bg-white/20 rounded-full p-2">
        <CalendarDays className="size-6 sm:size-8" />
      </div>
      <span className="pt-1">
        <span className="font-bold">{formattedDate.split(',')[0]},</span>
        {formattedDate.split(',').slice(1).join(',')}
      </span>
    </div>
  );
};
