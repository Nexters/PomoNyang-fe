import { Time } from '@/features/time';
import { useUser } from '@/features/user';
import hairballImage from '@/shared/assets/images/hairball.png';
import catFocusMotionRiveFile from '@/shared/assets/rivs/cat_focus.riv';
import { useRiveCat } from '@/shared/hooks';
import { Button, Icon, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName, msToTime } from '@/shared/utils';

type FocusScreenProps = {
  currentCategory: string;
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
        <header className="flex p-[10px]">
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
              onClick={() => setMinimized(false)}
            >
              <Icon name="minimizeOn" size="md" />
            </button>
          </div>
        </header>
        <div className="flex items-center p-6 pt-3">
          <div>
            <h2 className="body-sb flex gap-1 text-text-tertiary">
              <Icon name={getCategoryIconName(currentCategory)} size="sm" />
              {currentCategory}
            </h2>
            <Time
              minutes={minutes}
              seconds={seconds}
              className="mb-1 mt-2 gap-xs text-[40px] font-bold leading-[48px] tracking-[-.02em] text-text-primary"
            />
            <div className={cn('flex items-center gap-xs', isExceed ? 'opacity-100' : 'opacity-0')}>
              <Time
                minutes={exceedMinutes}
                seconds={exceedSeconds}
                className="header-5 gap-0 text-text-accent-1"
              />
              <span className="header-5 text-text-accent-1">초과</span>
            </div>
          </div>
          <div className="flex-1" />
          <img src={hairballImage} width="86" height="86" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <header className="flex p-4">
        <div className="subBody-sb flex w-[80px] gap-sm rounded-xs bg-background-secondary p-md text-text-tertiary">
          <Icon name={getCategoryIconName(currentCategory)} size="sm" />
          {currentCategory}
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
      <main className="flex flex-1 flex-col items-center justify-center">
        <Tooltip
          content={isExceed ? toolTipContentMap.exceed : toolTipContentMap.default}
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
        <div className="mt-xl flex flex-col items-center">
          <div className="flex gap-xs">
            <Icon name="focusTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">집중시간</span>
          </div>
          <Time minutes={minutes} seconds={seconds} className="header-1 gap-xs text-text-primary" />
          <div className={cn('flex items-center gap-xs', isExceed ? 'opacity-100' : 'opacity-0')}>
            <Time
              minutes={exceedMinutes}
              seconds={exceedSeconds}
              className="header-4 gap-0 text-text-accent-1"
            />
            <span className="header-4 text-text-accent-1">초과</span>
          </div>
        </div>
      </main>
      <div className="flex w-full flex-col items-center pb-5">
        <Button
          variant={isExceed ? 'primary' : 'secondary'}
          className="w-[200px] p-xl"
          size="lg"
          onClick={handleRest}
        >
          휴식하기
        </Button>
        <Button variant="text-secondary" size="md" onClick={handleEnd}>
          집중 끝내기
        </Button>
      </div>
    </div>
  );
};
