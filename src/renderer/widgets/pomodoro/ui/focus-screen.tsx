import { msToTime } from 'shared/util';

import { Category } from '@/entities/category';
import { CategoryChip } from '@/features/category';
import { Time } from '@/features/time';
import { useUser } from '@/features/user';
import hairballImage from '@/shared/assets/images/hairball.png';
import catFocusMotionRiveFile from '@/shared/assets/rivs/cat_focus.riv';
import { useRiveCat } from '@/shared/hooks';
import { Button, Icon, SimpleLayout, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName } from '@/shared/utils';

type FocusScreenProps = {
  currentCategory: Category;
  currentFocusTime: number;
  elapsedTime: number;
  exceededTime: number;
  minimized: boolean;
  alwaysOnTop: boolean;
  handleRest: () => void;
  handleEnd: () => void;
  setMinimized: (next: boolean) => void;
  setAlwaysOnTop: (next: boolean) => void;
};

const toolTipContentMap: Record<string, string> = {
  default: '잘 집중하고 있는 거냥?',
  exceed: '이제 나랑 놀자냥!',
};

export const FocusScreen = ({
  currentCategory,
  currentFocusTime,
  elapsedTime,
  exceededTime,
  minimized,
  alwaysOnTop,
  handleRest,
  handleEnd,
  setMinimized,
  setAlwaysOnTop,
}: FocusScreenProps) => {
  const isExceed = exceededTime > 0;
  const { minutes, seconds } = msToTime(currentFocusTime - elapsedTime);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(exceededTime);

  const { data: user } = useUser();
  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catFocusMotionRiveFile,
    stateMachines: 'State Machine_Focus',
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
          <CategoryChip category={currentCategory} />
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
        <main className="flex flex-1 flex-col items-center justify-center">
          <Tooltip
            content={isExceed ? toolTipContentMap.exceed : toolTipContentMap.default}
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

          <div className="mt-xl flex flex-col items-center">
            <div className="flex gap-xs">
              <Icon name="focusTime" width={20} height={20} />
              <span className="header-5 text-text-secondary">집중시간</span>
            </div>
            <Time
              minutes={minutes}
              seconds={seconds}
              className="header-1 gap-xs text-text-primary"
            />
            <div className={cn('flex items-center gap-xs', isExceed ? 'opacity-100' : 'opacity-0')}>
              <Time
                minutes={exceedMinutes}
                seconds={exceedSeconds}
                className="header-4 gap-0 text-text-accent-red"
              />
              <span className="header-4 text-text-accent-red">초과</span>
            </div>
          </div>
        </main>
        <div className="flex w-full flex-col items-center gap-2 pb-5">
          <Button
            variant={isExceed ? 'primary' : 'secondary'}
            className="h-[60px] w-[200px] p-xl"
            size="lg"
            onClick={handleRest}
          >
            휴식하기
          </Button>
          <Button variant="text-secondary" size="md" className="h-[40px]" onClick={handleEnd}>
            집중 끝내기
          </Button>
        </div>
      </div>
    </SimpleLayout>
  );
};
