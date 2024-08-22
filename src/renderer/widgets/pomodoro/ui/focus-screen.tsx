import { Time } from '@/features/time';
import { useUser } from '@/features/user';
import catFocusMotionRiveFile from '@/shared/assets/rivs/cat_focus.riv';
import { useRiveCat } from '@/shared/hooks';
import { Button, Icon, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName, msToTime } from '@/shared/utils';

type FocusScreenProps = {
  currentCategory: string;
  time: number;
  handleRest: () => void;
  handleEnd: () => void;
};

const toolTipContentMap: Record<string, string> = {
  default: '잘 집중하고 있는 거냥?',
  exceed: '이제 나랑 놀자냥!',
};

export const FocusScreen = ({ currentCategory, time, handleRest, handleEnd }: FocusScreenProps) => {
  const { minutes, seconds } = msToTime(time > 0 ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(time < 0 ? -time : 0);

  const isExceed = time < 0;

  const { data: user } = useUser();
  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catFocusMotionRiveFile,
    stateMachines: 'State Machine_Focus',
    userCatType: user?.cat?.type,
  });

  return (
    <div className="relative flex flex-col h-full">
      <header className="flex p-4">
        <div className="flex gap-sm subBody-sb text-text-tertiary bg-background-secondary p-md rounded-xs w-[80px]">
          <Icon name={getCategoryIconName(currentCategory)} size="sm" />
          {currentCategory}
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1">
        <Tooltip
          content={isExceed ? toolTipContentMap.exceed : toolTipContentMap.default}
          color="white"
          sideOffset={-20}
          rootProps={{ open: true }}
          arrowProps={{ width: 14, height: 9 }}
        />
        <RiveComponent
          className="w-full h-[240px] cursor-pointer select-none"
          onClick={() => {
            clickCatInput?.fire();
          }}
        />
        <div className="flex flex-col items-center mt-xl">
          <div className="flex gap-xs">
            <Icon name="focusTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">집중시간</span>
          </div>
          <Time minutes={minutes} seconds={seconds} className="header-1 text-text-primary gap-xs" />
          <div className={cn('flex items-center gap-xs', isExceed ? 'opacity-100' : 'opacity-0')}>
            <Time
              minutes={exceedMinutes}
              seconds={exceedSeconds}
              className="gap-0 text-text-accent-1 header-4"
            />
            <span className="text-text-accent-1 header-4">초과</span>
          </div>
        </div>
      </main>
      <div className="flex flex-col items-center w-full pb-5">
        <Button
          variant={isExceed ? 'primary' : 'secondary'}
          className="p-xl w-[200px]"
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
