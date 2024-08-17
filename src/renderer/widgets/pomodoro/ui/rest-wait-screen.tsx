import { useEffect, useRef } from 'react';

import { PomodoroNextAction } from '@/entities/pomodoro';
import { CategoryChip } from '@/features/category/ui/category-chip';
import { Time } from '@/features/time';
import { MAX_FOCUS_MINUTES, MIN_FOCUS_MINUTES, MINUTES_GAP } from '@/shared/constants';
import { useTimer } from '@/shared/hooks';
import { Button, Icon, SelectGroup, SelectGroupItem } from '@/shared/ui';
import { msToTime } from '@/shared/utils';

type RestWaitScreenProps = {
  currentCategory: string;
  currentFocusMinutes: number;
  time: number;
  handleRest: () => void;
  handleEnd: () => void;
  handleInit: () => void;
  selectedNextAction: PomodoroNextAction | undefined;
  setSelectedNextAction: (nextAction: PomodoroNextAction) => void;
};

// @TODO: 60분으로 수정
const MAX_TIME_ON_PAGE = 1000 * 5; // 5초

export const RestWaitScreen = ({
  currentCategory,
  currentFocusMinutes,
  time,
  handleRest,
  handleEnd,
  handleInit,
  selectedNextAction,
  setSelectedNextAction,
}: RestWaitScreenProps) => {
  const { minutes, seconds } = msToTime(time > 0 ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(time < 0 ? -time : 0);

  const onFinishRef = useRef(handleInit);

  const isExceed = time < 0;

  const { start, stop } = useTimer(MAX_TIME_ON_PAGE, 0, {
    onFinishRef,
  });

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="h-[56px]" />
      <main className="flex flex-col items-center justify-center flex-1 gap-5">
        <div className="flex flex-col items-center justify-center gap-sm">
          <CategoryChip category={currentCategory} />
          <Time minutes={minutes} seconds={seconds} className="header-1 text-text-primary gap-xs" />
          {isExceed && (
            <div className="flex items-center gap-xs">
              <Time
                minutes={exceedMinutes}
                seconds={exceedSeconds}
                className="gap-0 text-text-accent-1 header-4"
              />
              <span className="text-text-accent-1 header-4">초과</span>
            </div>
          )}
        </div>
        <div className="w-[240px] h-[240px] bg-background-secondary" />
        <div className="flex flex-col gap-3">
          <p className="body-sb text-text-disabled">다음부터 집중시간을 바꿀까요?</p>
          <SelectGroup
            className="flex"
            value={selectedNextAction}
            onValueChange={setSelectedNextAction}
          >
            <SelectGroupItem
              disabled={currentFocusMinutes - MINUTES_GAP <= MIN_FOCUS_MINUTES}
              value="minus"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2"
            >
              <Icon name="minusSvg" size="sm" className="[&>path]:stroke-icon-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
            <SelectGroupItem
              disabled={currentFocusMinutes + MINUTES_GAP >= MAX_FOCUS_MINUTES}
              value="plus"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2"
            >
              <Icon name="plusSvg" size="sm" className="[&>path]:stroke-icon-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
          </SelectGroup>
        </div>
      </main>
      <div className="flex flex-col items-center w-full pb-5">
        <Button variant="primary" className="p-xl w-[200px]" size="lg" onClick={handleRest}>
          휴식 시작하기
        </Button>
        <Button variant="text-secondary" size="md" onClick={handleEnd}>
          집중 끝내기
        </Button>
      </div>
    </div>
  );
};
