import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { useTimer } from '@/shared/hooks';
import { Button, Drawer, DrawerContent, DrawerFooter, DrawerTitle, useToast } from '@/shared/ui';

const INITIAL_TIME = 1000 * 60 * 25;

const Pomodoro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { time, isRunning, start, resume, stop, pause } = useTimer(INITIAL_TIME, {
    onFinish: () => {
      new Notification('모하냥', {
        body: '수고했다냥',
      });
    },
  });
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  return (
    <Drawer open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
      <div>
        <Button
          onClick={() => {
            navigate(PATH.HOME);
          }}
        >
          홈 페이지로 가기
        </Button>
        <h1>뽀모도로 타이머</h1>
        {Math.floor(time / 1000)} : {INITIAL_TIME / 1000}
        <div>isRunning: {isRunning ? 'true' : 'false'}</div>
        <Button onClick={start}>START</Button>
        <Button onClick={resume}>RESUME</Button>
        <Button onClick={pause}>PAUSE</Button>
        <Button onClick={stop}>STOP</Button>
        <Button onClick={() => setIsOpenDrawer(true)}>끝났냥</Button>
        <DrawerContent>
          <div className="p-4">
            <DrawerTitle>집중 시간 어땠옹?</DrawerTitle>
            <p>나중에 설정에서 선택을 변경할 수 있엉</p>

            <div className="flex flex-col gap-2">
              <Button size="lg">쫌 짧드라</Button>
              <Button size="lg">적당했어</Button>
              <Button size="lg">쫌 길드라</Button>
            </div>
          </div>
          <DrawerFooter>
            <Button
              size="lg"
              onClick={() => {
                setIsOpenDrawer(false);
                toast({
                  title: '오키 5분 추가했엉 다음 집중때 해바',
                });
              }}
            >
              완료
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </div>
    </Drawer>
  );
};

export default Pomodoro;
