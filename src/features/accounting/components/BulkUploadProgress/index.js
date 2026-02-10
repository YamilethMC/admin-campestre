import React from 'react';

const statusLabels = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
};

const statusColors = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
};

const BulkUploadProgress = ({
  status,
  totalFiles,
  processed,
  failed,
  progressPercent,
  errors,
  isActive,
  onClose,
}) => {
  if (!status) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Estado del procesamiento
        </h3>
        {!isActive && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[status] || 'bg-gray-500'}`}>
          {statusLabels[status] || status}
        </span>
        <span className="text-gray-600 text-sm">
          {processed} de {totalFiles} archivos procesados
          {failed > 0 && <span className="text-red-500 ml-2">({failed} fallidos)</span>}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-500 ease-out ${
            status === 'FAILED' ? 'bg-red-500' : 
            status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{progressPercent}% completado</span>
        {isActive && (
          <span className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </span>
        )}
      </div>

      {status === 'COMPLETED' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            Procesamiento completado exitosamente.
          </p>
          <p className="text-green-600 text-sm mt-1">
            {processed} archivos procesados correctamente
            {failed > 0 && `, ${failed} con errores`}.
          </p>
        </div>
      )}

      {status === 'FAILED' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            El procesamiento falló.
          </p>
          {errors && errors.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside max-h-32 overflow-y-auto">
              {errors.slice(0, 5).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {errors.length > 5 && (
                <li className="text-red-500">... y {errors.length - 5} errores más</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUploadProgress;
