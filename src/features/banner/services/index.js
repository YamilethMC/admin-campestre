// Service functions to connect to real API
export const bannerService = {
  // Get all banners with pagination, search, and filters
  fetchBanners: async ({
    page = 1,
    limit = 10,
    orderBy = 'createdAt',
    order = 'asc',
    active = true, // Default to active banners
    search = '',
  } = {}) => {
    const token = localStorage.getItem('authToken');

    const params = new URLSearchParams({
      page,
      limit,
      search,
      order,
      orderBy,
    });

    if (typeof active === 'boolean') {
      params.append('active', active);
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/banner?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Error al obtener banners';

      // Handle specific error codes
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
          errorMessage = 'Error al obtener banners';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: {
        data: responseData.data?.data || responseData.data || [],
        meta: responseData.data?.meta || responseData.meta || null,
      },
      status: response.status,
    };
  },

  // Get banner by id
  getBannerById: async id => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/banner/${id}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Error al obtener banner';

      // Handle specific error codes
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para ver esta información';
          break;
        case 404:
          errorMessage = 'Banner no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al obtener banner';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData.data,
      status: response.status,
    };
  },

  // Create a new banner
  createBanner: async bannerData => {
    const token = localStorage.getItem('authToken');

    // Format dates for API (the form should send ISO strings or null)
    const formattedData = {
      ...bannerData,
      startDate: bannerData.startDate ? new Date(bannerData.startDate).toISOString() : null,
      endDate: bannerData.endDate ? new Date(bannerData.endDate).toISOString() : null,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/banner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al registrar banner';

      // Handle specific error codes
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
          break;
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para registrar banners';
          break;
        case 404:
          errorMessage = 'Banner no encontrado';
          break;
        case 409:
          errorMessage = 'El banner ya existe';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al registrar banner';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const result = await response.json();

    // Success message for toast
    return {
      success: true,
      data: result.data || result,
      message: 'Banner registrado exitosamente',
      status: response.status,
    };
  },

  // Update a banner
  updateBanner: async (id, bannerData) => {
    const token = localStorage.getItem('authToken');

    // Format dates for API (the form should send ISO strings or null)
    const formattedData = {
      ...bannerData,
      startDate: bannerData.startDate ? new Date(bannerData.startDate).toISOString() : null,
      endDate: bannerData.endDate ? new Date(bannerData.endDate).toISOString() : null,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/banner/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al actualizar banner';

      // Handle specific error codes
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para actualizar banners';
          break;
        case 404:
          errorMessage = 'Banner no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al actualizar banner';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const result = await response.json();

    // Success message for toast
    return {
      success: true,
      data: result.data || result,
      message: 'Banner actualizado exitosamente',
      status: response.status,
    };
  },

  // Delete a banner
  deleteBanner: async id => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/banner/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = 'Error al eliminar el banner';

      // Handle specific error codes
      switch (response.status) {
        case 401:
          errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso prohibido: No tienes permisos para eliminar banners';
          break;
        case 404:
          errorMessage = 'Banner no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al eliminar el banner';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    // Success message for toast
    return {
      success: true,
      message: 'Banner eliminado exitosamente',
      status: response.status,
    };
  },
};
