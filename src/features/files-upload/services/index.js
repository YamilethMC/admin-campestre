import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const fileUploadService = {
  getFiles: async (params) => {
    const { page = 1, limit = 10, search = '', order = 'asc', orderBy = 'name' } = params;
    const query = new URLSearchParams({ page, limit, search, order, orderBy });

    const response = await api.get(`/files?${query}`);

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
      let errorMessage = response.data?.message || 'Error al obtener archivos';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: {
        data: response.data.data.files,
        meta: response.data.data.meta
      },
      status: response.status
    };
  },

  // Upload a new file
  uploadFile: async (fileData) => {
    // Get auth token
    const token = localStorage.getItem('authToken');

    // Create FormData for file upload
    const formData = new FormData();
    if (fileData.file) {
      formData.append('file', fileData.file);
    }
    formData.append('name', fileData.name);
    formData.append('description', fileData.description || '');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/files/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

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
      const errorData = await response.json();
      let errorMessage = 'Error al subir archivo';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos del archivo';
          break;
        case 404:
          errorMessage = 'No se encontró el archivo';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al subir archivo';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: {data: result.data.files, meta: result.data.meta},
      message: 'Archivo subido exitosamente',
      status: response.status
    };
  },

  getFileById: async (id) => {
    const response = await api.get(`/files/${id}`);

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
      let errorMessage = response.data?.message || 'Error al obtener archivo';
      if (response.status === 404) errorMessage = 'Archivo no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, data: response.data.data, status: response.status };
  },

  updateFile: async (id, fileData) => {
    const response = await api.patch(`/files/${id}`, {
      name: fileData.name,
      description: fileData.description,
      type: fileData.type || 'pdf'
    });

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
      let errorMessage = response.data?.message || 'Error al actualizar archivo';
      if (response.status === 404) errorMessage = 'Archivo no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: { data: response.data.data.files, meta: response.data.data.meta },
      message: 'Archivo actualizado exitosamente',
      status: response.status
    };
  },

  deleteFile: async (id) => {
    const response = await api.del(`/files/${id}`);

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
      let errorMessage = response.data?.message || 'Error al eliminar archivo';
      if (response.status === 404) errorMessage = 'Archivo no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      message: 'Archivo eliminado exitosamente',
      deletedId: id,
      status: response.status
    };
  }
};