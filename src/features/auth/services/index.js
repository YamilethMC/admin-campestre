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
        return {
          success: false,
          error: data.message || 'Error de autenticación',
        };
      }
      
      // Map the API response to match the expected format in your app
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
      };
    }
  },
};