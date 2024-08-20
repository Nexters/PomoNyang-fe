import { useEffect, useState } from 'react';

import { StateMachineInput, StateMachineInputType, useRive } from '@rive-app/react-canvas';
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
import { useDisclosure } from '@/shared/hooks';
import { Button, Guide, Icon, Tooltip } from '@/shared/ui';
import { getCategoryIconName, createIsoDuration } from '@/shared/utils';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];
const RIVE_STATE_MACHINE_NAME = 'State Machine_Home';
const userCatTypeAliasMap: Record<CatType, string> = {
  CHEESE: 'cheese',
  BLACK: 'black',
  THREE_COLOR: 'calico',
};

type HomeScreenProps = {
  setMode: (mode: PomodoroMode) => void;
  start: () => void;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  currentFocusMinutes: number;
  currentRestMinutes: number;
};

export const HomeScreen = ({
  setMode,
  start,
  currentCategory,
  setCurrentCategory,
  currentFocusMinutes,
  currentRestMinutes,
}: HomeScreenProps) => {
  const navigate = useNavigate();

  const [clickedMode, setClickedMode] = useState<'focus' | 'rest'>('focus');

  const [showGuide, setShowGuide] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY.GUIDE_SHOWN, false);

  const changeTimeDialogProps = useDisclosure();
  const changeCategoryDrawerProps = useDisclosure();

  const { data: categories } = useCategories();
  const { mutate: updateCategory } = useUpdateCategory();
  const { data: user } = useUser();

  const { rive, RiveComponent } = useRive({
    src: catHomeMotionRiveFile,
    stateMachines: RIVE_STATE_MACHINE_NAME,
  });
  const [clickInput, setClickInput] = useState<StateMachineInput>();

  useEffect(() => {
    const userCatType = user?.cat?.type;
    if (!rive || !userCatType) return;

    const userCatTypeAlias = userCatTypeAliasMap[userCatType];
    const inputs = rive.stateMachineInputs(RIVE_STATE_MACHINE_NAME);

    const booleanInputs = inputs.filter((input) => input.type === StateMachineInputType.Boolean);
    const triggerInputs = inputs.filter((input) => input.type === StateMachineInputType.Trigger);

    // boolean input들 중 user의 고양이 타입에 해당하는 input만 true로 설정
    booleanInputs.forEach((input) => {
      input.value = input.name.toLowerCase().includes(userCatTypeAlias);
    });
    // trigger input들 중 user의 고양이 타입에 해당하는 input을 클릭할 수 있도록 설정
    const clickInput = triggerInputs.find((input) => {
      return input.name.toLowerCase().includes(userCatTypeAlias);
    });
    setClickInput(clickInput);

    rive.play();
  }, [rive, user?.cat?.type]);

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
            content="오랜만이다냥"
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
          />
          <RiveComponent
            className="w-full h-[240px]"
            onClick={() => {
              clickInput?.fire();
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
