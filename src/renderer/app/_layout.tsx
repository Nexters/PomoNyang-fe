import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="max-w-[480px] bg-slate-100 m-auto h-dvh font-pretendard">
      <Outlet />
    </div>
  );
};

export default RootLayout;
