import { createRoot } from 'react-dom/client';

import '../index.css';
import { Provider } from './provider';
import { Router } from './router';

const root = createRoot(document.querySelector('#app'));
root.render(
  <Provider>
    <Router />
  </Provider>,
);
