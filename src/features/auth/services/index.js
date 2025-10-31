/**
 * Service for authentication
 */
export const authService = {
  /**
   * Performs validation of credentials
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - The username
   * @param {string} credentials.password - The password
   * @returns {Promise<Object>} Validation result
   */
  validateCredentials: async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    // Mock validation - in a real app, this would call an actual API
    if (credentials.username === 'admin' && credentials.password === '123456') {
      // Return successful validation result
      return {
        success: true,
        user: {
          id: 1,
          username: credentials.username,
          name: 'Administrador'
        }
      };
    } else {
      // Return failed validation result
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }
  }
};