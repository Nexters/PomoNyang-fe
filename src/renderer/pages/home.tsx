import { useNavigate } from 'react-router-dom';

import { useUser } from '@/features/user';
import { PATH } from '@/shared/constants';
import { useAuthToken, useMachineId } from '@/shared/hooks';
import { Button, SelectGroup, SelectGroupItem, Toggle, Tooltip } from '@/shared/ui';

const Home = () => {
  const navigate = useNavigate();
  const machineId = useMachineId();
  const { data: authToken } = useAuthToken();
  const { data: user } = useUser();
  console.log('from env:', import.meta.env.VITE_SAMPLE);
  console.log('authToken:', authToken, 'user:', user);
  return (
    <div>
      <h1>
        <Tooltip content="welcome!">home</Tooltip>
      </h1>
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
      <div className="p-2">
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

      <div className="inline-grid gap-2 p-2">
        <Button size="lg">default - lg</Button>
        <Button>default - md</Button>
        <Button size="sm">default - sm</Button>
        <Button disabled>default - disable</Button>
        <Button variant="secondary">secondary - able</Button>
        <Button variant="secondary" disabled>
          secondary - disable
        </Button>
        <Button variant="text-primary">text primary - default</Button>
        <Button variant="text-primary" disabled>
          text primary - disabled
        </Button>
        <Button variant="text-secondary">text secondary - default</Button>
        <Button variant="text-secondary" disabled>
          text secondary - disabled
        </Button>
        <Button variant="tertiary">tertiary - default</Button>
        <Button variant="secondary" size="icon" className="w-12 h-12 text-white">
          O
        </Button>
      </div>
      <SelectGroup className="p-2">
        <SelectGroupItem value="select1" className="p-4" disabled>
          select 1
        </SelectGroupItem>
        <SelectGroupItem value="select2" className="p-4">
          select 2
        </SelectGroupItem>
        <SelectGroupItem value="select3" className="p-4">
          select 3
        </SelectGroupItem>
      </SelectGroup>
      <Toggle />
    </div>
  );
};

export default Home;
