import { useEffect, useState } from 'react';

import { PomodoroMode } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useUser } from '@/features/user';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime, parseIsoDuration } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

// @TODO: 60분으로 수정
const END_TIME = -(1000 * 60 * 1); // 1분

const Pomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode | null>(null);

  const { data: categories } = useCategories();
  const { data: user } = useUser();
  const { mutate: addPomodoro } = useAddPomodoro();
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

  const { time, start, stop } = useTimer(1000 * 10 * 1, END_TIME, {
    onFinish: () => {
      if (mode === 'focus') {
        setMode('rest-wait');
      }

      // @TODO: 상황별로 다른 처리
    },
  });

  const handleEnd = () => {
    stop();
    if (categoryData?.no) {
      const { minutes, seconds } = msToTime(minutesToMs(currentFocusMinutes) - time);

      addPomodoro({
        body: [
          {
            clientFocusTimeId: `${user?.registeredDeviceNo}-${new Date().toISOString()}`,
            categoryNo: categoryData?.no,
            focusedTime: createIsoDuration({ minutes, seconds }),
            restedTime: createIsoDuration({ minutes: 0, seconds: 0 }),
            doneAt: new Date().toISOString(),
          },
        ],
      });
    }
    setMode(null);
  };

  if (mode === 'rest') return <RestScreen />;
  if (mode === 'rest-wait')
    return (
      <RestWaitScreen
        time={time}
        currentCategory={currentCategory}
        handleRest={() => {
          stop();
          setMode('rest');
        }}
        handleEnd={handleEnd}
        handleInit={() => {
          setMode(null);
          // @TODO: 모달 띄워주기
        }}
      />
    );
  if (mode === 'focus')
    return (
      <FocusScreen
        time={time}
        currentCategory={currentCategory}
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
      start={start}
      currentCategory={currentCategory}
      setCurrentCategory={setCurrentCategory}
      currentFocusMinutes={currentFocusMinutes}
      currentRestMinutes={currentRestMinutes}
    />
  );
};

export default Pomodoro;
