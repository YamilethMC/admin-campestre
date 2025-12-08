export const surveyService = {

  getSurveyCategoryOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { value: 'TODAS', label: 'Todas' },
      { value: 'SERVICES', label: 'Servicios' },
      { value: 'RESTAURANT', label: 'Restaurante' },
      { value: 'SPORTS', label: 'Deportes' },
      { value: 'EVENTS', label: 'Eventos' }
    ];
  },

  getSurveyPriorityOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { value: 'HIGH', label: 'Importante' },
      { value: 'MEDIUM', label: 'Normal' },
      { value: 'LOW', label: 'Baja' }
    ];
  },

  getSurveyById: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 404:
          errorMessage = 'Encuesta no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }
    const data = await response.json();
    return {
      success: true,
      data: data.data,
      status: response.status
    };
  },

  createSurvey: async (data) => {
    const token = localStorage.getItem('authToken');

    let response;
    if (data instanceof FormData) {
      // When sending FormData (with image), don't set Content-Type header
      // The browser will set it with the proper boundary
      response = await fetch(`${process.env.REACT_APP_API_URL}/survey`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });
    } else {
      // When sending JSON data (without image)
      response = await fetch(`${process.env.REACT_APP_API_URL}/survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';
      switch (response.status) {
        case 400:
          errorMessage = 'No se encontró la encuesta';
          break;
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: result.message || 'Encuesta creada exitosamente',
      status: response.status
    };
  },

  updateSurvey: async (id, data) => {
    const token = localStorage.getItem('authToken');

    let response;
    if (data instanceof FormData) {
      // When sending FormData (with image), don't set Content-Type header
      // The browser will set it with the proper boundary
      response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });
    } else {
      // When sending JSON data (without image)
      response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'No se encontró la encuesta';
          break;
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para actualizar esta encuesta';
          break;
        case 404:
          errorMessage = 'Encuesta no encontrada';
          break;
        case 409:
          errorMessage = 'Ya existe una encuesta con ese título';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }
    const result = await response.json();
    return {
      success: true,
      data: result,
      message: result.message || 'Encuesta actualizada exitosamente',
      status: response.status
    };
  },

  toggleSurveyStatus: async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        error: 'No se encontró el token de autenticación',
        status: 401
      };
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${id}/toggle-active`, {
      method: "PATCH",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para cambiar el estado de esta encuesta';
          break;
        case 404:
          errorMessage = 'Encuesta no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      message: 'Estado de encuesta actualizado exitosamente',
      status: response.status
    };
  },

  // Delete a survey
  deleteSurvey: async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        error: 'No se encontró el token de autenticación',
        status: 401
      };
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${id}`, {
      method: "DELETE",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para eliminar esta encuesta';
          break;
        case 404:
          errorMessage = 'Encuesta no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }
    return {
      success: true,
      message: 'Encuesta eliminada exitosamente',
      status: response.status
    };
  },
  
  // Get all responses for a survey (for the responses view)
  getSurveyResponses: async (surveyId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/${surveyId}/responses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para ver esta información';
          break;
        case 404:
          errorMessage = 'Encuesta no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }
    const data = await response.json();
    return {
      success: true,
      data: data.data,
      status: response.status
    };
  },

  // Fetch surveys with pagination, filtering and search
  async fetchSurveys({
    page = 1,
    limit = 10,
    search = '',
    category = '',
    status = '' // 'true', 'false', or empty for all
  } = {}) {
    const token = localStorage.getItem("authToken");

    // Build query parameters
    let query = `${process.env.REACT_APP_API_URL}/survey?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (category && category !== 'TODAS') query += `&category=${encodeURIComponent(category)}`;
    if (status) query += `&active=${encodeURIComponent(status)}`;
    const response = await fetch(query, {
      headers: {
        "accept": "*/*",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || 'Error desconocido';

      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 400:
          errorMessage = 'No se encontraron encuestas';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const data = await response.json();

    // The API returns { surveysActive, surveysInactive, meta }
    let surveys = [];
    let activeCount = 0;
    let inactiveCount = 0;

    // Handle the different status filter scenarios
    if (status === 'true') {
      // Only active surveys
      surveys = data.data.surveysActive || [];
    } else if (status === 'false') {
      // Only inactive surveys
      surveys = data.data.surveysInactive || [];
    } else {
      // All surveys (active first)
      surveys = [...(data.data.surveysActive || []), ...(data.data.surveysInactive || [])];
    }

    // Calculate counts based on data returned
    activeCount = data.data.surveysActive ? data.data.surveysActive.length : 0;
    inactiveCount = data.data.surveysInactive ? data.data.surveysInactive.length : 0;

    return {
      success: true,
      data: {
        surveys: surveys,
        meta: data.data.meta,
        activeCount,
        inactiveCount
      },
      status: response.status
    };
  }
};