import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const surveyService = {
  getSurveyCategoryOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { value: 'TODAS', label: 'Todas' },
      { value: 'SERVICES', label: 'Servicios' },
      { value: 'RESTAURANT', label: 'Restaurante' },
      { value: 'SPORTS', label: 'Deportes' },
      { value: 'EVENTS', label: 'Eventos' }
    ];
  },

  getSurveyPriorityOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { value: 'HIGH', label: 'Importante' },
      { value: 'MEDIUM', label: 'Normal' },
      { value: 'LOW', label: 'Baja' }
    ];
  },

  getSurveyById: async (id) => {
    const response = await api.get(`/survey/${id}`);
    
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
      if (response.status === 404) errorMessage = 'Encuesta no encontrada';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return { success: true, data: response.data.data, status: response.status };
  },

  createSurvey: async (surveyData) => {
    const response = await api.post('/survey', surveyData);
    
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
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Encuesta creada exitosamente',
      status: response.status
    };
  },

  updateSurvey: async (id, surveyData) => {
    const response = await api.patch(`/survey/${id}`, surveyData);
    
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
      if (response.status === 404) errorMessage = 'Encuesta no encontrada';
      else if (response.status === 409) errorMessage = 'Ya existe una encuesta con ese título';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Encuesta actualizada exitosamente',
      status: response.status
    };
  },

  toggleSurveyStatus: async (id) => {
    const response = await api.patch(`/survey/${id}/toggle-active`, {});

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
      if (response.status === 404) errorMessage = 'Encuesta no encontrada';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, message: 'Estado de encuesta actualizado exitosamente', status: response.status };
  },

  deleteSurvey: async (id) => {
    const response = await api.del(`/survey/${id}`);

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
      if (response.status === 404) errorMessage = 'Encuesta no encontrada';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return { success: true, message: 'Encuesta eliminada exitosamente', status: response.status };
  },
  
  getSurveyResponses: async (surveyId) => {
    const response = await api.get(`/survey/${surveyId}/responses`);
    
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
      if (response.status === 404) errorMessage = 'Encuesta no encontrada';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }
    
    return { success: true, data: response.data.data, status: response.status };
  },

  async fetchSurveys({ page = 1, limit = 10, search = '', category = '', status = '' } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (category && category !== 'TODAS') params.append('category', category);
    if (status) params.append('active', status);
    
    const response = await api.get(`/survey?${params}`);

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
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    const data = response.data.data;
    let surveys = [];
    
    if (status === 'true') {
      surveys = data.surveysActive || [];
    } else if (status === 'false') {
      surveys = data.surveysInactive || [];
    } else {
      surveys = [...(data.surveysActive || []), ...(data.surveysInactive || [])];
    }

    return {
      success: true,
      data: {
        surveys,
        meta: data.meta,
        activeCount: data.surveysActive?.length || 0,
        inactiveCount: data.surveysInactive?.length || 0
      },
      status: response.status
    };
  }
};