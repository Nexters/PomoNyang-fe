import { PomodoroNextAction } from '@/entities/pomodoro';
import { Time } from '@/features/time';
import { useUser } from '@/features/user';
import catRestMotionRiveFile from '@/shared/assets/rivs/cat_rest.riv';
import { MAX_REST_MINUTES, MIN_REST_MINUTES, MINUTES_GAP } from '@/shared/constants';
import { useRiveCat } from '@/shared/hooks';
import { Button, Icon, SelectGroup, SelectGroupItem, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName, msToTime } from '@/shared/utils';

type RestScreenProps = {
  currentCategory: string;
  time: number;
  currentRestMinutes: number;
  selectedNextAction: PomodoroNextAction | undefined;
  setSelectedNextAction: (nextAction: PomodoroNextAction) => void;
  handleFocus: () => void;
  handleEnd: () => void;
};

export const RestScreen = ({
  currentCategory,
  time,
  currentRestMinutes,
  selectedNextAction,
  setSelectedNextAction,
  handleFocus,
  handleEnd,
}: RestScreenProps) => {
  const isExceed = time < 0;
  const { minutes, seconds } = msToTime(!isExceed ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(isExceed ? -time : 0);

  const { data: user } = useUser();
  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catRestMotionRiveFile,
    stateMachines: 'State Machine_Home',
    userCatType: user?.cat?.type,
  });

  return (
    <div className="relative flex h-full flex-col">
      <header className="flex px-5 py-2">
        <div className="subBody-sb flex h-[40px] items-center gap-sm rounded-xs bg-background-secondary px-3 py-2 text-text-tertiary">
          <Icon name={getCategoryIconName(currentCategory)} size="sm" />
          {currentCategory}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-5">
        <Tooltip
          content={!isExceed ? '쉬는게 제일 좋다냥' : '이제 다시 사냥놀이 하자냥!'}
          color="white"
          sideOffset={-20}
          rootProps={{ open: true }}
          arrowProps={{ width: 14, height: 9 }}
        />
        <RiveComponent
          className="h-[240px] w-full cursor-pointer select-none"
          onClick={() => {
            clickCatInput?.fire();
          }}
        />
        <div className="flex flex-col items-center py-3">
          <div className="flex gap-xs">
            <Icon name="restTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">휴식시간</span>
          </div>
          <Time minutes={minutes} seconds={seconds} className="header-1 gap-xs text-text-primary" />
          <div className={cn('flex items-center gap-xs', !isExceed && 'opacity-0')}>
            <Time
              minutes={exceedMinutes}
              seconds={exceedSeconds}
              className="header-4 gap-0 text-text-accent-1"
            />
            <span className="header-4 text-text-accent-1">초과</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="body-sb text-text-disabled">다음부터 휴식시간을 바꿀까요?</p>
          <SelectGroup
            className="flex"
            value={selectedNextAction}
            onValueChange={setSelectedNextAction}
          >
            <SelectGroupItem
              disabled={currentRestMinutes - MINUTES_GAP <= MIN_REST_MINUTES}
              value="minus"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2"
            >
              <Icon name="minusSvg" size="sm" className="[&>path]:stroke-icon-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
            <SelectGroupItem
              disabled={currentRestMinutes + MINUTES_GAP >= MAX_REST_MINUTES}
              value="plus"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2"
            >
              <Icon name="plusSvg" size="sm" className="[&>path]:stroke-icon-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
          </SelectGroup>
        </div>
      </main>

      <div className="flex w-full flex-col items-center pb-5">
        <Button variant="secondary" className="w-[200px]" size="lg" onClick={handleFocus}>
          한번 더 집중하기
        </Button>
        <Button variant="text-secondary" size="md" onClick={handleEnd}>
          집중 끝내기
        </Button>
      </div>
    </div>
  );
};
