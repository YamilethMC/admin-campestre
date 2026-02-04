import { useState, useContext, useRef } from 'react';
import { bulkUploadService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useBulkUpload = () => {
  const { setMembers, addLog, addToast } = useContext(AppContext);

  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const fileInputRef = useRef(null);

  /**
   * Handle file upload and send to API
   * @param {Object} e - File input event
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - the API accepts Excel files
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      addLog('Error: Por favor sube un archivo Excel válido (.xlsx o .xls)');
      addToast('Error: Por favor sube un archivo Excel válido (.xlsx o .xls)', 'error');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const result = await bulkUploadService.uploadMembers(file);

    if (result.success) {
      setUploadResult(result.data);
      // Usar el mensaje de la respuesta de la API si está disponible
      const message = result.message || `Archivo subido exitosamente. ${result.data?.totalMembersAdded || 0} socios agregados.`;
      addLog(message);
      addToast(message, 'success');
    } else {
      if (result.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      const errorMessage = result.error || 'Error al subir el archivo';
      addLog(errorMessage);
      addToast(errorMessage, 'error');
      console.error('Bulk upload error:', errorMessage);
    }

    setUploading(false);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setUploadResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    uploading,
    uploadResult,
    handleFileUpload,
    resetForm,
    fileInputRef
  };
};