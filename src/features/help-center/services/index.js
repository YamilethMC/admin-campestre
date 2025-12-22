export const helpCenterService = {
  // Get all help center entries
  fetchHelpCenter: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/help-center`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      status: response.status,
    };
  },

  // Get a single help center entry by ID
  getHelpCenterById: async id => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/help-center/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 404:
          errorMessage = 'Artículo no encontrado';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      status: response.status,
    };
  },

  // Create a new help center entry
  createHelpCenter: async helpCenterData => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/help-center`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(helpCenterData),
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
      message: result.message || 'Entrada de centro de ayuda creada exitosamente',
      status: response.status,
    };
  },

  // Update an existing help center entry
  updateHelpCenter: async (id, helpCenterData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/help-center/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(helpCenterData),
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      // Manejar códigos de error específicos
      switch (response.status) {
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Artículo no encontrado';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
      message: result.message || 'Entrada de centro de ayuda actualizada exitosamente',
      status: response.status,
    };
  },

  // Delete a help center entry
  deleteHelpCenter: async id => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return {
        success: false,
        error: 'No se encontró el token de autenticación',
        status: 401,
      };
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/help-center/${id}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      // Manejar códigos de error específicos
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Artículo no encontrado';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      success: true,
      message: 'Entrada de centro de ayuda eliminada exitosamente',
      status: response.status,
    };
  },
};
