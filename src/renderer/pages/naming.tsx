import { useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { Button, Frame } from '@/shared/ui';

const Naming = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const errorMessage = useMemo(() => getErrorMessage(name), [name]);

  const selectedCatName = useMemo(() => {
    // FIXME: 고양이 선택 페이지에서 넘어온게 아니면 redirect 해야할지도?
    return location.state?.selectedCatName ?? '까만냥';
  }, [location.state]);

  return (
    <Frame>
      <Frame.NavBar onBack={() => navigate(PATH.SELECTION)} />
      <div className="flex flex-col gap-10">
        <h2 className="header-3 text-text-primary whitespace-pre-wrap">
          {'반갑다냥!\n내 이름을 지어줄래냥?'}
        </h2>
        <div className="text-center">
          <div className="inline-block w-[240px] h-[240px] bg-background-secondary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="subBody-4 text-text-secondary">내 고양이의 이름</label>
          <input
            value={name}
            placeholder={selectedCatName}
            className="body-sb text-text-primary placeholder:text-text-disabled p-lg rounded-sm caret-text-accent-1"
            onChange={(e) => setName(e.target.value)}
          />
          {errorMessage && <div className="caption-r text-accent-red">{errorMessage}</div>}
        </div>
      </div>
      <Frame.BottomBar>
        <Button
          className="w-full"
          disabled={!!errorMessage}
          onClick={() => navigate(PATH.POMODORO)}
        >
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
