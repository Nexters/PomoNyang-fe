import { useState, useEffect, useCallback, useRef } from 'react';
type TUseTimer = {
  initialTime: number;
  mode?: 'up' | 'down';
  onStart?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
};

/**
 * @returns time: 초 단위
 */
export const useTimer = (props: TUseTimer) => {
  const { initialTime, mode = 'down', onStart, onStop, onPause, onFinish } = props;

  const [time, setTime] = useState(initialTime);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      _clearInterval();
    };
  }, []);

  const tick = useCallback(() => {
    setTime((prevTime) => {
      if (mode === 'up') {
        return prevTime + 1;
      } else {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          onFinish?.();
          stop();
          return 0;
        }
        return newTime;
      }
    });
  }, [mode]);

  const start = useCallback(() => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(tick, 1000);
    onStart?.();
  }, [tick, onStart]);

  const stop = useCallback(() => {
    setTime(initialTime);
    _clearInterval();
    onStop?.();
  }, [onStop]);

  const pause = useCallback(() => {
    _clearInterval();
    onPause?.();
  }, [stop, onPause]);

  const _clearInterval = () => {
    if (timerRef.current === null) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return {
    time,
    isRunning: timerRef.current !== null,
    start,
    stop,
    pause,
  };
};
