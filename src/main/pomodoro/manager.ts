import {
  PomodoroCycle,
  PomodoroEndReason,
  PomodoroManagerConfig,
  PomodoroMode,
  PomodoroTime,
} from '../../shared/type';
import { parse, padNumber, msToTime, getPomodoroTime } from '../../shared/util';

import { SimpleStorage } from './util/storage';

const STORAGE_KEY = {
  POMODORO_CYCLES: 'pomodoroCycles',
  POMODORO_TIME: 'pomodoroTime',
  POMODORO_CALLED_ONCE_FOR_EXCEED_TIME: 'pomodoroCalledOnceForExceedTime',
};
const DEFAULT_POMODORO_TIME: PomodoroTime = { elapsed: 0, exceeded: 0 };

export class PomodoroManager {
  storage: SimpleStorage;
  pomodoroCycles: PomodoroCycle[];
  pomodoroTime: { elapsed: number; exceeded: number };
  calledOnceForExceedGoalTime: boolean;
  tickId?: NodeJS.Timeout;

  constructor(public config: PomodoroManagerConfig) {
    // setup
    this.storage = new SimpleStorage();
    this.pomodoroCycles = parse(this.storage.getItem(STORAGE_KEY.POMODORO_CYCLES), []);
    this.pomodoroTime = parse(
      this.storage.getItem(STORAGE_KEY.POMODORO_TIME),
      DEFAULT_POMODORO_TIME,
    );
    this.calledOnceForExceedGoalTime =
      (this.storage.getItem(STORAGE_KEY.POMODORO_CALLED_ONCE_FOR_EXCEED_TIME), false);

    // run tick
    this._runTick();
  }

  _save() {
    this.storage.setItem(STORAGE_KEY.POMODORO_CYCLES, JSON.stringify(this.pomodoroCycles));
    this.storage.setItem(STORAGE_KEY.POMODORO_TIME, JSON.stringify(this.pomodoroTime));
    this.storage.setItem(
      STORAGE_KEY.POMODORO_CALLED_ONCE_FOR_EXCEED_TIME,
      JSON.stringify(this.calledOnceForExceedGoalTime),
    );
  }

  _clear() {
    this.pomodoroCycles = [];
    this.pomodoroTime = DEFAULT_POMODORO_TIME;
    this.calledOnceForExceedGoalTime = false;

    this.storage.removeItem(STORAGE_KEY.POMODORO_CYCLES);
    this.storage.removeItem(STORAGE_KEY.POMODORO_TIME);
    this.storage.removeItem(STORAGE_KEY.POMODORO_CALLED_ONCE_FOR_EXCEED_TIME);
  }

  _tick() {
    const currentCycle = this.pomodoroCycles[this.pomodoroCycles.length - 1];
    if (!currentCycle) return;

    const { elapsed, exceeded } = getPomodoroTime(currentCycle);
    this.pomodoroTime = { elapsed, exceeded };

    if (exceeded > 0 && !this.calledOnceForExceedGoalTime) {
      this.config.onceExceedGoalTime?.(currentCycle.mode);
      this.calledOnceForExceedGoalTime = true;
    }

    if (exceeded >= currentCycle.exceedMaxTime) {
      if (currentCycle.mode === 'focus') {
        this.startRestWait();
      }
      if (currentCycle.mode === 'rest-wait') {
        this.endPomodoro('exceed');
      }
      if (currentCycle.mode === 'rest') {
        this.endPomodoro('exceed');
      }
    }
  }

  // FIXME: tick이 타이머 실행중일 때만 돌 수 있도록 해야함
  _runTick() {
    clearInterval(this.tickId);

    this.tickId = setInterval(() => {
      // @note: hmr로 인해 this 객체가 사라지면, 에러가 발생함.
      try {
        this._tick();
        this.config.onTickPomodoro?.(this.pomodoroCycles, this.pomodoroTime);
      } catch (error) {
        clearInterval(this.tickId);
      }
    }, 200);
  }

  updateConfig(config: Partial<PomodoroManagerConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  destroy() {
    clearTimeout(this.tickId);
  }

  startFocus() {
    const nextCycles = PomodoroManager.updateCycles(this.pomodoroCycles, {
      startAt: Date.now(),
      goalTime: this.config.focusTime,
      exceedMaxTime: this.config.focusExceedMaxTime,
      mode: 'focus',
    });
    this.pomodoroCycles = nextCycles;
    this.pomodoroTime = DEFAULT_POMODORO_TIME;
    this.calledOnceForExceedGoalTime = false;
    this._save();
  }

  startRestWait() {
    const nextCycles = PomodoroManager.updateCycles(this.pomodoroCycles, {
      startAt: Date.now(),
      goalTime: 0,
      exceedMaxTime: this.config.restWaitExceedMaxTime,
      mode: 'rest-wait',
    });
    this.pomodoroCycles = nextCycles;
    this.pomodoroTime = DEFAULT_POMODORO_TIME;
    this.calledOnceForExceedGoalTime = false;
    this._save();
  }

  startRest() {
    const nextCycles = PomodoroManager.updateCycles(this.pomodoroCycles, {
      startAt: Date.now(),
      goalTime: this.config.restTime,
      exceedMaxTime: this.config.restExceedMaxTime,
      mode: 'rest',
    });
    this.pomodoroCycles = nextCycles;
    this.pomodoroTime = DEFAULT_POMODORO_TIME;
    this.calledOnceForExceedGoalTime = false;
    this._save();
  }

  endPomodoro(reason: PomodoroEndReason = 'manual') {
    const endedCycles = PomodoroManager.updateCycles(this.pomodoroCycles);
    this.config.onEndPomodoro(endedCycles, reason);

    // 상위로 전달했으니 cycle 데이터 초기화
    this._clear();
  }

  static updateCycles(cycles: PomodoroCycle[], nextCycle?: PomodoroCycle): PomodoroCycle[] {
    const prevCycles = cycles.slice(0, -1);
    const lastCycle = cycles[cycles.length - 1] as PomodoroCycle | undefined;

    if (lastCycle?.mode === nextCycle?.mode) {
      throw new Error('Invalid mode cycle');
    }

    return [
      ...prevCycles,
      lastCycle && {
        ...lastCycle,
        endAt: Date.now(),
      },
      nextCycle,
    ].filter(Boolean) as PomodoroCycle[];
  }

  static getFormattedTime(goalTime: number, { elapsed, exceeded }: PomodoroTime) {
    const isExceed = exceeded > 0;
    const { minutes, seconds } = msToTime(isExceed ? exceeded : goalTime - elapsed);
    const time = `${padNumber(minutes)}:${padNumber(seconds)}`;
    return { isExceed, time };
  }

  static getTrayIcon(mode: PomodoroMode, isExceed: boolean) {
    if (mode === 'focus') {
      return isExceed ? 'focus-exceed' : 'focus';
    }
    if (mode === 'rest') {
      return isExceed ? 'rest-exceed' : 'rest';
    }
    return '';
  }

  static getTrayInfo(cycles: PomodoroCycle[], time: PomodoroTime) {
    const currentCycle = cycles[cycles.length - 1];
    if (!currentCycle) return { icon: '', time: '' };

    const mode = currentCycle.mode;
    // 휴식 대기 중에는 직전 아이콘 그대로 보여주기 위해 null 반환
    if (mode === 'rest-wait') return null;

    const { isExceed, time: formattedTime } = PomodoroManager.getFormattedTime(
      currentCycle.goalTime,
      time,
    );
    const trayIcon = PomodoroManager.getTrayIcon(currentCycle.mode, isExceed);
    return { icon: trayIcon, time: formattedTime };
  }
}
