import { useEffect, useRef, useState } from 'react';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useAddPomodoro } from '@/features/pomodoro';
import { useUser } from '@/features/user';
import { useTimer } from '@/shared/hooks';
import { createIsoDuration, minutesToMs, msToTime, parseIsoDuration } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

// @TODO: 60분으로 수정
const END_TIME = -(1000 * 5); // 5초

const Pomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode | null>(null);
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();
  const onFinishRef = useRef(() => {});

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
  // const currentFocusMinutes =
  //   parseIsoDuration(categoryData?.focusTime).hours * 60 +
  //   parseIsoDuration(categoryData?.focusTime).minutes;
  const currentFocusMinutes = 0.1; // 6초

  useEffect(() => {
    if (mode === 'focus') {
      onFinishRef.current = () => {
        setMode('rest-wait');
      };
    }
  }, [mode]);

  const { time, start, stop } = useTimer(minutesToMs(currentFocusMinutes), END_TIME, {
    onFinishRef,
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

  if (mode === 'rest')
    return (
      <RestScreen
        time={minutesToMs(currentFocusMinutes) - time}
        currentCategory={currentCategory}
        currentRestMinutes={currentRestMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
        handleFocus={() => {
          // TODO: selectedNextAction 에 따라 focus 시간 조절 후 focus 모드로 변경
          setMode('focus');
        }}
        handleEnd={() => {
          // @TODO: 서버로 뽀모도로 POST 요청
          setMode(null);
        }}
      />
    );
  if (mode === 'rest-wait')
    return (
      <RestWaitScreen
        time={minutesToMs(currentFocusMinutes) - time} // 전체 경과 시간
        currentCategory={currentCategory}
        currentFocusMinutes={currentFocusMinutes}
        selectedNextAction={selectedNextAction}
        setSelectedNextAction={setSelectedNextAction}
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
