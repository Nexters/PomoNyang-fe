import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { Category } from '@/entities/category';
import { useUpdateCategory, ChangeCategoryDrawer, CategoryChip } from '@/features/category';
import { ChangeTimeDialog } from '@/features/time';
import { useUser } from '@/features/user';
import catHomeMotionRiveFile from '@/shared/assets/rivs/cat_home.riv';
import { LOCAL_STORAGE_KEY } from '@/shared/constants';
import { useDisclosure, useRiveCat } from '@/shared/hooks';
import { Button, Guide, Icon, SidebarLayout, Tooltip, useToast } from '@/shared/ui';
import { createIsoDuration } from '@/shared/utils';

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
  startTimer: () => void;
  currentCategory: Category;
  currentFocusMinutes: number;
  currentRestMinutes: number;
};

export const HomeScreen = ({
  startTimer,
  currentCategory,
  currentFocusMinutes,
  currentRestMinutes,
}: HomeScreenProps) => {
  const location = useLocation();
  const openChangeCategoryDrawer = location.state?.openChangeCategoryDrawer ?? false;

  const [clickedMode, setClickedMode] = useState<'focus' | 'rest'>('focus');

  const [showGuide, setShowGuide] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY.GUIDE_SHOWN, true);

  const changeTimeDialogProps = useDisclosure();
  const changeCategoryDrawerProps = useDisclosure();

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
    showRandomMessage();
  }, [user?.cat?.type]);

  useEffect(() => {
    if (openChangeCategoryDrawer) {
      changeCategoryDrawerProps.onOpen();
    }
  }, [openChangeCategoryDrawer]);

  const handleCloseDrawer = () => {
    if (openChangeCategoryDrawer) {
      location.state = { openChangeCategoryDrawer: false };
    }
  };

  const showRandomMessage = () => {
    const messages = getTooltipMessages(user?.cat?.type);
    const randomIndex = Math.floor(Math.random() * messages.length);
    setTooltipMessage(messages[randomIndex]);
  };

  return (
    <SidebarLayout>
      <div className="flex h-full flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-[25px]">
          <Tooltip
            content={tooltipMessage}
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
            arrowProps={{ width: 14, height: 9 }}
          >
            <RiveComponent
              className="h-[240px] w-[240px] cursor-pointer select-none"
              onClick={() => {
                showRandomMessage();
                clickCatInput?.fire();
              }}
            />
          </Tooltip>

          <div className="header-4 text-text-tertiary">{user?.cat?.name}</div>
          <div className="flex flex-col items-center gap-md p-lg">
            <CategoryChip
              category={currentCategory}
              onClick={() => {
                changeCategoryDrawerProps.onOpen();
              }}
            />
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
        onClose={handleCloseDrawer}
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

          const categoryNo = category.no;
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
    </SidebarLayout>
  );
};

const toastMessageMap: Record<'focus' | 'rest', string> = {
  focus: '집중 시간을 변경했어요',
  rest: '휴식 시간을 변경했어요',
};
