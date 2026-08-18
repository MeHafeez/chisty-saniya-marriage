'use client';

import { useEffect, useState } from 'react';

import type { TimeLeft } from '@/types';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

function getTimeLeft(target: number): TimeLeft {
  const total = target - Date.now();
  if (total <= 0) return ZERO;

  return {
    days: Math.floor(total / DAY),
    hours: Math.floor((total % DAY) / HOUR),
    minutes: Math.floor((total % HOUR) / MINUTE),
    seconds: Math.floor((total % MINUTE) / SECOND),
    total,
  };
}

/**
 * Ticks once a second toward `targetDate`.
 * Starts at zero so server and client markup match, then hydrates to the real
 * value on mount — avoiding a hydration mismatch on a time-dependent render.
 */
export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const target = targetDate.getTime();

    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    setIsReady(true);

    const id = window.setInterval(tick, SECOND);
    return () => window.clearInterval(id);
  }, [targetDate]);

  return {
    timeLeft,
    isReady,
    hasPassed: isReady && timeLeft.total <= 0,
  };
}
