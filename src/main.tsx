import React from 'react'
import ReactDOM from 'react-dom/client' 
import './global.css' 
import { router } from "./routes";
import { RouterProvider } from 'react-router-dom'
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('global')!).render(
  <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
    <Toaster />
  </React.StrictMode>
)
