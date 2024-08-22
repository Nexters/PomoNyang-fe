import { useCallback, useEffect } from 'react';

import { useLocalStorage } from 'usehooks-ts';

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

export type PomodoroCycle = {
  startAt: number;
  endAt?: number;
  goalTime: number;
  exceedMaxTime: number;
  mode: 'focus' | 'rest-wait' | 'rest';
};

export type PomodoroTime = {
  elapsed: number;
  exceeded: number;
};

export type PomodoroParams = {
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
  // TODO:
  submitPomodoro: (cycles: PomodoroCycle[]) => void;
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

export const usePomodoro = ({
  focusTime,
  focusExceedMaxTime,
  restWaitExceedMaxTime,
  restTime,
  restExceedMaxTime,
}: PomodoroParams) => {
  const [pomodoroCycles, setPomodoroCycles] = useLocalStorage<PomodoroCycle[]>(
    'pomodoro-cycles',
    [],
  );
  const [pomodoroTime, setPomodoroTime] = useLocalStorage<PomodoroTime>('pomodoro-time', {
    elapsed: 0,
    exceeded: 0,
  });

  const startFocus = useCallback(() => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: focusTime,
      exceedMaxTime: focusExceedMaxTime,
      mode: 'focus',
    });
    setPomodoroCycles(nextCycles);
  }, [focusTime, focusExceedMaxTime, pomodoroCycles]);

  const startRestWait = useCallback(() => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: 0,
      exceedMaxTime: restWaitExceedMaxTime,
      mode: 'rest-wait',
    });
    setPomodoroCycles(nextCycles);
  }, [restWaitExceedMaxTime, pomodoroCycles]);

  const startRest = useCallback(() => {
    const nextCycles = updateCycles(pomodoroCycles, {
      startAt: Date.now(),
      goalTime: restTime,
      exceedMaxTime: restExceedMaxTime,
      mode: 'rest',
    });
    setPomodoroCycles(nextCycles);
  }, [restTime, restExceedMaxTime, pomodoroCycles]);

  const endPomodoro = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const endedCycles = updateCycles(pomodoroCycles);

    // TODO: 값 서버에 전달용으로 변환 후 전달
    // submitPomodoro(endedCycles);

    // 초기화
    setPomodoroCycles([]);
  }, [pomodoroCycles]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentCycle = pomodoroCycles[pomodoroCycles.length - 1];
      if (!currentCycle) return;

      const now = Date.now();
      const elapsed = now - currentCycle.startAt;
      const exceeded = elapsed - currentCycle.goalTime;

      setPomodoroTime({ elapsed, exceeded });

      if (exceeded >= currentCycle.exceedMaxTime) {
        if (currentCycle.mode === 'focus') {
          startRestWait();
        }
        if (currentCycle.mode === 'rest-wait') {
          endPomodoro();
        }
        if (currentCycle.mode === 'rest') {
          endPomodoro();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pomodoroCycles, startRestWait, endPomodoro]);

  return {
    pomodoroTime,
    startFocus,
    startRestWait,
    startRest,
    endPomodoro,
  };
};
