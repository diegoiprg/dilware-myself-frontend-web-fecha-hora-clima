'use client';

import { CalendarDays } from 'lucide-react';

/**
 * Spanish month abbreviations for date formatting
 */
const MONTHS_ES = [
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
];

/**
 * Formats a Date object into a localized Spanish date string
 * @param date - Date object to format
 * @returns Formatted date string in Spanish
 */
const formatDate = (date: Date): string => {
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    date
  );
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAbbr = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${capitalizedDayName}, ${day} ${monthAbbr} ${year}`;
};

/**
 * DateDisplay component - Shows the current date with calendar icon
 * @param date - Date object to display
 */
export const DateDisplay = ({ date }: { date: Date }) => {
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(
    date
  );
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAbbr = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();

  return (
    <div className="text-3xl sm:text-4xl flex items-center gap-3">
      <div className="bg-white/20 rounded-full p-2">
        <CalendarDays className="size-6 sm:size-8" />
      </div>
      <span className="pt-1">
        <span className="font-bold">{capitalizedDayName}</span>, {day}{' '}
        {monthAbbr} {year}
      </span>
    </div>
  );
};
