import { useEffect, useRef, useState } from 'react';

import { PomodoroCycle, PomodoroEndReason, PomodoroManagerConfig, PomodoroTime } from 'shared/type';

export type UsePomodoroParams = Omit<PomodoroManagerConfig, 'onTickPomodoro'>;

export const usePomodoroByMain = (params: UsePomodoroParams) => {
  const [pomodoroCycles, setPomodoroCycles] = useState<PomodoroCycle[]>([]);
  const [pomodoroTime, setPomodoroTime] = useState<PomodoroTime>({ elapsed: 0, exceeded: 0 });
  const {
    focusTime,
    focusExceedMaxTime,
    restWaitExceedMaxTime,
    restTime,
    restExceedMaxTime,
    ...callbacks
  } = params;
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    window.electronAPI.onTickPomodoro((cycles, time) => {
      setPomodoroCycles(cycles);
      setPomodoroTime(time);
    });
    window.electronAPI.onEndPomodoro((cycles, reason) => {
      callbacksRef.current.onEndPomodoro(cycles, reason);
    });
    window.electronAPI.onOnceExceedGoalTime((mode) => {
      callbacksRef.current.onceExceedGoalTime?.(mode);
    });

    window.electronAPI.setupPomodoro({
      focusTime,
      focusExceedMaxTime,
      restWaitExceedMaxTime,
      restTime,
      restExceedMaxTime,
    });
  }, [focusTime, focusExceedMaxTime, restWaitExceedMaxTime, restTime, restExceedMaxTime]);

  const startFocus = () => {
    window.electronAPI.startFocus();
  };
  const startRestWait = () => {
    window.electronAPI.startRestWait();
  };
  const startRest = () => {
    window.electronAPI.startRest();
  };
  const endPomodoro = (reason: PomodoroEndReason = 'manual') => {
    window.electronAPI.endPomodoro(reason);
  };

  return {
    pomodoroCycles,
    pomodoroTime,
    startFocus,
    startRestWait,
    startRest,
    endPomodoro,
  };
};
