import React, { useState, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

const AccountStatementUpload = () => {
  const { members, addLog, addToast } = useContext(AppContext);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Mes actual (1-12)
  const [fileList, setFileList] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [processingDone, setProcessingDone] = useState(false); // Track if processing has been done
  const [sentResults, setSentResults] = useState(false); // Track if results have been sent

  // Generar opciones para años (últimos 5 años)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Generar nombres de meses
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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
    //addToast(`Archivo ZIP cargado: ${file.name} (${mockFileList.length} estados de cuenta simulados)`, 'info');
  };

  const processUpload = () => {
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

    const results = fileList.map(fileName => {
      // Extraer número de socio del nombre del archivo (antes del primer '_')
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

    setUploadResults(results);
    setProcessingDone(true); // Set processing state to true
    setSentResults(false); // Reset sent state when processing new results
    
    // Contar resultados
    const successful = results.filter(r => r.status === 'Asociado exitosamente').length;
    const failed = results.filter(r => r.status !== 'Asociado exitosamente').length;
    
    const message = `Proceso completado: ${successful} estados asociados, ${failed} con errores. Año/Mes: ${year}/${months[month-1]}`;
    addLog(message);
    //addToast(message, 'info');
  };

  const handleSend = () => {
    // Count successful associations (where a member was found)
    const successful = uploadResults.filter(r => r.status === 'Asociado exitosamente').length;
    
    if (successful > 0) {
      addLog(`Estados de cuenta enviados: ${successful} estados enviados exitosamente`);
      addToast(`Estados de cuenta enviados: ${successful} estados enviados exitosamente`, 'success');
    } else {
      addLog('No se encontraron estados de cuenta para enviar');
      addToast('No se encontraron estados de cuenta para enviar', 'info');
    }
    
    // After sending, set both buttons to disabled state (sentResults = true)
    setSentResults(true);
    // Keep processingDone as true so we know there are results, but sentResults controls the buttons
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Carga Masiva de Estados de Cuenta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {months.map((m, index) => (
              <option key={index + 1} value={index + 1}>{m}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo ZIP
          </label>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => {
              // Clear the input first to ensure change event fires even if same file is selected
              if (e.target.value) {
                handleFileUpload(e);
                e.target.value = null; // Reset the input value
              }
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20"
          />
        </div>
      </div>

      {fileList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Archivos en el ZIP:</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto border border-gray-200">
            <ul className="list-disc pl-5 space-y-1">
              {fileList.map((fileName, index) => (
                <li key={index} className="text-sm text-gray-700">{fileName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {fileList.length > 0 && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={processUpload}
            disabled={processingDone || sentResults}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              processingDone || sentResults
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
            }`}
          >
            Cargar
          </button>
          <button
            onClick={handleSend}
            disabled={!processingDone || sentResults}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !processingDone || sentResults
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-success text-white hover:bg-success/90 focus:ring-success' 
            }`}
          >
            Enviar
          </button>
        </div>
      )}

      {uploadResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Resultados:</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Socio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Socio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.fileName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.socioNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.memberName}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      result.status === 'Asociado exitosamente' 
                        ? 'text-success' 
                        : 'text-error'
                    }`}>
                      {result.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatementUpload;