import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('global')!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </React.StrictMode>
  </QueryClientProvider>
);
