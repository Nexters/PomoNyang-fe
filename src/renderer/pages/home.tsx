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
    </div>
  );
};

export default Home;
