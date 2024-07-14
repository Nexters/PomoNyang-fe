import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/home';

const root = createRoot(document.querySelector('#app'));
root.render(<Home />);
