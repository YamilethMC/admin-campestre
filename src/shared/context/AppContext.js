import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../../features/auth/services';
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
      sexo: 'H',
      rfc: 'JUAP850101XXX',
      fecha_nacimiento: '1985-01-01',
      email: 'juan.perez@example.com',
      foraneo: false,
      telefono_movil: '555-1234',
      alias_movil: 'Casa',
      telefono_fijo: '555-5678',
      alias_fijo: 'Oficina',
      telefono_emergencia: '555-9999',
      alias_emergencia: 'Madre',
      calle: 'Calle Falsa',
      numero_exterior: '123',
      numero_interior: 'A',
      cp: '01234',
      colonia: 'Centro',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      pais: 'México',
      titulo: 'Ingeniero',
      profesion: 'Software',
      metodo_pago: 'Tarjeta de crédito',
      fecha_admision: '2020-06-15',
      activo: true
    },
    {
      id: 2,
      numero_socio: 2,
      nombre: 'María',
      apellidos: 'López Rodríguez',
      sexo: 'M',
      rfc: 'MALO900202XXX',
      fecha_nacimiento: '1990-02-02',
      email: 'maria.lopez@example.com',
      foraneo: true,
      telefono_movil: '555-4321',
      alias_movil: 'Personal',
      telefono_fijo: '555-8765',
      alias_fijo: 'Trabajo',
      telefono_emergencia: '555-8888',
      alias_emergencia: 'Padre',
      calle: 'Avenida Siempre Viva',
      numero_exterior: '456',
      numero_interior: 'B',
      cp: '56789',
      colonia: 'Norte',
      ciudad: 'Guadalajara',
      estado: 'Jalisco',
      pais: 'México',
      titulo: 'Arquitecta',
      profesion: 'Diseño',
      metodo_pago: 'Transferencia bancaria',
      fecha_admision: '2021-03-22',
      activo: false
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
  const [authToken, setAuthToken] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login
  const login = (user, token) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAuthToken(token);
    
    // Store in localStorage for persistence
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return true;
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    
    // Clear localStorage on logout
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