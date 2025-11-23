// Service functions to connect to real API
export const noticeService = {
  // Get all notices with pagination, search, and filters
  fetchNotices: async ({
    page = 1,
    limit = 10,
    orderBy = 'title',
    order = 'asc',
    active = true, // Default to active notices
    search = ''
  } = {}) => {
    console.log('el active en notice es: ', active)
    if(active === false){
      active = null
    }
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/notify?page=${page}&limit=${limit}&search=${search}&order=${order}&orderBy=${orderBy}&active=${active}`,
      {
        method: "GET",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Error al obtener avisos';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para ver esta información';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al obtener avisos';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: {
        data: responseData.data.notifications || [],
        meta: responseData.data.meta || null
      },
      status: response.status
    };
  },

  // Get notice by id
  getNoticeById: async (id) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Error al obtener aviso';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para ver esta información';
          break;
        case 404:
          errorMessage = 'Aviso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al obtener aviso';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
      status: response.status
    };
  },

  // Create a new notice
  createNotice: async (noticeData) => {
    const token = localStorage.getItem("authToken");
    noticeData.sentDate = new Date().toISOString();
    noticeData.visibleUntil = new Date(noticeData.visibleUntil).toISOString();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al registrar aviso';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
          break;
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para registrar avisos';
          break;
        case 404:
          errorMessage = 'Aviso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al registrar aviso';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: result.data,
      message: 'Aviso registrado exitosamente',
      status: response.status
    };
  },

  // Update a notice
  updateNotice: async (id, noticeData) => {
    const token = localStorage.getItem("authToken");
    noticeData.visibleUntil = new Date(noticeData.visibleUntil).toISOString();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al actualizar aviso';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al actualizar aviso';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: result.data,
      message: 'Aviso actualizado exitosamente',
      status: response.status
    };
  },

  // Toggle notice status (activate/deactivate)
  toggleNoticeStatus: async (id, active) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al actualizar estado del aviso';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al actualizar estado del aviso';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: result.data,
      message: active ? 'Aviso activado exitosamente' : 'Aviso desactivado exitosamente',
      status: response.status
    };
  },



  // Delete a notice
  deleteNotice: async (id) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al eliminar el aviso';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al eliminar el aviso';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    // Mensaje de éxito para el toast
    return {
      success: true,
      message: 'Aviso eliminado exitosamente',
      status: response.status
    };
  },
};