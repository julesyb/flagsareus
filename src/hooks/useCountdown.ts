import { useState, useEffect } from 'react';

/**
 * Countdown timer that decrements every second while `running` is true.
 * Stops automatically at 0. Returns current seconds remaining.
 */
export function useCountdown(seconds: number, running: boolean): number {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  return timeLeft;
}
