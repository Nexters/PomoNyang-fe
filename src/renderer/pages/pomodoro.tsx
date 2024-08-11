import { Guide, Button, Icon } from '@/shared/ui';
import { __localStorage } from '@/shared/utils';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];

type TShowGuide = {
  showGuide: boolean;
};

const Pomodoro = () => {
  const hasShownGuide = !!__localStorage.getItem<TShowGuide>('showGuide');

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex justify-end p-4">
          <Button variant="text-primary" size="md" className="p-[8px] rounded-none bg-gray-50">
            <Icon name="placeholder" size="md" />
          </Button>
        </header>
        <main className="flex flex-col gap-[25px] items-center justify-center flex-1">
          <div className="w-[240px] h-[240px] bg-background-secondary" />
          <div className="flex flex-col p-lg gap-md">
            <Button variant="tertiary" className="w-[80px] mx-auto" size="sm" id="categoryButton">
              <Icon name="placeholder" size="sm" />
              집중
            </Button>
            <div className="flex items-center text-gray-500 p-xs gap-md" id="timeAdjustDiv">
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="body-sb">집중</span>
                <span className="header-3">25분</span>
              </div>
              <div className="w-[2px] h-[20px] bg-gray-200 rounded-full" />
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="body-sb">휴식</span>
                <span className="header-3">25분</span>
              </div>
            </div>
          </div>
          <Button variant="primary" className="p-[28px]" size="icon">
            <Icon name="placeholder" size="lg" />
          </Button>
        </main>
      </div>
      {!hasShownGuide && (
        <Guide
          steps={steps}
          handler={{
            onGuideEnd: () => __localStorage.setItem('showGuide', { showGuide: false }),
          }}
        />
      )}
    </>
  );
};

export default Pomodoro;
