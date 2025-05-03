import { useEffect } from 'react';

import { PomodoroCycle, PomodoroEndReason, PomodoroMode, PomodoroTime } from 'shared/type';
import { msToTime, padNumber } from 'shared/util';
import { useLocalStorage } from 'usehooks-ts';

import { LOCAL_STORAGE_KEY } from '@/shared/constants';
import { useInterval } from '@/shared/hooks';

// == usePomodoro 로직에 대한 description

// 집중 시작 - 시작 시각: Date.now(), 목표시간: 25 * 60 * 1000(25분, 형식 미정), 모드: focus, 끝난시간: Null로 로컬에 저장

// 집중 중 - 저장한 값과 현재 시각으로 몇분 지났는지 & 초과/미만인지 표시
//   ㄴ 이 때 초과시간이 특정 시간을 넘어가면(ex, 정해논 시간보다 초과시간이 1시간이 넘어가면) 자동 휴식으로 넘어가기

// 휴식 대기 - 집중 끝난시간 값 업데이트. 시작시간: Date.now(), 목표시간: 0, 모드: rest-wait, 끝난시간: null로 저장.

// 휴식 대기 중 - 저장한 값과 현재 시각으로 몇분 지났는지 확인
//   ㄴ 이 때도 초과시간이 특정 시간을 넘어가면 자동 종료(?)하기

// 휴식 시작 - 휴식 대기 끝난시간 없데이트. 휴식 시간, 목표시간, 모드, 끝난시간은 null로 저장.

// 휴식 중 - 저장한 값과 현재 시각으로 몇분 지났는지 & 초과/미만인지 표시
//   ㄴ 이 때도 초과시간이 특정 시간을 넘어가면 자동 종료하기

// 집중 전환 - 휴식 끝난시간 값 업데이트 & … 계속 반복

// 뽀모도로 종료 - 저장된 값 list를 서버에 전달(물론 전달하기 전 변환 필수). 전달 성공시 저장된 값 초기화

// 강제 종료 - 뽀모도로 종료 로직 실행(단, 마지막 끝난시간은 강제 종료시점으로 해서)

export type UsePomodoroParams = {
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
  /** 뽀모도로 종료시 실행되는 콜백 */
  onEndPomodoro: (cycles: PomodoroCycle[], reason: PomodoroEndReason) => void;
  /** 목표시간 초과시 한번만 실행되는 콜백 */
  onceExceedGoalTime?: (mode: PomodoroMode) => void;
};

const isNotNil = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;

const updateCycles = (cycles: PomodoroCycle[], nextCycle?: PomodoroCycle): PomodoroCycle[] => {
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
  ].filter(isNotNil);
};

const getFormattedTime = (goalTime: number, { elapsed, exceeded }: PomodoroTime) => {
  const isExceed = exceeded > 0;
  const { minutes, seconds } = msToTime(isExceed ? exceeded : goalTime - elapsed);
  const time = `${padNumber(minutes)}:${padNumber(seconds)}`;
  return { isExceed, time };
};

const getTrayIcon = (mode: PomodoroMode, isExceed: boolean) => {
  if (mode === 'focus') {
    return isExceed ? 'focus-exceed' : 'focus';
  }
  if (mode === 'rest') {
    return isExceed ? 'rest-exceed' : 'rest';
  }
  return '';
};

export const getPomodoroTime = (cycle: PomodoroCycle): PomodoroTime => {
  const now = cycle.endAt ?? Date.now();
  const maxElapsedTime = cycle.goalTime + cycle.exceedMaxTime;
  const elapsed = Math.min(maxElapsedTime, now - cycle.startAt);
  const exceeded = Math.min(cycle.exceedMaxTime, elapsed - cycle.goalTime);

  return { elapsed, exceeded };
};

const defaultPomodoroTime: PomodoroTime = { elapsed: 0, exceeded: 0 };

export const usePomodoro = ({
  focusTime,
  focusExceedMaxTime,
  restWaitExceedMaxTime,
  restTime,
  restExceedMaxTime,
  onEndPomodoro,
  onceExceedGoalTime,
}: UsePomodoroParams) => {
  const [pomodoroCycles, setPomodoroCycles] = useLocalStorage<PomodoroCycle[]>(
    LOCAL_STORAGE_KEY.POMODORO_CYCLES,
    [],
  );
  const [pomodoroTime, setPomodoroTime] = useLocalStorage<PomodoroTime>(
    LOCAL_STORAGE_KEY.POMODORO_TIME,
    defaultPomodoroTime,
  );
  const [calledOnceForExceedGoalTime, setCalledOnceForExceedGoalTime] = useLocalStorage(
    LOCAL_STORAGE_KEY.POMODORO_CALLED_ONCE_FOR_EXCEED_TIME,
    false,
  );

  const startFocus = () => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: focusTime,
      exceedMaxTime: focusExceedMaxTime,
      mode: 'focus',
    });
    setPomodoroCycles(nextCycles);
    setPomodoroTime(defaultPomodoroTime);
    setCalledOnceForExceedGoalTime(false);
  };

  const startRestWait = () => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: 0,
      exceedMaxTime: restWaitExceedMaxTime,
      mode: 'rest-wait',
    });
    setPomodoroCycles(nextCycles);
    setPomodoroTime(defaultPomodoroTime);
    setCalledOnceForExceedGoalTime(false);
  };

  const startRest = () => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: restTime,
      exceedMaxTime: restExceedMaxTime,
      mode: 'rest',
    });
    setPomodoroCycles(nextCycles);
    setPomodoroTime(defaultPomodoroTime);
    setCalledOnceForExceedGoalTime(false);
  };

  const endPomodoro = (reason: PomodoroEndReason = 'manual') => {
    const endedCycles = updateCycles(pomodoroCycles);
    onEndPomodoro(endedCycles, reason);

    // 상위로 전달했으니 cycle 데이터 초기화
    setPomodoroCycles([]);
    setPomodoroTime(defaultPomodoroTime);
    setCalledOnceForExceedGoalTime(false);
  };

  useInterval(
    () => {
      const currentCycle = pomodoroCycles[pomodoroCycles.length - 1];
      if (!currentCycle) return;

      const { elapsed, exceeded } = getPomodoroTime(currentCycle);
      setPomodoroTime({ elapsed, exceeded });

      if (exceeded > 0 && !calledOnceForExceedGoalTime) {
        onceExceedGoalTime?.(currentCycle.mode);
        setCalledOnceForExceedGoalTime(true);
      }

      if (exceeded >= currentCycle.exceedMaxTime) {
        if (currentCycle.mode === 'focus') {
          startRestWait();
        }
        if (currentCycle.mode === 'rest-wait') {
          endPomodoro('exceed');
        }
        if (currentCycle.mode === 'rest') {
          endPomodoro('exceed');
        }
      }
    },
    pomodoroCycles.length > 0 ? 250 : null,
  );

  useEffect(() => {
    const currentCycle = pomodoroCycles[pomodoroCycles.length - 1];
    if (!currentCycle) {
      window.electronAPI.changeTrayIcon('');
      window.electronAPI.changeTrayTitle('');
      return;
    }

    const { isExceed, time: trayTitle } = getFormattedTime(currentCycle.goalTime, pomodoroTime);
    const mode = currentCycle.mode;
    // 휴식 대기 중에는 직전의 집중 시간을 표시하기 위함
    if (mode !== 'rest-wait') {
      const trayIcon = getTrayIcon(mode, isExceed);
      window.electronAPI.changeTrayIcon(trayIcon);
      window.electronAPI.changeTrayTitle(trayTitle);
    }
  }, [pomodoroCycles, pomodoroTime]);

  return {
    pomodoroCycles,
    pomodoroTime,
    startFocus,
    startRestWait,
    startRest,
    endPomodoro,
  };
};
