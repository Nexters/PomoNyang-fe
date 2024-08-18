import { useState, useEffect, useCallback, useRef } from 'react';

type THandler = {
  onStart?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onFinish?: (time: number) => void;
};

const INTERVAL_MS = 90;

/**
 * @returns time: ms 단위
 */
export const useTimer = (initialTime: number, endTime?: number, handler?: THandler) => {
  const handlerRef = useRef<THandler>();
  handlerRef.current = handler;

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
      handlerRef.current?.onFinish?.(newTime);
      stop();
    }
  }, [initialTime, handlerRef, endTime]);

  const run = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(tick, INTERVAL_MS);

    setIsRunning(true);
  }, [tick, isRunning]);

  const start = useCallback(() => {
    run();
    handlerRef.current?.onStart?.();
  }, [run, handlerRef]);

  const resume = useCallback(() => {
    run();
    handlerRef.current?.onResume?.();
  }, [run, handlerRef]);

  const stop = useCallback(() => {
    setIsRunning(false);

    handlerRef.current?.onStop?.();
    _clearInterval();
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
  }, [handlerRef, time]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    _clearInterval();
    // @note: 현재까지 경과된 시간을 계산하여 누적
    if (startTimeRef.current !== null) {
      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    }

    setIsRunning(false);
    handlerRef.current?.onPause?.();
  }, [handlerRef, isRunning]);

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
