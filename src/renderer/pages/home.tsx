import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { useAuthToken, useMachineId } from '@/shared/hooks';
import { Button } from '@/shared/ui';

const Home = () => {
  const navigate = useNavigate();
  const machineId = useMachineId();
  const [enable, setEnable] = useState(false);
  const authToken = useAuthToken(enable);
  console.log('from env:', import.meta.env.VITE_SAMPLE);
  console.log('authToken:', authToken.data, authToken.error, authToken.isLoading);
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
      <Button onClick={() => setEnable(!enable)}>{enable ? 'disable' : 'enable'}</Button>
    </div>
  );
};

export default Home;
