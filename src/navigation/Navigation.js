import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../shared/context/AppContext';
import { 
  AccountStatementIcon, 
  MemberListIcon, 
  SurveysIcon,
  NoticesIcon,
  LogoutIcon,
  HomeIcon,
  FileUploadIcon,
  FacilitiesIcon,
  EventsIcon,
  HelpCenterIcon,
  BannerIcon
} from '../shared/components/icons/icons';

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout } = useContext(AppContext);
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Inicio', icon: HomeIcon, exact: true },
    { path: '/socios', label: 'Socios', icon: MemberListIcon },
    { path: '/estados-cuenta', label: 'Estados de cuenta', icon: AccountStatementIcon },
    { path: '/eventos', label: 'Eventos', icon: EventsIcon },
    { path: '/encuestas', label: 'Encuestas', icon: SurveysIcon },
    { path: '/avisos', label: 'Avisos', icon: NoticesIcon },
    { path: '/banner', label: 'Banner', icon: BannerIcon },
    { path: '/archivos', label: 'Carga de archivos', icon: FileUploadIcon },
    { path: '/instalaciones', label: 'Instalaciones', icon: FacilitiesIcon },
    { path: '/ayuda', label: 'Centro de ayuda', icon: HelpCenterIcon },
  ];

  const handleNavClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const isActiveRoute = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`
      bg-white shadow-lg border-r border-gray-200 overflow-y-auto
      fixed lg:static inset-y-0 left-0 z-40
      w-64 flex-shrink-0
      transform transition-transform duration-300 ease-in-out lg:transform-none
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3 hidden lg:block">
          Menú Principal
        </h2>
        <ul className="space-y-1">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = isActiveRoute(item.path, item.exact);
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              handleNavClick();
              logout();
            }}
            className="w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon className="text-red-600 flex-shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navigation;