import { useState, useEffect } from 'react';

/**
 * Custom hook that provides the current date and time, updating every second
 * @returns Current Date object
 */
export const useDateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
