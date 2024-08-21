import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { PomodoroMode } from '@/entities/pomodoro';
import { useCategories, useUpdateCategory, ChangeCategoryDrawer } from '@/features/category';
import { catNameMap } from '@/features/pomodoro';
import { ChangeTimeDialog } from '@/features/time';
import { useUser } from '@/features/user';
import catHomeMotionRiveFile from '@/shared/assets/rivs/cat_home.riv';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';
import { useDisclosure, useRiveCat } from '@/shared/hooks';
import { Button, Guide, Icon, Tooltip } from '@/shared/ui';
import { getCategoryIconName, createIsoDuration } from '@/shared/utils';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];
const getTooltipMessages = (catType?: CatType) => {
  if (catType === 'THREE_COLOR')
    return [
      '"시간이 없어서"는 변명이다냥',
      '휴대폰 그만보고 집중하라냥',
      '기회란 금새 왔다 사라진다냥',
    ];
  return ['나랑 함께할 시간이다냥!', '자주 와서 쓰다듬어 달라냥', '집중이 잘 될 거 같다냥'];
};

type HomeScreenProps = {
  setMode: (mode: PomodoroMode) => void;
  startTimer: () => void;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  currentFocusMinutes: number;
  currentRestMinutes: number;
};

export const HomeScreen = ({
  setMode,
  startTimer,
  currentCategory,
  setCurrentCategory,
  currentFocusMinutes,
  currentRestMinutes,
}: HomeScreenProps) => {
  const navigate = useNavigate();

  const [clickedMode, setClickedMode] = useState<'focus' | 'rest'>('focus');

  const [showGuide, setShowGuide] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY.GUIDE_SHOWN, true);

  const changeTimeDialogProps = useDisclosure();
  const changeCategoryDrawerProps = useDisclosure();

  const { data: categories } = useCategories();
  const { mutate: updateCategory } = useUpdateCategory();
  const { data: user } = useUser();

  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catHomeMotionRiveFile,
    stateMachines: 'State Machine_Home',
    userCatType: user?.cat?.type,
  });
  const [tooltipMessage, setTooltipMessage] = useState('');

  useEffect(() => {
    const messages = getTooltipMessages(user?.cat?.type);
    const randomIndex = Math.floor(Math.random() * messages.length);
    setTooltipMessage(messages[randomIndex]);
  }, [user?.cat?.type]);

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex justify-end p-4">
          <Button
            variant="text-primary"
            size="md"
            className="p-[8px] rounded-none bg-gray-50"
            onClick={() => navigate(PATH.MY_PAGE)}
          >
            <Icon name="menu" size="md" />
          </Button>
        </header>
        <main className="flex flex-col gap-[25px] items-center justify-center flex-1">
          <Tooltip
            content={tooltipMessage}
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
            arrowProps={{ width: 14, height: 9 }}
          />
          <RiveComponent
            className="w-full h-[240px] cursor-pointer select-none"
            onClick={() => {
              clickCatInput?.fire();
            }}
          />

          <div className="header-4 text-text-tertiary">
            {catNameMap(user?.cat?.type ?? 'CHEESE')}
          </div>
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
              startTimer();
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
