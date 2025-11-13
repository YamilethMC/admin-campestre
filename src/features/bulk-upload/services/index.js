/**
 * Service for bulk member upload to the real API
 */
export const bulkUploadService = {
  /**
   * Upload Excel file for bulk member creation
   * @param {File} file - The Excel file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadMembers: async (file) => {
    try {
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
        throw new Error(errorData.message || 'Error al subir archivo de socios');
      }

      const responseJson = await response.json();
      // La API devuelve { success: true, data: {...}, message: "...", ... }
      // Devolvemos el objeto data completo para que el hook pueda acceder a todas las propiedades
      return responseJson.data;
    } catch (error) {
      console.error('Error uploading members:', error);
      throw error;
    }
  }
};