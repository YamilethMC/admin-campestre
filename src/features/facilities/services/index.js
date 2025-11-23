const API_BASE_URL = process.env.REACT_APP_API_URL;

export const facilityService = {
  async fetchFacilities({
    page = 1,
    limit = 10,
    search = '',
    status = 'ACTIVE',
    type = '',
    date = '',
    order = 'asc',
    orderBy = 'name'
  } = {}) {
    const token = localStorage.getItem("authToken");

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      order,
      orderBy,
      ...(status && { status }),
      ...(type && { type }),
      ...(date && { date })
    });

    const response = await fetch(
      `${API_BASE_URL}/facilities?${params}`,
      {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al obtener instalaciones";

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = "Error al obtener instalaciones";
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
      data: data.data, // contains facilities data + meta
      status: response.status
    };
  },

  async createFacility(facilityData) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${API_BASE_URL}/facilities`,
      {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(facilityData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al crear instalación";

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos de la instalación';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = "Error al crear instalación";
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
      data: result.data,
      message: 'Instalación creada exitosamente',
      status: response.status
    };
  },

  async updateFacility(id, facilityData) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${API_BASE_URL}/facilities/${id}`,
      {
        method: "PATCH",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(facilityData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al actualizar instalación";

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Instalación no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = "Error al actualizar instalación";
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
      data: result.data,
      message: 'Instalación actualizada exitosamente',
      status: response.status
    };
  },

  async getFacilityById(id) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${API_BASE_URL}/facilities/${id}`,
      {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al obtener instalación";

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
          break;
        case 404:
          errorMessage = 'Instalación no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = "Error al obtener instalación";
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
      data: result.data,
      status: response.status
    };
  },

  async deleteFacility(id) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${API_BASE_URL}/facilities/${id}`,
      {
        method: "DELETE",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Error al eliminar instalación";

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Instalación no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = "Error al eliminar instalación";
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      message: 'Instalación eliminada exitosamente',
      status: response.status
    };
  }
};