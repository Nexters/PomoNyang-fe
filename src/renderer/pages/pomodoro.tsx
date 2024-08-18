import { useEffect, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { LOCAL_STORAGE_KEY } from '@/shared/constants';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

// @TODO: 둘 다 60분으로 수정
const END_TIME = -(1000 * 5); // 5초
const MAX_TIME_ON_PAGE = 1000 * 60; // 5초

const Pomodoro = () => {
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();

  const [mode, setMode] = useLocalStorage<PomodoroMode | null>(LOCAL_STORAGE_KEY.MODE, null);

  // 단위 ms
  const [focusedTime, setFocusedTime] = useLocalStorage(LOCAL_STORAGE_KEY.FOCUSED_TIME, 0);

  const { data: categories } = useCategories();
  const { data: user } = useUser();
  const { mutate: addPomodoro } = useAddPomodoro();

  const { createNotificationByMode } = useFocusNotification();

  useEffect(() => {
    setCurrentCategory(categories?.[0].title ?? '');
  }, [categories]);

  const [currentCategory, setCurrentCategory] = useState(categories?.[0].title ?? '');
  const categoryData = categories?.find((category) => category.title === currentCategory);

  // const currentRestMinutes =
  //   parseIsoDuration(categoryData?.restTime).hours * 60 +
  //   parseIsoDuration(categoryData?.restTime).minutes;
  // const currentFocusMinutes =
  //   parseIsoDuration(categoryData?.focusTime).hours * 60 +
  //   parseIsoDuration(categoryData?.focusTime).minutes;

  const currentRestMinutes = 0.1; // 6초
  const currentFocusMinutes = 0.1; // 6초

  const [initialTime, setInitialTime] = useState(minutesToMs(currentFocusMinutes));

  const { time, start, stop } = useTimer(initialTime, END_TIME, {
    onStop: () => {
      if (mode === 'focus') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'focus-end');
      }
      if (mode === 'rest') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'rest-end');
        setInitialTime(minutesToMs(currentFocusMinutes));
      }
    },
    onFinish: (_time) => {
      if (mode === 'focus') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 휴식 대기 화면으로 강제 이동
        setFocusedTime(minutesToMs(currentRestMinutes) - _time);
        setInitialTime(minutesToMs(MAX_TIME_ON_PAGE));
        setMode('rest-wait');
      }
      if (mode === 'rest-wait') {
        // 초기 값 변경 이후
        // 홈 화면으로 강제 이동
        setInitialTime(minutesToMs(currentRestMinutes));
        setMode(null);
      }
      if (mode === 'rest') {
        // 데이터 저장 이후,
        // 초기 값 변경 이후
        // 홈 화면으로 강제 이동
        if (categoryData?.no) {
          addPomodoro({
            body: [
              {
                clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
                categoryNo: categoryData?.no,
                focusedTime: createIsoDuration(msToTime(focusedTime)),
                restedTime: createIsoDuration(msToTime(minutesToMs(currentRestMinutes) - _time)),
                doneAt: new Date().toISOString(),
              },
            ],
          });
        }
        setInitialTime(minutesToMs(currentFocusMinutes));
        setMode(null);
      }
    },
  });

  const handleEndFocus = () => {
    stop();
    if (categoryData?.no) {
      addPomodoro({
        body: [
          {
            clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
            categoryNo: categoryData?.no,
            focusedTime: createIsoDuration(msToTime(time)),
            restedTime: createIsoDuration({ minutes: 0 }),
            doneAt: new Date().toISOString(),
          },
        ],
      });
    }
    setMode(null);
  };

  const handleEndRestWait = () => {
    stop();
    if (categoryData?.no) {
      addPomodoro({
        body: [
          {
            clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
            categoryNo: categoryData?.no,
            focusedTime: createIsoDuration(msToTime(focusedTime)),
            restedTime: createIsoDuration({ minutes: 0 }),
            doneAt: new Date().toISOString(),
          },
        ],
      });
    }
    setMode(null);
  };

  const handleEndRest = () => {
    stop();
    if (categoryData?.no) {
      addPomodoro({
        body: [
          {
            clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
            categoryNo: categoryData?.no,
            focusedTime: createIsoDuration(msToTime(focusedTime)),
            restedTime: createIsoDuration(msToTime(time)),
            doneAt: new Date().toISOString(),
          },
        ],
      });
    }
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
        startTimer={start}
        handleFocus={() => {
          // TODO: selectedNextAction 에 따라 rest 시간 조절 후 focus 모드로 변경
          stop();
          if (categoryData?.no) {
            const _focusedTime = msToTime(focusedTime);
            const _restedTime = msToTime(minutesToMs(currentRestMinutes) - time);

            addPomodoro({
              body: [
                {
                  clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
                  categoryNo: categoryData?.no,
                  focusedTime: createIsoDuration(_focusedTime),
                  restedTime: createIsoDuration(_restedTime),
                  doneAt: new Date().toISOString(),
                },
              ],
            });
          }
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
        startTimer={start}
        handleRest={() => {
          stop();
          if (time > 0) {
            setMode('rest');
            setInitialTime(minutesToMs(currentRestMinutes));
          } else {
            setMode(null);
            setInitialTime(minutesToMs(currentFocusMinutes));
            // @TODO: 모달 띄워주기
          }
        }}
        handleEnd={handleEndRestWait}
      />
    );
  if (mode === 'focus')
    return (
      <FocusScreen
        time={time}
        currentCategory={currentCategory}
        startTimer={start}
        handleRest={() => {
          stop();
          setFocusedTime(minutesToMs(currentFocusMinutes) - time);
          setInitialTime(MAX_TIME_ON_PAGE);
          setMode('rest-wait');
        }}
        handleEnd={handleEndFocus}
      />
    );

  return (
    <HomeScreen
      setMode={setMode}
      currentCategory={currentCategory}
      setCurrentCategory={setCurrentCategory}
      currentFocusMinutes={currentFocusMinutes}
      currentRestMinutes={currentRestMinutes}
    />
  );
};

export default Pomodoro;
