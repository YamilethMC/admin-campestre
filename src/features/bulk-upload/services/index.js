import Papa from 'papaparse';

/**
 * Mock service for bulk member upload
 */
export const bulkUploadService = {
  /**
   * Parse CSV file
   * @param {File} file - The CSV file to parse
   * @returns {Promise<Array>} Parsed CSV data
   */
  parseCsv: (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  },

  /**
   * Validate CSV data against existing members
   * @param {Array} csvData - The parsed CSV data
   * @param {Array} existingMembers - The existing members in the system
   * @returns {Object} Validation result
   */
  validateCsvData: (csvData, existingMembers) => {
    const invalidRows = [];
    const duplicateNumbers = [];
    
    csvData.forEach((row, index) => {
      if (!row.numero_socio || !row.nombre) {
        invalidRows.push(index + 1); // +1 to show readable row number
      }
      
      // Check if the member number already exists in the current list
      const socioNumber = parseInt(row.numero_socio);
      const existingMember = existingMembers.find(m => m.numero_socio === socioNumber);
      if (existingMember) {
        duplicateNumbers.push(socioNumber);
      }
    });

    return {
      isValid: invalidRows.length === 0 && duplicateNumbers.length === 0,
      invalidRows,
      duplicateNumbers
    };
  },

  /**
   * Process members from CSV data
   * @param {Array} csvData - The parsed CSV data
   * @param {Array} existingMembers - The existing members in the system
   * @returns {Array} Processed members ready to be added
   */
  processMembers: (csvData, existingMembers) => {
    // Find the max ID from existing members to generate unique IDs for new members
    const maxExistingId = existingMembers.length > 0 ? Math.max(...existingMembers.map(m => m.id)) : 0;
    
    return csvData.map((row, index) => ({
      ...row,
      id: maxExistingId + 1 + index,
      numero_socio: parseInt(row.numero_socio), // Ensure it's a number
      foraneo: row.foraneo === 'true' || row.foraneo === '1' || row.foraneo === true // Convert to boolean
    }));
  }
};