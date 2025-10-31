import { useState, useContext } from 'react';
import { bulkUploadService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useBulkUpload = () => {
  const { members, setMembers, addLog, addToast } = useContext(AppContext);
  
  const [csvData, setCsvData] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  /**
   * Handle file upload
   * @param {Object} e - File input event
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      addLog('Error: Por favor sube un archivo CSV válido');
      addToast('Error: Por favor sube un archivo CSV válido', 'error');
      return;
    }

    try {
      const data = await bulkUploadService.parseCsv(file);
      setCsvData(data);
      // Show only the first 5 rows as preview
      setPreviewData(data.slice(0, 5));
      addLog(`Archivo CSV cargado: ${data.length} registros encontrados`);
    } catch (error) {
      addLog(`Error al procesar el archivo CSV: ${error.message}`);
      addToast(`Error al procesar el archivo CSV: ${error.message}`, 'error');
    }
  };

  /**
   * Handle adding members from CSV
   */
  const handleAddMembers = () => {
    if (csvData.length === 0) {
      addLog('Error: No hay datos para agregar');
      addToast('Error: No hay datos para agregar', 'error');
      return;
    }

    // Validate that all required fields exist
    const validation = bulkUploadService.validateCsvData(csvData, members);

    if (validation.invalidRows.length > 0) {
      const errorMessage = `Error: Filas con datos incompletos: ${validation.invalidRows.join(', ')}. Se requiere número de socio y nombre.`;
      addLog(errorMessage);
      addToast(errorMessage, 'error');
      return;
    }

    if (validation.duplicateNumbers.length > 0) {
      const errorMessage = `Error: Números de socio duplicados: ${validation.duplicateNumbers.join(', ')}. No se puede agregar.`;
      addLog(errorMessage);
      addToast(errorMessage, 'error');
      return;
    }

    // Process members from CSV data
    const newMembers = bulkUploadService.processMembers(csvData, members);
    
    setMembers(prev => [...prev, ...newMembers]);
    const successMessage = `Se agregaron ${newMembers.length} socios desde archivo CSV`;
    addLog(successMessage);
    addToast(successMessage, 'success');
    
    // Reset form
    setPreviewData([]);
    setCsvData([]);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setCsvData([]);
    setPreviewData([]);
  };

  return {
    csvData,
    previewData,
    handleFileUpload,
    handleAddMembers,
    resetForm
  };
};