import { useEffect, useState } from 'react';

import { PomodoroMode, PomodoroNextAction } from '@/entities/pomodoro';
import { useCategories } from '@/features/category';
import { useTimer } from '@/shared/hooks';
import { parseIsoDuration } from '@/shared/utils';
import { FocusScreen, HomeScreen, RestScreen, RestWaitScreen } from '@/widgets/pomodoro';

const END_TIME = -(1000 * 60 * 1); // 1분

const Pomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode | null>(null);
  const [selectedNextAction, setSelectedNextAction] = useState<PomodoroNextAction>();

  const { data: categories } = useCategories();
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

  const { time, start } = useTimer(1000 * 10 * 1, END_TIME, {
    onFinish: () => {
      setMode('rest-wait');
    },
  });

  if (mode === 'rest')
    return (
      <RestScreen
        time={time}
        currentCategory={currentCategory}
        currentFocusMinutes={currentFocusMinutes}
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
  if (mode === 'rest-wait') return <RestWaitScreen />;
  if (mode === 'focus')
    return (
      <FocusScreen
        time={time}
        currentCategory={currentCategory}
        handleRest={() => {
          setMode('rest-wait');
        }}
        handleEnd={() => {
          // @TODO: 서버로 뽀모도로 POST 요청
          setMode(null);
        }}
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
