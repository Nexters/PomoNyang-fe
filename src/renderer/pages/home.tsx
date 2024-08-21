import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { useUser } from '@/features/user';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';

const Home = () => {
  const navigate = useNavigate();
  const [isCompletedOnboarding] = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED, false);
  const { data: user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (!isCompletedOnboarding) return navigate(PATH.ONBOARDING);
    if (!user.cat) return navigate(PATH.SELECTION);
    navigate(PATH.POMODORO);
  }, [isCompletedOnboarding, user]);

  return <div>loading... 🐈 🐈‍⬛</div>;
};

export default Home;
