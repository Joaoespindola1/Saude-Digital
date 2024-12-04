import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css';
import App from './App.jsx'
import ClienteDashboard from './pages/ClienteDashboard.jsx'
import CorretorDashboard from './pages/CorretorDashboard.jsx'
import CorretorPerfil from './pages/CorretorPerfil.jsx'
import Mensagens from './pages/Mensagens.jsx'
import PerfilCorretorEdit from './pages/CorretorPerfilEdit.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App isLogin={true} />, 
  },
  {
    path: '/login',
    element: <App isLogin={true} />,
  },
  {
    path: '/register',
    element: <App isLogin={false} />, 
  },
  {
    path: '/cliente-dashboard',
    element: <ClienteDashboard />,
  },
  {
    path: '/corretor-dashboard',
    element: <CorretorDashboard />, 
  },
  {
    path: '/corretor-perfil/:id', 
    element: <CorretorPerfil />,
  },
  {
    path: '/corretor-perfil-edit/:id', 
    element: <PerfilCorretorEdit />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
