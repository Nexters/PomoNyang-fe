import { useNavigate } from 'react-router-dom';

import { useUser } from '@/features/user';
import { PATH } from '@/shared/constants';
import { Button, Frame, Icon, Tooltip } from '@/shared/ui';

const MyCat = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const handleClickEditNameButton = () => {
    navigate(PATH.NAMING, { state: { fromMyCatPage: true } });
  };
  const handleClickChangeCatButton = () => {
    navigate(PATH.SELECTION, { state: { fromMyCatPage: true } });
  };

  return (
    <Frame>
      <Frame.NavBar title="나의 고양이" onBack={() => navigate(PATH.MY_PAGE)} />

      <div className="h-full flex justify-center items-center">
        <div className="w-full flex flex-col">
          <Tooltip
            content="사냥놀이를 하고싶다냥"
            color="white"
            sideOffset={-20}
            rootProps={{ open: true }}
            arrowProps={{ width: 14, height: 9 }}
          >
            <div className=" h-[240px] bg-background-secondary" />
          </Tooltip>

          <div className="w-full flex justify-center items-center">
            <button
              className="flex gap-1 justify-center items-center p-3"
              onClick={handleClickEditNameButton}
            >
              <span className="header-4 text-text-secondary">{user?.cat?.name}</span>
              <Icon name="pen" size="md" />
            </button>
          </div>
        </div>
      </div>

      <Frame.BottomBar>
        <Button className="w-full" variant="secondary" onClick={handleClickChangeCatButton}>
          고양이 바꾸기
        </Button>
      </Frame.BottomBar>
    </Frame>
  );
};

export default MyCat;
