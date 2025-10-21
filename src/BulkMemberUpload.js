import React, { useState, useContext } from 'react';
import Papa from 'papaparse';
import { AppContext } from './AppContext';

const BulkMemberUpload = () => {
  const { members, setMembers, addLog, addToast } = useContext(AppContext);
  
  const [csvData, setCsvData] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      addLog('Error: Por favor sube un archivo CSV válido');
      addToast('Error: Por favor sube un archivo CSV válido', 'error');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        setCsvData(data);
        // Mostrar solo las primeras 5 filas como previsualización
        setPreviewData(data.slice(0, 5));
        addLog(`Archivo CSV cargado: ${data.length} registros encontrados`);
        //addToast(`Archivo CSV cargado: ${data.length} registros encontrados`, 'info');
      },
      error: (error) => {
        addLog(`Error al procesar el archivo CSV: ${error.message}`);
        addToast(`Error al procesar el archivo CSV: ${error.message}`, 'error');
      }
    });
  };

  const handleAddMembers = () => {
    if (csvData.length === 0) {
      addLog('Error: No hay datos para agregar');
      addToast('Error: No hay datos para agregar', 'error');
      return;
    }

    // Validar que todos los campos requeridos existan
    const invalidRows = [];
    const duplicateNumbers = [];
    
    csvData.forEach((row, index) => {
      if (!row.numero_socio || !row.nombre) {
        invalidRows.push(index + 1); // +1 para mostrar número de fila legible
      }
      
      // Verificar si el número de socio ya existe en la lista actual
      const socioNumber = parseInt(row.numero_socio);
      const existingMember = members.find(m => m.numero_socio === socioNumber);
      if (existingMember) {
        duplicateNumbers.push(socioNumber);
      }
    });

    if (invalidRows.length > 0) {
      const errorMessage = `Error: Filas con datos incompletos: ${invalidRows.join(', ')}. Se requiere número de socio y nombre.`;
      addLog(errorMessage);
      addToast(errorMessage, 'error');
      return;
    }

    if (duplicateNumbers.length > 0) {
      const errorMessage = `Error: Números de socio duplicados: ${duplicateNumbers.join(', ')}. No se puede agregar.`;
      addLog(errorMessage);
      addToast(errorMessage, 'error');
      return;
    }

    const newMembers = csvData.map((row, index) => ({
      ...row,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 + index : 1 + index,
      numero_socio: parseInt(row.numero_socio), // Asegurar que sea número
      foraneo: row.foraneo === 'true' || row.foraneo === '1' || row.foraneo === true // Convertir a booleano
    }));
    
    setMembers(prev => [...prev, ...newMembers]);
    const successMessage = `Se agregaron ${newMembers.length} socios desde archivo CSV`;
    addLog(successMessage);
    addToast(successMessage, 'success');
    
    setPreviewData([]);
    setCsvData([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Carga Masiva de Socios (CSV)</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar archivo CSV
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20"
        />
      </div>

      {previewData.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Previsualización de los primeros 5 registros:</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Socio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foráneo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Entradas</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.numero_socio}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.apellidos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.foraneo === 'true' || row.foraneo === '1' ? 'Sí' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id_sistema_entradas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Total de registros en el archivo: {csvData.length}
          </div>
        </div>
      )}

      {csvData.length > 0 && (
        <button
          onClick={handleAddMembers}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Agregar Socios desde CSV
        </button>
      )}
    </div>
  );
};

export default BulkMemberUpload;