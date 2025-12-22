const API_BASE_URL = process.env.REACT_APP_API_URL;

export const eventService = {
  // Fetch all events with pagination, search, filters, and date
  async fetchEvents({
    page = 1,
    limit = 10,
    search = '',
    order = 'asc',
    orderBy = 'name',
    type = '',
    date = new Date().toISOString().slice(0, 7), // Current year-month as default
  } = {}) {
    const token = localStorage.getItem('authToken');

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      order,
      orderBy,
      ...(type && type !== 'TODAS' && { type }),
      ...(date && { date }),
    });

    const response = await fetch(`${API_BASE_URL}/events?${params}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al obtener eventos';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al obtener eventos';
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
      status: response.status,
    };
  },

  // Create a new event
  async createEvent(eventData) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al crear evento';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al crear evento';
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
      message: 'Evento creado exitosamente',
      status: response.status,
    };
  },

  // Update an existing event
  async updateEvent(id, eventData) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PATCH',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al actualizar evento';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al actualizar evento';
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
      message: 'Evento actualizado exitosamente',
      status: response.status,
    };
  },

  // Get a single event by ID
  async getEventById(id) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al obtener evento';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al obtener evento';
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
      status: response.status,
    };
  },

  // Delete an event
  async deleteEvent(id) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al eliminar evento';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'No se encontró el evento';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = errorData.message || 'Error al eliminar evento';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      success: true,
      message: 'Evento eliminado exitosamente',
      status: response.status,
    };
  },

  // Update event registration
  async updateEventRegistration(eventId, memberId, registrationData) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/registrations/members/${memberId}`,
      {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al actualizar registro';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al actualizar registro';
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
      message: result.data.message || 'Registro actualizado exitosamente',
      status: response.status,
    };
  },

  // Delete event registration
  async deleteEventRegistration(eventId, memberId) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/registrations/members/${memberId}`,
      {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al cancelar registro';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Registro no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = errorData.message || 'Error al cancelar registro';
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
      message: result.data.message || 'Registro cancelado exitosamente',
      status: response.status,
    };
  },

  // Create event registration
  async createEventRegistration(eventId, registrationData) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/events/${eventId}/registration`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al crear registro';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = errorData.message || 'Error al crear registro';
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
      message: result.data.message || 'Registro creado exitosamente',
      status: response.status,
    };
  },

  // Get club member by ID with guests
  async getClubMemberById(memberId) {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/club-members/${memberId}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al obtener miembro';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Miembro no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = errorData.message || 'Error al obtener miembro';
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
      status: response.status,
    };
  },

  // Search club members
  async searchClubMembers(search = '') {
    const token = localStorage.getItem('authToken');

    const params = new URLSearchParams({
      page: '1',
      limit: '10',
      search,
      orderBy: 'name',
      active: 'true',
    });

    const response = await fetch(`${API_BASE_URL}/club-members?${params}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error al obtener miembros';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = errorData.message || 'Error al obtener miembros';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    const result = await response.json();

    if (result.success) {
      // Filter out members without memberCode
      const filteredMembers = (result.data.members || []).filter(m => m.memberCode !== null);
      return {
        success: true,
        data: { members: filteredMembers },
        status: response.status,
      };
    } else {
      return {
        success: false,
        error: result.message || 'Error al obtener miembros',
        status: response.status,
      };
    }
  },
};
