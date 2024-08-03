import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { useMachineId } from '@/shared/hooks';
import { Button } from '@/shared/ui';

const Home = () => {
  const navigate = useNavigate();
  const machineId = useMachineId();
  console.log('from env:', import.meta.env.VITE_SAMPLE);
  return (
    <div>
      <h1>home</h1>
      <p>your machine id: {machineId}</p>
      <Button
        onClick={() => {
          navigate(PATH.SECOND);
        }}
      >
        second 페이지로 가기
      </Button>
      <Button
        onClick={() => {
          navigate(PATH.ONBOARDING);
        }}
      >
        온보딩 페이지로 가기
      </Button>
      <Button
        onClick={() => {
          navigate(PATH.SELECTION);
        }}
      >
        선택 페이지로 가기
      </Button>
      <Button
        onClick={() => {
          navigate(PATH.POMODORO);
        }}
      >
        뽀모도로 페이지로 가기
      </Button>
      <div className="container">
        <div className="time">time</div>

        <div className="header-1">header-1</div>
        <div className="header-2">header-2</div>
        <div className="header-3">header-3</div>
        <div className="header-4">header-4</div>
        <div className="header-5">header-5</div>

        <div className="body-sb">body-sb</div>
        <div className="body-r">body-r</div>

        <div className="subBody-sb">subBody-sb</div>
        <div className="subBody-r">subBody-r</div>

        <div className="caption-sb">caption-sb</div>
        <div className="caption-r">caption-r</div>
      </div>
    </div>
  );
};

export default Home;
