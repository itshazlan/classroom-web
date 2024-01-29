import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Stylesheets
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Choose the theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
// import 'primeflex/primeicons.css';
import './index.css'; // Ensure this import is after PrimeReact styles
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PrimeReactProvider value={{unstyled: true, pt: Tailwind}}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
