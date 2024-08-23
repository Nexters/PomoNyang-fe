import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="m-auto h-dvh max-w-md bg-background-primary font-pretendard">
      <Outlet />
    </div>
  );
};

export default RootLayout;
