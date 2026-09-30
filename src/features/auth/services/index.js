import api from '../../../shared/api/api';
import { leerRefresh } from '../../../shared/api/sesion';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const authService = {
  validateCredentials: async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { username: email, password });

      if (!response.ok) {
        let errorMessage = response.data?.message || 'Error de autenticación';

        switch (response.status) {
          case 401:
            errorMessage = 'Credenciales incorrectas: Usuario o contraseña no válidos';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = response.data?.message || 'Error de autenticación';
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      const userPayload = response.data.data.user || {};

      return {
        success: true,
        user: {
          id: userPayload.id,
          username: userPayload.email,
          name: userPayload.name,
          lastName: userPayload.lastName,
          type: userPayload.type,
          role: userPayload.role,
          permissions: userPayload.permissions,
          accessToken: response.data.data.access_token,
        },
        accessToken: response.data.data.access_token,
        // El refresh es lo que evita que el token muera a las 24 horas y saque
        // al usuario al login a media captura. Antes llegaba y se tiraba.
        refreshToken: response.data.data.refresh_token,
      };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        success: false,
        error: 'Error de conexión. Por favor, intente de nuevo más tarde.',
        status: null
      };
    }
  },

  async logout() {
    try {
      // Sin el refresh, cerrar sesión deja viva la sesión de este dispositivo:
      // con él se podría abrir otra enseguida.
      const response = await api.post('/auth/logout', { refresh_token: leerRefresh() || undefined });

      if (!response.ok) {
        let errorMessage = response.data?.message || 'Error al cerrar sesión';
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Token inválido o expirado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = response.data?.message || 'Error al cerrar sesión';
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      return {
        success: true,
        message: 'Sesión cerrada exitosamente',
        status: response.status
      };
    } catch (error) {
      console.error("Error en logout:", error);
      return {
        success: false,
        error: 'Error de conexión. Por favor, intente de nuevo más tarde.',
        status: null
      };
    }
  }
};