import { useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useRenameSelectedCat } from '@/features/cat';
import { useUser } from '@/features/user';
import catHomeMotionRiveFile from '@/shared/assets/rivs/cat_home.riv';
import { PATH } from '@/shared/constants';
import { useRiveCat } from '@/shared/hooks';
import { Button, Frame, Tooltip } from '@/shared/ui';

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
    <Frame>
      <Frame.NavBar onBack={handleClickBackButton} />
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col w-full gap-10">
          <Tooltip
            content="반갑다냥! 내 이름을 지어줄래냥?"
            color="white"
            sideOffset={-20}
            rootProps={{ open: true }}
            arrowProps={{ width: 14, height: 9 }}
          />
          <RiveComponent
            className="w-full h-[240px] cursor-pointer select-none"
            onClick={() => {
              clickCatInput?.fire();
            }}
          />
          <div className="relative flex flex-col gap-2">
            <label className="subBody-4 text-text-secondary">내 고양이의 이름</label>
            <input
              value={typedCatName}
              placeholder={selectedCatName}
              className="rounded-sm body-sb text-text-primary placeholder:text-text-disabled p-lg caret-text-accent-1"
              onChange={(e) => setTypedCatName(e.target.value)}
            />
            {errorMessage && (
              <div className="absolute bottom-[-8px] left-0 w-full">
                <div className="absolute top-0 left-0 caption-r text-accent-red">
                  {errorMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Frame.BottomBar>
        <Button className="w-full" disabled={!!errorMessage} onClick={handleClickCompleteButton}>
          확인
        </Button>
      </Frame.BottomBar>
    </Frame>
  );
};

// 특수문자 및 공백 여부 확인 정규식
const specialCharRegex = /[~!@#$%^&*()_+|<>?:{}\s]/;

const getErrorMessage = (name: string) => {
  if (name.length === 0) return '';
  if (specialCharRegex.test(name)) return '고양이 이름에는 공백, 특수문자가 들어갈 수 없어요';
  if (name.length > 10) return '고양이 이름은 10글자를 넘길 수 없어요';
  return '';
};

export default Naming;
