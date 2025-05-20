import { useNavigate } from 'react-router-dom';

import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { PATH } from '@/shared/constants';
import { SidebarLayout, Icon, Toggle } from '@/shared/ui';

const SURVEY_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSdoFxWJ7TFTU0-HKZEeqmDxz5ZprYtRz08FwrzNgDWnkNaOeA/viewform';

const MyPage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { isEnabled, isUnavailable, changeEnabled } = useFocusNotification();

  return (
    <SidebarLayout title="마이페이지">
      <div className="px-4 py-2">
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="subBody-sb text-text-secondary">나의 고양이</h2>
            <ActionButton onClick={() => navigate(PATH.MY_CAT)}>
              <span className="body-sb text-text-primary">{user?.cat?.name}</span>
            </ActionButton>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="subBody-sb text-text-secondary">알림</h2>
            <div className="w-full rounded-sm bg-background-secondary px-5 py-6">
              <div className="flex w-full items-center">
                <div className="flex flex-1 flex-col justify-start gap-1">
                  <h3 className="body-sb text-text-primary">집중시간 알림받기</h3>
                  <p className="caption-r text-text-tertiary">
                    집중・휴식시간이 되면 고양이가 알려줘요
                  </p>
                </div>
                <Toggle
                  disabled={isUnavailable}
                  pressed={isEnabled}
                  onPressedChange={(pressed) => {
                    console.log('pressed', pressed);
                    changeEnabled(pressed);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="subBody-sb text-text-secondary">서비스</h2>
            <ActionButton onClick={() => window.open(SURVEY_LINK, '_target')}>
              <span className="body-sb text-text-primary">의견 보내기</span>
            </ActionButton>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};
const ActionButton = ({ children, onClick }: ActionButtonProps) => (
  <button
    className="flex w-full items-center rounded-sm bg-background-secondary p-5"
    onClick={onClick}
  >
    <span className="flex flex-1 flex-col items-start">{children}</span>
    <Icon name="chevronRight" size="md" />
  </button>
);

export default MyPage;
