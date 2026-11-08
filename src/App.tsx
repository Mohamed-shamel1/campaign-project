import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    document.title = `${pharmacyName || 'صيدلية التجميل'} | مدير حملات واتساب`;
  }, [pharmacyName]);

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/:id" element={<CampaignDetailsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
