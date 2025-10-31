// JSDoc type definitions for bulk-upload feature

/**
 * @typedef {Object} Member
 * @property {number} id - Unique identifier for the member
 * @property {number} numero_socio - Member number
 * @property {string} nombre - Member's first name
 * @property {string} apellidos - Member's last name
 * @property {string} email - Member's email
 * @property {string} telefono - Member's phone number
 * @property {boolean} foraneo - Whether the member is foreign
 * @property {string} direccion - Member's address
 * @property {number} id_sistema_entradas - ID for entry system
 */

/**
 * @typedef {Object} BulkUploadFormState
 * @property {Array} csvData - Parsed CSV data
 * @property {Array} previewData - Preview of CSV data (first 5 rows)
 */

/**
 * @typedef {Object} CsvValidationResult
 * @property {boolean} isValid - Whether the CSV data is valid
 * @property {Array} invalidRows - Array of invalid row numbers
 * @property {Array} duplicateNumbers - Array of duplicate member numbers
 */

/**
 * @typedef {Object} BulkUploadService
 * @property {function(File): Promise<Array>} parseCsv - Parse CSV file
 * @property {function(Array, Array): CsvValidationResult} validateCsvData - Validate CSV data against existing members
 * @property {function(Array, Array): Array} processMembers - Process members from CSV data
 */