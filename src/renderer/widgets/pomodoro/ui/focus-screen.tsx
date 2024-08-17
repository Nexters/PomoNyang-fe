import { Time } from '@/features/time';
import { Button, Icon, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName, msToTime } from '@/shared/utils';

type FocusScreenProps = {
  currentCategory: string;
  time: number;
  handleRest: () => void;
  handleEnd: () => void;
};

export const FocusScreen = ({ currentCategory, time, handleRest, handleEnd }: FocusScreenProps) => {
  const { minutes, seconds } = msToTime(time > 0 ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(time < 0 ? -time : 0);

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
          content="잘 집중하고 있는 거냥?"
          color="white"
          sideOffset={-20}
          rootProps={{ open: true }}
        />
        {/* TODO: 고양이 유형에 따라 다른 이미지 */}
        <div className="w-[240px] h-[240px] bg-background-secondary" />
        <div className="flex flex-col items-center mt-xl">
          <div className="flex gap-xs">
            <Icon name="focusTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">집중시간</span>
          </div>
          <Time minutes={minutes} seconds={seconds} className="header-1 text-text-primary gap-xs" />
          <div
            className={cn(
              'flex items-center gap-xs',
              exceedMinutes === 0 && exceedSeconds === 0 ? 'opacity-0' : 'opacity-100',
            )}
          >
            <Time
              minutes={exceedMinutes}
              seconds={exceedSeconds}
              className="gap-0 text-text-accent-1 header-4"
            />
            <span className="text-text-accent-1 header-4">초과</span>
          </div>
        </div>
      </main>
      <div className="absolute left-0 flex flex-col items-center w-full m-auto bottom-4">
        <Button variant="secondary" className="p-xl w-[200px]" size="lg" onClick={handleRest}>
          휴식하기
        </Button>
        <Button variant="text-secondary" size="md" onClick={handleEnd}>
          집중 끝내기
        </Button>
      </div>
    </div>
  );
};
