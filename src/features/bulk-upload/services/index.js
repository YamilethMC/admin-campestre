import { handleAuthError } from '../../../shared/utils/authErrorHandler';

export const bulkUploadService = {
  uploadMembers: async (file) => {
    const formData = new FormData();
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/club-members/bulk-upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const handleResponse = async (response) => {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return {
          ok: response.ok,
          status: response.status,
          data,
        };
      };

      const result = await handleResponse(response);

      if (!result.ok) {
        if (response.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: response.status
          };
        }
        let errorMessage = result.data?.message || 'Error al subir archivo de socios';
        if (result.status === 400) {
          errorMessage = 'Solicitud incorrecta: Verifica que el archivo esté en el formato correcto';
        } else if (result.status === 500) {
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
        }

        return {
          success: false,
          error: errorMessage,
          status: result.status
        };
      }

      if (result.data.data && (result.data.data.errors > 0 || (result.data.data.errorsList && result.data.data.errorsList.length > 0))) {
        const errorCount = result.data.data.errors || (result.data.data.errorsList ? result.data.data.errorsList.length : 0);
        const successCount = result.data.data.success || 0;
        const message = `Carga masiva completada con ${errorCount} error(es) y ${successCount} éxito(s)`;

        return {
          success: false,
          data: result.data.data,
          error: message,
          status: result.status
        };
      }

      return {
        success: true,
        data: result.data.data,
        message: result.data.data?.message || 'Archivo subido exitosamente',
        status: result.status
      };
    } catch (error) {
      console.error('Error uploading bulk members:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión. Por favor, intente de nuevo más tarde.',
        status: null
      };
    }
  }
};