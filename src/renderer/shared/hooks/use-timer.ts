import { useState, useEffect, useCallback, useRef } from 'react';

type THandler = {
  onStart?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
};

/**
 * @returns time: 초 단위
 */
export const useTimer = (initialTime: number, handler: THandler) => {
  const { onStart, onStop, onPause, onFinish } = handler;

  const [time, setTime] = useState(initialTime);
  const timerRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    return () => {
      _clearInterval();
      setIsRunning(false);
    };
  }, []);

  const tick = useCallback(() => {
    setTime((prevTime) => {
      const newTime = prevTime - 1;
      if (newTime <= 0) {
        onFinish?.();
        stop();
        return 0;
      }
      return newTime;
    });
  }, []);

  const start = useCallback(() => {
    if (isRunning) {
      return;
    }
    timerRef.current = window.setInterval(tick, 1000);
    setIsRunning(true);
    onStart?.();
  }, [tick, onStart]);

  const stop = useCallback(() => {
    if (!isRunning) {
      return;
    }
    setTime(initialTime);
    _clearInterval();
    setIsRunning(false);
    onStop?.();
  }, [onStop]);

  const pause = useCallback(() => {
    if (!isRunning) {
      return;
    }
    _clearInterval();
    setIsRunning(false);

    onPause?.();
  }, [stop, onPause]);

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
