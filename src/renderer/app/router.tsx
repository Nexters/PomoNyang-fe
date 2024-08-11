import { HashRouter as ReactRouter, Route, Routes } from 'react-router-dom';

import RootLayout from './layout';

import Home from '@/pages/home';
import Naming from '@/pages/naming';
import Onboarding from '@/pages/onboarding';
import Pomodoro from '@/pages/pomodoro';
import Second from '@/pages/second';
import Selection from '@/pages/selection';
import { PATH } from '@/shared/constants';

export const Router = () => {
  return (
    <ReactRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={PATH.HOME} element={<Home />} />
          <Route path={PATH.POMODORO} element={<Pomodoro />} />
          <Route path={PATH.SECOND} element={<Second />} />
          <Route path={PATH.ONBOARDING} element={<Onboarding />} />
          <Route path={PATH.SELECTION} element={<Selection />} />
          <Route path={PATH.NAMING} element={<Naming />} />
        </Route>
      </Routes>
    </ReactRouter>
  );
};
