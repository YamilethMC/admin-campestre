import React from 'react';
import { useBulkUpload } from '../../hooks/useBulkUpload';

const BulkMemberForm = () => {
  const {
    uploading,
    uploadResult,
    handleFileUpload,
    resetForm,
    fileInputRef
  } = useBulkUpload();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Carga masiva de socios (Excel)</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar archivo Excel
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full animate-pulse" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Subiendo archivo...</p>
        </div>
      )}

      {uploadResult && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800">Carga exitosa</h3>
          <p className="text-green-700">
            Se han agregado {uploadResult.totalMembersAdded || 0} socios correctamente.
          </p>
          {uploadResult.errorCount > 0 && (
            <p className="text-yellow-700">
              {uploadResult.errorCount} registros tuvieron errores.
            </p>
          )}
        </div>
      )}

      {(uploadResult || uploadResult === null) && !uploading && (
        <div className="flex space-x-3">
          <button
            onClick={resetForm}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Subir otro archivo
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkMemberForm;