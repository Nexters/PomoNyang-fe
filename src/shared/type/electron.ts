import {
  PomodoroCycle,
  PomodoroEndReason,
  PomodoroManagerConfigWithoutCallbacks,
  PomodoroMode,
  PomodoroTime,
} from './pomodoro';

// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  getMachineId: () => Promise<string>;
  changeTrayIcon: (icon: string) => void;
  changeTrayTitle: (title: string) => void;
  getAlwaysOnTop: () => Promise<boolean>;
  setAlwaysOnTop: (isAlwaysOnTop: boolean) => Promise<void>;
  getMinimized: () => Promise<boolean>;
  setMinimized: (isMinimized: boolean) => Promise<void>;

  // pomodoro
  setupPomodoro: (config: PomodoroManagerConfigWithoutCallbacks) => Promise<void>;
  startFocus: () => Promise<void>;
  startRestWait: () => Promise<void>;
  startRest: () => Promise<void>;
  endPomodoro: (reason: PomodoroEndReason) => Promise<void>;

  onTickPomodoro: (callback: (cycles: PomodoroCycle[], time: PomodoroTime) => void) => void;
  onEndPomodoro: (callback: (cycles: PomodoroCycle[], reason: PomodoroEndReason) => void) => void;
  onOnceExceedGoalTime: (callback: (mode: PomodoroMode) => void) => void;
}
