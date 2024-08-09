import { ReactNode } from 'react';

import { Icon } from './icon';

type FrameProps = {
  children: ReactNode;
};
export const Frame = ({ children }: FrameProps) => {
  return (
    <div className="w-full h-full relative pt-[56px] pb-[112px] overflow-y-auto">
      <div className="p-5 h-full">{children}</div>
    </div>
  );
};

type NavBarProps = {
  title?: string;
  onBack?: () => void;
};
const NavBar = ({ title, onBack }: NavBarProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-[56px] flex justify-center items-center p-2">
      <button
        className="absolute top-2 left-2 flex justify-center items-center w-[40px] h-[40px]"
        onClick={onBack}
      >
        <Icon name="back" size="md" />
      </button>
      <h1 className="body-sb text-text-primary">{title}</h1>
    </div>
  );
};

type BottomBarProps = {
  children: ReactNode;
};
const BottomBar = ({ children }: BottomBarProps) => {
  return <div className="absolute bottom-0 left-0 w-full h-[112px] px-5 py-6">{children}</div>;
};

Frame.NavBar = NavBar;
Frame.BottomBar = BottomBar;
