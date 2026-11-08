import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useSettings } from './hooks/useSettings';

export const AppContent: React.FC = () => {
  const { pharmacyName } = useSettings();

  useEffect(() => {
    document.title = `${pharmacyName || 'صيدليات الفؤاد'} | مدير حملات واتساب`;
  }, [pharmacyName]);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected SaaS Application Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/:id" element={<CampaignDetailsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback to Home / Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
