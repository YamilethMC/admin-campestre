import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const helpCenterService = {
  fetchHelpCenter: async () => {
    const response = await api.get('/help-center');
    
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
      let errorMessage = response.data?.message || 'Error desconocido';
      if (response.status === 500) errorMessage = 'Error interno del servidor';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return { success: true, data: response.data.data, status: response.status };
  },

  getHelpCenterById: async (id) => {
    const response = await api.get(`/help-center/${id}`);
    
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
      let errorMessage = response.data?.message || 'Error desconocido';
      if (response.status === 404) errorMessage = 'Artículo no encontrado';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return { success: true, data: response.data.data, status: response.status };
  },

  createHelpCenter: async (helpCenterData) => {
    const response = await api.post('/help-center', helpCenterData);
    
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
      let errorMessage = response.data?.message || 'Error desconocido';
      if (response.status === 400) errorMessage = 'Datos inválidos';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Entrada de centro de ayuda creada exitosamente',
      status: response.status
    };
  },

  updateHelpCenter: async (id, helpCenterData) => {
    const response = await api.patch(`/help-center/${id}`, helpCenterData);
    
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
      let errorMessage = response.data?.message || 'Error desconocido';
      if (response.status === 404) errorMessage = 'Artículo no encontrado';
      else if (response.status === 400) errorMessage = 'Datos inválidos';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Entrada de centro de ayuda actualizada exitosamente',
      status: response.status
    };
  },

  deleteHelpCenter: async (id) => {
    const response = await api.del(`/help-center/${id}`);

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
      let errorMessage = response.data?.message || 'Error desconocido';
      if (response.status === 404) errorMessage = 'Artículo no encontrado';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return {
      success: true,
      message: 'Entrada de centro de ayuda eliminada exitosamente',
      status: response.status
    };
  }
};