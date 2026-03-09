import React, { useState, useEffect, useCallback, useContext } from 'react';
import AdminDependentDetail from '../features/dependents/AdminDependentDetail';
import { AppContext } from '../shared/context/AppContext';

const RELATIONSHIP_LABELS = {
  SPOUSE: 'Cónyuge',
  CHILD: 'Hijo/a',
  WIFE: 'Esposa',
  HUSBAND: 'Esposo',
  SON: 'Hijo',
  DAUGHTER: 'Hija',
};

const DependentsValidation = () => {
  const { authToken } = useContext(AppContext);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDependentId, setSelectedDependentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState({});

  const getToken = () => authToken || localStorage.getItem('authToken');

  const fetchPendingDependents = useCallback(async () => {
    try {
      if (!getToken()) {
        setError('Tu sesión ha expirado. Vuelve a iniciar sesión e intenta nuevamente.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const headers = { Authorization: `Bearer ${getToken()}` };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents?pendingOnly=true&page=${currentPage}&limit=20`,
        { headers }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${res.status} al cargar dependientes`);
      }

      const payload = await res.json();
      const apiData = payload?.data ?? payload ?? {};
      setDependents(apiData.dependents || []);
      setTotalPages(apiData.meta?.totalPages || 1);
      setMeta(apiData.meta || {});
    } catch (err) {
      setError(err.message || 'Error inesperado al cargar dependientes');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPendingDependents();
  }, [fetchPendingDependents]);

  const handleDependentApproved = () => {
    setSelectedDependentId(null);
    fetchPendingDependents();
  };

  const handleDependentRejected = () => {
    setSelectedDependentId(null);
    fetchPendingDependents();
  };

  if (selectedDependentId) {
    return (
      <AdminDependentDetail
        dependentId={selectedDependentId}
        onBack={() => setSelectedDependentId(null)}
        onApproved={handleDependentApproved}
        onRejected={handleDependentRejected}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Validación de Dependientes</h1>
            <p className="text-gray-600 text-sm mt-1">
              Dependientes pendientes de validación (sin número de socio asignado)
            </p>
          </div>
          {dependents.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
              🔴 {dependents.length} pendiente{dependents.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error al cargar dependientes</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchPendingDependents}
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        ) : dependents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 font-medium">No hay dependientes pendientes de validación</p>
            <p className="text-gray-400 text-sm mt-1">Todos los dependientes han sido procesados</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relación</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio Titular</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dependents.map((dep) => (
                    <tr key={dep.id} className="bg-yellow-50 hover:bg-yellow-100">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 overflow-hidden flex-shrink-0">
                            {dep.user?.profilePhotoUrl ? (
                              <img src={dep.user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (dep.user?.name?.[0] || '?').toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {dep.user?.name} {dep.user?.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {RELATIONSHIP_LABELS[dep.relationship] || dep.relationship}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {dep.invitedBy ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              {dep.invitedBy.user?.name} {dep.invitedBy.user?.lastName}
                            </p>
                            {dep.invitedBy.memberCode && (
                              <p className="text-xs text-gray-500">#{dep.invitedBy.memberCode}</p>
                            )}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {dep.user?.email || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {dep.ageStatus ? `${dep.ageStatus.age} años` : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {dep.relationshipDocumentUrl ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ✓ Subido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                            ⚠ Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {dep.isDependentActive === false ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            ✗ Rechazado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            ⏳ Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDependentId(dep.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/*{totalPages > 1 && ( */}
            {meta && (
              <div className="flex justify-center items-center gap-3 mt-4">
                {(() => {
                  const totalPages = meta.totalPages;
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                  // Adjust start if range exceeds total pages
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  return (
                    <>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded border text-sm ${
                            currentPage === 1 ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                          }`}
                        >
                        Anterior
                      </button>
                      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                        const pageNum = startPage + i;
                        return (
                          <button
                            key={`page-${pageNum}`}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded border text-sm ${
                              currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded border text-sm ${
                            currentPage === totalPages ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                          }`}
                        >
                        Siguiente
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
            {/*})} */}
          </>
        )}
      </div>
    </div>
  );
};

export default DependentsValidation;
