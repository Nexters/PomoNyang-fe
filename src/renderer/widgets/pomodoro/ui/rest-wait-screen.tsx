import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { PomodoroNextAction } from '@/entities/pomodoro';
import { CategoryChip } from '@/features/category';
import { Time } from '@/features/time';
import completeFocusLottie from '@/shared/assets/lotties/loti_complete_focus.json?url';
import particleLottie from '@/shared/assets/lotties/loti_particle.json?url';
import { MAX_FOCUS_MINUTES, MIN_FOCUS_MINUTES, MINUTES_GAP } from '@/shared/constants';
import { Button, Icon, SelectGroup, SelectGroupItem } from '@/shared/ui';
import { minutesToMs, msToTime } from '@/shared/utils';

type RestWaitScreenProps = {
  currentCategory: string;
  currentFocusMinutes: number;
  time: number;
  handleRest: () => void;
  handleEnd: () => void;
  selectedNextAction: PomodoroNextAction | undefined;
  setSelectedNextAction: (nextAction: PomodoroNextAction) => void;
};

export const RestWaitScreen = ({
  currentCategory,
  currentFocusMinutes,
  time, // 전체 경과한 시간
  handleRest,
  handleEnd,
  selectedNextAction,
  setSelectedNextAction,
}: RestWaitScreenProps) => {
  // 만약 전체 경과한 시간이 설정한 focusTime 보다 크면 초과
  const isExceed = time > minutesToMs(currentFocusMinutes);
  const { minutes, seconds } = msToTime(isExceed ? minutesToMs(currentFocusMinutes) : time);
  const { minutes: exceedMinutes, seconds: exceedSeconds } = msToTime(
    isExceed ? time - minutesToMs(currentFocusMinutes) : 0,
  );

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
        <div className="relative w-[240px] h-[240px]">
          <DotLottieReact
            src={completeFocusLottie}
            autoplay
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '240px',
              height: '240px',
            }}
          />
          {isExceed && (
            <DotLottieReact
              src={particleLottie}
              autoplay
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '240px',
                height: '240px',
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="body-sb text-text-disabled">다음부터 집중시간을 바꿀까요?</p>
          <SelectGroup
            className="flex"
            value={selectedNextAction}
            onValueChange={setSelectedNextAction}
          >
            <SelectGroupItem
              disabled={currentFocusMinutes - MINUTES_GAP <= MIN_FOCUS_MINUTES}
              value="minus-focus-time"
              className="flex flex-row items-center justify-center gap-1 px-3 py-2"
            >
              <Icon name="minusSvg" size="sm" className="[&>path]:stroke-icon-tertiary" />
              <span className="body-sb text-text-tertiary">5분</span>
            </SelectGroupItem>
            <SelectGroupItem
              disabled={currentFocusMinutes + MINUTES_GAP >= MAX_FOCUS_MINUTES}
              value="plus-focus-time"
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
