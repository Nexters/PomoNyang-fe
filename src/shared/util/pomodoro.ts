import { PomodoroCycle, PomodoroTime } from '../type';

export const getPomodoroTime = (cycle: PomodoroCycle): PomodoroTime => {
  const now = cycle.endAt ?? Date.now();
  const maxElapsedTime = cycle.goalTime + cycle.exceedMaxTime;
  const elapsed = Math.min(maxElapsedTime, now - cycle.startAt);
  const exceeded = Math.min(cycle.exceedMaxTime, elapsed - cycle.goalTime);

  return { elapsed, exceeded };
};
