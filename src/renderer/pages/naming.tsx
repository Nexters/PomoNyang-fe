import { useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useRenameSelectedCat } from '@/features/cat';
import { useUser } from '@/features/user';
import catHomeMotionRiveFile from '@/shared/assets/rivs/cat_home.riv';
import { PATH } from '@/shared/constants';
import { useRiveCat } from '@/shared/hooks';
import { Button, Frame, SimpleLayout, Tooltip } from '@/shared/ui';

const Naming = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromMyCatPage = location.state?.fromMyCatPage ?? false;

  const { data: user } = useUser();
  const { mutate: renameSelectedCat } = useRenameSelectedCat();

  const [typedCatName, setTypedCatName] = useState('');
  const errorMessage = useMemo(() => getErrorMessage(typedCatName), [typedCatName]);

  const selectedCatName = user?.cat?.name;

  const { RiveComponent, clickCatInput } = useRiveCat({
    src: catHomeMotionRiveFile,
    stateMachines: 'State Machine_Home',
    userCatType: user?.cat?.type,
  });

  const handleClickBackButton = () => {
    navigate(fromMyCatPage ? PATH.MY_CAT : PATH.SELECTION);
  };
  const handleClickCompleteButton = () => {
    if (errorMessage) return;

    if (typedCatName.length > 0) {
      renameSelectedCat(typedCatName);
    }
    navigate(fromMyCatPage ? PATH.MY_CAT : PATH.POMODORO);
  };

  return (
    <SimpleLayout>
      <Frame>
        <Frame.NavBar onBack={handleClickBackButton} />
        <div className="flex h-full w-full flex-col items-center justify-center gap-10">
          <Tooltip
            content="반갑다냥! 내 이름을 지어줄래냥?"
            color="white"
            sideOffset={-40}
            rootProps={{ open: true }}
            arrowProps={{ width: 14, height: 9 }}
          >
            <RiveComponent
              className="h-[240px] w-[240px] cursor-pointer select-none"
              onClick={() => {
                clickCatInput?.fire();
              }}
            />
          </Tooltip>

          <div className="relative flex w-full flex-col gap-2">
            <label className="subBody-r text-text-secondary">내 고양이의 이름</label>
            <input
              value={typedCatName}
              placeholder={selectedCatName}
              className="body-sb rounded-sm p-lg text-text-primary caret-text-accent-1 placeholder:text-text-disabled"
              onChange={(e) => setTypedCatName(e.target.value)}
            />
            {errorMessage && (
              <div className="absolute bottom-[-8px] left-0 w-full">
                <div className="caption-r absolute left-0 top-0 text-accent-red">
                  {errorMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <Frame.BottomBar>
          <Button className="w-full" disabled={!!errorMessage} onClick={handleClickCompleteButton}>
            확인
          </Button>
        </Frame.BottomBar>
      </Frame>
    </SimpleLayout>
  );
};

// 특수문자 및 공백 여부 확인 정규식
const spaceRegex = /^\s+$/;
const specialCharRegex = /[~!@#$%^&*()_+|<>?:{}\s]/;

const getErrorMessage = (name: string) => {
  if (name.length === 0) return '';
  if (spaceRegex.test(name)) return '고양이 이름은 빈 칸이 될 수 없어요';
  if (specialCharRegex.test(name)) return '고양이 이름에는 공백, 특수문자가 들어갈 수 없어요';
  if (name.length > 10) return '고양이 이름은 10글자를 넘길 수 없어요';
  return '';
};

export default Naming;
