import { HashRouter as ReactRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/home';
import Onboarding from '@/pages/onboarding';
import Pomodoro from '@/pages/pomodoro';
import Second from '@/pages/second';
import Selection from '@/pages/selection';
import { PATH } from '@/shared/constants';

export const Router = () => {
  return (
    <ReactRouter>
      <Routes>
        <Route>
          <Route path={PATH.HOME} element={<Home />} />
          <Route path={PATH.POMODORO} element={<Pomodoro />} />
          <Route path={PATH.SECOND} element={<Second />} />
          <Route path={PATH.ONBOARDING} element={<Onboarding />} />
          <Route path={PATH.SELECTION} element={<Selection />} />
        </Route>
      </Routes>
    </ReactRouter>
  );
};
