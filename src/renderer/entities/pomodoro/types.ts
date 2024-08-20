export type Pomodoro = {
  clientFocusTimeId: string;
  categoryNo: number;
  focusedTime: string;
  restedTime: string;
  doneAt: string;
};

export type PomodoroMode = 'focus' | 'rest-wait' | 'rest';

export type PomodoroNextAction = 'plus' | 'minus';
