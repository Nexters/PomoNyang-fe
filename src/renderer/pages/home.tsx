import { useNavigate } from 'react-router-dom';

import { useUser } from '@/features/user';
import { PATH } from '@/shared/constants';
import { useAuthToken, useMachineId } from '@/shared/hooks';
import { Button } from '@/shared/ui';

const Home = () => {
  const navigate = useNavigate();
  const machineId = useMachineId();
  const { data: authToken } = useAuthToken();
  const { data: user } = useUser();
  console.log('from env:', import.meta.env.VITE_SAMPLE);
  console.log('authToken:', authToken, 'user:', user);
  return (
    <div>
      <p>your machine id: {machineId}</p>
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
      <Button
        onClick={() => {
          navigate(PATH.NAMING);
        }}
      >
        이름짓기 페이지로 가기
      </Button>
      <Button
        onClick={() => {
          navigate(PATH.MY_PAGE);
        }}
      >
        마이 페이지로 가기
      </Button>
    </div>
  );
};

export default Home;
