import { useEffect, useState } from 'react';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

// @TODO: 둘 다 60분으로 수정
const END_TIME = -(1000 * 5); // 5초
const MAX_TIME_ON_PAGE = 1000 * 60; // 5초

const Pomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode | null>(null);
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();

  const [focusedTime, setFocusedTime] = useState(0);
  const [restedTime, setRestedTime] = useState(0);

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
    onStop: (_time) => {
      if (mode === 'focus') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'focus-end');
        setMode('rest-wait');
        setFocusedTime(minutesToMs(currentFocusMinutes) - _time);
        setInitialTime(MAX_TIME_ON_PAGE);

        console.log(
          '집중한 시간: ',
          minutesToMs(currentFocusMinutes) - _time,
          minutesToMs(currentFocusMinutes) - time,
        );
      }
      if (mode === 'rest-wait') {
        if (_time > 0) {
          setInitialTime(minutesToMs(currentRestMinutes));
        } else {
          setMode(null);
          setInitialTime(minutesToMs(currentFocusMinutes));
          // @TODO: 모달 띄워주기
        }
      }
      if (mode === 'rest') {
        createNotificationByMode(user?.cat?.type ?? 'CHEESE', 'rest-end');
        setRestedTime(minutesToMs(currentRestMinutes) - _time);
        setInitialTime(minutesToMs(currentFocusMinutes));

        console.log(
          '휴식한 시간: ',
          minutesToMs(currentRestMinutes) - _time,
          minutesToMs(currentRestMinutes) - time,
        );

        if (categoryData?.no) {
          const _focusedTime = msToTime(focusedTime);
          const _restedTime = msToTime(minutesToMs(currentRestMinutes) - _time);

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
        setMode(null);
      }
    },
  });

  const handleEnd = () => {
    stop();
    if (categoryData?.no) {
      const _focusedTime = msToTime(focusedTime);
      const _restedTime = msToTime(restedTime);

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
          setMode('focus');
        }}
        handleEnd={handleEnd}
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
          setMode('rest');
        }}
        handleEnd={handleEnd}
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
          setMode('rest-wait');
        }}
        handleEnd={handleEnd}
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
