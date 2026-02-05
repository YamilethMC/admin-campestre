import React from 'react';

const ValidationTable = ({ 
  validations = [], 
  getStatusBadge, 
  formatStatus, 
  onViewDetails, 
  onApprove, 
  onReject 
}) => {
  const getProgressPercentage = (validation) => {
    const requestedTotal = validation.stats?.requestedTotal || 0;
    const requestedValidated = validation.stats?.requestedValidated || 0;
    if (requestedTotal === 0) return 0;
    return Math.round((requestedValidated / requestedTotal) * 100);
  };

  const validationsArray = Array.isArray(validations) ? validations : [];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Socio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progreso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documentos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha envío
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {validationsArray.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No hay validaciones que coincidan con los filtros
              </td>
            </tr>
          ) : (
            validationsArray.map((validation, index) => {
              const member = validation.clubMember ?? validation.member ?? {};
              return (
                <tr key={`${validation.id || 'validation'}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.user?.name} {member.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Socio #{member.memberCode}
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(validation.status)}`}>
                      {formatStatus(validation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{getProgressPercentage(validation)}%</span>
                          <span>
                            {validation.stats?.requestedValidated || 0}/
                            {validation.stats?.requestedTotal || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getProgressPercentage(validation)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {validation.documents?.slice(0, 3).map((doc, idx) => (
                        <div key={`${validation.id}-doc-${doc.id || idx}`} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            doc.status === 'VALIDATED' ? 'bg-green-400' :
                            doc.status === 'REJECTED' ? 'bg-red-400' :
                            doc.status === 'UPLOADED' ? 'bg-blue-400' :
                            'bg-gray-300'
                          }`}></span>
                          <span className="text-xs">{doc.catalog?.label}</span>
                        </div>
                      ))}
                      {validation.documents?.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{validation.documents.length - 3} más
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {validation.submittedAt ? new Date(validation.submittedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {member.id && (
                        <button
                          onClick={() => onViewDetails(member.id)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          Ver detalles
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ValidationTable;
