import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { HRProvider } from './contexts/HRContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HRProvider>
          <App />
        </HRProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);