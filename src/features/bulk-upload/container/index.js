import React, { useState } from 'react';
import BulkMemberForm from '../components/BulkMemberForm';

const BulkMemberUploadContainer = ({ onCancel }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirmLeave = () => {
    setShowConfirmationModal(false);
    if (pendingNavigationCallback) {
      pendingNavigationCallback();
      setPendingNavigationCallback(null);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleCancel = () => {
    confirmLeave(onCancel);
  };

  const confirmLeave = callback => {
    setPendingNavigationCallback(() => callback);
    setShowConfirmationModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Regresar"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Agregar socios</h2>
      </div>

      <BulkMemberForm />

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas regresar? Los cambios no guardados se perderán.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={handleConfirmLeave}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkMemberUploadContainer;
