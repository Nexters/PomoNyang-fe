import { useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '../constants';
import { cn } from '../utils';

import { Icon } from './icon';

export type MobileLayoutProps = {
  children: React.ReactNode;
};

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return <div className="m-auto h-dvh max-w-md bg-background-primary">{children}</div>;
};

export type DesktopLayoutProps = {
  children: React.ReactNode;
};

export const DesktopLayout = ({ children }: DesktopLayoutProps) => {
  return (
    <div className="relative h-dvh w-full">
      <div className="absolute bottom-0 left-0 top-0 w-[68px] bg-background-secondary pt-[52px]">
        <DesktopSidebar />
      </div>
      <div className="absolute left-[68px] right-0 top-0 h-[52px] bg-background-tertiary">
        {/* FIXME: 위 영역 구분을 위해 임시로 배경색 변경해둠 */}
      </div>
      <div className="absolute bottom-0 left-[68px] right-0 top-[52px] bg-background-primary">
        {children}
      </div>
    </div>
  );
};

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <button
        className={cn(
          'h-12 w-12 p-2',
          location.pathname === PATH.POMODORO ? 'text-icon-primary' : 'text-icon-tertiary',
        )}
        onClick={() => navigate(PATH.POMODORO)}
      >
        <Icon size="lg" name="clockLine" className="*:stroke-current" />
      </button>
      <button
        className={cn(
          'h-12 w-12 p-2',
          location.pathname === PATH.MY_PAGE ? 'text-icon-primary' : 'text-icon-tertiary',
        )}
        onClick={() => navigate(PATH.MY_PAGE)}
      >
        <Icon size="lg" name="menu" className="*:stroke-current" />
      </button>
    </div>
  );
};
