export const accountStatementService = {
  /**
   * Process a ZIP file containing account statements
   * @param {File} file - The ZIP file containing account statements
   * @param {Array} members - Array of member data to match against
   * @param {number} year - Selected year
   * @param {number} month - Selected month
   * @returns {Promise<Array>} Array of results for each file in the ZIP
   */
  processAccountStatement: async (file, members, year, month) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Mock file list - in a real app this would extract from the ZIP file
    const mockFileList = [
      '1_estado_cuenta.pdf',
      '2_estado_cuenta.pdf',
      '3_estado_cuenta.pdf',
      '4_estado_cuenta.pdf',
      '5_estado_cuenta.pdf',
      '10_estado_cuenta.pdf',
      '15_estado_cuenta.pdf'
    ];

    // Process each file in the mock list
    const results = mockFileList.map(fileName => {
      // Extract member number from file name (before the first '_')
      const match = fileName.match(/^(\d+)_/);
      const socioNumber = match ? parseInt(match[1]) : null;

      if (socioNumber) {
        const member = members.find(m => m.numero_socio === socioNumber);
        if (member) {
          return {
            fileName,
            socioNumber,
            memberName: `${member.nombre} ${member.apellidos}`,
            status: 'Asociado exitosamente'
          };
        } else {
          return {
            fileName,
            socioNumber,
            memberName: 'No encontrado',
            status: 'Socio no encontrado'
          };
        }
      } else {
        return {
          fileName,
          socioNumber: 'N/A',
          memberName: 'N/A',
          status: 'Número de socio no identificado'
        };
      }
    });

    // Return the results
    return results;
  },

  /**
   * Upload ZIP file with account statements to the API
   * @param {File} file - The ZIP file to upload
   * @returns {Promise<Object>} API response
   */
  uploadAccountStatements: async (file) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return {
        success: false,
        error: 'No se encontró token de autorización',
        status: null
      };
    }

    const formData = new FormData();
    formData.append('zipFile', file, file.name);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/account-statements/upload-bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        let errorMessage = errorResult.message || `Error HTTP ${response.status}`;

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 400:
            errorMessage = errorResult.message || 'Error en la validación del archivo o formato no soportado';
            break;
          case 500:
            errorMessage = errorResult.message || 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = errorResult.message || `Error HTTP ${response.status}`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        message: result.message || 'Estados de cuenta subidos exitosamente',
        status: response.status
      };
    } catch (error) {
      console.error('Error uploading account statements:', error);
      let errorMessage = 'Error de conexión. Por favor, intente de nuevo más tarde.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet y que la API esté disponible.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
        status: null
      };
    }
  },

  /**
   * Send account statements
   * @param {Array} results - Array of processing results
   * @returns {Promise<void>}
   */
  sendAccountStatements: async (results) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

    // Count successful associations
    const successful = results.filter(r => r.status === 'Asociado exitosamente').length;

    return Promise.resolve();
  }
};