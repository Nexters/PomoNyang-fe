import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { PATH } from '@/shared/lib/constants';

const Second = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>second</h1>
      <Button
        onClick={() => {
          navigate(PATH.HOME);
        }}
      >
        홈으로 가기
      </Button>
    </div>
  );
};

export default Second;
