import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { useUser } from '@/features/user';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';

const Home = () => {
  const navigate = useNavigate();
  const [isCompleted] = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED, false);
  const { data: user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (!isCompleted) return navigate(PATH.ONBOARDING);
    if (!user.cat) return navigate(PATH.SELECTION);
    navigate(PATH.POMODORO);
  }, [isCompleted, user]);

  return <div>loading... 🐈 🐈‍⬛</div>;
};

export default Home;
