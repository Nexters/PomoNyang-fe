import { useState } from 'react';

import { Time } from '@/features/time';
import { Button, Icon, SelectGroup, SelectGroupItem, Tooltip } from '@/shared/ui';
import { cn, getCategoryIconName, msToTime } from '@/shared/utils';

type RestScreenProps = {
  currentCategory: string;
  time: number;
  currentFocusMinutes: number;
  handleFocus: () => void;
  handleEnd: () => void;
};

export const RestScreen = ({
  currentCategory,
  time,
  // currentFocusMinutes,
  handleFocus,
  handleEnd,
}: RestScreenProps) => {
  const [selectedAction, setSelectedAction] = useState<string>();
  const isExceed = time < 0;
  const { minutes, seconds } = msToTime(!isExceed ? time : 0);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(isExceed ? -time : 0);

  return (
    <div className="relative flex flex-col h-full">
      <header className="flex px-5 py-2">
        <div className="h-[40px] flex items-center gap-sm subBody-sb text-text-tertiary bg-background-secondary px-3 py-2 rounded-xs">
          <Icon name={getCategoryIconName(currentCategory)} size="sm" />
          {currentCategory}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 gap-5">
        <Tooltip
          content={!isExceed ? '쉬는게 제일 좋다냥' : '이제 다시 사냥놀이 하자냥!'}
          color="white"
          sideOffset={-20}
          rootProps={{ open: true }}
        >
          {/* TODO: 고양이 유형에 따라 다른 이미지 */}
          <div className="w-[240px] h-[240px] bg-background-secondary" />
        </Tooltip>

        <div className="flex flex-col items-center py-3">
          <div className="flex gap-xs">
            <Icon name="restTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">휴식시간</span>
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

        <div className="flex flex-col gap-3">
          <p className="body-sb text-text-disabled">다음부터 휴식시간을 바꿀까요?</p>
          <SelectGroup className="flex" value={selectedAction} onValueChange={setSelectedAction}>
            {/* TODO: -/+ 아이콘 색상 변경 */}
            <SelectGroupItem
              value="minus"
              className="flex flex-row justify-center items-center gap-1 py-2 px-3"
            >
              <Icon name="minus" size="sm" className="text-text-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
            <SelectGroupItem
              value="plus"
              className="flex flex-row justify-center items-center gap-1 py-2 px-3"
            >
              <Icon name="plus" size="sm" color="fill-text-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
          </SelectGroup>
        </div>
      </main>

      <div className="flex flex-col items-center w-full pb-5">
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
