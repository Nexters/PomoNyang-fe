import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

type THandler = {
  onStart?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onFinishRef?: RefObject<() => void>;
};

const INTERVAL_MS = 100;

/**
 * @returns time: ms 단위
 */
export const useTimer = (initialTime: number, endTime?: number, handler?: THandler) => {
  const { onStart, onResume, onStop, onPause, onFinishRef } = handler ?? {};

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
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
    const elapsedTime = now - startTimeRef.current + accumulatedTimeRef.current;
    const newTime = initialTime - elapsedTime;

    setTime(newTime);

    if (newTime <= (endTime ?? 0)) {
      onFinishRef?.current?.();
      stop();
    }
  }, [initialTime, onFinishRef]);

  const run = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(tick, INTERVAL_MS);

    setIsRunning(true);
  }, [tick, isRunning, onFinishRef]);

  const start = useCallback(() => {
    run();
    onStart?.();
  }, [run, onStart]);

  const resume = useCallback(() => {
    run();
    onResume?.();
  }, [run, onResume]);

  const stop = useCallback(() => {
    setIsRunning(false);

    _clearInterval();
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;

    onStop?.();
  }, [initialTime, onStop]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    _clearInterval();
    // @note: 현재까지 경과된 시간을 계산하여 누적
    if (startTimeRef.current !== null) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    }

    setIsRunning(false);
    onPause?.();
  }, [onPause, isRunning]);

  const _clearInterval = useCallback(() => {
    if (timerRef.current === null) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  return {
    time,
    isRunning,
    start,
    resume,
    stop,
    pause,
  };
};
