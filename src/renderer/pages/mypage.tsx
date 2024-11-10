import { useNavigate } from 'react-router-dom';

import { useFocusNotification } from '@/features/time';
import { useUser } from '@/features/user';
import { PATH } from '@/shared/constants';
import { DesktopLayout, Frame, Icon, Toggle } from '@/shared/ui';

const SURVEY_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSdoFxWJ7TFTU0-HKZEeqmDxz5ZprYtRz08FwrzNgDWnkNaOeA/viewform';

const MyPage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { isEnabled, isUnavailable, changeEnabled } = useFocusNotification();

  return (
    <DesktopLayout>
      <Frame>
        <Frame.NavBar title="마이페이지" onBack={() => navigate(PATH.POMODORO)} />

        <div className="flex w-full flex-col gap-3">
          <ActionButton onClick={() => navigate(PATH.MY_CAT)}>
            <span className="subBody-r text-text-tertiary">나의 고양이</span>
            <span className="header-4 text-text-primary">{user?.cat?.name}</span>
          </ActionButton>

          <ReadyForStat />

          <div className="w-full rounded-sm bg-background-secondary p-5">
            <div className="flex w-full items-center">
              <div className="flex flex-1 flex-col justify-start">
                <h3 className="body-sb text-text-primary">집중시간 알림받기</h3>
                <p className="subBody-r text-text-tertiary">
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

          <ActionButton onClick={() => window.open(SURVEY_LINK, '_target')}>
            <span className="body-sb text-text-primary">의견 보내기</span>
          </ActionButton>
        </div>
      </Frame>
    </DesktopLayout>
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

const ReadyForStat = () => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-sm bg-background-secondary py-[62px]">
    <Icon name="readyForStat" width={100} height={100} />
    <div className="flex flex-col gap-1 text-center">
      <h3 className="header-5 text-text-primary">통계 기능을 준비하고 있어요</h3>
      <p className="subBody-r text-text-secondary">
        집중시간을 모아보는 통계가
        <br />곧 업데이트될 예정이에요
      </p>
    </div>
  </div>
);

// TODO: 통계쪽 디자인 가이드 완성되면 반영 예정
// const OfflineStat = () => (
//   <div className="flex flex-col justify-center items-center gap-2 py-[62px] bg-background-secondary rounded-sm">
//     <img src={OfflineStatIcon} width={100} height={100} />
//     <div className="flex flex-col gap-1 text-center">
//       <h3 className="header-5 text-text-primary">지금은 통계를 확인할 수 없어요</h3>
//       <p className="subBody-r text-text-secondary">인터넷에 연결하면 통계를 볼 수 있어요</p>
//     </div>
//   </div>
// );

// TODO: 디자인 가이드 업데이트 가능성이 있어서 일단 작업 보류함
// const OnlineStat = () => {
//   const statics = {
//     today: '3시간 35분',
//     week: '23시간 45분',
//     categories: [
//       { name: '집중', time: '2시간 30분' },
//       { name: '휴식', time: '1시간 5분' },
//     ],
//   }
//   return <div className='w-full p-5 rounded-sm bg-background-secondary'>
//     <div>

//     </div>
//   </div>
// }

export default MyPage;
