import React from 'react';
import { useAccountStatement } from '../../hooks/useAccountStatement';
import FileList from '../FileList';
import UploadResults from '../UploadResults';

const AccountStatementForm = () => {
  const {
    year,
    setYear,
    month,
    setMonth,
    selectedFile,
    fileList,
    uploadResults,
    processingDone,
    sentResults,
    years,
    months,
    handleFileUpload,
    processUpload,
    handleSend
  } = useAccountStatement();

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
          <div className="flex items-center">
            <input
              id="file-input-account-statement"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              /*onChange={(e) => {
                // Clear the input first to ensure change event fires even if same file is selected
                if (e.target.value) {
                  handleFileUpload(e);
                  e.target.value = null; // Reset the input value
                }
              }}*/
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
            />
            {/*{selectedFile ? (
              <span className="ml-2 text-sm text-gray-600 truncate max-w-[150px]" title={selectedFile.name}>
                {selectedFile.name}
              </span>
            ) : (
              <span className="ml-2 text-sm text-gray-400">Ningún archivo seleccionado</span>
            )}*/}
          </div>
        </div>
      </div>

      {fileList.length > 0 && (
        <FileList fileList={fileList} />
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
        <UploadResults uploadResults={uploadResults} />
      )}
    </div>
  );
};

export default AccountStatementForm;