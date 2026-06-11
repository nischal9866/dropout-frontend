import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../layouts/Layout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TeacherManagementPage from '../pages/dashboard/TeacherManagementPage';
import ProfilePage from '../pages/auth/ProfilePage';
import ChangePasswordPage from '../pages/auth/ChangePasswordPage';
import PredictionPage from '../pages/prediction/PredictionPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'prediction',
        element: <PredictionPage />,
      },
      {
        path: 'teachers',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'superuser']}>
            <TeacherManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
    ],
  },
]);