import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useLocalStorage, useTimeout } from 'usehooks-ts';

import { useUser } from '@/features/user';
import appSymbolIcon from '@/shared/assets/svgs/app-symbol.svg';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';
import { cn } from '@/shared/utils';

const Home = () => {
  const navigate = useNavigate();
  const [isCompletedOnboarding] = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED, false);
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);
  const { data: user } = useUser();

  // @note: 로딩이 1초 이상 길어지면 로고를 보여주기 위함
  useTimeout(() => setIsMinTimePassed(true), 1000);

  useEffect(() => {
    if (!user) return;
    if (!isCompletedOnboarding) return navigate(PATH.ONBOARDING);
    if (!user.cat) return navigate(PATH.SELECTION);
    navigate(PATH.POMODORO);
  }, [isCompletedOnboarding, user]);

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-[#FFE9BF] transition-opacity duration-500',
        isMinTimePassed ? 'opacity-100' : 'opacity-0',
      )}
    >
      <img src={appSymbolIcon} width={174} />
    </div>
  );
};

export default Home;
