import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const noticeService = {
  // Get all notices with pagination, search, and filters
  fetchNotices: async ({
    page = 1,
    limit = 10,
    orderBy = 'title',
    order = 'asc',
    active = true,
    search = ''
  } = {}) => {
    const params = new URLSearchParams({ page, limit, search, order, orderBy });
    if (active !== false) params.append("active", active);

    const response = await api.get(`/notify?${params}`);

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al obtener avisos';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: {
        data: response.data.data.notifications || [],
        meta: response.data.data.meta || null
      },
      status: response.status
    };
  },

  // Get notice by id
  getNoticeById: async (id) => {
    const response = await api.get(`/notify/${id}`);

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al obtener aviso';
      if (response.status === 404) errorMessage = 'Aviso no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, data: response.data.data, status: response.status };
  },

  // Create a new notice
  createNotice: async (noticeData) => {
    noticeData.sentDate = new Date().toISOString();
    noticeData.visibleUntil = new Date(noticeData.visibleUntil).toISOString();
    
    const response = await api.post('/notify', noticeData);

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al registrar aviso';
      if (response.status === 400) errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Aviso registrado exitosamente',
      status: response.status
    };
  },

  // Update a notice
  updateNotice: async (id, noticeData) => {
    noticeData.visibleUntil = new Date(noticeData.visibleUntil).toISOString();
    const response = await api.patch(`/notify/${id}`, noticeData);

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al actualizar aviso';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Aviso actualizado exitosamente',
      status: response.status
    };
  },

  // Toggle notice status (activate/deactivate)
  toggleNoticeStatus: async (id, active) => {
    const response = await api.patch(`/notify/${id}`, { active });

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al actualizar estado del aviso';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data,
      message: active ? 'Aviso activado exitosamente' : 'Aviso desactivado exitosamente',
      status: response.status
    };
  },



  // Delete a notice
  deleteNotice: async (id) => {
    const response = await api.del(`/notify/${id}`);

    if (!response.ok) {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: response.status
        };
      }
      let errorMessage = response.data?.message || 'Error al eliminar el aviso';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, message: 'Aviso eliminado exitosamente', status: response.status };
  },
};