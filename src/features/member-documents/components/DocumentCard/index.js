import React from 'react';

const DocumentCard = ({ document, formatStatus, getStatusBadge, onApprove, onReject }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{document.catalog.label}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(document.status)}`}>
              {formatStatus(document.status)}
            </span>
            {document.catalog.required && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Requerido
              </span>
            )}
          </div>
          {document.catalog.description && (
            <p className="text-sm text-gray-600 mb-2">{document.catalog.description}</p>
          )}
        </div>
      </div>

      {document.fileUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Documento subido</span>
          </div>

          <div className="flex gap-2">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-center text-sm font-medium"
            >
              Ver documento
            </a>
            
            {document.status === 'UPLOADED' && (
              <>
                <button
                  onClick={() => onApprove(document)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-medium"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => onReject(document)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium"
                >
                  Rechazar
                </button>
              </>
            )}
          </div>

          {document.notes && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Notas:</strong> {document.notes}
            </div>
          )}

          {document.uploadedAt && (
            <p className="text-xs text-gray-500">
              Subido: {new Date(document.uploadedAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p>Documento no subido</p>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
