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
      let errorMessage = "Error al obtener eventos";
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'No se encontraron eventos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al obtener eventos";
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
      let errorMessage = "Error al crear evento";
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 409:
          errorMessage = 'El evento ya existe';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al crear evento";
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
      message: 'Evento creado exitosamente',
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
      let errorMessage = "Error al actualizar evento";
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'No se encontró el evento';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al actualizar evento";
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
      message: 'Evento actualizado exitosamente',
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
      let errorMessage = "Error al obtener evento";
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'No se encontró el evento';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al obtener evento";
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
      let errorMessage = "Error al eliminar evento";
      switch (response.status) {
        case 404:
          errorMessage = 'No se encontró el evento';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al eliminar evento";
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      message: 'Evento eliminado exitosamente',
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
      let errorMessage = "Error al actualizar registro";
      switch (response.status) {
        case 404:
          errorMessage = 'Registro no encontrado';
          break;
        case 409:
          errorMessage = 'No hay suficientes espacios disponibles';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al actualizar registro";
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
      let errorMessage = "Error al cancelar registro";
      switch (response.status) {
        case 404:
          errorMessage = 'Registro no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al cancelar registro";
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
      let errorMessage = "Error al crear registro";
      switch (response.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'Evento o Miembro no encontrado';
          break;
        case 409:
          errorMessage = 'El evento está lleno o el socio ya está registrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al crear registro";
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
      let errorMessage = "Error al obtener miembro";
      switch (response.status) {
        case 404:
          errorMessage = 'Miembro no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al obtener miembro";
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
      let errorMessage = "Error al obtener miembros";
      if (response.status === 500) {
        errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
      } else {
        errorMessage = response.data?.message || "Error al obtener miembros";
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