import { ReactNode } from 'react';

import { Icon } from './icon';

type FrameProps = {
  children: ReactNode;
};
export const Frame = ({ children }: FrameProps) => {
  return (
    <div className="relative h-full w-full overflow-y-auto pb-[112px] pt-[56px]">
      <div className="h-full p-5">{children}</div>
    </div>
  );
};

type NavBarProps = {
  title?: string;
  onBack?: () => void;
};
const NavBar = ({ title, onBack }: NavBarProps) => {
  return (
    <div className="absolute left-0 top-0 flex h-[56px] w-full items-center justify-center p-2">
      {onBack && (
        <button
          className="absolute left-2 top-2 flex h-[40px] w-[40px] items-center justify-center"
          onClick={onBack}
        >
          <Icon name="back" size="md" />
        </button>
      )}
      <h1 className="body-sb text-text-primary">{title}</h1>
    </div>
  );
};

type BottomBarProps = {
  children: ReactNode;
};
const BottomBar = ({ children }: BottomBarProps) => {
  return <div className="absolute bottom-0 left-0 h-[112px] w-full px-5 py-6">{children}</div>;
};

Frame.NavBar = NavBar;
Frame.BottomBar = BottomBar;
