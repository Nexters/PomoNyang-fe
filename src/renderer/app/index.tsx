import { createRoot } from 'react-dom/client';

import './index.css';
import { Provider } from './provider';
import { Router } from './router';

import { initDatadogRum } from '@/shared/utils';

initDatadogRum();

const root = createRoot(document.querySelector('#app')!);
root.render(
  <Provider>
    <Router />
  </Provider>,
);
