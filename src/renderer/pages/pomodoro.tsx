import { useEffect, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { LOCAL_STORAGE_KEY } from '@/shared/constants';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime, parseIsoDuration } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

const END_TIME = -minutesToMs(60);
const MAX_TIME_ON_PAGE = minutesToMs(60);

const Pomodoro = () => {
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();

  const [mode, setMode] = useLocalStorage<PomodoroMode | null>(LOCAL_STORAGE_KEY.MODE, null);

  // 단위 ms
  const [focusedTime, setFocusedTime] = useLocalStorage(LOCAL_STORAGE_KEY.FOCUSED_TIME, 0);

  const { data: categories } = useCategories();
  const { data: user } = useUser();
  const { mutate: _addPomodoro } = useAddPomodoro();

  const { createNotificationByMode } = useFocusNotification();

  useEffect(() => {
    setCurrentCategory(categories?.[0].title ?? '');
  }, [categories]);

  const [currentCategory, setCurrentCategory] = useState(categories?.[0].title ?? '');
  const categoryData = categories?.find((category) => category.title === currentCategory);

  const currentRestMinutes =
    parseIsoDuration(categoryData?.restTime).hours * 60 +
    parseIsoDuration(categoryData?.restTime).minutes;
  const currentFocusMinutes =
    parseIsoDuration(categoryData?.focusTime).hours * 60 +
    parseIsoDuration(categoryData?.focusTime).minutes;

  const [initialTime, setInitialTime] = useState(minutesToMs(currentFocusMinutes));

  const { time, start, stop } = useTimer(initialTime, END_TIME, {
    onStop: () => {
      if (mode === 'focus') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'focus-end');
        return;
      }
      if (mode === 'rest') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'rest-end');
        setInitialTime(minutesToMs(currentFocusMinutes));
      }
    },
    onFinish: () => {
      if (mode === 'focus') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 휴식 대기 화면으로 강제 이동
        setFocusedTime(minutesToMs(currentFocusMinutes) - END_TIME);
        setInitialTime(MAX_TIME_ON_PAGE);
        setMode('rest-wait');
        return;
      }
      if (mode === 'rest-wait') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 홈 화면으로 강제 이동
        if (categoryData?.no) {
          addPomodoro(focusedTime, 0);
        }
        setInitialTime(minutesToMs(currentRestMinutes));
        setMode(null);
        // @TODO: 모달 띄워주기
        return;
      }
      if (mode === 'rest') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 홈 화면으로 강제 이동
        if (categoryData?.no) {
          addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - END_TIME);
        }
        setInitialTime(minutesToMs(currentFocusMinutes));
        setMode(null);
      }
    },
  });

  useEffect(() => {
    if (!mode) return;
    start();
  }, [mode]);

  const addPomodoro = (focusedTime: number, restedTime: number) => {
    if (categoryData?.no) {
      _addPomodoro({
        body: [
          {
            clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
            categoryNo: categoryData?.no,
            focusedTime: createIsoDuration(msToTime(focusedTime)),
            restedTime: createIsoDuration(msToTime(restedTime)),
            doneAt: new Date().toISOString(),
          },
        ],
      });
    }
  };

  const handleEndFocus = () => {
    stop();
    addPomodoro(minutesToMs(currentFocusMinutes) - time, 0);
    setMode(null);
  };

  const handleEndRestWait = () => {
    addPomodoro(focusedTime, 0);
    setMode(null);
  };

  const handleEndRest = () => {
    addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - time);
    setMode(null);
  };

  if (mode === 'rest')
    return (
      <RestScreen
        time={time}
        currentCategory={currentCategory}
        currentRestMinutes={currentRestMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
        handleFocus={() => {
          // TODO: selectedNextAction 에 따라 rest 시간 조절 후 focus 모드로 변경
          stop();
          addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - time);
          setMode('focus');
        }}
        handleEnd={handleEndRest}
      />
    );
  if (mode === 'rest-wait')
    return (
      <RestWaitScreen
        time={focusedTime}
        currentCategory={currentCategory}
        currentFocusMinutes={currentFocusMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
        handleRest={() => {
          setInitialTime(minutesToMs(currentRestMinutes));
          stop();
          setMode('rest');
        }}
        handleEnd={handleEndRestWait}
      />
    );
  if (mode === 'focus')
    return (
      <FocusScreen
        time={time}
        currentCategory={currentCategory}
        handleRest={() => {
          setInitialTime(MAX_TIME_ON_PAGE);
          stop();
          setFocusedTime(minutesToMs(currentFocusMinutes) - time);
          setMode('rest-wait');
        }}
        handleEnd={handleEndFocus}
      />
    );

  return (
    <HomeScreen
      setMode={setMode}
      startTimer={start}
      currentCategory={currentCategory}
      setCurrentCategory={setCurrentCategory}
      currentFocusMinutes={currentFocusMinutes}
      currentRestMinutes={currentRestMinutes}
    />
  );
};

export default Pomodoro;
