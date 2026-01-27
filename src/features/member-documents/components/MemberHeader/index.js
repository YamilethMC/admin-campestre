import React from 'react';

const MemberHeader = ({ memberData, formatStatus, onBack }) => {
  const getValidationStatusColor = (status) => {
    const colorMap = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'PARTIAL': 'bg-yellow-100 text-yellow-800',
      'IN_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al panel de validaciones
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {memberData.member?.user?.name} {memberData.member?.user?.lastName}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Código de socio: <strong>#{memberData.member?.memberCode}</strong></p>
            <p>Email: <strong>{memberData.member?.user?.email}</strong></p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getValidationStatusColor(memberData.validation?.status)}`}>
              {formatStatus(memberData.validation?.status || 'NOT_STARTED')}
            </span>
          </div>
          {memberData.validation?.submittedAt && (
            <p className="text-xs text-gray-500">
              Enviado: {new Date(memberData.validation.submittedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberHeader;
