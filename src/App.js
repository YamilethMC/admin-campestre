import React, { useState, useContext, useRef, useEffect } from 'react';
import './shared/styles/output.css';
import { AppProvider, AppContext } from './shared/context/AppContext';
import Login from './features/auth';
import Navigation from './navigation/Navigation';
import IndividualMemberForm from './features/individual-members';
import BulkMemberUpload from './features/bulk-upload';
import AccountStatementUpload from './features/accounting';
import MembersContainer from './features/members';
import LogPanel from './shared/components/log-panel/LogPanel';
import Toast from './shared/components/toast/Toast';
import SurveysContainer from './features/surveys';
import FileUploadContainer from './features/files-upload';
import NoticesContainer from './features/notices';
import FacilitiesContainer from './features/facilities';
import EventsContainer from './features/events/container';
import HelpCenterContainer from './features/help-center/container';

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

// Main app content that checks authentication
function AppContent() {
  const { isAuthenticated } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <MainApplication />;
}

// The main application interface after login
function MainApplication() {
  const [activeView, setActiveView] = useState('dashboard'); // State managed in App
  const { logout, currentUser } = useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 shadow-lg relative">
        <div className="container mx-0 flex items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Gestión de Socios
            </h1>
          </div>
          <div className="absolute right-6">
            {currentUser && (
              <button
                ref={buttonRef}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-white hover:bg-primary-dark hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Hola, {currentUser.name} {currentUser.lastName}</span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {showUserMenu && (
              <div 
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex">
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          <ToastContainer />
          {activeView === 'dashboard' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              
            </div>
          )}
          {activeView === 'addMember' && <IndividualMemberForm />}
          {activeView === 'bulkMembers' && <BulkMemberUpload />}
          {activeView === 'accountStatements' && <AccountStatementUpload />}
          {activeView === 'memberList' && <MembersContainer />}
          {activeView === 'surveys' && <SurveysContainer />}
          {activeView === 'filesUpload' && <FileUploadContainer />}
          {activeView === 'notices' && <NoticesContainer />}
          {activeView === 'instalaciones' && <FacilitiesContainer />}
          {activeView === 'events' && <EventsContainer />}
          {activeView === 'logs' && <LogPanel />}
          {activeView === 'helpCenter' && <HelpCenterContainer />}
        </main>
      </div>
    </div>
  );
}

// Toast container component to display toasts
function ToastContainer() {
  const { toasts, setToasts } = useContext(AppContext);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div>
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

export default App;