import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './shared/styles/output.css';
import { AppProvider, AppContext } from './shared/context/AppContext';
import Login from './features/auth';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import IndividualMemberForm from './features/individual-members';
import BulkMemberUpload from './features/bulk-upload';
import AccountStatementUpload from './features/accounting';
import MembersContainer from './features/members';
import LogPanel from './shared/components/log-panel/LogPanel';
import SurveysContainer from './features/surveys';
import FileUploadContainer from './features/files-upload';
import NoticesContainer from './features/notices';
import FacilitiesContainer from './features/facilities';
import EventsContainer from './features/events/container';
import HelpCenterContainer from './features/help-center/container';
import BannerContainer from './features/banner/container';
import TemporaryPassesContainer from './features/temporary-passes';
import ValidationsDashboard from './features/validations';
import DocumentCatalog from './features/document-catalog';
import VerifyAccess from './pages/VerifyAccess';

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/verify-access" element={<VerifyAccess />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="socios" element={<MembersContainer />} />
        <Route path="socios/nuevo" element={<IndividualMemberForm />} />
        <Route path="socios/carga-masiva" element={<BulkMemberUpload />} />
        <Route path="validaciones" element={<ValidationsDashboard />} />
        <Route path="catalogo-documentos" element={<DocumentCatalog />} />
        <Route path="pases-temporales" element={<TemporaryPassesContainer />} />
        <Route path="estados-cuenta" element={<AccountStatementUpload />} />
        <Route path="eventos" element={<EventsContainer />} />
        <Route path="encuestas" element={<SurveysContainer />} />
        <Route path="avisos" element={<NoticesContainer />} />
        <Route path="banner" element={<BannerContainer />} />
        <Route path="archivos" element={<FileUploadContainer />} />
        <Route path="instalaciones" element={<FacilitiesContainer />} />
        <Route path="ayuda" element={<HelpCenterContainer />} />
        <Route path="logs" element={<LogPanel />} />
        <Route path="404" element={<NotFound />} />
        {/*<Route path="*" element={<Navigate to="/404" replace />} />*/}
      </Route>
    </Routes>
  );
}

export default App;