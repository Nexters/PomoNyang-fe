import { useEffect, useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { useCategories, useUpdateCategory, ChangeCategoryDrawer } from '@/features/category';
import { ChangeTimeDialog } from '@/features/time';
import { useUser } from '@/features/user';
import { useDisclosure, useTimer } from '@/shared/hooks';
import { Guide, Button, Icon, Tooltip } from '@/shared/ui';
import {
  cn,
  createIsoDuration,
  getCategoryIconName,
  msToTime,
  padNumber,
  parseIsoDuration,
} from '@/shared/utils';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];

type Mode = 'focus' | 'rest-wait' | 'rest';

const Pomodoro = () => {
  const [mode, setMode] = useState<Mode | null>('focus');

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

  const { time, start } = useTimer(1000 * 60 * currentFocusMinutes);

  if (mode === 'rest') return <RestScreen />;
  if (mode === 'rest-wait') return <RestWaitScreen />;
  if (mode === 'focus') return <FocusScreen time={time} currentCategory={currentCategory} />;

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

const catName = (type: CatType) => {
  if (type === 'CHEESE') return '치즈냥';
  if (type === 'BLACK') return '까만냥';
  if (type === 'THREE_COLOR') return '삼색냥';
  return '';
};

type HomeScreenProps = {
  setMode: (mode: Mode) => void;
  start: () => void;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  currentFocusMinutes: number;
  currentRestMinutes: number;
};

const HomeScreen = ({
  setMode,
  start,
  currentCategory,
  setCurrentCategory,
  currentFocusMinutes,
  currentRestMinutes,
}: HomeScreenProps) => {
  const [clickedMode, setClickedMode] = useState<'focus' | 'rest'>('focus');

  const [showGuide, setShowGuide] = useLocalStorage<boolean>(
    'showGuide',
    !(localStorage.getItem('showGuide') === 'false'),
  );

  const changeTimeDialogProps = useDisclosure();
  const changeCategoryDrawerProps = useDisclosure();

  const { data: categories } = useCategories();
  const { mutate: updateCategory } = useUpdateCategory();
  const { data: user } = useUser();

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex justify-end p-4">
          <Button variant="text-primary" size="md" className="p-[8px] rounded-none bg-gray-50">
            <Icon name="menu" size="md" />
          </Button>
        </header>
        <main className="flex flex-col gap-[25px] items-center justify-center flex-1">
          <Tooltip
            content="오랜만이다냥"
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
          />
          {/* TODO: 고양이 유형에 따라 다른 이미지 */}
          <div className="w-[240px] h-[240px] bg-background-secondary" />
          <div className="header-4 text-text-tertiary">{catName(user?.cat?.type ?? 'CHEESE')}</div>
          <div className="flex flex-col p-lg gap-md">
            <Button
              variant="tertiary"
              className="w-[80px] mx-auto"
              size="sm"
              id="categoryButton"
              onClick={() => {
                changeCategoryDrawerProps.onOpen();
              }}
            >
              <Icon name={getCategoryIconName(currentCategory)} size="sm" />
              {currentCategory}
            </Button>
            <div className="flex items-center p-xs gap-md" id="timeAdjustDiv">
              <button
                className="flex items-center cursor-pointer p-sm gap-sm"
                onClick={() => {
                  setClickedMode('focus');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="text-gray-500 body-sb">집중</span>
                <span className="header-3 text-text-secondary">{currentFocusMinutes}분</span>
              </button>
              <div className="w-[2px] h-[20px] bg-gray-200 rounded-full" />
              <button
                className="flex items-center cursor-pointer p-sm gap-sm"
                onClick={() => {
                  setClickedMode('rest');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="text-gray-500 body-sb">휴식</span>
                <span className="header-3 text-text-secondary">{currentRestMinutes}분</span>
              </button>
            </div>
          </div>
          <Button
            variant="primary"
            className="p-[28px]"
            size="icon"
            onClick={() => {
              setMode('focus');
              start();
            }}
          >
            <Icon name="play" size="lg" />
          </Button>
        </main>
      </div>
      <ChangeCategoryDrawer
        open={changeCategoryDrawerProps.isOpen}
        onOpenChange={changeCategoryDrawerProps.setIsOpen}
        defaultCategory={currentCategory}
        onChangeCategory={(category) => {
          setCurrentCategory(category);
        }}
      />

      {showGuide && (
        <Guide
          steps={steps}
          handler={{
            onGuideEnd: () => setShowGuide(false),
          }}
        />
      )}
      <ChangeTimeDialog
        open={changeTimeDialogProps.isOpen}
        onOpenChange={changeTimeDialogProps.setIsOpen}
        mode={clickedMode}
        category={currentCategory}
        onChangeCategoryTime={(category, minutes) => {
          const body =
            clickedMode === 'focus'
              ? { focusTime: createIsoDuration({ minutes }) }
              : { restTime: createIsoDuration({ minutes }) };
          updateCategory({
            no: categories?.find((_category) => _category.title === category)?.no ?? 0,
            body,
          });
        }}
        categoryTimeMinutes={clickedMode === 'focus' ? currentFocusMinutes : currentRestMinutes}
        categoryTimeSeconds={0}
      />
    </>
  );
};

type FocusScreenProps = {
  currentCategory: string;
  time: number;
};

const FocusScreen = ({ currentCategory, time }: FocusScreenProps) => {
  const { minutes, seconds } = msToTime(time);
  return (
    <div className="relative flex flex-col h-full">
      <header className="flex p-4">
        <div className="flex gap-sm subBody-sb text-text-tertiary bg-background-secondary p-md rounded-xs w-[80px]">
          <Icon name={getCategoryIconName(currentCategory)} size="sm" />
          {currentCategory}
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1">
        <Tooltip
          content="잘 집중하고 있는 거냥?"
          color="white"
          sideOffset={-40}
          rootProps={{ open: true }}
        />
        {/* TODO: 고양이 유형에 따라 다른 이미지 */}
        <div className="w-[240px] h-[240px] bg-background-secondary" />
        <div className="flex flex-col items-center mt-xl">
          <div className="flex gap-xs">
            <Icon name="focusTime" width={20} height={20} />
            <span className="header-5 text-text-secondary">집중시간</span>
          </div>
          <Time minutes={minutes} seconds={seconds} className="header-1 text-text-primary gap-xs" />
          <div className="flex items-center gap-xs">
            <Time
              minutes={minutes}
              seconds={seconds}
              className="gap-0 text-text-accent-1 header-4"
            />
            <span className="text-text-accent-1 header-4">초과</span>
          </div>
        </div>
      </main>
      <div className="absolute left-0 flex flex-col items-center w-full m-auto bottom-4">
        <Button variant="secondary" className="p-xl w-[200px]" size="lg">
          휴식하기
        </Button>
        <Button variant="text-secondary" size="md">
          집중 끝내기
        </Button>
      </div>
    </div>
  );
};

type TimeProps = {
  minutes: number;
  seconds: number;
  className?: string;
};

const Time = ({ minutes, seconds, className }: TimeProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <span className="tabular-nums">{padNumber(minutes)}</span>
      <span>:</span>
      <span className="tabular-nums">{padNumber(seconds)}</span>
    </div>
  );
};

const RestScreen = () => {
  return <div>RestScreen</div>;
};

const RestWaitScreen = () => {
  return <div>RestWaitScreen</div>;
};
