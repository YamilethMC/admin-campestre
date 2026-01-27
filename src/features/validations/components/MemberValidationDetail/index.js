import React, { useState, useEffect } from 'react';
import validationService from '../../services';

const MemberValidationDetail = ({ memberId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [validationData, setValidationData] = useState(null);
  const [error, setError] = useState('');
  const [processingDocId, setProcessingDocId] = useState(null);

  useEffect(() => {
    loadValidationData();
  }, [memberId]);

  const loadValidationData = async () => {
    try {
      setLoading(true);
      const response = await validationService.getMemberValidationData(memberId);
      // Unwrap the API response
      const data = response?.data?.data || response?.data || response;
      console.log('Validation data loaded:', data);
      setValidationData(data);
      setError('');
    } catch (err) {
      console.error('Error loading validation data:', err);
      setError(err.message || 'Error al cargar los datos de validación');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentAction = async (documentId, action, reason = null) => {
    try {
      setProcessingDocId(documentId);
      const status = action === 'approve' ? 'VALIDATED' : 'REJECTED';
      
      await validationService.updateDocumentStatus(documentId, {
        status,
        notes: reason
      });

      // Reload data after update
      await loadValidationData();
      setProcessingDocId(null);
    } catch (err) {
      setError(err.message || 'Error al actualizar el documento');
      setProcessingDocId(null);
    }
  };

  const getDocumentStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-gray-100 text-gray-800',
      UPLOADED: 'bg-blue-100 text-blue-800',
      VALIDATED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.PENDING;
  };

  const getDocumentStatusLabel = (status) => {
    const labels = {
      PENDING: 'Pendiente',
      UPLOADED: 'Subido',
      VALIDATED: 'Aprobado',
      REJECTED: 'Rechazado'
    };
    return labels[status] || 'Desconocido';
  };

  const getValidationStatusBadge = (status) => {
    const badges = {
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      PARTIAL: 'bg-yellow-100 text-yellow-800',
      IN_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.NOT_STARTED;
  };

  const getValidationStatusLabel = (status) => {
    const labels = {
      NOT_STARTED: 'No iniciado',
      PARTIAL: 'Parcial',
      IN_REVIEW: 'En revisión',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado'
    };
    return labels[status] || 'Desconocido';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && !validationData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const member = validationData?.member || {};
  const validation = validationData?.validation || {};
  const documents = validationData?.documents || [];

  console.log('Rendering with documents:', documents);

  const requiredDocs = documents.filter(d => d.required);
  const optionalDocs = documents.filter(d => !d.required);
  const requiredApproved = requiredDocs.filter(d => d.document?.status === 'VALIDATED').length;
  const totalRequired = requiredDocs.length;

  // Use stats from backend for accurate counts
  const requestedValidated = validationData?.stats?.requestedValidated || documents.filter(d => d.document?.status === 'VALIDATED').length;
  const requestedTotal = validationData?.stats?.requestedTotal || documents.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Validación de Documentos - Socio #{member.memberCode}
          </h1>
          <p className="text-gray-600">
            {member.user?.name} {member.user?.lastName}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getValidationStatusBadge(validation.status)}`}>
            {getValidationStatusLabel(validation.status)}
          </span>
          <p className="text-sm text-gray-600 mt-2">
            Documentos: {requestedValidated}/{requestedTotal}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Required Documents */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Documentos Requeridos ({requiredApproved}/{totalRequired})
        </h2>
        <div className="space-y-4">
          {requiredDocs.map((doc) => (
            <DocumentCard
              key={doc.catalogId}
              doc={doc}
              onApprove={(reason) => handleDocumentAction(doc.document?.id, 'approve', reason)}
              onReject={(reason) => handleDocumentAction(doc.document?.id, 'reject', reason)}
              processing={processingDocId === doc.document?.id}
              getStatusBadge={getDocumentStatusBadge}
              getStatusLabel={getDocumentStatusLabel}
            />
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documentos Opcionales
          </h2>
          <div className="space-y-4">
            {optionalDocs.map((doc) => (
              <DocumentCard
                key={doc.catalogId}
                doc={doc}
                onApprove={(reason) => handleDocumentAction(doc.document?.id, 'approve', reason)}
                onReject={(reason) => handleDocumentAction(doc.document?.id, 'reject', reason)}
                processing={processingDocId === doc.document?.id}
                getStatusBadge={getDocumentStatusBadge}
                getStatusLabel={getDocumentStatusLabel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentCard = ({ doc, onApprove, onReject, processing, getStatusBadge, getStatusLabel }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Por favor ingresa una razón para el rechazo');
      return;
    }
    onReject(rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const document = doc.document;
  const hasDocument = !!document && !!document.url;
  const canApprove = hasDocument && document.status === 'UPLOADED';
  const canReject = hasDocument && (document.status === 'UPLOADED' || document.status === 'VALIDATED');
  const isPDF = document?.fileName?.toLowerCase().endsWith('.pdf');
  const isImage = document?.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  // Debug logging
  console.log('DocumentCard render:', {
    label: doc.label,
    hasDocument,
    url: document?.url,
    fileName: document?.fileName,
    status: document?.status,
    isPDF,
    isImage,
    canApprove,
    canReject
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{doc.label}</h3>
            {doc.required && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Requerido
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(document?.status || 'PENDING')}`}>
              {getStatusLabel(document?.status || 'PENDING')}
            </span>
          </div>
          
          {doc.description && (
            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Formatos: {doc.acceptedFormats}</span>
            <span>Tamaño máx: {doc.maxSizeMB}MB</span>
          </div>

          {document && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700">{document.fileName}</span>
              </div>
              {document.uploadedAt && (
                <p className="text-xs text-gray-500">
                  Subido: {new Date(document.uploadedAt).toLocaleString()}
                </p>
              )}
              {document.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800">
                    <strong>Nota:</strong> {document.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {!hasDocument && (
            <p className="text-sm text-gray-500 mt-2">No se ha subido ningún documento</p>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {document?.url && (
            <button
              onClick={() => setShowPreview(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver documento
            </button>
          )}
          
          {canApprove && (
            <button
              onClick={() => onApprove(null)}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
            >
              {processing ? 'Procesando...' : 'Aprobar'}
            </button>
          )}
          
          {canReject && (
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
            >
              {processing ? 'Procesando...' : 'Rechazar'}
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && document?.url && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] w-full mx-4 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{doc.label}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center items-center bg-gray-100 rounded p-4">
              {isImage ? (
                <img src={document.url} alt={doc.label} className="max-w-full max-h-[70vh] object-contain" />
              ) : isPDF ? (
                <iframe src={document.url} className="w-full h-[70vh]" title={doc.label} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Vista previa no disponible</p>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Descargar documento
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rechazar documento
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Por favor indica la razón del rechazo:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              rows="4"
              placeholder="Ej: La imagen está borrosa, por favor sube una foto más clara"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberValidationDetail;
