import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize with mock data
  const [members, setMembers] = useState([
    {
      id: 1,
      numero_socio: 1,
      nombre: 'Juan',
      apellidos: 'Pérez García',
      email: 'juan.perez@example.com',
      telefono: '555-1234',
      foraneo: false,
      direccion: 'Calle Falsa 123',
    },
    {
      id: 2,
      numero_socio: 2,
      nombre: 'María',
      apellidos: 'López Rodríguez',
      email: 'maria.lopez@example.com',
      telefono: '555-5678',
      foraneo: true,
      direccion: 'Avenida Siempre Viva 456',
    }
  ]);
  
  const [logs, setLogs] = useState([
    'Sistema iniciado correctamente',
    'Datos iniciales cargados'
  ]);
  
  const [toasts, setToasts] = useState([]);

  // Initialize logs when component mounts
  useEffect(() => {
    if (logs.length === 2) { // Only if it's the initial state
      setLogs([
        'Sistema iniciado correctamente',
        'Datos iniciales cargados'
      ]);
    }
  }, []);

  // Function to add a log
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Function to add a toast notification
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Automatically remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

    // User state
  const [currentUser, setCurrentUser] = useState(null);

  // Function to handle login
  const login = (username, password) => {
    // Mock authentication - hardcoded credentials
    if (username === 'admin' && password === '123456') {
      setIsAuthenticated(true);
      setCurrentUser({
        username: 'admin',
        name: 'Juan',
        lastName: 'Pérez'
      });
      addLog('Inicio de sesión exitoso');
      //addToast('Inicio de sesión exitoso', 'success');
      return true;
    } else {
      addLog('Error de autenticación: Credenciales incorrectas');
      addToast('Credenciales incorrectas', 'error');
      return false;
    }
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    addLog('Sesión cerrada');
    //addToast('Sesión cerrada', 'info');
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