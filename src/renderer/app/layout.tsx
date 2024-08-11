import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="max-w-md m-auto bg-background-primary h-dvh font-pretendard">
      <Outlet />
    </div>
  );
};

export default RootLayout;
