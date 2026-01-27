import api from '../../../shared/api/api';

export const authService = {
  validateCredentials: async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { email, password });

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

      return {
        success: true,
        user: {
          id: response.data.data.user.id,
          username: response.data.data.user.email,
          name: response.data.data.user.name,
          lastName: response.data.data.user.lastName,
          role: response.data.data.user.role,
          permissions: response.data.data.user.permissions,
          accessToken: response.data.data.access_token,
        },
        accessToken: response.data.data.access_token,
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
      const response = await api.post('/auth/logout', {});

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