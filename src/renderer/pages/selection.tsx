import { Fragment, useMemo, useState } from 'react';

import { useRive } from '@rive-app/react-canvas';
import { useLocation, useNavigate } from 'react-router-dom';

import { CatType } from '@/entities/cat';
import { useCats, useSelectCat } from '@/features/cat';
import catSelectMotionRiveFile from '@/shared/assets/rivs/cat_select_motion.riv';
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
const RIVE_STATE_MACHINE_NAME = 'State Machine_selectCat';
// @note: 다음과 같은 애니메이션이 있고 참고용으로 남겨둠
// const riveAnimations = [
//   'Defualt_noneSelect',
//   'Home_Default_Cheese Cat',
//   'Home_Default_Black Cat',
//   'Home_Default_Calico Cat',
//   'stretch_Cheese Cat',
//   'stretch_Black Cat',
//   'stretch_Calico Cat',
//   'Change_FrontView_Cheese Cat',
//   'Change_FrontView_Black Cat',
//   'Change_FrontView_Calico Cat',
//   'Pangpang_Cheese Cat',
//   'Pangpang_Black Cat',
//   'Pangpang_Calico Cat',
//   'Focus_Calico Cat',
// ];

const Selection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromMyCatPage = location.state?.fromMyCatPage ?? false;

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

  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const { rive, RiveComponent } = useRive({
    src: catSelectMotionRiveFile,
    stateMachines: RIVE_STATE_MACHINE_NAME,
    autoplay: true,
    onStateChange: (event) => {
      setCurrentAnimation((event.data as string[])[0]);
    },
  });
  const [cheeseCatInput, blackCatInput, calicoCatInput] =
    rive?.stateMachineInputs(RIVE_STATE_MACHINE_NAME) ?? [];
  const catTypeInputMap = {
    CHEESE: cheeseCatInput,
    BLACK: blackCatInput,
    THREE_COLOR: calicoCatInput,
  };

  const handleClickBackButton = () => {
    navigate(fromMyCatPage ? PATH.MY_CAT : PATH.ONBOARDING);
  };

  const handleClickSelectButton = async () => {
    if (!selectedCatId) return;

    const permission = await requestPermission();
    // TODO: 알림 허가 여부에 따른 토스트 메시지 표시?
    console.log(permission);

    const selectedCatNo = Number(selectedCatId);

    selectCat(selectedCatNo);
    navigate(fromMyCatPage ? PATH.MY_CAT : PATH.NAMING);
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
          <RiveComponent className="w-full h-[240px]" />
        </div>

        <SelectGroup
          className="flex"
          value={selectedCatId}
          // FIXME: stretch 중에 다른 고양이 선택하면 제대로 전환이 일어나지 않음...
          // 안드로이드는 어떻게 했는지 확인 필요
          disabled={currentAnimation.startsWith('stretch_')}
          onValueChange={(nextCatId) => {
            setSelectedCatId((prevCatId) => {
              const prevCat = cats.find((cat) => cat.id === prevCatId);
              const nextCat = cats.find((cat) => cat.id === nextCatId);

              // 다음 고양이 선택이 있으면 해당 input을 fire
              // 없으면 처음으로 돌아가기 위해 이전 고양이의 input을 fire
              if (nextCat) {
                catTypeInputMap[nextCat.type]?.fire();
              } else if (prevCat) {
                catTypeInputMap[prevCat.type]?.fire();
              }

              return nextCatId;
            });
          }}
        >
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
