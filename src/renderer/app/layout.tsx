import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="max-w-md m-auto bg-slate-100 h-dvh font-pretendard">
      <Outlet />
    </div>
  );
};

export default RootLayout;
