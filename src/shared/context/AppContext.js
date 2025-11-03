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
      fecha_admision: '2020-06-15'
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
      fecha_admision: '2021-03-22'
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