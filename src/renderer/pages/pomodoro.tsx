import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { useUser } from '@/features/user';
import { Guide, Button, Icon, Tooltip } from '@/shared/ui';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];

const Pomodoro = () => {
  const [showGuide, setShowGuide] = useLocalStorage<boolean>(
    'showGuide',
    !(localStorage.getItem('showGuide') === 'false'),
  );

  const { data: userData } = useUser();

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
          <div className="header-4 text-text-tertiary">
            {catName(userData?.cat?.catType ?? 'CHEESE')}
          </div>
          <div className="flex flex-col p-lg gap-md">
            <Button variant="tertiary" className="w-[80px] mx-auto" size="sm" id="categoryButton">
              <Icon name="placeholder" size="sm" />
            </Button>
            <div className="flex items-center p-xs gap-md" id="timeAdjustDiv">
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="text-gray-500 body-sb">집중</span>
                <span className="header-3 text-text-secondary">25분</span>
              </div>
              <div className="w-[2px] h-[20px] bg-gray-200 rounded-full" />
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="text-gray-500 body-sb">휴식</span>
                <span className="header-3 text-text-secondary">25분</span>
              </div>
            </div>
          </div>
          <Button variant="primary" className="p-[28px]" size="icon">
            <Icon name="play" size="lg" />
          </Button>
        </main>
      </div>
      {showGuide && (
        <Guide
          steps={steps}
          handler={{
            onGuideEnd: () => setShowGuide(false),
          }}
        />
      )}
    </>
  );
};

export default Pomodoro;

const catName = (type: CatType) => {
  if (type === 'CHEESE') return '치즈냥';
  if (type === 'BLACK') return '까만냥';
  if (type === 'THREE_COLOR') return '삼색냥';
  return '';
};
