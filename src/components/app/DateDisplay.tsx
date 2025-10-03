'use client';

import { CalendarDays } from 'lucide-react';

const MONTHS_ES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

const formatDate = (date: Date): string => {
  const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const day = String(date.getDate()).padStart(2, '0');
  const monthAbbr = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${capitalizedDayName}, ${day} ${monthAbbr} ${year}`;
};

export const DateDisplay = ({ date }: { date: Date }) => {
  const formattedDate = formatDate(date);
  return (
    <div className="text-2xl sm:text-3xl flex items-center gap-3">
      <CalendarDays className="size-8 sm:size-10" />
      <span className="pt-1">{formattedDate}</span>
    </div>
  );
};
