import { AppContext } from '../context/AppContext';

const { addToast, logout, setAuthToken } = AppContext;
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentUser, setCurrentUser] = useState(null);

export const handleAuthError = () => {
  addToast('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'error');
  setIsAuthenticated(false);
  setCurrentUser(null);
  setAuthToken(null);

  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};