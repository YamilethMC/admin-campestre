import { useState, useContext } from 'react';
import { authService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: contextLogin, addToast } = useContext(AppContext);

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const result = await authService.validateCredentials({ email: username, password });

    if (result.success) {
      contextLogin(result.user, result.accessToken);
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
    resetForm,
  };
};
