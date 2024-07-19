import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '@/pages/home';
import Second from '@/pages/second';
import { PATH } from '@/shared/constants';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path={PATH.HOME} element={<Home />} />
          <Route path={PATH.SECOND} element={<Second />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
