import React from 'react';

const ActionModal = ({ 
  show, 
  actionType, 
  selectedValidation, 
  rejectionReason, 
  onReasonChange, 
  onCancel, 
  onConfirm 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {actionType === 'approve' ? 'Aprobar validación' : 'Rechazar validación'}
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Socio: <strong>
              {selectedValidation?.member?.user?.name} {selectedValidation?.member?.user?.lastName}
            </strong>
          </p>
          <p className="text-sm text-gray-600">
            Código: <strong>#{selectedValidation?.member?.memberCode}</strong>
          </p>
        </div>

        {actionType === 'reject' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del rechazo:
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ingresa el motivo del rechazo..."
              required
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={actionType === 'reject' && !rejectionReason.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              actionType === 'approve' ? 
                'bg-green-600 hover:bg-green-700' : 
                'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {actionType === 'approve' ? 'Aprobar' : 'Rechazar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
