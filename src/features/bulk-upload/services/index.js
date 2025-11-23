export const bulkUploadService = {
  /**
   * Upload Excel file for bulk member creation
   * @param {File} file - The Excel file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadMembers: async (file) => {
    // Get auth token
    const token = localStorage.getItem('authToken');

    // Create FormData for file upload
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/club-members/bulk-upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Error al subir archivo de socios';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica que el archivo esté en el formato correcto';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = errorData.message || 'Error al subir archivo de socios';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const responseJson = await response.json();

    // Verificar si hay errores en el procesamiento, incluso si la solicitud HTTP fue exitosa
    if (responseJson.data && (responseJson.data.errors > 0 || (responseJson.data.errorsList && responseJson.data.errorsList.length > 0))) {
      // Hay errores en el procesamiento
      const errorCount = responseJson.data.errors || (responseJson.data.errorsList ? responseJson.data.errorsList.length : 0);
      const successCount = responseJson.data.success || 0;
      const message = `Carga masiva completada con ${errorCount} error(es) y ${successCount} éxito(s)`;

      return {
        success: false, // Marcamos como fallido si hay errores
        data: responseJson.data,
        error: message,
        status: response.status
      };
    } else {
      // Procesamiento exitoso sin errores
      return {
        success: true,
        data: responseJson.data,
        message: responseJson.data?.message || 'Archivo subido exitosamente',
        status: response.status
      };
    }
  }
};