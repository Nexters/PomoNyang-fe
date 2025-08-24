import { useEffect, useRef, useState } from 'react';

import {
  EndPomodoroCallback,
  OnceExceedGoalTimeCallback,
  PomodoroCycle,
  PomodoroEndReason,
  PomodoroManagerConfig,
  PomodoroTime,
  TickPomodoroCallback,
} from 'shared/type';

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
    const tickPomodoroCallback: TickPomodoroCallback = (_, cycles, time) => {
      setPomodoroCycles(cycles);
      setPomodoroTime(time);
    };
    const endPomodoroCallback: EndPomodoroCallback = (_, cycles, reason) => {
      callbacksRef.current.onEndPomodoro(cycles, reason);
    };
    const onceExceedGoalTimeCallback: OnceExceedGoalTimeCallback = (_, mode) => {
      callbacksRef.current.onceExceedGoalTime?.(mode);
    };

    window.electronAPI.onTickPomodoro(tickPomodoroCallback);
    window.electronAPI.onEndPomodoro(endPomodoroCallback);
    window.electronAPI.onOnceExceedGoalTime(onceExceedGoalTimeCallback);

    window.electronAPI.setupPomodoro({
      focusTime,
      focusExceedMaxTime,
      restWaitExceedMaxTime,
      restTime,
      restExceedMaxTime,
    });

    return () => {
      window.electronAPI.offTickPomodoro(tickPomodoroCallback);
      window.electronAPI.offEndPomodoro(endPomodoroCallback);
      window.electronAPI.offOnceExceedGoalTime(onceExceedGoalTimeCallback);
    };
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
