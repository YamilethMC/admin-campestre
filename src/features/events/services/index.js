import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const eventService = {
  // Fetch all events with pagination, search, filters, and date
  async fetchEvents({
    page = 1,
    limit = 10,
    search = '',
    order = 'asc',
    orderBy = 'name',
    type = '',
    date = new Date().toISOString().slice(0, 7)
  } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      order,
      orderBy,
      ...(type && type !== 'TODAS' && { type }),
      ...(date && { date })
    });

    const response = await api.get(`/events?${params}`);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al obtener eventos",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  async createEvent(eventData) {
    const response = await api.post('/events', eventData);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al crear evento",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.data?.message || 'Evento creado exitosamente',
      status: response.status
    };
  },

  async updateEvent(id, eventData) {
    const response = await api.patch(`/events/${id}`, eventData);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al actualizar evento",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.data?.message || 'Evento actualizado exitosamente',
      status: response.status
    };
  },

  async getEventById(id) {
    const response = await api.get(`/events/${id}`);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al obtener evento",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  async deleteEvent(id) {
    const response = await api.del(`/events/${id}`);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al eliminar evento",
        status: response.status
      };
    }

    return {
      success: true,
      message: response.data.data?.message || 'Evento eliminado exitosamente',
      status: response.status
    };
  },

  async updateEventRegistration(eventId, memberId, registrationData) {
    const response = await api.patch(`/events/${eventId}/registrations/members/${memberId}`, registrationData);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al actualizar registro",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.data?.message || 'Registro actualizado exitosamente',
      status: response.status
    };
  },

  async deleteEventRegistration(eventId, memberId) {
    const response = await api.del(`/events/${eventId}/registrations/members/${memberId}`);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al cancelar registro",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.data?.message || 'Registro cancelado exitosamente',
      status: response.status
    };
  },

  async createEventRegistration(eventId, registrationData) {
    const response = await api.post(`/events/${eventId}/registration`, registrationData);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al crear registro",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.data?.message || 'Registro creado exitosamente',
      status: response.status
    };
  },

  async getClubMemberById(memberId) {
    const response = await api.get(`/club-members/${memberId}`);

    if (!response.ok) {
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al obtener miembro",
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
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
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      
      // Return the actual API error messages instead of generic ones
      const apiMessage = response.data?.message;
      return {
        success: false,
        error: apiMessage || "Error al obtener miembros",
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