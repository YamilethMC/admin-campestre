import React from 'react';
import { useBulkUpload } from '../../hooks/useBulkUpload';
import CsvPreview from '../CsvPreview';

const BulkMemberForm = () => {
  const {
    csvData,
    previewData,
    handleFileUpload,
    handleAddMembers
  } = useBulkUpload();

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
        <CsvPreview previewData={previewData} csvData={csvData} />
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

export default BulkMemberForm;