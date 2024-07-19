import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/home';
import Onboarding from '@/pages/onboarding';
import Second from '@/pages/second';
import Selection from '@/pages/selection';
import { PATH } from '@/shared/lib/constants';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path={PATH.HOME} element={<Home />} />
          <Route path={PATH.SECOND} element={<Second />} />
          <Route path={PATH.ONBOARDING} element={<Onboarding />} />
          <Route path={PATH.SELECTION} element={<Selection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
