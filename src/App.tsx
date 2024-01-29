import './App.css';
import { useRoutes } from 'react-router-dom';
import AppRouter from './AppRouter';

function App() {
  const content = useRoutes(AppRouter);
  return content;
}

export default App;
