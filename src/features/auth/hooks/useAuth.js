import { useState, useContext } from 'react';
import { authService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: contextLogin } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // Validate credentials using the service
      const result = await authService.validateCredentials({ email: username, password });
      
      if (result.success) {
        // Use the context login function to set the authenticated state
        contextLogin(result.user, result.accessToken);
      } else {
        setError(result.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de autenticación');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
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