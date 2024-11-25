import { useLocation, useNavigate } from 'react-router-dom';

import { PATH } from '../constants';
import { cn } from '../utils';

import { Icon } from './icon';

export type SimpleLayoutProps = {
  children: React.ReactNode;
};

export const SimpleLayout = ({ children }: SimpleLayoutProps) => {
  return (
    <div className="relative m-auto h-dvh max-w-md bg-background-primary">
      <div className="drag-region fixed left-0 right-0 top-0 h-[28px]" />
      <div className="absolute bottom-0 left-0 right-0 top-[28px]">{children}</div>
    </div>
  );
};

export type SidebarLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export const SidebarLayout = ({ title, children }: SidebarLayoutProps) => {
  return (
    <div className="relative h-dvh w-full">
      <div className="drag-region absolute bottom-0 left-0 top-0 w-[68px] bg-background-secondary pt-[52px]">
        <DesktopSidebar />
      </div>
      <div className="drag-region absolute left-[68px] right-0 top-0 h-[52px] bg-background-primary">
        <h1 className="body-sb inline-flex h-full items-center pl-3 text-text-primary">{title}</h1>
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
