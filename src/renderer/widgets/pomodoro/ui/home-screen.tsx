import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { PomodoroMode } from '@/entities/pomodoro';
import { useCategories, useUpdateCategory, ChangeCategoryDrawer } from '@/features/category';
import { ChangeTimeDialog } from '@/features/time';
import { useUser } from '@/features/user';
import catHomeMotionRiveFile from '@/shared/assets/rivs/cat_home.riv';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';
import { useDisclosure, useRiveCat } from '@/shared/hooks';
import { Button, Guide, Icon, Tooltip, useToast } from '@/shared/ui';
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

  const { toast } = useToast();

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
      <div className="flex h-full flex-col">
        <header className="flex justify-end p-4">
          <Button
            variant="text-primary"
            size="md"
            className="rounded-none bg-gray-50 p-[8px]"
            onClick={() => navigate(PATH.MY_PAGE)}
          >
            <Icon name="menu" size="md" />
          </Button>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-[25px]">
          <Tooltip
            content={tooltipMessage}
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
            arrowProps={{ width: 14, height: 9 }}
          />
          <RiveComponent
            className="h-[240px] w-full cursor-pointer select-none"
            onClick={() => {
              clickCatInput?.fire();
            }}
          />

          <div className="header-4 text-text-tertiary">{user?.cat?.name}</div>
          <div className="flex flex-col gap-md p-lg">
            <Button
              variant="tertiary"
              className="mx-auto w-[80px]"
              size="sm"
              id="categoryButton"
              onClick={() => {
                changeCategoryDrawerProps.onOpen();
              }}
            >
              <Icon name={getCategoryIconName(currentCategory)} size="sm" />
              {currentCategory}
            </Button>
            <div className="flex items-center gap-md p-xs" id="timeAdjustDiv">
              <button
                className="flex cursor-pointer items-center gap-sm p-sm"
                onClick={() => {
                  setClickedMode('focus');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="body-sb text-gray-500">집중</span>
                <span className="header-3 text-text-secondary">{currentFocusMinutes}분</span>
              </button>
              <div className="h-[20px] w-[2px] rounded-full bg-gray-200" />
              <button
                className="flex cursor-pointer items-center gap-sm p-sm"
                onClick={() => {
                  setClickedMode('rest');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="body-sb text-gray-500">휴식</span>
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
          if (category === currentCategory) return;
          setCurrentCategory(category);
          toast({
            iconName: 'check',
            iconClassName: '[&>path]:stroke-icon-tertiary',
            message: '카테고리를 변경했어요',
          });
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
        onChangeCategoryTime={async (category, minutes) => {
          if (clickedMode === 'focus' && minutes === currentFocusMinutes) return;
          if (clickedMode === 'rest' && minutes === currentRestMinutes) return;

          const categoryNo = categories?.find((_category) => _category.title === category)?.no;
          if (!categoryNo) return;

          const body =
            clickedMode === 'focus'
              ? { focusTime: createIsoDuration({ minutes }) }
              : { restTime: createIsoDuration({ minutes }) };
          updateCategory({
            no: categoryNo,
            body,
          });
          toast({
            iconName: 'check',
            iconClassName: '[&>path]:stroke-icon-tertiary',
            message: toastMessageMap[clickedMode],
          });
        }}
        categoryTimeMinutes={clickedMode === 'focus' ? currentFocusMinutes : currentRestMinutes}
        categoryTimeSeconds={0}
      />
    </>
  );
};

const toastMessageMap: Record<'focus' | 'rest', string> = {
  focus: '집중 시간을 변경했어요',
  rest: '휴식 시간을 변경했어요',
};
