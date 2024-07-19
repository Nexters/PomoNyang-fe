import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { Button } from '@/shared/ui/button';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>home</h1>
      <Button
        onClick={() => {
          navigate(PATH.SECOND);
        }}
      >
        second 페이지로 가기
      </Button>
    </div>
  );
};

export default Home;
