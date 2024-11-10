import { useEffect } from 'react';

import { useRive } from '@rive-app/react-canvas';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/features/user';
import catSelectMotionRiveFile from '@/shared/assets/rivs/cat_select_ver2.0.riv';
import { PATH } from '@/shared/constants';
import { userCatTypeAliasMap } from '@/shared/hooks';
import { Button, Frame, Icon, MobileLayout, Tooltip } from '@/shared/ui';

const MyCat = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const handleClickEditNameButton = () => {
    navigate(PATH.NAMING, { state: { fromMyCatPage: true } });
  };
  const handleClickChangeCatButton = () => {
    navigate(PATH.SELECTION, { state: { fromMyCatPage: true } });
  };

  const { rive, RiveComponent } = useRive({
    src: catSelectMotionRiveFile,
    stateMachines: 'State Machine_selectCat',
    autoplay: true,
  });

  useEffect(() => {
    const userCatType = user?.cat?.type;
    if (!rive || !userCatType) return;

    // 선택페이지 고양이가 자동으로 선택되도록 설정
    const userCatTypeAlias = userCatTypeAliasMap[userCatType];
    const clickCatInput = rive.stateMachineInputs('State Machine_selectCat').find((input) => {
      return input.name.toLowerCase().includes(userCatTypeAlias);
    });
    clickCatInput?.fire();
  }, [rive, user?.cat?.type]);

  return (
    <MobileLayout>
      <Frame>
        <Frame.NavBar title="나의 고양이" onBack={() => navigate(PATH.MY_PAGE)} />

        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col">
            <Tooltip
              content="사냥놀이를 하고싶다냥"
              color="white"
              sideOffset={-20}
              rootProps={{ open: true }}
              arrowProps={{ width: 14, height: 9 }}
            />

            <RiveComponent className="h-[240px] w-full select-none" />

            <div className="flex w-full items-center justify-center">
              <button
                className="flex items-center justify-center gap-1 p-3"
                onClick={handleClickEditNameButton}
              >
                <span className="header-4 text-text-secondary">{user?.cat?.name}</span>
                <Icon name="pen" size="md" />
              </button>
            </div>
          </div>
        </div>

        <Frame.BottomBar>
          <Button className="w-full" variant="secondary" onClick={handleClickChangeCatButton}>
            고양이 바꾸기
          </Button>
        </Frame.BottomBar>
      </Frame>
    </MobileLayout>
  );
};

export default MyCat;
