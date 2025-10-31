// JSDoc type definitions for accounting feature

/**
 * @typedef {Object} FileUploadResult
 * @property {string} fileName - Name of the uploaded file
 * @property {number|string} socioNumber - Member number associated with the file
 * @property {string} memberName - Name of the member
 * @property {string} status - Status of the association (e.g., 'Asociado exitosamente', 'Socio no encontrado')
 */

/**
 * @typedef {Object} Member
 * @property {number} numero_socio - Member number
 * @property {string} nombre - Member first name
 * @property {string} apellidos - Member last name
 */

/**
 * @typedef {Object} AccountStatementData
 * @property {number} year - Year selected for account statements
 * @property {number} month - Month selected for account statements (1-12)
 * @property {File|null} selectedFile - The selected ZIP file
 * @property {string[]} fileList - List of files in the ZIP
 * @property {FileUploadResult[]} uploadResults - Results of file processing
 * @property {boolean} processingDone - Whether processing has been completed
 * @property {boolean} sentResults - Whether results have been sent
 */

/**
 * @typedef {Object} AccountStatementFormState
 * @property {number} year - Year selected
 * @property {number} month - Month selected (1-12)
 * @property {File|null} selectedFile - Selected ZIP file
 * @property {string[]} fileList - List of files in the ZIP
 * @property {FileUploadResult[]} uploadResults - Processing results
 * @property {boolean} processingDone - Whether processing is complete
 * @property {boolean} sentResults - Whether results have been sent
 */

/**
 * @typedef {Object} AccountStatementService
 * @property {function(File, Member[], number, number): Promise<FileUploadResult[]>} processAccountStatement - Process account statement ZIP file
 * @property {function(FileUploadResult[]): Promise<void>} sendAccountStatements - Send account statements
 */