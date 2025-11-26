import React, { useContext } from 'react';
import { AppContext } from '../shared/context/AppContext';
import { 
  DashboardIcon, 
  AddMemberIcon, 
  BulkUploadIcon, 
  AccountStatementIcon, 
  MemberListIcon, 
  SurveysIcon,
  NoticesIcon,
  LogIcon, 
  LogoutIcon,
  HomeIcon,
  FileUploadIcon,
  FacilitiesIcon,
  EventsIcon
} from '../shared/components/icons/icons';

const Navigation = ({ activeView, setActiveView }) => {
  const { logout } = useContext(AppContext);
  
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: HomeIcon },
    { id: 'memberList', label: 'Socios', icon: MemberListIcon },
    //{ id: 'addMember', label: 'Agregar socio', icon: AddMemberIcon },
    //{ id: 'bulkMembers', label: 'Carga masiva socios', icon: BulkUploadIcon },
    { id: 'accountStatements', label: 'Estados de cuenta (ZIP)', icon: AccountStatementIcon },
    { id: 'events', label: 'Eventos', icon: EventsIcon },
    { id: 'surveys', label: 'Encuestas', icon: SurveysIcon },
    { id: 'notices', label: 'Avisos', icon: NoticesIcon },
    { id: 'filesUpload', label: 'Carga de archivos', icon: FileUploadIcon },
    { id: 'instalaciones', label: 'Instalaciones', icon: FacilitiesIcon },
    // { id: 'logs', label: 'Panel de Logs', icon: LogIcon } // Comentado temporalmente
  ];

  return (
    <nav className="w-64 bg-white shadow-lg h-screen sticky top-0 border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">Menú Principal</h2>
        <ul className="space-y-1">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 transition-colors ${
                    activeView === item.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`${activeView === item.id ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`${activeView === item.id ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon className="text-red-600" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;