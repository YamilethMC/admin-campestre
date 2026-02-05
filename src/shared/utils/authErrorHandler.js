let globalSetCurrentUser = null;
let globalSetIsAuthenticated = null;
let globalSetAuthToken = null;
let globalAddToast = null;

// Función para registrar las funciones del contexto global
export const registerGlobalContextFunctions = (addToast, setIsAuthenticated, setCurrentUser, setAuthToken) => {
  globalAddToast = addToast;
  globalSetIsAuthenticated = setIsAuthenticated;
  globalSetCurrentUser = setCurrentUser;
  globalSetAuthToken = setAuthToken;
};

// Función para manejar el error de autenticación
export const handleAuthError = (navigateFunction = null) => {
  // Verificar si las funciones globales están disponibles
  if (globalAddToast && globalSetIsAuthenticated && globalSetCurrentUser && globalSetAuthToken) {
    // Mostrar el toast de error
    globalAddToast('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'error');

    // Limpiar datos de autenticación
    globalSetIsAuthenticated(false);
    globalSetCurrentUser(null);
    globalSetAuthToken(null);

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Esperar 5 segundos (tiempo predeterminado del toast) antes de redirigir
    setTimeout(() => {
      // Si se proporciona una función de navegación, usarla; de lo contrario, redirigir con window.location
      if (navigateFunction) {
        navigateFunction('/login');
      } else {
        window.location.href = '/login';
      }
    }, 1000); // 1000 ms = 1 segundo
  } else {
    // Si no están disponibles, almacenar en localStorage para procesamiento posterior
    localStorage.setItem('authExpired', 'true');
    window.location.href = '/login';
  }
};