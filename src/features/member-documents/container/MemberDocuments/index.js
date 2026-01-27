import React, { useState } from 'react';
import { useMemberDocuments } from '../../hooks/useMemberDocuments';
import MemberHeader from '../../components/MemberHeader';
import DocumentCard from '../../components/DocumentCard';
import ValidationActions from '../../components/ValidationActions';

const MemberDocuments = ({ memberId, onBack }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [actionType, setActionType] = useState('');
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  const {
    memberData,
    documents,
    loading,
    updateDocumentStatus,
    updateValidationStatus,
    formatStatus,
    getStatusBadge
  } = useMemberDocuments(memberId);

  const handleDocumentApprove = (document) => {
    setSelectedDocument(document);
    setActionType('approve-document');
    setNotes('');
    setShowModal(true);
  };

  const handleDocumentReject = (document) => {
    setSelectedDocument(document);
    setActionType('reject-document');
    setNotes('');
    setShowModal(true);
  };

  const handleValidationApprove = () => {
    setActionType('approve-validation');
    setNotes('');
    setShowModal(true);
  };

  const handleValidationReject = () => {
    setActionType('reject-validation');
    setNotes('');
    setShowModal(true);
  };

  const executeAction = async () => {
    let success = false;

    if (actionType === 'approve-document') {
      success = await updateDocumentStatus(selectedDocument.id, 'VALIDATED', notes || null);
    } else if (actionType === 'reject-document') {
      success = await updateDocumentStatus(selectedDocument.id, 'REJECTED', notes);
    } else if (actionType === 'approve-validation') {
      success = await updateValidationStatus(memberData.validation.id, 'APPROVED', null);
    } else if (actionType === 'reject-validation') {
      success = await updateValidationStatus(memberData.validation.id, 'REJECTED', notes);
    }

    if (success) {
      setShowModal(false);
      setSelectedDocument(null);
      setNotes('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <p className="text-gray-600">No se encontraron datos del socio</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemberHeader 
        memberData={memberData} 
        formatStatus={formatStatus}
        onBack={onBack}
      />

      <ValidationActions
        memberData={memberData}
        onApprove={handleValidationApprove}
        onReject={handleValidationReject}
      />

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos del Socio</h2>
        
        {documents.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No hay documentos registrados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                formatStatus={formatStatus}
                getStatusBadge={getStatusBadge}
                onApprove={handleDocumentApprove}
                onReject={handleDocumentReject}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType.includes('approve') ? 'Aprobar' : 'Rechazar'}{' '}
              {actionType.includes('document') ? 'Documento' : 'Validación'}
            </h3>
            
            {actionType.includes('document') && selectedDocument && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Documento: <strong>{selectedDocument.catalog.label}</strong>
                </p>
              </div>
            )}

            {(actionType === 'reject-document' || actionType === 'reject-validation') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'reject-document' ? 'Notas (requerido):' : 'Motivo del rechazo (requerido):'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ingresa las notas o motivo..."
                  required
                />
              </div>
            )}

            {actionType === 'approve-document' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDocument(null);
                  setNotes('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={executeAction}
                disabled={(actionType.includes('reject') && !notes.trim())}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  actionType.includes('approve') ? 
                    'bg-green-600 hover:bg-green-700' : 
                    'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionType.includes('approve') ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDocuments;
