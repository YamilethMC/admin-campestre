import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';
import { TIPOS_CON_PANEL, rutaInicial } from '../../../shared/auth/acceso';

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
      if (!TIPOS_CON_PANEL.includes(normalizedType)) {
        const message = 'Tu cuenta no tiene acceso al panel';
        setError(message);
        addToast(message, 'error');
        setLoading(false);
        return;
      }

      // El profesor no tiene Inicio: entra directo a su agenda.
      const destino = rutaInicial(normalizedType);
      contextLogin(
        result.user,
        result.accessToken,
        (ruta) => navigate(destino || ruta),
        result.refreshToken,
      );
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