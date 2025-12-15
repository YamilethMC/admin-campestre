import React, { useContext, useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../shared/context/AppContext';
import Navigation from '../navigation/Navigation';
import Toast from '../shared/components/toast/Toast';

const MainLayout = () => {
  const { logout, currentUser, toasts, setToasts } = useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Tus efectos se mantienen igual
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    // CAMBIO 1: Contenedor Maestro "h-screen" y "overflow-hidden"
    // Esto bloquea el scroll del body y permite que solo el contenido scrollee
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {/* CAMBIO 2: Navigation es el PRIMER hijo directo. 
          Al estar en un flex row, se pega a la izquierda con altura completa */}
      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CAMBIO 3: Wrapper de la Derecha (Columna) */}
      {/* Contiene el Header arriba y el Main abajo */}
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* Header: Ahora vive DENTRO de la columna derecha */}
        {/* Quitamos 'sticky' porque flexbox ya lo mantiene arriba */}
        <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 shadow-lg z-20 flex-shrink-0">
          <div className="flex items-center justify-between max-w-full px-2 sm:px-4">
            
            {/* Botón Hamburguesa (Solo visible en móvil) */}
            <div className="flex items-center lg:hidden">
                <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-primary-dark transition-colors mr-2"
                aria-label="Toggle menu"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>
            </div>

            {/* Logo/Title */}
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="hidden sm:inline">Gestión de Socios</span>
                <span className="sm:hidden">Socios</span>
              </h1>
            </div>

            {/* User menu */}
            <div className="relative">
              {currentUser && (
                <button
                  ref={buttonRef}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-primary-dark hover:bg-opacity-50 px-2 sm:px-3 py-2 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden md:inline">Hola, {currentUser.name} {currentUser.lastName}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
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
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 text-gray-800"
                >
                  <div className="md:hidden px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    {currentUser?.name} {currentUser?.lastName}
                  </div>
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

        {/* CAMBIO 4: Main Content 
            'flex-1' para que ocupe el resto del espacio vertical
            'overflow-y-auto' para que SOLO esto tenga scroll */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 w-full relative">
          
          {/* Toast container (Fijo relativo al viewport) */}
          <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map(toast => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => removeToast(toast.id)} 
                />
              </div>
            ))}
          </div>

          {/* Page content */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;