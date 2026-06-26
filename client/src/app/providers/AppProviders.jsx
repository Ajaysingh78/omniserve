import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { ToastProvider } from '../../components/ui/Toast';
import { ThemeProvider } from '../../context/ThemeContext';

export default function AppProviders({ children }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}
