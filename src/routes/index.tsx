import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import TeamLeadDashboard from '../pages/TeamLeadDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import MainLayout from '../components/layout/MainLayout';
import Attendance from '../pages/Attendance';
import Leave from '../pages/Leave';
import Salary from '../pages/Salary';
import Holidays from '../pages/Holidays';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner', 'team_lead', 'employee']}>
            <MainLayout>
              {user && user.role === 'owner' && <AdminDashboard />}
              {user && user.role === 'team_lead' && <TeamLeadDashboard />}
              {user && user.role === 'employee' && <EmployeeDashboard />}
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={['owner', 'team_lead', 'employee']}><MainLayout><Attendance /></MainLayout></ProtectedRoute>} />
      <Route path="/leave" element={<ProtectedRoute allowedRoles={['owner', 'team_lead', 'employee']}><MainLayout><Leave /></MainLayout></ProtectedRoute>} />
      <Route path="/salary" element={<ProtectedRoute allowedRoles={['owner', 'team_lead', 'employee']}><MainLayout><Salary /></MainLayout></ProtectedRoute>} />
      <Route path="/holidays" element={<ProtectedRoute allowedRoles={['owner', 'team_lead', 'employee']}><MainLayout><Holidays /></MainLayout></ProtectedRoute>} />

      {/* Redirect to login if no other route matches */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export default AppRoutes;