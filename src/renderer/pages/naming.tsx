import { useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useRenameSelectedCat } from '@/features/cat';
import { useCats } from '@/features/cat/hooks/use-cats';
import { PATH } from '@/shared/constants';
import { Button, Frame, Tooltip } from '@/shared/ui';

const Naming = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: cats } = useCats();
  const { mutate: renameSelectedCat } = useRenameSelectedCat();

  const [typedCatName, setTypedCatName] = useState('');
  const errorMessage = useMemo(() => getErrorMessage(typedCatName), [typedCatName]);

  // FIXME: 고양이 선택 페이지에서 넘어온게 아니면 redirect 해야할지도?
  const selectedCatName = useMemo(() => {
    const { selectedCatNo } = location.state ?? {};
    return cats?.find((cat) => cat.no === selectedCatNo)?.name;
  }, [location.state, cats]);

  const handleClickBackButton = () => {
    navigate(PATH.SELECTION);
  };
  const handleClickCompleteButton = () => {
    if (errorMessage) return;

    if (typedCatName.length > 0) {
      renameSelectedCat(typedCatName);
    }
    navigate(PATH.POMODORO);
  };

  return (
    <Frame>
      <Frame.NavBar onBack={handleClickBackButton} />
      <div className="h-full flex justify-center items-center">
        <div className="w-full flex flex-col gap-10">
          <Tooltip
            content="반갑다냥! 내 이름을 지어줄래냥?"
            color="white"
            sideOffset={-20}
            rootProps={{ open: true }}
            arrowProps={{ width: 14, height: 9 }}
          >
            <div className=" h-[240px] bg-background-secondary" />
          </Tooltip>

          <div className="relative flex flex-col gap-2">
            <label className="subBody-4 text-text-secondary">내 고양이의 이름</label>
            <input
              value={typedCatName}
              placeholder={selectedCatName}
              className="body-sb text-text-primary placeholder:text-text-disabled p-lg rounded-sm caret-text-accent-1"
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
          완료
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
