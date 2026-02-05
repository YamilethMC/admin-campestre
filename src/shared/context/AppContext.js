import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../../features/auth/services';
import { registerGlobalContextFunctions } from '../utils/authErrorHandler';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga

  const [logs, setLogs] = useState([
    'Sistema iniciado correctamente',
    'Datos iniciales cargados'
  ]);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (logs.length === 2) {
      setLogs([
        'Sistema iniciado correctamente',
        'Datos iniciales cargados'
      ]);
    }
  }, []);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }

    // Marcar como cargado después de verificar el estado de autenticación
    setIsLoading(false);

    // Registrar las funciones globales para el manejo de errores de autenticación
    registerGlobalContextFunctions(addToast, setIsAuthenticated, setCurrentUser, setAuthToken);
  }, []);

  const login = (user, token, navigateFunction = null) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAuthToken(token);

    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Si se proporciona una función de navegación, redirigir al dashboard
    if (navigateFunction) {
      navigateFunction('/');
    }

    return true;
  };

  const logout = async () => {
    try {
      const result = await authService.logout();

      if (result && !result.success && result.error) {
        if (result.status !== 401) {
          addToast(result.error, 'error');
        }
        
      }
    } catch (error) {
      addToast('Error de conexión. Por favor, intente de nuevo más tarde.', 'error');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  return (
    <AppContext.Provider value={{
      logs,
      setLogs,
      toasts,
      setToasts,
      addLog,
      addToast,
      isAuthenticated,
      setIsAuthenticated,
      currentUser,
      setCurrentUser,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};