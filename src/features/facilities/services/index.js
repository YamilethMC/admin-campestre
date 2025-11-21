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
      throw new Error(errorData.message || "Error al obtener instalaciones");
    }

    const data = await response.json();
    return data.data; // contains facilities data + meta
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
      throw new Error(errorData.message || "Error al crear instalación");
    }

    const result = await response.json();
    return result.data;
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
      throw new Error(errorData.message || "Error al actualizar instalación");
    }

    const result = await response.json();
    return result.data;
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
      throw new Error(errorData.message || "Error al obtener instalación");
    }

    const result = await response.json();
    return result.data;
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
      throw new Error(errorData.message || "Error al eliminar instalación");
    }

    return true;
  }
};