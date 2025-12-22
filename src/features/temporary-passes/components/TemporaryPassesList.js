import React, { useState } from 'react';
import { useTemporaryPasses } from '../hooks/useTemporaryPasses';

const TemporaryPassesList = () => {
  const { passes, loading, total, approvePass, rejectPass } = useTemporaryPasses();
  const [selectedPass, setSelectedPass] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [expirationDays, setExpirationDays] = useState(30);

  const handleApproveClick = pass => {
    setSelectedPass(pass);
    setShowApproveModal(true);
  };

  const handleRejectClick = pass => {
    setSelectedPass(pass);
    setShowRejectModal(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedPass) {
      const success = await approvePass(selectedPass.user.id, selectedPass.id, expirationDays);
      if (success) {
        setShowApproveModal(false);
        setSelectedPass(null);
        setExpirationDays(30);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedPass) {
      const success = await rejectPass(selectedPass.id);
      if (success) {
        setShowRejectModal(false);
        setSelectedPass(null);
      }
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRelationshipLabel = relationship => {
    const labels = {
      WIFE: 'Esposa',
      HUSBAND: 'Esposo',
      SON: 'Hijo',
      DAUGHTER: 'Hija',
      FATHER: 'Padre',
      MOTHER: 'Madre',
      BROTHER: 'Hermano',
      SISTER: 'Hermana',
      FRIEND: 'Amigo',
      OTHER: 'Otro',
    };
    return labels[relationship] || relationship;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Pases temporales pendientes</h2>
        <p className="text-gray-600 mt-1">
          {total} {total === 1 ? 'pase pendiente' : 'pases pendientes'} de aprobación
        </p>
      </div>

      {passes.length === 0 ? (
        <div className="p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pases pendientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Todos los pases temporales han sido procesados
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Socio Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Solicitud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {passes.map(pass => (
                <tr key={pass.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pass.user?.name} {pass.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{pass.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getRelationshipLabel(pass.relationship)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pass.invitedBy?.user?.name} {pass.invitedBy?.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Número de acción #{pass.invitedBy?.memberCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pass.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApproveClick(pass)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleRejectClick(pass)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Aprobar pase temporal</h3>
            <p className="text-gray-600 mb-4">
              ¿Deseas aprobar el pase temporal para{' '}
              <strong>
                {selectedPass.user?.name} {selectedPass.user?.lastName}
              </strong>
              ?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de validez
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={expirationDays}
                onChange={e => setExpirationDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                El pase expirará el{' '}
                {new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toLocaleDateString(
                  'es-MX',
                )}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedPass(null);
                  setExpirationDays(30);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rechazar pase temporal</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas rechazar el pase temporal para{' '}
              <strong>
                {selectedPass.user?.name} {selectedPass.user?.lastName}
              </strong>
              ?
            </p>
            <p className="text-sm text-red-600 mb-4">
              Esta acción eliminará permanentemente el registro del pase temporal.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedPass(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default TemporaryPassesList;
