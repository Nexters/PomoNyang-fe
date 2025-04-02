import { useEffect, useState } from 'react';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories, useUpdateCategory } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { getPomodoroTime, usePomodoro } from '@/features/pomodoro/hooks/use-pomodoro';
import { TimeoutDialog } from '@/features/pomodoro/ui/timeout-dialog';
import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { MINUTES_GAP } from '@/shared/constants';
import { useAlwaysOnTop, useDisclosure, useMinimize } from '@/shared/hooks';
import { useToast } from '@/shared/ui';
import {
  createIsoDuration,
  isoDurationToMs,
  minutesToMs,
  msToIsoDuration,
  msToMinutes,
} from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

// @note: 개발할 때, 초과시간까지 빠르게 테스트하기 위해 설정함
// 원래대로 하고 싶으면 false로 변경해서 사용하면 됩니다
const isFastForward = import.meta.env.DEV;
const taping = (ms: number) => (isFastForward ? Math.floor(ms / 60) : ms);

const focusExceedMaxTime = taping(minutesToMs(60));
const restWaitExceedMaxTime = taping(minutesToMs(60));
const restExceedMaxTime = taping(minutesToMs(30));

const timeoutMessageMap: Record<
  Exclude<PomodoroMode, 'focus'>,
  { title: string; description: string }
> = {
  'rest-wait': {
    title: '집중을 끝내고 돌아왔어요',
    description: '너무 오랜 시간동안 대기화면에 머물러서 홈화면으로 이동되었어요.',
  },
  rest: {
    title: '휴식을 끝내고 돌아왔어요',
    description: '너무 오랜 시간동안 휴식하고 있어서 홈화면으로 이동되었어요.',
  },
};

const Pomodoro = () => {
  const { createNotificationByMode } = useFocusNotification();
  const { toast } = useToast();

  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();
  const [timeoutMode, setTimeoutMode] = useState<Exclude<PomodoroMode, 'focus'> | null>(null);
  const timeoutDialogProps = useDisclosure();

  const { currentCategory } = useCategories();
  const { data: user } = useUser();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: savePomodoro } = useAddPomodoro();
  const { minimized, setMinimized } = useMinimize();
  const { alwaysOnTop, setAlwaysOnTop } = useAlwaysOnTop();

  const currentFocusTime = taping(isoDurationToMs(currentCategory?.focusTime));
  const currentRestTime = taping(isoDurationToMs(currentCategory?.restTime));

  const { pomodoroCycles, pomodoroTime, startFocus, startRestWait, startRest, endPomodoro } =
    usePomodoro({
      focusTime: currentFocusTime,
      focusExceedMaxTime,
      restWaitExceedMaxTime,
      restTime: currentRestTime,
      restExceedMaxTime,
      onceExceedGoalTime: (mode) => {
        if (!user?.cat?.type) return;
        // 목표시간 초과 시 알림
        // 초과시점에 창에 포커스 맞추기
        window.electronAPI.showWindow();
        if (mode === 'focus') return createNotificationByMode(user.cat.type, 'focus-end');
        if (mode === 'rest') return createNotificationByMode(user.cat.type, 'rest-end');
      },
      onEndPomodoro: (cycles, reason) => {
        console.log('Pomodoro cycles:', cycles);

        let focusedTime = 0;
        let restedTime = 0;

        cycles.forEach((cycle) => {
          const time = getPomodoroTime(cycle);
          if (cycle.mode === 'focus') focusedTime += time.elapsed;
          if (cycle.mode === 'rest') restedTime += time.elapsed;
        });

        if (focusedTime < 1000 * 60) {
          return toast({ message: '1분 미만의 집중 시간은 저장되지 않아요', iconName: 'clock' });
        }

        const lastCycleMode = cycles.at(-1)?.mode;
        if (reason === 'exceed' && lastCycleMode && lastCycleMode !== 'focus') {
          setTimeoutMode(lastCycleMode);
          timeoutDialogProps.onOpen();
        }

        if (currentCategory) {
          savePomodoro({
            body: [
              {
                clientFocusTimeId: Date.now().toString(),
                categoryNo: currentCategory.no,
                focusedTime: msToIsoDuration(focusedTime),
                restedTime: msToIsoDuration(restedTime),
                doneAt: new Date().toISOString(),
              },
            ],
          });
        }
      },
    });
  const mode = pomodoroCycles.at(-1)?.mode;
  const latestFocusCycle = pomodoroCycles.findLast((cycle) => cycle.mode === 'focus');
  const latestFocusTime = latestFocusCycle ? getPomodoroTime(latestFocusCycle) : null;

  const currentFocusMinutes = msToMinutes(currentFocusTime);
  const currentRestMinutes = msToMinutes(currentRestTime);

  const updateCategoryTime = (type: 'focusTime' | 'restTime', currentMinutes: number) => {
    if (!selectedNextAction || !currentCategory) return;

    updateCategory({
      no: currentCategory.no,
      body: {
        [type]: createIsoDuration({
          minutes:
            selectedNextAction === 'plus'
              ? currentMinutes + MINUTES_GAP
              : currentMinutes - MINUTES_GAP,
        }),
      },
    });
    setSelectedNextAction(undefined);
  };

  useEffect(() => {
    // 휴식 대기중이거나 시작 대기전에는 최소화 및 항상 위에 표시를 해제
    if (mode !== 'focus' && mode !== 'rest') {
      setMinimized(false);
      setAlwaysOnTop(false);
    }
  }, [mode]);

  // TODO: loading 처리?
  if (!currentCategory) return null;
  if (mode === 'focus')
    return (
      <FocusScreen
        currentFocusTime={currentFocusTime}
        elapsedTime={Math.min(pomodoroTime.elapsed, currentFocusTime)}
        exceededTime={pomodoroTime.exceeded}
        currentCategory={currentCategory}
        minimized={minimized}
        alwaysOnTop={alwaysOnTop}
        handleRest={startRestWait}
        handleEnd={endPomodoro}
        setMinimized={setMinimized}
        setAlwaysOnTop={setAlwaysOnTop}
      />
    );

  if (mode === 'rest-wait')
    return (
      <RestWaitScreen
        elapsedTime={Math.min(latestFocusTime?.elapsed ?? 0, currentFocusTime)}
        exceededTime={latestFocusTime?.exceeded ?? 0}
        currentCategory={currentCategory}
        currentFocusMinutes={currentFocusMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
        handleRest={() => {
          updateCategoryTime('focusTime', currentFocusMinutes);
          startRest();
        }}
        handleEnd={() => {
          updateCategoryTime('focusTime', currentFocusMinutes);
          endPomodoro();
        }}
      />
    );

  if (mode === 'rest')
    return (
      <RestScreen
        currentRestTime={currentRestTime}
        elapsedTime={Math.min(pomodoroTime.elapsed, currentRestTime)}
        exceededTime={pomodoroTime.exceeded}
        currentCategory={currentCategory}
        currentRestMinutes={currentRestMinutes}
        selectedNextAction={selectedNextAction}
        minimized={minimized}
        alwaysOnTop={alwaysOnTop}
        setSelectedNextAction={setSelectedNextAction}
        handleFocus={() => {
          updateCategoryTime('restTime', currentRestMinutes);
          startFocus();
        }}
        handleEnd={() => {
          updateCategoryTime('restTime', currentRestMinutes);
          endPomodoro();
        }}
        setMinimized={setMinimized}
        setAlwaysOnTop={setAlwaysOnTop}
      />
    );

  return (
    <>
      <HomeScreen
        startTimer={startFocus}
        currentCategory={currentCategory}
        currentFocusMinutes={msToMinutes(currentFocusTime)}
        currentRestMinutes={msToMinutes(currentRestTime)}
      />
      {timeoutMode && (
        <TimeoutDialog
          open={timeoutDialogProps.isOpen}
          onOpenChange={timeoutDialogProps.setIsOpen}
          title={timeoutMessageMap[timeoutMode].title}
          description={timeoutMessageMap[timeoutMode].description}
        />
      )}
    </>
  );
};

export default Pomodoro;
