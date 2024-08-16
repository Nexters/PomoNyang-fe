import { Fragment, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { CatType } from '@/entities/cat';
import { useCats, useSelectCat } from '@/features/cat';
import { PATH } from '@/shared/constants';
import { useNotification } from '@/shared/hooks';
import { Button, Frame, Icon, IconName, SelectGroup, SelectGroupItem } from '@/shared/ui';
import { cn } from '@/shared/utils';

const adjectiveMap: Record<CatType, string> = {
  CHEESE: '응원',
  BLACK: '긍정',
  THREE_COLOR: '자극',
};
const iconNameMap: Record<CatType, IconName> = {
  CHEESE: 'cheer',
  BLACK: 'positive',
  THREE_COLOR: 'stimulus',
};
const alarmMessageMap: Record<CatType, string> = {
  CHEESE: '어디갔나옹...',
  BLACK: '어디갔나옹...',
  THREE_COLOR: '내가 여기있는데 어디갔냐옹!',
};

const Selection = () => {
  const navigate = useNavigate();
  const { data: originCats } = useCats();
  const cats = useMemo(
    () =>
      originCats?.map((cat) => ({
        no: cat.no,
        name: cat.name,
        type: cat.type,
        id: String(cat.no),
        iconName: iconNameMap[cat.type],
        adjective: adjectiveMap[cat.type],
        alarmMessage: alarmMessageMap[cat.type],
      })) ?? [],
    [originCats],
  );
  const [selectedCatId, setSelectedCatId] = useState<string | undefined>(undefined);
  const { mutate: selectCat } = useSelectCat();
  const { requestPermission } = useNotification();

  const handleClickBackButton = () => {
    navigate(PATH.ONBOARDING);
  };

  const handleClickSelectButton = async () => {
    if (!selectedCatId) return;

    const permission = await requestPermission();
    // TODO: 알림 허가 여부에 따른 토스트 메시지 표시?
    console.log(permission);

    const selectedCatNo = Number(selectedCatId);

    selectCat(selectedCatNo);
    navigate(PATH.NAMING, {
      state: {
        selectedCatId,
        selectedCatNo,
      },
    });
  };

  return (
    <Frame>
      <Frame.NavBar title="고양이 선택" onBack={handleClickBackButton} />

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
                {cat.adjective} <Icon size="xs" name={cat.iconName} />
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
        <Button disabled={!selectedCatId} className="w-full" onClick={handleClickSelectButton}>
          이 고양이와 함께하기
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
