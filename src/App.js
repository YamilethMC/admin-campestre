import React, { useState, useContext } from 'react';
import './output.css';
import { AppProvider, AppContext } from './AppContext';
import Login from './Login';
import Navigation from './Navigation';
import IndividualMemberForm from './IndividualMemberForm';
import BulkMemberUpload from './BulkMemberUpload';
import AccountStatementUpload from './AccountStatementUpload';
import MemberList from './MemberList';
import LogPanel from './LogPanel';
import Toast from './Toast';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Gestión de Socios</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <span className="text-white">Hola, {currentUser.name} {currentUser.lastName}</span>
            )}
            {/*<button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cerrar sesión
            </button>*/}
          </div>
        </div>
      </header>
      <div className="flex">
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          <ToastContainer />
          {activeView === 'dashboard' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Control</h2>
              <p className="text-gray-600">Bienvenido al sistema de gestión de socios y estados de cuenta.</p>
              <p className="text-gray-600 mt-2">Utiliza el menú lateral para navegar entre las diferentes funcionalidades:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600">
                <li><strong>Agregar Socio:</strong> Formulario para dar de alta socios individuales</li>
                <li><strong>Carga Masiva de Socios:</strong> Importar socios desde archivo CSV</li>
                <li><strong>Estados de Cuenta (ZIP):</strong> Cargar estados de cuenta desde archivo ZIP</li>
                <li><strong>Lista de Socios:</strong> Visualizar todos los socios registrados</li>
                {/*<li><strong>Panel de Logs:</strong> Ver historial de acciones realizadas</li>*/}
              </ul>
            </div>
          )}
          {activeView === 'addMember' && <IndividualMemberForm />}
          {activeView === 'bulkMembers' && <BulkMemberUpload />}
          {activeView === 'accountStatements' && <AccountStatementUpload />}
          {activeView === 'memberList' && <MemberList />}
          {activeView === 'logs' && <LogPanel />}
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