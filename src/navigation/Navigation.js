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
  BannerIcon,
  TemporaryPassesIcon,
} from '../shared/components/icons/icons';

// Settings icon component
const SettingsIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// Legal docs icon
const LegalIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout } = useContext(AppContext);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: HomeIcon, exact: true },
    { path: '/socios', label: 'Socios', icon: MemberListIcon },
    { path: '/pases-temporales', label: 'Pases temporales', icon: TemporaryPassesIcon },
    { path: '/estados-cuenta', label: 'Estados de cuenta', icon: AccountStatementIcon },
    { path: '/eventos', label: 'Eventos', icon: EventsIcon },
    { path: '/encuestas', label: 'Encuestas', icon: SurveysIcon },
    { path: '/avisos', label: 'Avisos', icon: NoticesIcon },
    { path: '/banner', label: 'Banner', icon: BannerIcon },
    { path: '/archivos', label: 'Carga de archivos', icon: FileUploadIcon },
    { path: '/instalaciones', label: 'Instalaciones', icon: FacilitiesIcon },
    { path: '/ayuda', label: 'Centro de ayuda', icon: HelpCenterIcon },
    { path: '/documentos-legales', label: 'Documentos Legales', icon: LegalIcon },
    { path: '/configuracion', label: 'Configuración', icon: SettingsIcon },
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
      bg-gradient-to-b from-gray-50 to-white shadow-lg border-r border-gray-200 overflow-y-auto
      fixed lg:static inset-y-0 left-0 z-40
      w-64 flex-shrink-0
      transform transition-transform duration-300 ease-in-out lg:transform-none
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4">
        <h2 className="text-lg font-bold text-primary mb-6 border-b-2 border-primary/20 pb-3 hidden lg:block">
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
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]'
                      : 'text-primary hover:bg-primary/10 hover:shadow-sm'
                  }`}
                >
                  <IconComponent className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
                  <span className={`truncate font-medium ${isActive ? 'text-white' : 'text-primary'}`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 pt-4 border-t-2 border-gray-200">
          <button
            onClick={() => {
              handleNavClick();
              logout();
            }}
            className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 font-medium"
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
