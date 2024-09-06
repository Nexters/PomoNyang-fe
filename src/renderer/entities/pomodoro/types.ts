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
  startAt: number;
  endAt?: number;
  goalTime: number;
  exceedMaxTime: number;
  mode: PomodoroMode;
};

export type PomodoroTime = {
  elapsed: number;
  exceeded: number;
};
