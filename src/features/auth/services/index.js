export const authService = {
  /**
   * Performs validation of credentials
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - The user's email
   * @param {string} credentials.password - The password
   * @returns {Promise<Object>} Validation result
   */
  validateCredentials: async ({ email, password }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = data.message || 'Error de autenticación';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'Credenciales incorrectas: Usuario o contraseña no válidos';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = data.message || 'Error de autenticación';
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        success: true,
        user: {
          id: data.data.user.id,
          username: data.data.user.email, // Using email as username
          name: data.data.user.name,
          lastName: data.data.user.lastName,
          role: data.data.user.role,
          permissions: data.data.user.permissions,
          accessToken: data.data.access_token,
        },
        accessToken: data.data.access_token,
      };
    } catch (error) {
      console.error('Auth service error:', error);
      return {
        success: false,
        error: 'Error de conexión. Por favor, intente de nuevo más tarde.',
        status: null,
      };
    }
  },

  async logout() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        let errorMessage = err.message || 'Error al cerrar sesión';

        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Token inválido o expirado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = err.message || 'Error al cerrar sesión';
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status,
        };
      }

      return {
        success: true,
        message: 'Sesión cerrada exitosamente',
        status: response.status,
      };
    } catch (error) {
      console.error('Error en logout:', error);
      return {
        success: false,
        error: 'Error de conexión. Por favor, intente de nuevo más tarde.',
        status: null,
      };
    }
  },
};
