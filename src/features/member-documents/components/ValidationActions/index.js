import React from 'react';

const ValidationActions = ({ memberData, onApprove, onReject }) => {
  if (memberData.validation?.status !== 'IN_REVIEW') {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Validación</h2>
      <div className="flex gap-4">
        <button
          onClick={onApprove}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
        >
          Aprobar Validación Completa
        </button>
        <button
          onClick={onReject}
          className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
        >
          Rechazar Validación
        </button>
      </div>
    </div>
  );
};

export default ValidationActions;
