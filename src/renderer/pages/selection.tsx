import { Fragment, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { Button, Frame, Icon, SelectGroup, SelectGroupItem } from '@/shared/ui';
import { cn } from '@/shared/utils';

const Selection = () => {
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState<string | undefined>(undefined);

  // TODO: 고양이 목록 API 호출
  const cats = [
    { id: '1', name: '치즈냥', adj: '응원', alarmMessage: '어디갔나옹...' },
    { id: '2', name: '까만냥', adj: '긍정', alarmMessage: '어디갔나옹...' },
    { id: '3', name: '삼색냥', adj: '자극', alarmMessage: '내가 여기있는데 어디갔냐옹!' },
  ];

  return (
    <Frame>
      <Frame.NavBar title="고양이 선택" onBack={() => navigate(PATH.ONBOARDING)} />

      <div className="w-full flex flex-col gap-[42px]">
        <div className="flex flex-col gap-1">
          <h1 className="header-3 text-text-primary">어떤 고양이와 함께할까요?</h1>
          <p className="body-r text-text-secondary">언제든지 다른 고양이와 함께할 수 있어요</p>
        </div>

        <div className="flex flex-col gap-3">
          {!selectedCatId && <AlarmEmpty />}
          {cats.map((cat) => (
            <Fragment key={cat.id}>
              {selectedCatId === cat.id && <AlarmSample message={cat.alarmMessage} />}
            </Fragment>
          ))}

          {/* TODO: 아래를 선택한 고양이 이미지 에셋으로 변경 */}
          <div className="w-full h-[240px] bg-background-secondary" />
        </div>

        <SelectGroup className="flex" value={selectedCatId} onValueChange={setSelectedCatId}>
          {cats.map((cat) => (
            <SelectGroupItem
              key={cat.id}
              value={cat.id}
              className="h-[80px] flex-1 flex flex-col gap-1"
            >
              <span className="flex gap-1 subBody-4 text-text-tertiary">
                {cat.adj} <Icon size="xs" />
              </span>
              <span
                className={cn(
                  'header-5',
                  selectedCatId === cat.id ? 'text-text-primary' : 'text-text-secondary',
                )}
              >
                {cat.name}
              </span>
            </SelectGroupItem>
          ))}
        </SelectGroup>
      </div>

      <Frame.BottomBar>
        <Button
          disabled={!selectedCatId}
          className="w-full"
          onClick={() =>
            navigate(PATH.NAMING, {
              state: {
                selectedCatId,
                selectedCatName: cats.find((cat) => cat.id === selectedCatId)?.name,
              },
            })
          }
        >
          이 고양이와 시작하기
        </Button>
      </Frame.BottomBar>
    </Frame>
  );
};

const AlarmEmpty = () => {
  return (
    <div className="w-full h-[72px] rounded-xs bg-background-secondary flex justify-center items-center text-center text-gray-400 body-r whitespace-pre-line">
      {'고양이를 선택하면\n딴 짓 방해알림 예시를 보여드려요'}
    </div>
  );
};

type AlarmSampleProps = {
  appName?: string;
  time?: string;
  message: string;
};
const AlarmSample = ({ appName = '모하냥', time = '지금', message }: AlarmSampleProps) => {
  return (
    <div
      className={cn(
        'w-full h-[72px] rounded-xs bg-background-secondary flex items-center gap-[10px] px-[14px]',
        'animate-in fade-in-0 slide-in-from-bottom-2 duration-700',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      )}
    >
      {/* TODO: 앱 아이콘으로 변경 */}
      <div className="w-[38px] h-[38px] rounded-xs bg-white" />

      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <h3 className="subBody-sb text-gray-900">{appName}</h3>
          <p className="caption-r text-gray-300 pr-2">{time}</p>
        </div>
        <p className="subBody-r text-gray-900">{message}</p>
      </div>
    </div>
  );
};

export default Selection;
