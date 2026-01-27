import React from 'react';
import { useAccountStatement } from '../../hooks/useAccountStatement';

const AccountStatementForm = () => {
  const {
    fileList,
    handleFileUpload,
    handleUpload
  } = useAccountStatement();

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estados de Cuenta</h1>
            <p className="text-gray-600">Carga masiva de estados de cuenta</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">   
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

      {/*{fileList.length > 0 && (
        <FileList fileList={fileList} />
      )}*/}

      {fileList.length > 0 && (
        <div className="flex space-x-4 mb-4">
          {/*<button
            onClick={processUpload}
            disabled={processingDone || sentResults}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              processingDone || sentResults
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
            }`}
          >
            Cargar
          </button>*/}
          <button
            onClick={handleUpload}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-white hover:bg-primary-dark focus:ring-primary`}
          >
            Cargar
          </button>
        </div>
      )}

      {/*{uploadResults.length > 0 && (
        <UploadResults uploadResults={uploadResults} />
      )}*/}
      </div>
    </div>
  );
};

export default AccountStatementForm;