import api from '../../../shared/api/api';

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

    const response = await api.get(`/facilities?${params}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al obtener instalaciones";
      if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  async createFacility(facilityData) {
    const response = await api.post('/facilities', facilityData);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al crear instalación";
      if (response.status === 400) {
        errorMessage = 'Solicitud incorrecta: Verifica los datos de la instalación';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Instalación creada exitosamente',
      status: response.status
    };
  },

  async updateFacility(id, facilityData) {
    const response = await api.patch(`/facilities/${id}`, facilityData);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al actualizar instalación";
      if (response.status === 404) {
        errorMessage = 'Instalación no encontrada';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Instalación actualizada exitosamente',
      status: response.status
    };
  },

  async getFacilityById(id) {
    const response = await api.get(`/facilities/${id}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al obtener instalación";
      if (response.status === 404) {
        errorMessage = 'Instalación no encontrada';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  async deleteFacility(id) {
    const response = await api.del(`/facilities/${id}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al eliminar instalación";
      if (response.status === 404) {
        errorMessage = 'Instalación no encontrada';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
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
  },

  async getFacilityWithReservations(id, date) {
    const params = new URLSearchParams({ date });
    const response = await api.get(`/facilities/${id}?${params}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al obtener instalación";
      if (response.status === 404) {
        errorMessage = 'Instalación no encontrada';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  async createFacilityReservation(facilityId, memberId, reservationData) {
    const response = await api.post(`/facilities/${facilityId}/club-members/${memberId}/reservations`, reservationData);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al crear reservación";
      switch (response.status) {
        case 400:
          errorMessage = 'Rango de tiempo inválido o instalación no disponible';
          break;
        case 404:
          errorMessage = 'Instalación o Miembro no encontrado';
          break;
        case 409:
          errorMessage = 'Intervalo de tiempo ya reservado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Reservación creada exitosamente',
      status: response.status
    };
  },

  async updateFacilityReservation(reservationId, clubMemberId, reservationData) {
    const response = await api.patch(`/facilities/reservations/${reservationId}/club-member/${clubMemberId}`, reservationData);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al actualizar reservación";
      switch (response.status) {
        case 400:
          errorMessage = 'Rango de tiempo inválido o instalación no disponible';
          break;
        case 403:
          errorMessage = 'No autorizado para actualizar esta reservación';
          break;
        case 404:
          errorMessage = 'Reservación no encontrada';
          break;
        case 409:
          errorMessage = 'Intervalo de tiempo ya reservado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Reservación actualizada exitosamente',
      status: response.status
    };
  },

  async searchClubMembers(search = '') {
    const params = new URLSearchParams({
      page: '1',
      limit: '10',
      search,
      orderBy: 'name',
      active: 'true'
    });

    const response = await api.get(`/club-members?${params}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || "Error al obtener miembros";
      if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const filteredMembers = (response.data.data?.members || []).filter(m => m.memberCode !== null);
    return {
      success: true,
      data: { members: filteredMembers },
      status: response.status
    };
  }
};