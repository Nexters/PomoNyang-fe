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

export type PomodoroManagerConfig = {
  /** 집중시간. (단위는 ms) */
  focusTime: number;
  /** 집중 초과 최대시간. (단위는 ms) */
  focusExceedMaxTime: number;
  /** 휴식대기 초과 최대시간. (단위는 ms) */
  restWaitExceedMaxTime: number;
  /** 휴식시간. (단위는 ms) */
  restTime: number;
  /** 휴식 초과 최대시간. (단위는 ms) */
  restExceedMaxTime: number;
  /** 뽀모도로 매 tick 마다 실행되는 콜백 */
  onTickPomodoro?: (cycles: PomodoroCycle[], time: PomodoroTime) => void;
  /** 뽀모도로 종료시 실행되는 콜백 */
  onEndPomodoro: (cycles: PomodoroCycle[], reason: PomodoroEndReason) => void;
  /** 목표시간 초과시 한번만 실행되는 콜백 */
  onceExceedGoalTime?: (mode: PomodoroMode) => void;
};

export type PomodoroManagerConfigWithoutCallbacks = Omit<
  PomodoroManagerConfig,
  'onTickPomodoro' | 'onEndPomodoro' | 'onceExceedGoalTime'
>;

export type Pomodoro = {
  clientFocusTimeId: string;
  categoryNo: number;
  focusedTime: string;
  restedTime: string;
  doneAt: string;
};

export type PomodoroMode = 'focus' | 'rest-wait' | 'rest';

export type PomodoroNextAction = 'plus' | 'minus';

export type PomodoroEndReason = 'manual' | 'exceed';

export type PomodoroCycle = {
  /* 시작 시각 */
  startAt: number;
  /* 종료 시각. 현재 cycle이 종료되지 않았다면 undefined */
  endAt?: number;
  /* 목표 시간 */
  goalTime: number;
  /* 초과 시간 */
  exceedMaxTime: number;
  /* 모드 */
  mode: PomodoroMode;
};

export type PomodoroTime = {
  /* 지난 시간. 값의 범위: 0 <= elapsed <= cycle.goalTime + cycle.exceedMaxTime */
  elapsed: number;
  /* 초과 시간. 값의 범위: 0 <= exceeded <= cycle.exceedMaxTime */
  exceeded: number;
};
