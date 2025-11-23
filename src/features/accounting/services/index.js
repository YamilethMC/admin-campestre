/**
 * Mock service for account statement upload
 */
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
      throw new Error('No se encontró token de autorización');
    }

    const formData = new FormData();
    formData.append('zipFile', file, file.name);
    try {
      const response = await fetch('http://localhost:3003/account-statements/upload-bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor inicie sesión nuevamente.');
        } else if (response.status === 400) {
          throw new Error('Error en la validación del archivo o formato no soportado.');
        }else if (response.status === 403) {
          throw new Error('Acceso denegado. No tiene permisos para esta operación.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Por favor inténtelo más tarde.');
        } else {
          const errorResult = await response.json().catch(() => ({}));
          throw new Error(errorResult.message || `Error HTTP ${response.status}`);
        }
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error('Error uploading account statements:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifique su conexión a internet y que la API esté disponible.');
      }
      throw error;
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