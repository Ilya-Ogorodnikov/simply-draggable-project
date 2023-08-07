import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Для монтрования React необходимо иметь на странице блок div с id="root"');
}

ReactDOM.createRoot(container).render(<App />);
