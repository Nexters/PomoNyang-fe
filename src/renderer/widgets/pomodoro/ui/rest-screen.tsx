import { PomodoroNextAction } from 'shared/type';
import { msToTime } from 'shared/util';

import { Category } from '@/entities/category';
import { Time } from '@/features/time';
import { useUser } from '@/features/user';
import hairballImage from '@/shared/assets/images/hairball.png';
import catRestMotionRiveFile from '@/shared/assets/rivs/cat_rest.riv';
import { MAX_REST_MINUTES, MIN_REST_MINUTES, MINUTES_GAP } from '@/shared/constants';
import { useRiveCat } from '@/shared/hooks';
import { Button, Icon, SelectGroup, SelectGroupItem, SimpleLayout, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName } from '@/shared/utils';

type RestScreenProps = {
  currentCategory: Category;
  currentRestTime: number;
  elapsedTime: number;
  exceededTime: number;
  currentRestMinutes: number;
  selectedNextAction: PomodoroNextAction | undefined;
  minimized: boolean;
  alwaysOnTop: boolean;
  setSelectedNextAction: (nextAction: PomodoroNextAction) => void;
  handleFocus: () => void;
  handleEnd: () => void;
  setMinimized: (next: boolean) => void;
  setAlwaysOnTop: (next: boolean) => void;
};

export const RestScreen = ({
  currentCategory,
  currentRestTime,
  elapsedTime,
  exceededTime,
  currentRestMinutes,
  selectedNextAction,
  minimized,
  alwaysOnTop,
  setSelectedNextAction,
  handleFocus,
  handleEnd,
  setMinimized,
  setAlwaysOnTop,
}: RestScreenProps) => {
  const isExceed = exceededTime > 0;
  const { minutes, seconds } = msToTime(currentRestTime - elapsedTime);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(exceededTime);

  const { data: user } = useUser();
  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catRestMotionRiveFile,
    stateMachines: 'State Machine_Home',
    userCatType: user?.cat?.type,
  });

  if (minimized) {
    return (
      <div className="flex h-full flex-col">
        <header className="drag-region flex p-[10px]">
          <div className="drag-region flex-1" />
          <div className="drag-region flex gap-2">
            <button
              className="rounded-full p-2 hover:bg-background-secondary"
              onClick={() => setAlwaysOnTop(!alwaysOnTop)}
            >
              <Icon name={alwaysOnTop ? 'pinOn' : 'pinOff'} size="md" />
            </button>
            <button
              className="rounded-full p-2 hover:bg-background-secondary"
              onClick={() => setMinimized(false)}
            >
              <Icon name="minimizeOn" size="md" />
            </button>
          </div>
        </header>
        <div className="flex items-center p-6 pt-3">
          <div className="flex flex-col items-start justify-center">
            <h2 className="body-sb flex gap-1 text-text-tertiary">
              <Icon name={getCategoryIconName(currentCategory.iconType)} size="sm" />
              {currentCategory.title}
            </h2>
            <Time
              minutes={minutes}
              seconds={seconds}
              className="mb-1 mt-2 gap-xs text-[40px] font-bold leading-[48px] tracking-[-.02em] text-text-primary"
            />
            {isExceed && (
              <div className="flex items-center gap-xs">
                <Time
                  minutes={exceedMinutes}
                  seconds={exceedSeconds}
                  className="header-5 gap-0 text-text-accent-1"
                />
                <span className="header-5 text-text-accent-1">초과</span>
              </div>
            )}
          </div>
          <div className="flex-1" />
          <img src={hairballImage} width="86" height="86" />
        </div>
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="relative flex h-full flex-col">
        <header className="flex px-4 py-2">
          <div className="subBody-sb flex h-[40px] items-center gap-sm rounded-xs bg-background-secondary px-3 py-2 text-text-tertiary">
            <Icon name={getCategoryIconName(currentCategory.iconType)} size="sm" />
            {currentCategory.title}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2">
            <button
              className="rounded-full p-2 hover:bg-background-secondary"
              onClick={() => setAlwaysOnTop(!alwaysOnTop)}
            >
              <Icon name={alwaysOnTop ? 'pinOn' : 'pinOff'} size="md" />
            </button>
            <button
              className="rounded-full p-2 hover:bg-background-secondary"
              onClick={() => setMinimized(true)}
            >
              <Icon name="minimizeOff" size="md" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <Tooltip
            content={!isExceed ? '쉬는게 제일 좋다냥' : '이제 다시 사냥놀이 하자냥!'}
            color="white"
            sideOffset={-40}
            rootProps={{ open: true }}
            arrowProps={{ width: 14, height: 9 }}
          >
            <RiveComponent
              className="h-[240px] w-[240px] cursor-pointer select-none"
              onClick={() => {
                clickCatInput?.fire();
              }}
            />
          </Tooltip>

          <div className="flex flex-col items-center py-3">
            <div className="flex gap-xs">
              <Icon name="restTime" width={20} height={20} />
              <span className="header-5 text-text-secondary">휴식시간</span>
            </div>
            <Time
              minutes={minutes}
              seconds={seconds}
              className="header-1 gap-xs text-text-primary"
            />
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
              type="single"
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

        <div className="flex w-full flex-col items-center gap-2 pb-5">
          <Button
            variant="secondary"
            className="h-[60px] w-[200px]"
            size="lg"
            onClick={handleFocus}
          >
            한번 더 집중하기
          </Button>
          <Button variant="text-secondary" size="md" className="h-[40px]" onClick={handleEnd}>
            집중 끝내기
          </Button>
        </div>
      </div>
    </SimpleLayout>
  );
};
