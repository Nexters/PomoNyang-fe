import { useEffect, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories, useUpdateCategory } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { LOCAL_STORAGE_KEY, MINUTES_GAP } from '@/shared/constants';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime, parseIsoDuration } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

const END_TIME_ON_FOCUS_PAGE = -minutesToMs(60);
const END_TIME_ON_REST_WAIT_PAGE = -minutesToMs(60);
const END_TIME_ON_REST_PAGE = -minutesToMs(30);

const Pomodoro = () => {
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();

  const [mode, setMode] = useLocalStorage<PomodoroMode | null>(LOCAL_STORAGE_KEY.MODE, null);

  // 단위 ms
  const [focusedTime, setFocusedTime] = useLocalStorage(LOCAL_STORAGE_KEY.FOCUSED_TIME, 0);

  const { data: categories } = useCategories();
  const { data: user } = useUser();
  const { mutate: _addPomodoro } = useAddPomodoro();
  const { mutate: updateCategory } = useUpdateCategory();

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
  const [endTime, setEndTime] = useState(END_TIME_ON_FOCUS_PAGE); // 끝나는 시간

  useEffect(() => {
    setInitialTime(minutesToMs(currentFocusMinutes));
  }, [categoryData]);

  const { time, start, stop } = useTimer(initialTime, endTime, {
    onStop: () => {
      if (mode === 'focus') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'focus-end');
        setInitialTime(0);
        setEndTime(END_TIME_ON_REST_WAIT_PAGE);
        return;
      }
      if (mode === 'rest') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'rest-end');
        setInitialTime(minutesToMs(currentFocusMinutes));
        setEndTime(END_TIME_ON_FOCUS_PAGE);
      }
    },
    onFinish: () => {
      if (mode === 'focus') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 휴식 대기 화면으로 강제 이동
        setFocusedTime(minutesToMs(currentFocusMinutes) - endTime);
        setInitialTime(0);
        setEndTime(END_TIME_ON_REST_WAIT_PAGE);
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
        setEndTime(END_TIME_ON_REST_PAGE);
        setMode(null);
        // @TODO: 모달 띄워주기
        return;
      }
      if (mode === 'rest') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 홈 화면으로 강제 이동
        if (categoryData?.no) {
          addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - endTime);
        }
        setInitialTime(minutesToMs(currentFocusMinutes));
        setEndTime(END_TIME_ON_FOCUS_PAGE);
        setMode(null);
      }
    },
  });

  useEffect(() => {
    if (!mode) {
      setInitialTime(minutesToMs(currentFocusMinutes));
      setFocusedTime(0);
      setEndTime(END_TIME_ON_FOCUS_PAGE);
      return;
    }
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

  const updateCategoryTime = (type: 'focusTime' | 'restTime', currentMinutes: number) => {
    if (!selectedNextAction || !categoryData?.no) return;
    updateCategory({
      no: categoryData?.no,
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

  if (mode === 'rest')
    return (
      <RestScreen
        time={time}
        currentCategory={currentCategory}
        currentRestMinutes={currentRestMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
        handleFocus={() => {
          updateCategoryTime('restTime', currentRestMinutes);
          stop();
          addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - time);
          setMode('focus');
        }}
        handleEnd={() => {
          updateCategoryTime('restTime', currentRestMinutes);
          stop();
          addPomodoro(focusedTime, minutesToMs(currentRestMinutes) - time);
          setMode(null);
        }}
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
          updateCategoryTime('focusTime', currentFocusMinutes);
          setInitialTime(minutesToMs(currentRestMinutes));
          setEndTime(END_TIME_ON_REST_PAGE);
          stop();
          setMode('rest');
        }}
        handleEnd={() => {
          updateCategoryTime('focusTime', currentFocusMinutes);
          stop();
          addPomodoro(focusedTime, 0);
          setMode(null);
        }}
      />
    );
  if (mode === 'focus')
    return (
      <FocusScreen
        time={time}
        currentCategory={currentCategory}
        handleRest={() => {
          setInitialTime(0);
          setEndTime(END_TIME_ON_REST_WAIT_PAGE);
          stop();
          setFocusedTime(minutesToMs(currentFocusMinutes) - time);
          setMode('rest-wait');
        }}
        handleEnd={() => {
          stop();
          addPomodoro(minutesToMs(currentFocusMinutes) - time, 0);
          setMode(null);
        }}
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
