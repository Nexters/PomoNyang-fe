import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { useStopwatch } from '@/shared/hooks';
import { Button } from '@/shared/ui';

const INITIAL_TIME = 60 * 25;

const Pomodoro = () => {
  const navigate = useNavigate();
  const { time, isRunning, start, stop, pause } = useStopwatch(INITIAL_TIME, {
    onFinish: () => {
      new Notification('모하냥', {
        body: '수고했다냥',
      });
    },
  });

  return (
    <div>
      <Button
        onClick={() => {
          navigate(PATH.HOME);
        }}
      >
        홈 페이지로 가기
      </Button>
      <h1>뽀모도로 타이머</h1>
      {time} : {INITIAL_TIME}
      <div>isRunning: {isRunning ? 'true' : 'false'}</div>
      <Button onClick={start}>START</Button>
      <Button onClick={pause}>PAUSE</Button>
      <Button onClick={stop}>STOP</Button>
    </div>
  );
};

export default Pomodoro;
