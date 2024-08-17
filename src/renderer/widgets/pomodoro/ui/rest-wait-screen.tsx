import { useEffect } from 'react';

import { CategoryChip } from '@/features/category/ui/category-chip';
import { Time } from '@/features/time';
import { useTimer } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { msToTime } from '@/shared/utils';

type RestWaitScreenProps = {
  currentCategory: string;
  time: number;
  handleRest: () => void;
  handleEnd: () => void;
  handleInit: () => void;
};

// @TODO: 60분으로 수정
const MAX_TIME_ON_PAGE = 1000 * 60;

export const RestWaitScreen = ({
  currentCategory,
  time,
  handleRest,
  handleEnd,
  handleInit,
}: RestWaitScreenProps) => {
  const { minutes, seconds } = msToTime(time > 0 ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(time < 0 ? -time : 0);

  const { start, stop } = useTimer(MAX_TIME_ON_PAGE, 0, {
    onFinish: () => {
      handleInit();
    },
  });

  const isExceed = time < 0;

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="h-[56px]" />
      <main className="flex flex-col items-center gap-xl">
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
        <div>다음부터 집중 시간을 바꿀까요?</div>
      </main>
      <div className="absolute left-0 flex flex-col items-center w-full m-auto bottom-4">
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
