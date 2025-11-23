import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../../features/auth/services';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  }, []);

  const login = (user, token) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAuthToken(token);
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return true;
  };

  const logout = async () => {
    try {
      const result = await authService.logout();

      if (result && !result.success && result.error) {
        addToast(result.error, 'error');
      }
    } catch (error) {
      addToast('Error al cerrar sesión', 'error');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  return (
    <AppContext.Provider value={{ 
      members, 
      setMembers, 
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