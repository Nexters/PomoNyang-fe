import { useState, useEffect, useCallback, useRef } from 'react';

type THandler = {
  onStart?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
};

const INTERVAL_MS = 100;

/**
 * @returns time: ms 단위
 */
export const useTimer = (initialTime: number, handler: THandler) => {
  const { onStart, onStop, onPause, onFinish } = handler;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      _clearInterval();
      setIsRunning(false);
    };
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    const now = Date.now();
    const elapsedTime = now - startTimeRef.current + pausedTimeRef.current;
    const newTime = Math.max(0, initialTime - elapsedTime); // clamp

    setTime(newTime);

    if (newTime <= 0) {
      onFinish?.();
      stop();
    }
  }, [initialTime, onFinish]);

  const start = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(tick, INTERVAL_MS);

    setIsRunning(true);
    onStart?.();
  }, [tick, onStart, isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);

    _clearInterval();
    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    onStop?.();
  }, [initialTime, onStop]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    _clearInterval();
    // @note: 타이머가 시작된 적이 있다면, 현재까지 경과된 시간을 계산하여 누적
    if (startTimeRef.current !== null) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
    }

    setIsRunning(false);
    onPause?.();
  }, [onPause, isRunning]);

  const _clearInterval = () => {
    if (timerRef.current === null) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return {
    time,
    isRunning,
    start,
    stop,
    pause,
  };
};
