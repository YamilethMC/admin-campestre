import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: contextLogin, addToast } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const result = await authService.validateCredentials({ email: username, password });
    if (result.success) {
      const userType = result.user?.type;
      const normalizedType = typeof userType === 'string' ? userType : userType?.name;
      const allowedRoles = ['ADMINISTRADOR', 'STAFF'];

      if (!allowedRoles.includes(normalizedType)) {
        const message = 'Solo los usuarios administradores pueden acceder al panel';
        setError(message);
        addToast(message, 'error');
        setLoading(false);
        return;
      }

      contextLogin(result.user, result.accessToken, navigate);
    } else {
      addToast(result.error || 'Error de autenticación', 'error');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
    resetForm
  };
};