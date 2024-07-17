import { createRoot } from 'react-dom/client';

import Home from '@/pages/home';
import '../index.css';

const root = createRoot(document.querySelector('#app'));
root.render(<Home />);
