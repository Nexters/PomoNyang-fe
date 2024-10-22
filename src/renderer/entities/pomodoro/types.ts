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
