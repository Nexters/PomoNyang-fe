import {
  PomodoroCycle,
  PomodoroEndReason,
  PomodoroManagerConfigWithoutCallbacks,
  PomodoroMode,
  PomodoroTime,
} from './pomodoro';

export type TickPomodoroCallback = (
  event: Electron.IpcRendererEvent,
  cycles: PomodoroCycle[],
  time: PomodoroTime,
) => void;
export type EndPomodoroCallback = (
  event: Electron.IpcRendererEvent,
  cycles: PomodoroCycle[],
  reason: PomodoroEndReason,
) => void;
export type OnceExceedGoalTimeCallback = (
  event: Electron.IpcRendererEvent,
  mode: PomodoroMode,
) => void;

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

  onTickPomodoro: (callback: TickPomodoroCallback) => void;
  offTickPomodoro: (callback: TickPomodoroCallback) => void;
  onEndPomodoro: (callback: EndPomodoroCallback) => void;
  offEndPomodoro: (callback: EndPomodoroCallback) => void;
  onOnceExceedGoalTime: (callback: OnceExceedGoalTimeCallback) => void;
  offOnceExceedGoalTime: (callback: OnceExceedGoalTimeCallback) => void;
}
