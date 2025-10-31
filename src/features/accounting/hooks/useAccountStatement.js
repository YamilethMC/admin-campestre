import { useState, useContext } from 'react';
import { accountStatementService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useAccountStatement = () => {
  const { members, addLog, addToast } = useContext(AppContext);
  
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Mes actual (1-12)
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [processingDone, setProcessingDone] = useState(false);
  const [sentResults, setSentResults] = useState(false);
  
  // Generar opciones para años (últimos 5 años)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  
  // Generar nombres de meses
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /**
   * Handle file upload
   * @param {Object} e - File input event
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      addLog('Error: Por favor sube un archivo ZIP válido');
      addToast('Error: Por favor sube un archivo ZIP válido', 'error');
      return;
    }

    setSelectedFile(file);

    // Simular la lista de archivos dentro del ZIP (usando datos mock)
    const mockFileList = [
      '1_estado_cuenta.pdf',
      '2_estado_cuenta.pdf',
      '3_estado_cuenta.pdf',
      '4_estado_cuenta.pdf',
      '5_estado_cuenta.pdf',
      '10_estado_cuenta.pdf',
      '15_estado_cuenta.pdf'
    ];

    setFileList(mockFileList);
    setProcessingDone(false); // Reset processing state when new file is selected
    setSentResults(false); // Reset sent state when new file is selected
    setUploadResults([]); // Clear previous results
    addLog(`Archivo ZIP cargado: ${file.name} (${mockFileList.length} estados de cuenta simulados)`);
  };

  /**
   * Process the uploaded file
   */
  const processUpload = async () => {
    if (!selectedFile) {
      addLog('Error: Por favor selecciona un archivo ZIP primero');
      addToast('Error: Por favor selecciona un archivo ZIP primero', 'error');
      return;
    }

    if (fileList.length === 0) {
      addLog('Error: No se encontraron archivos en el ZIP simulado');
      addToast('Error: No se encontraron archivos en el ZIP simulado', 'error');
      return;
    }

    try {
      const results = await accountStatementService.processAccountStatement(selectedFile, members, year, month);
      setUploadResults(results);
      setProcessingDone(true); // Set processing state to true
      setSentResults(false); // Reset sent state when processing new results
      
      // Contar resultados
      const successful = results.filter(r => r.status === 'Asociado exitosamente').length;
      const failed = results.filter(r => r.status !== 'Asociado exitosamente').length;
      
      const message = `Proceso completado: ${successful} estados asociados, ${failed} con errores. Año/Mes: ${year}/${months[month-1]}`;
      addLog(message);
      
      return results;
    } catch (error) {
      addLog(`Error procesando estados de cuenta: ${error.message}`);
      addToast(`Error procesando estados de cuenta: ${error.message}`, 'error');
      throw error;
    }
  };

  /**
   * Send the processed account statements
   */
  const handleSend = async () => {
    try {
      // Count successful associations (where a member was found)
      const successful = uploadResults.filter(r => r.status === 'Asociado exitosamente').length;
      
      if (successful > 0) {
        await accountStatementService.sendAccountStatements(uploadResults);
        addLog(`Estados de cuenta enviados: ${successful} estados enviados exitosamente`);
        addToast(`Estados de cuenta enviados: ${successful} estados enviados exitosamente`, 'success');
      } else {
        addLog('No se encontraron estados de cuenta para enviar');
        addToast('No se encontraron estados de cuenta para enviar', 'info');
      }
      
      // After sending, set both buttons to disabled state (sentResults = true)
      setSentResults(true);
      
      // Reset form fields after successful send
      resetForm();
    } catch (error) {
      addLog(`Error enviando estados de cuenta: ${error.message}`);
      addToast(`Error enviando estados de cuenta: ${error.message}`, 'error');
      throw error;
    }
  };

  /**
   * Reset all form fields to their initial state
   */
  const resetForm = () => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    setSelectedFile(null);
    setFileList([]);
    setUploadResults([]);
    setProcessingDone(false);
    setSentResults(false);
    
    // Clear file input in the DOM
    const fileInput = document.getElementById('file-input-account-statement');
    if (fileInput) fileInput.value = '';
  };

  return {
    year,
    setYear,
    month,
    setMonth,
    selectedFile,
    setSelectedFile,
    fileList,
    uploadResults,
    processingDone,
    sentResults,
    years,
    months,
    handleFileUpload,
    processUpload,
    handleSend,
    resetForm,
    addLog,
    addToast
  };
};